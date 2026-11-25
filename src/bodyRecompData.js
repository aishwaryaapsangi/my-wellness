// Adapted from the 2026-11-24 Body Recomp 8-Week System workbook.
// User entries remain in browser storage; only the shared plan is source-controlled.
export const RECOMP_START='2026-11-25';
export const RECOMP_END='2027-01-19';
export const RECOMP_BASELINE='2026-11-24';
export const RECOMP_REVIEWS=['2026-11-24','2026-12-01','2026-12-08','2026-12-15','2026-12-22','2026-12-29','2027-01-05','2027-01-12','2027-01-19'];
export const WEEK_FOCUS=[
  "Technique and accurate baseline; no forced increases",
  "Repeat exercises; try +1 good rep where appropriate",
  "Continue improving reps; do not chase fatigue",
  "Recovery and four-week review on December 22",
  "Increase load only when every set meets top-rep criteria",
  "Consolidate load, sleep, meals and consistency",
  "Improve range and reps; optional tiny increments",
  "Compare week 1 with week 8 without forcing a transformation"
];
export const RECOMP_EXERCISES=[
  {
    "id": "machine-or-barbell-hip-thrust",
    "session": "Lower A",
    "name": "Dumbbell hip thrust (bench)",
    "sets": 3,
    "low": 8,
    "high": 12,
    "cue": "Place ONE padded dumbbell securely across the hip crease with a stable bench behind shoulders. Chin tucked, ribs down, pause 2 sec at the top; no barbell required."
  },
  {
    "id": "romanian-deadlift",
    "session": "Lower A",
    "name": "Romanian deadlift",
    "sets": 3,
    "low": 8,
    "high": 10,
    "cue": "Hinge hips back with soft knees, controlled lowering, stable spine."
  },
  {
    "id": "leg-press",
    "session": "Lower A",
    "name": "Leg press",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Controlled range, planted feet; avoid bouncing."
  },
  {
    "id": "seated-hip-abduction",
    "session": "Lower A",
    "name": "Seated hip abduction",
    "sets": 2,
    "low": 12,
    "high": 15,
    "cue": "Open with control; pause and return slowly."
  },
  {
    "id": "lat-pulldown",
    "session": "Upper A + Core",
    "name": "Lat pulldown",
    "sets": 3,
    "low": 8,
    "high": 12,
    "cue": "Pull elbows toward ribs without swinging."
  },
  {
    "id": "chest-press",
    "session": "Upper A + Core",
    "name": "Chest press",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Set shoulders comfortably; keep wrists straight."
  },
  {
    "id": "seated-row",
    "session": "Upper A + Core",
    "name": "Seated row",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Stable trunk; row handles toward rib cage."
  },
  {
    "id": "dumbbell-shoulder-press",
    "session": "Upper A + Core",
    "name": "Dumbbell shoulder press",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Use controlled dumbbell presses with your reported 10 lb per hand baseline; avoid arching and shorten range if shoulders hurt.",
    "startingWeight": 10
  },
  {
    "id": "weighted-straight-leg-captain-s-chair-raise",
    "session": "Upper A + Core",
    "name": "Weighted straight-leg captain's-chair raise",
    "sets": 3,
    "low": 10,
    "high": 15,
    "cue": "Use your +5 lb ankle load only if securely attached. Legs stay straight, raise with pelvic control, lower slowly without swinging. 3 quality sets, not endless reps.",
    "startingWeight": 5
  },
  {
    "id": "glute-bridge",
    "session": "Lower B",
    "name": "Dumbbell glute bridge (floor)",
    "sets": 3,
    "low": 8,
    "high": 12,
    "cue": "Set one padded dumbbell across hips; drive through heels, hold top for 2 seconds and lower slowly. No barbell needed."
  },
  {
    "id": "supported-split-squat",
    "session": "Lower B",
    "name": "Supported split squat",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Use support as needed; count reps for each side."
  },
  {
    "id": "seated-or-lying-hamstring-curl",
    "session": "Lower B",
    "name": "Seated or lying hamstring curl",
    "sets": 3,
    "low": 10,
    "high": 15,
    "cue": "Smooth reps; do not jerk the machine."
  },
  {
    "id": "goblet-squat",
    "session": "Lower B",
    "name": "Goblet squat",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Choose comfortable depth; track knee alignment."
  },
  {
    "id": "calf-raise",
    "session": "Lower B",
    "name": "Calf raise",
    "sets": 2,
    "low": 12,
    "high": 15,
    "cue": "Pause at top and lower fully under control."
  },
  {
    "id": "seated-cable-row",
    "session": "Upper B + Core",
    "name": "Seated cable row",
    "sets": 3,
    "low": 8,
    "high": 12,
    "cue": "Pull without swinging or rocking back."
  },
  {
    "id": "incline-chest-press",
    "session": "Upper B + Core",
    "name": "Incline chest press",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Stay within comfortable shoulder range."
  },
  {
    "id": "lateral-raise",
    "session": "Upper B + Core",
    "name": "Lateral raise",
    "sets": 2,
    "low": 10,
    "high": 15,
    "cue": "Use 10 lb per hand as your reported baseline only if you can raise without swinging or shrugging; lower to 5–8 lb if form breaks.",
    "startingWeight": 10
  },
  {
    "id": "biceps-curl",
    "session": "Upper B + Core",
    "name": "Biceps curl",
    "sets": 2,
    "low": 8,
    "high": 12,
    "cue": "Use your reported 10 lb dumbbell in each hand, elbows steady and wrists neutral. Avoid swinging; gradual rep progression.",
    "startingWeight": 10
  },
  {
    "id": "triceps-pushdown",
    "session": "Upper B + Core",
    "name": "Straight-bar cable triceps pushdown",
    "sets": 2,
    "low": 10,
    "high": 15,
    "cue": "Use the straight bar as shown in your reference. Elbows stay by ribs; extend arms and control the cable return. Stack resistance is not equal to dumbbell weight."
  },
  {
    "id": "pallof-press",
    "session": "Upper B + Core",
    "name": "Pallof press",
    "sets": 2,
    "low": 10,
    "high": 12,
    "cue": "Resist rotation; count reps per side."
  }
];
// Preserve the user's reported weighted Russian-twist capability as an OPTIONAL core movement.
RECOMP_EXERCISES.push({id:'weighted-russian-twist',session:'Upper B + Core',name:'Weighted Russian twist',sets:3,low:18,high:24,startingWeight:20,cue:'20 lb plate (reported baseline), 18–24 TOTAL controlled touches per set, not per side. Keep spine comfortably neutral, rotate upper back slightly rather than wrenching low back; skip if uncomfortable.'});
// Dedicated short abs-focused reunion-day workout. Reuses known core movements
// so future progression can read the same training history.
RECOMP_EXERCISES.push({id:'controlled-leg-rainbow-with-ball',session:'Abs + Core',name:'Controlled leg rainbows (optional finisher)',sets:2,low:10,high:14,startingWeight:0,cue:'Optional finisher: small controlled rainbow arcs with ball between feet, no added load. Keep your back supported. Progress with slower tempo, not heavier ankle weights.'});
// Source-informed updates: short-girl lifting clips show upper-body splits,
// lower-body strength work and a dedicated core + cardio day. Their exact loads
// and nutrition figures are not personal prescriptions.
RECOMP_EXERCISES.push({id:'weighted-dead-bug',session:'Upper A + Core',name:'Weighted dead bug (alternating legs)',sets:3,low:8,high:12,startingWeight:20,cue:'One dumbbell held above chest with BOTH hands; alternate 8–12 slow leg lowers PER SIDE, ribs down and lower back controlled. You reported up to 30 lb, so 20 lb is a technique-first trial; edit upward if clean.'});
RECOMP_EXERCISES.push({id:'cable-crunch',session:'Upper B + Core',name:'Kneeling cable crunch',sets:3,low:10,high:15,cue:'Light/moderate cable stack, move ribs toward pelvis without yanking the arms. The stack number varies by machine. Pause at the shortened position.'});
export const RECOMP_RECIPES=[
  {
    "id": "blueberry-overnight-oats",
    "name": "Blueberry overnight oats",
    "type": "Breakfast",
    "yield": "1 serving",
    "ingredients": "1/2 cup oats; 3/4 cup fortified soy milk; 1/2 cup high-protein soy or Greek yogurt; 1 tbsp chia; 1/2 cup berries; cinnamon",
    "instructions": "Stir, refrigerate overnight. Add berries on eating day.",
    "adjustments": "0 added oil; optional egg or extra yogurt for protein",
    "nutrients": "Oats, fiber, protein, calcium if fortified"
  },
  {
    "id": "spinach-eggs-on-sourdough",
    "name": "Spinach eggs on sourdough",
    "type": "Breakfast",
    "yield": "1 serving",
    "ingredients": "2 eggs; 1 cup spinach; 1/2 cup mushrooms; 2 slices sourdough; 1 tsp olive oil or nonstick spray",
    "instructions": "Sauté mushrooms/spinach, scramble eggs, serve over toast.",
    "adjustments": "Use measured oil; add fruit",
    "nutrients": "Egg protein, choline, iron; greens"
  },
  {
    "id": "mango-berry-chia-pudding",
    "name": "Mango-berry chia pudding",
    "type": "Breakfast",
    "yield": "1 serving",
    "ingredients": "2 tbsp chia; 3/4 cup fortified soy milk; 1/2 cup soy or Greek yogurt; 1/2 cup fruit",
    "instructions": "Mix chia with milk, chill 4h/overnight, top with yogurt and fruit.",
    "adjustments": "Start with 1 tbsp chia if gas-prone; hydrate",
    "nutrients": "Fiber; omega-3 ALA; calcium if fortified"
  },
  {
    "id": "cottage-cheese-berry-smoothie",
    "name": "Cottage cheese berry smoothie",
    "type": "Snack / Breakfast",
    "yield": "1 serving",
    "ingredients": "1/2 cup cottage cheese OR 150g silken tofu; 1/2 cup soy yogurt; 1 banana; 1/2 cup berries; water/soy milk",
    "instructions": "Blend and serve; add toast if breakfast.",
    "adjustments": "If dairy causes symptoms use silken tofu and soy yogurt",
    "nutrients": "Protein, fruit, potassium"
  },
  {
    "id": "veggie-moong-dal-khichdi",
    "name": "Veggie moong-dal khichdi",
    "type": "Lunch",
    "yield": "2 servings",
    "ingredients": "1/2 cup dry moong dal; 1/2 cup dry rice; 2–3 cups spinach/carrot/peas; 1 tsp oil; ginger, cumin, turmeric",
    "instructions": "Rinse dal/rice; sauté spices briefly, add vegetables and water; simmer until soft.",
    "adjustments": "Top each bowl with tofu or an egg if desired",
    "nutrients": "Legumes, whole-food carbs, greens"
  },
  {
    "id": "rajma-rice-bowl",
    "name": "Rajma rice bowl",
    "type": "Lunch",
    "yield": "2 servings",
    "ingredients": "1.5 cups cooked kidney beans; 1 cup cooked brown rice; 2 cups spinach/bell pepper; crushed tomatoes; spices; 1 tsp oil",
    "instructions": "Warm beans with tomatoes/spices; serve with rice and sautéed greens.",
    "adjustments": "Use canned low-sodium beans and rinse well; try smaller portions if gas-prone",
    "nutrients": "Beans, fiber, iron; tomato vitamin C"
  },
  {
    "id": "chickpea-feta-spinach-wrap",
    "name": "Chickpea feta spinach wrap",
    "type": "Lunch",
    "yield": "1 serving",
    "ingredients": "3/4 cup chickpeas; big handful spinach; 1 small wrap; cucumber; lemon; 1–2 tbsp feta OR tofu",
    "instructions": "Mash chickpeas with lemon and spices; wrap with vegetables.",
    "adjustments": "Feta optional; add hummus or tofu for protein",
    "nutrients": "Legumes, vegetables, calcium option"
  },
  {
    "id": "lemony-lentil-soup",
    "name": "Lemony lentil soup",
    "type": "Lunch",
    "yield": "3 servings",
    "ingredients": "1 cup dry red lentils; carrot; spinach; celery; broth; lemon; cumin; optional tofu cubes",
    "instructions": "Simmer lentils and vegetables 20–25 min; finish with lemon and spinach.",
    "adjustments": "Freezes well; have toast alongside if hungry",
    "nutrients": "Fiber, folate, iron, vegetables"
  },
  {
    "id": "ginger-tofu-stir-fry",
    "name": "Ginger tofu stir fry",
    "type": "Dinner",
    "yield": "2 servings",
    "ingredients": "300g firm tofu; 3 cups broccoli/bell pepper/carrot; ginger; garlic; soy sauce; 1–2 tsp sesame/olive oil; cooked rice",
    "instructions": "Brown tofu in nonstick pan; add vegetables and splash of water; season and serve with rice.",
    "adjustments": "Choose lower-sodium soy sauce; add citrus",
    "nutrients": "Soy protein, vegetables, grain"
  },
  {
    "id": "egg-spinach-dosa",
    "name": "Egg-spinach dosa",
    "type": "Dinner",
    "yield": "1 serving",
    "ingredients": "1–2 medium dosas; 1–2 eggs; spinach; chopped onion; tomato chutney; 1 tsp oil total",
    "instructions": "Cook dosas on nonstick pan with a small amount of oil; add egg and spinach.",
    "adjustments": "Oil can be measured rather than eliminated",
    "nutrients": "Egg protein, fermented batter, greens"
  },
  {
    "id": "roasted-vegetables-chickpeas",
    "name": "Roasted vegetables + chickpeas",
    "type": "Dinner",
    "yield": "2 servings",
    "ingredients": "1 can chickpeas rinsed; 3 cups cauliflower/carrots/sweet potato; 2 tsp oil; smoked paprika; lemon; tofu optional",
    "instructions": "Toss and roast about 25–35 min at 425°F until tender; add lemon.",
    "adjustments": "Add tofu or yogurt dip for extra protein",
    "nutrients": "Colorful vegetables, legumes"
  },
  {
    "id": "tofu-fajita-bowl",
    "name": "Tofu fajita bowl",
    "type": "Dinner",
    "yield": "2 servings",
    "ingredients": "300g tofu; bell peppers; onions; 1 cup cooked brown rice; lettuce; salsa; avocado optional; 1–2 tsp oil",
    "instructions": "Roast peppers and tofu with cumin/chili; serve over rice, greens and salsa.",
    "adjustments": "Add avocado if desired; fats needn't be avoided",
    "nutrients": "Protein, grain, fiber"
  },
  {
    "id": "miso-ginger-tofu-noodle-soup",
    "name": "Miso-ginger tofu noodle soup",
    "type": "Lunch / Dinner",
    "yield": "2 servings",
    "ingredients": "250g tofu; 2 portions noodles; bok choy/spinach; mushrooms; miso; ginger; broth",
    "instructions": "Simmer vegetables and ginger; add noodles and tofu; stir miso in off heat.",
    "adjustments": "Miso can be salty; portion to taste",
    "nutrients": "Protein, fluids, vegetables"
  },
  {
    "id": "chickpea-pasta-primavera",
    "name": "Chickpea pasta primavera",
    "type": "Dinner",
    "yield": "2 servings",
    "ingredients": "4 oz dry chickpea pasta; 2 cups spinach/broccoli/tomato; lemon; garlic; 1–2 tsp oil; 100g tofu optional",
    "instructions": "Cook pasta; sauté vegetables lightly; toss with pasta water, garlic and lemon.",
    "adjustments": "Use parmesan or feta only if tolerated",
    "nutrients": "Legume protein, vegetables, whole-food ingredients"
  }
];
export const RECOMP_GROCERIES=[
  {
    "category": "Protein",
    "items": "Firm tofu 3–4 blocks; eggs 6–12; legumes 2–3 cans plus dry lentils; fortified soy milk; yogurt optional",
    "prep": "Rinse canned beans; prep tofu and lentils",
    "note": "Choose portions based on hunger, not a fixed calorie goal"
  },
  {
    "category": "Greens",
    "items": "Spinach 2 bags; kale or bok choy 1 bunch",
    "prep": "Fresh or frozen",
    "note": "Serve greens with at least one meal every day"
  },
  {
    "category": "Vegetables",
    "items": "Broccoli, bell peppers, carrots, cauliflower, zucchini, mushrooms, cucumbers",
    "prep": "Season with herbs, citrus, spices",
    "note": "Roast 2 trays, use about 1–2 tsp oil if desired"
  },
  {
    "category": "Grains",
    "items": "Oats, rice, sourdough, wraps, potatoes, pasta",
    "prep": "No need to remove carbs",
    "note": "Cook rice; refrigerate promptly"
  },
  {
    "category": "Fruit",
    "items": "Bananas, berries, apples, citrus",
    "prep": "Frozen berries can be economical",
    "note": "Add to pudding, smoothies and snacks"
  },
  {
    "category": "Flavor",
    "items": "Ginger, garlic, lemon, cilantro, cumin, chili, turmeric, miso, tomatoes",
    "prep": "Use salsa, lemon and herbs",
    "note": "Pre-mix one sauce per week"
  },
  {
    "category": "Healthy fats",
    "items": "Chia, olive oil, nuts and seeds",
    "prep": "Fats aren't bad, even if oil preference is low",
    "note": "Use sensible portions; no ban"
  },
  {
    "category": "Sunday",
    "items": "45–75 minutes total",
    "prep": "Cook grain, protein and 2–3 days of vegetables",
    "note": "Freeze extra cooked food"
  },
  {
    "category": "Wednesday",
    "items": "20–30 minutes total",
    "prep": "Top up fresh greens and protein",
    "note": "Adjust recipes to taste"
  }
];
const TWO_WEEK_MENU=[
  [
    "Recovery & skill",
    "Cottage-cheese berry smoothie (or soy alternative) + toast",
    "Lemony lentil soup + sourdough",
    "Paneer/tofu fajita bowl (minimal oil)",
    "Roasted chickpeas + fruit"
  ],
  [
    "Lower A",
    "Apple-cinnamon overnight oats + pumpkin seeds",
    "Tofu, roasted broccoli + brown rice",
    "Veggie-loaded chickpea pasta + greens",
    "Fortified soy milk + walnuts"
  ],
  [
    "Upper A + Core",
    "Spinach mushroom egg scramble + toast",
    "Spinach dal + roti + cucumber salad",
    "Dal + roasted zucchini + lemon potatoes",
    "Berry smoothie (after training if preferred)"
  ],
  [
    "Optional social activity",
    "Chia-berry oats + soy yogurt",
    "Miso-ginger tofu noodle soup + greens",
    "Homemade low-oil veggie pizza + salad",
    "Carrots + hummus"
  ],
  [
    "Rest + meal prep",
    "Berry-cinnamon overnight oats + soy yogurt",
    "Veggie moong-dal khichdi + tofu",
    "Ginger-garlic tofu veggie stir fry + rice",
    "Apple + handful of pumpkin seeds"
  ],
  [
    "Lower B",
    "Eggs + spinach + sourdough",
    "Rajma rice bowl + cucumber + lemon",
    "Egg dosa + spinach + tomato chutney",
    "Soy yogurt + blueberries"
  ],
  [
    "Upper B + Core",
    "Chia pudding + fortified soy yogurt + berries",
    "Chickpea-feta (or tofu) spinach wrap",
    "Roasted cauliflower + sweet potato + herbed chickpeas",
    "Banana + soy milk (before training if hungry)"
  ],
  [
    "Recovery & skill",
    "Banana-berry tofu smoothie + toast",
    "Tofu lentil bolognese + whole-grain pasta",
    "Egg scramble + spinach + sourdough",
    "Roasted chickpeas + fruit"
  ],
  [
    "Lower A",
    "Overnight oats + strawberries",
    "Ginger tofu soba with bok choy",
    "Vegetable dal + roti + cucumber",
    "Fortified soy milk + walnuts"
  ],
  [
    "Upper A + Core",
    "Savory oats + egg + spinach",
    "Lentil stew + whole-grain toast",
    "Chickpea pasta primavera",
    "Berry smoothie (after training if preferred)"
  ],
  [
    "Optional social activity",
    "Yogurt berry bowl + chia",
    "Egg-spinach rice bowl",
    "Mushroom spinach dosa + soy yogurt dip",
    "Carrots + hummus"
  ],
  [
    "Rest + meal prep",
    "Blueberry oats + soy yogurt",
    "Rajma + brown rice + sautéed spinach",
    "Roasted pepper and tofu pita + greens",
    "Apple + handful of pumpkin seeds"
  ],
  [
    "Lower B",
    "Spinach egg-and-toast plate",
    "Veggie moong khichdi + tofu",
    "Cauliflower-chickpea curry + rice",
    "Soy yogurt + blueberries"
  ],
  [
    "Upper B + Core",
    "Chia-mango pudding + soy yogurt",
    "Chickpea spinach lemon wrap",
    "Tofu lemon herb sheet-pan veg + potatoes",
    "Banana + soy milk (before training if hungry)"
  ]
];
const DAY_MS=86400000;
const utcDay=key=>Date.parse(key+'T12:00:00Z');
export const dayIndex=key=>Math.round((utcDay(key)-utcDay(RECOMP_START))/DAY_MS);
export function buildRecompDay(key){
 const i=dayIndex(key);if(!Number.isFinite(i)||i<0||i>=56)return null;
 const week=Math.floor(i/7)+1;
 let [session,breakfast,lunch,dinner,snack]=TWO_WEEK_MENU[i%14];
 if(key==='2026-11-25')session='Abs + Core';
 const lifting=['Lower A','Lower B','Upper A + Core','Upper B + Core','Abs + Core'].includes(session);
 const recovery=session==='Recovery & skill';
 const prep=session==='Rest + meal prep';
 const cardio=lifting?'Your usual 20–30 min incline treadmill (3 mph, 12%) or StairMaster if you have time and energy':recovery||session==='Optional social activity'?'Optional relaxed 20–30 min walk':'Rest or optional gentle walk';
 let note=lifting?'Record load, reps, technique and recovery after training':'Rest counts';
 if(key==='2026-11-25')note='High-school reunion day: dedicated abs + core session. Keep it manageable before the event; no need to chase exhaustion.';
 if(key==='2026-11-26'||key==='2026-12-25'||key==='2027-01-01')note='Holiday: move or shorten training if needed; no catch-up punishment';
 if(key==='2026-12-22'||key==='2027-01-19')note='Review strength, energy, appetite, cycle and digestion';
 return {date:key,week,session,breakfast,lunch,dinner,snack,cardio,note,focus:WEEK_FOCUS[week-1],prep:recovery?'10-minute greens/protein top-up':prep?'Batch-cook grains, legumes and 2–3 days of vegetables':'Pack next meal and training clothes; no rigid restriction'};
}
export function allRecompDays(){
 return Array.from({length:56},(_,i)=>buildRecompDay(new Date(utcDay(RECOMP_START)+DAY_MS*i).toISOString().slice(0,10)));
}
export function exercisesForSession(session){
 if(session==='Abs + Core'){
  const chosen=['weighted-straight-leg-captain-s-chair-raise','weighted-russian-twist','weighted-dead-bug','cable-crunch','controlled-leg-rainbow-with-ball'];
  return chosen.map(id=>RECOMP_EXERCISES.find(ex=>ex.id===id)).filter(Boolean);
 }
 return RECOMP_EXERCISES.filter(x=>x.session===session);
}
