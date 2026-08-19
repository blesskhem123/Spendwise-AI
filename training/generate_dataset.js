// Generates a synthetic but realistic labeled dataset of transaction
// descriptions mapped to the 8 SpendWise categories.
// Templates reflect common Indian transaction description patterns.

const templates = {
  food: [
    'Swiggy order {n}', 'Zomato delivery {n}', 'Dominos pizza order', 'McDonalds meal',
    'Starbucks coffee', 'CCD cafe', 'restaurant dinner with friends', 'lunch at food court',
    'Blinkit grocery order', 'Zepto instant delivery', 'BigBasket grocery',
    'local dhaba meal', 'street food vendor', 'KFC order', 'Burger King meal',
    'ice cream parlor', 'bakery items', 'tea stall', 'canteen food', 'grocery store {n}',
    'vegetable market purchase', 'milk and dairy items', 'Dunzo food delivery',
    'birthday cake order', 'snacks and beverages', 'weekend brunch', 'chai and samosa',
    'Subway sandwich', 'juice center', 'sweet shop order'
  ],
  transport: [
    'Uber ride to {n}', 'Ola cab booking', 'Rapido bike ride', 'petrol fill up',
    'diesel refill', 'metro card recharge', 'bus ticket booking', 'train ticket IRCTC',
    'auto rickshaw fare', 'FASTag recharge', 'parking fee', 'toll payment',
    'flight ticket booking', 'cab to airport', 'bike service and repair',
    'car maintenance', 'RedBus ticket', 'Ola outstation trip', 'vehicle insurance renewal',
    'car wash service', 'Uber Eats delivery charge', 'railway platform ticket',
    'shared cab pool', 'bike fuel', 'car servicing at garage', 'tyre replacement'
  ],
  shopping: [
    'Amazon order {n}', 'Flipkart purchase', 'Myntra clothing order', 'Ajio shopping',
    'Nike shoes purchase', 'electronics store purchase', 'mobile phone accessories',
    'clothing store shopping', 'shopping mall purchase', 'online furniture order',
    'home decor items', 'Croma electronics purchase', 'Reliance Digital order',
    'watch purchase', 'sunglasses order', 'gift shopping for friend', 'book store purchase',
    'stationery shopping', 'shoe store purchase', 'jewelry store', 'bag purchase',
    'laptop accessories order', 'headphones purchase', 'Meesho order', 'Snapdeal purchase',
    'IKEA furniture order', 'perfume purchase'
  ],
  entertainment: [
    'Netflix subscription', 'Amazon Prime subscription', 'Hotstar subscription',
    'Spotify premium', 'movie ticket BookMyShow', 'PVR cinema tickets',
    'concert ticket booking', 'gaming subscription', 'Steam game purchase',
    'PlayStation game purchase', 'amusement park entry', 'bowling alley',
    'club entry fee', 'YouTube premium subscription', 'comedy show ticket',
    'theatre play ticket', 'water park entry', 'arcade gaming', 'Zomato Gold membership',
    'video game console purchase', 'music streaming subscription', 'Disney+ subscription',
    'concert merchandise', 'karaoke night', 'escape room booking'
  ],
  bills: [
    'electricity bill payment', 'water bill payment', 'mobile recharge Jio',
    'Airtel postpaid bill', 'broadband internet bill', 'DTH recharge',
    'gas cylinder booking', 'maintenance society bill', 'house rent payment',
    'WiFi bill payment', 'credit card bill payment', 'insurance premium payment',
    'property tax payment', 'municipal tax bill', 'Vodafone Idea recharge',
    'landline bill payment', 'apartment maintenance fee', 'water tanker payment',
    'gas pipeline bill', 'DTH Tata Sky recharge'
  ],
  health: [
    'Apollo pharmacy order', 'medicine purchase', 'doctor consultation fee',
    'hospital bill payment', 'gym membership fee', 'yoga class fee',
    'health checkup package', 'dentist appointment', 'physiotherapy session',
    'diagnostic lab test', 'Cult.fit membership', 'protein supplement order',
    'eye checkup optician', 'vaccination fee', 'ambulance service charge',
    'medical insurance premium', 'Practo consultation', 'PharmEasy order',
    'fitness equipment purchase', 'skin clinic visit'
  ],
  education: [
    'Udemy course purchase', 'Coursera subscription', 'college semester fee',
    'tuition fee payment', 'coaching institute fee', 'book purchase for course',
    'online certification fee', 'exam registration fee', 'library membership',
    'BYJUS subscription', 'GATE coaching fee', 'workshop registration fee',
    'hostel fee payment', 'laptop for studies', 'stationery for exams',
    'skill development course', 'LinkedIn Learning subscription', 'test series purchase',
    'college application fee', 'seminar registration'
  ],
  other: [
    'ATM cash withdrawal', 'bank service charge', 'miscellaneous expense',
    'gift to family member', 'donation to charity', 'temple donation',
    'salon and haircut', 'spa treatment', 'pet supplies purchase', 'plant nursery purchase',
    'home repair service', 'plumber service charge', 'electrician service fee',
    'courier and shipping charge', 'photocopy and printing', 'lottery ticket',
    'legal consultation fee', 'passport application fee', 'random cash expense',
    'unclassified purchase'
  ],
};

function fill(t, i) {
  return t.replace('{n}', i % 50);
}

const rows = [];
for (const [category, list] of Object.entries(templates)) {
  list.forEach((t, idx) => {
    // create a few variations per template to grow dataset size
    for (let i = 0; i < 4; i++) {
      rows.push({ text: fill(t, idx * 4 + i), category });
    }
  });
}

// shuffle
for (let i = rows.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [rows[i], rows[j]] = [rows[j], rows[i]];
}

import fs from 'fs';
fs.writeFileSync('./dataset.json', JSON.stringify(rows, null, 2));
console.log(`Generated ${rows.length} labeled examples across ${Object.keys(templates).length} categories`);
