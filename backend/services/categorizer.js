import axios from 'axios';
import natural from 'natural';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CATEGORIES = [
  'food', 'transport', 'shopping', 'entertainment',
  'bills', 'health', 'education', 'other',
];

// ---- ML fallback classifier (Naive Bayes, trained offline) ----
// Trained on 752 synthetic labeled transaction descriptions, ~95-98%
// held-out accuracy (8-way classification). See /training/ for the
// dataset generator and training script used to produce this model.
let mlClassifier = null;
const modelPath = path.join(__dirname, '..', 'data', 'trained_classifier.json');

function loadMLClassifier() {
  return new Promise((resolve, reject) => {
    natural.BayesClassifier.load(modelPath, null, (err, classifier) => {
      if (err) return reject(err);
      mlClassifier = classifier;
      resolve(classifier);
    });
  });
}

// Kick off loading at module import time; classifyML will wait on it
// if it hasn't finished yet.
const mlReady = loadMLClassifier().catch((err) => {
  console.error('Failed to load ML fallback classifier:', err.message);
});

async function classifyML(description) {
  if (!mlClassifier) await mlReady;
  if (!mlClassifier) {
    return { category: 'other', source: 'default', confidence: null };
  }

  // getClassifications returns raw per-category scores, NOT true
  // probabilities (they don't sum to 1). We normalize across the
  // candidates it actually returns so we can show an honest relative
  // confidence, rather than presenting a raw score as if it were a
  // calibrated probability.
  const classifications = mlClassifier.getClassifications(description);
  const category = mlClassifier.classify(description);

  let confidence = null;
  if (classifications && classifications.length > 0) {
    const total = classifications.reduce((sum, c) => sum + c.value, 0);
    const top = classifications[0];
    confidence = total > 0 ? Math.round((top.value / total) * 100) : null;
  }

  return { category, source: 'ml', confidence };
}

// ---- LLM primary classifier (OpenAI) ----
async function classifyLLM(description, amount) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `Classify the following personal finance transaction into exactly one category from this list: ${CATEGORIES.join(', ')}.
Transaction description: "${description}"
${amount ? `Amount: ${amount}` : ''}
Respond with ONLY the category value, nothing else.`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    }
  );

  const raw = response.data.choices?.[0]?.message?.content?.trim().toLowerCase();
  const category = CATEGORIES.includes(raw) ? raw : null;

  if (!category) {
    throw new Error(`LLM returned unrecognized category: "${raw}"`);
  }

  return { category, source: 'llm', confidence: null };
}

// ---- Public entry point: LLM primary, ML fallback ----
export async function categorizeTransaction(description, amount) {
  if (!description || !description.trim()) {
    return { category: 'other', source: 'default', confidence: null };
  }

  try {
    return await classifyLLM(description, amount);
  } catch (err) {
    // Falls back silently to the ML classifier on any LLM error:
    // missing/invalid API key, timeout, rate limit, or malformed response.
    console.warn(`LLM categorization failed (${err.message}), falling back to ML classifier`);
    return await classifyML(description);
  }
}