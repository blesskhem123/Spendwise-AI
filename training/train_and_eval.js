import fs from 'fs';
import natural from 'natural';

const data = JSON.parse(fs.readFileSync('./dataset.json', 'utf-8'));

// 80/20 train/test split (stratified-ish since data is pre-shuffled)
const splitIdx = Math.floor(data.length * 0.8);
const train = data.slice(0, splitIdx);
const test = data.slice(splitIdx);

const classifier = new natural.BayesClassifier();
train.forEach(({ text, category }) => classifier.addDocument(text, category));
classifier.train();

let correct = 0;
const confusion = {};
test.forEach(({ text, category }) => {
  const predicted = classifier.classify(text);
  if (predicted === category) correct++;
  confusion[category] = confusion[category] || { total: 0, correct: 0 };
  confusion[category].total++;
  if (predicted === category) confusion[category].correct++;
});

const accuracy = (correct / test.length) * 100;

console.log(`Train size: ${train.length}, Test size: ${test.length}`);
console.log(`Overall accuracy on held-out test set: ${accuracy.toFixed(2)}%`);
console.log('\nPer-category accuracy:');
Object.entries(confusion).forEach(([cat, v]) => {
  console.log(`  ${cat}: ${((v.correct / v.total) * 100).toFixed(1)}% (${v.correct}/${v.total})`);
});

// Persist trained classifier for reuse in backend
classifier.save('./trained_classifier.json', (err) => {
  if (err) console.error('Save error:', err);
  else console.log('\nSaved trained_classifier.json');
});
