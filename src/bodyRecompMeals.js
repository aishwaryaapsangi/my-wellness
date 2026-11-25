// Food-first vegetarian meal inspiration. Quantities are grocery estimates,
// not calorie limits, medical prescriptions, or promises to "detox" skin.
const G={
 oats:['Grains',.5,'cup'],chia:['Pantry',1,'tbsp'],berries:['Fruit',.5,'cup'],banana:['Fruit',1,'each'],apple:['Fruit',1,'each'],mango:['Fruit',.5,'cup'],lemon:['Produce',.5,'each'],ginger:['Produce',1,'inch'],spinach:['Greens',1,'cup'],cilantro:['Greens',.25,'bunch'],broccoli:['Vegetables',1,'cup'],cauliflower:['Vegetables',1,'cup'],carrots:['Vegetables',1,'each'],pepper:['Vegetables',.5,'each'],onion:['Vegetables',.5,'each'],tomato:['Vegetables',1,'each'],cucumber:['Vegetables',.5,'each'],eggplant:['Vegetables',.5,'each'],okra:['Vegetables',1,'cup'],peas:['Vegetables',.5,'cup'],potato:['Vegetables',1,'each'],sweet_potato:['Vegetables',1,'each'],mushrooms:['Vegetables',1,'cup'],zucchini:['Vegetables',.5,'each'],squash:['Vegetables',1,'cup'],avocado:['Fruit',.25,'each'],eggs:['Protein',2,'each'],paneer:['Protein',100,'g'],yogurt:['Protein',.75,'cup'],cottage_cheese:['Protein',.5,'cup'],soy_milk:['Drinks',1,'cup'],milk:['Drinks',1,'cup'],lentils:['Protein',.33,'cup dry'],moong:['Protein',.33,'cup dry'],beans:['Protein',.75,'cup cooked'],chickpeas:['Protein',.75,'cup cooked'],sourdough:['Grains',2,'slices'],rice:['Grains',.5,'cup dry'],roti:['Grains',2,'each'],wrap:['Grains',1,'each'],dosa_batter:['Grains',.75,'cup'],pasta:['Grains',2,'oz dry'],noodles:['Grains',2,'oz dry'],feta:['Protein',1,'oz'],cheese:['Protein',1,'oz'],pumpkin_seeds:['Pantry',1,'tbsp'],walnuts:['Pantry',2,'tbsp'],peanut_butter:['Pantry',1,'tbsp'],olive_oil:['Pantry',1,'tsp'],spices:['Pantry',1,'set'],miso:['Pantry',1,'tbsp'],herbs:['Greens',1,'small bunch'],bread:['Grains',2,'slices'],tortilla:['Grains',1,'each'],garlic:['Produce',2,'cloves'],broth:['Pantry',1,'cup']
};
const r=(id,name,type,shop,ingredients,steps,note,highlights)=>({id,name,type,shop,ingredients,instructions:steps,adjustments:note,nutrients:highlights,yield:'1 generous serving; adjust to appetite'});
export const RICH_RECIPES=[
r('overnight-oats','Blueberry cinnamon overnight oats','Breakfast',['oats','chia','berries','yogurt','soy_milk'],'½ cup rolled oats, 1 tbsp soaked chia, ½ cup blueberries, ¾ cup Greek/soy yogurt, milk, cinnamon','Mix oats, yogurt, milk and chia. Refrigerate overnight; top with berries in morning.','Add banana or more yogurt if hungry; choose dairy-free if dairy bothers you.','Fiber, protein, calcium if fortified'),
r('chia-pudding','Creamy mango-berry chia pudding','Breakfast',['chia','yogurt','soy_milk','mango','berries'],'2 tbsp chia, ¾ cup soy milk, ¾ cup yogurt, ½ cup mango/berries','Stir chia into milk twice five minutes apart; chill at least four hours; add yogurt and fruit.','Start with 1 tbsp chia if fiber makes you gassy. Never swallow dry chia seeds.','Fiber, plant omega-3, fruit'),
r('eggs-sourdough','Spinach eggs and sourdough','Breakfast',['eggs','sourdough','spinach','mushrooms','tomato'],'2 eggs, toasted sourdough, mushrooms, baby spinach, tomato','Sauté mushrooms and spinach in a nonstick skillet with a splash of water or ½ tsp oil; scramble eggs and serve over toast.','Serve with kiwi or orange for vitamin C.','Protein, iron, choline, greens'),
r('berry-smoothie','Blueberry banana cottage-cheese smoothie','Breakfast / Snack',['cottage_cheese','berries','banana','soy_milk'],'½ cup cottage cheese, banana, berries, soy milk or water, cinnamon','Blend until smooth, and enjoy with toast or another meal when hungry.','Use Greek yogurt or fortified soy yogurt if preferred.','Protein, potassium, calcium'),
r('green-smoothie','Kiwi spinach green smoothie','Morning / Snack',['spinach','banana','ginger','soy_milk','lemon'],'Spinach, half a banana, kiwi or berries, tiny slice of ginger, soy milk and water','Blend thoroughly and have with breakfast or a protein-containing meal.','No juice cleanse. Ginger can trigger reflux; keep optional.','Greens, vitamin C, fiber'),
r('veggie-khichdi','Vegetable moong-dal khichdi','Lunch / Dinner',['moong','rice','spinach','peas','carrots','ginger','spices'],'Moong dal, rice, spinach, carrots, peas, ginger, cumin, turmeric; ½–1 tsp oil optional','Rinse dal and rice, simmer with vegetables and spices until soft and creamy. Add lemon and yogurt or egg on side.','Use nonstick tempering with measured oil or water.','Protein, fiber, greens, carbs'),
r('brinjal-bhaji','Smoky brinjal (eggplant) bhaji + dal','Lunch / Dinner',['eggplant','onion','tomato','lentils','roti','garlic','cilantro','spices'],'Eggplant, tomato, onion, garlic, mustard seeds, turmeric, red chili; dal and roti','Roast/bake eggplant until soft, then mash into a nonstick onion-tomato masala. Serve with dal and roti.','Roasting cuts added oil; choose mild spice if reflux-prone.','Vegetables, legumes, balanced meal'),
r('bhindi-bhaji','Crisp bhindi bhaji with dal-rice','Lunch / Dinner',['okra','onion','lentils','rice','spices','lemon'],'Dry okra, onion, cumin, coriander, turmeric, dal, rice','Pat okra completely dry; cook in hot nonstick pan with 1 tsp oil or air fryer until crisp. Serve with dal and rice.','Avoid washing chopped okra directly before frying.','Fiber, lentil protein, familiar flavor'),
r('potato-pea-bhaji','Batata-matar bhaji + egg','Lunch / Dinner',['potato','peas','spinach','eggs','roti','spices'],'Potatoes, peas, spinach, cumin, mustard, turmeric, egg and roti','Steam potatoes then fold into briefly sautéed spices, peas and spinach; serve with an egg and roti.','Potatoes are nutritious; no need to eliminate them.','Carbohydrates, vegetables, protein'),
r('rajma-rice','Rajma rice with lemony cucumber','Lunch / Dinner',['beans','rice','tomato','onion','spinach','cucumber','lemon','spices'],'Kidney beans, rice, tomato-ginger masala, spinach, cucumber, lemon','Simmer cooked beans in tomato-onion gravy, wilt greens into sauce, and serve with rice and lemon cucumber.','Rinse canned beans; make a small portion if beans cause bloating.','Fiber, plant protein, iron'),
r('palak-paneer','Lighter palak paneer + roti','Lunch / Dinner',['paneer','spinach','onion','tomato','roti','garlic','spices'],'Paneer, lots of spinach, garlic, onion, tomato, spices; roti','Blanch spinach, blend; simmer with tomato-spice base then add paneer. Use ½–1 tsp oil and water in place of heavy cream.','Use eggs or chickpeas instead of paneer if you are testing dairy tolerance.','Calcium, protein, greens'),
r('chickpea-feta-wrap','Chickpea feta cilantro-lime wrap','Lunch / Dinner',['chickpeas','feta','wrap','spinach','cucumber','yogurt','cilantro','lemon'],'Chickpeas, spinach, cucumber, feta, tortilla, cilantro-lime yogurt sauce','Mash chickpeas with lemon and spices; fill wrap with greens and a little feta. Drizzle cilantro-lime yogurt sauce.','Swap feta for avocado if dairy worsens symptoms; increase chickpeas for protein.','Protein, fiber, vegetables'),
r('jalapeno-wrap','Jalapeño popper veggie wrap','Lunch / Dinner',['wrap','yogurt','cheese','pepper','spinach','beans','spices'],'Jalapeño or bell pepper, a little cheese, yogurt-based creamy sauce, white beans, spinach, tortilla','Roast peppers, mash beans with yogurt and spices, fill wrap, toast in dry skillet.','Skip heavy cream or excessive cheese without sacrificing flavor.','Beans, greens, fiber'),
r('fajita-paneer','Spicy paneer fajita rice bowl','Lunch / Dinner',['paneer','rice','pepper','onion','beans','spinach','lemon','spices'],'Spiced paneer, rice, sautéed peppers and onion, black beans, spinach and fresh salsa','Air-fry or pan-sear paneer with measured oil; cook peppers, assemble over rice with lemon and salsa.','Choose egg or chickpeas instead of paneer if needed.','Protein, vegetables, grains'),
r('sheet-pan-veg','Crispy cauliflower & chickpea sheet pan','Lunch / Dinner',['cauliflower','chickpeas','carrots','sweet_potato','yogurt','lemon','spices'],'Cauliflower, carrots, sweet potato, chickpeas, paprika, cumin, cilantro-lime sauce','Toss with 1–2 tsp oil for the entire tray; roast at 425°F until edges crisp, serve with yogurt sauce and grains as desired.','Use parchment or air fryer, and add egg for more protein.','Colorful vegetables, plant protein'),
r('lentil-pasta','Tomato-spinach lentil pasta','Lunch / Dinner',['pasta','lentils','spinach','tomato','garlic','herbs','cheese'],'Whole-grain or chickpea pasta, red lentils, tomato, spinach, garlic and basil','Cook pasta; simmer lentils in tomato sauce until soft, add spinach, toss and finish with herbs.','Parmesan/feta optional; make sauce in bulk.','Iron, fiber, protein'),
r('butternut-soup','Creamy butternut squash and lentil soup','Lunch / Dinner',['squash','lentils','carrots','onion','broth','bread','ginger'],'Roasted squash, carrot, red lentils, ginger, low-salt broth, toast','Roast vegetables, simmer with lentils and stock, blend smooth. Serve with toasted sourdough.','Silky without cream; add an egg or yogurt on side if desired.','Vitamin A from foods, plant protein, comfort'),
r('ginger-soup','Cozy ginger mushroom egg soup','Lunch / Dinner',['mushrooms','spinach','eggs','broth','ginger','noodles','miso'],'Mushrooms, bok choy/spinach, ginger, egg, broth, noodles; miso optional','Simmer mushrooms and ginger in broth. Cook noodles, swirl in beaten egg, add greens and miso off heat.','Tofu-free by default. Add or reduce miso to taste; sodium can vary.','Protein, greens, warming soup'),
r('buffalo-cauliflower','Buffalo cauliflower & bean rice bowl','Lunch / Dinner',['cauliflower','beans','rice','yogurt','cucumber','spices'],'Oven-baked buffalo cauliflower, black beans, rice, crisp cucumber, herbed yogurt','Roast cauliflower with a little oil, toss lightly in hot sauce, serve over rice/beans and cooling sauce.','Choose mild hot sauce if sensitive; no need to deep-fry.','Beans, vitamin C, fiber'),
r('spinach-dal','Spinach dal + lemon potatoes','Lunch / Dinner',['lentils','spinach','potato','lemon','spices','yogurt'],'Masoor or toor dal, baby spinach, roasted potato, lemon and cumin','Simmer lentils with spices, wilt spinach, roast potato wedges using measured oil or air fryer.','Serve yogurt if tolerated; add bread if still hungry.','Protein, iron, balanced carbs'),
r('paneer-pizza','Homemade peppy paneer veggie pizza','Lunch / Dinner',['paneer','bread','tomato','pepper','onion','spinach','cheese'],'Small homemade pizza base, tomato sauce, spiced paneer, bell pepper, onion, mozzarella and spinach','Bake topped homemade base or flatbread until golden. Add a side of leafy greens.','No need to ban pizza; keep oil modest and vegetables abundant.','Protein, satisfying meal'),
r('egg-bowl','Egg & spinach rice bowl','Lunch / Dinner',['eggs','rice','spinach','mushrooms','carrots','spices'],'Soft eggs, rice, mushrooms, carrots, spinach, sesame or chili flakes','Quick sauté vegetables, add soft scrambled eggs, serve over warm rice.','Swap vegetables freely; top with cilantro.','Protein, iron, greens'),
r('zucchini-wrap','Garlic mushroom feta pita','Lunch / Dinner',['mushrooms','zucchini','feta','bread','spinach','garlic','lemon'],'Mushrooms, zucchini, garlic, a little feta, greens and toasted pita','Sauté mushrooms and zucchini on nonstick, finish with garlic-lemon sauce, fill pita and add greens.','For higher protein add chickpeas.','Vegetables, protein, balanced meal'),
r('sabudana-bhaji','Vegetable sabudana bhaji with yogurt','Lunch / Dinner',['potato','peas','carrots','yogurt','peanut_butter','lemon','spices'],'Soaked sabudana (tapioca pearls), potato, peas, carrot, cumin, lemon, roasted ground peanuts; yogurt on side','Soak sabudana according to package, steam potato, toss briefly with vegetables and spices until pearls turn translucent.','Tapioca is mostly starch; pair with yogurt or eggs for protein. Confirm if this is the sabu bhaji you meant.','Carbs, vegetables; protein side')
];
const breakfast=['overnight-oats','eggs-sourdough','chia-pudding','berry-smoothie','overnight-oats','eggs-sourdough','chia-pudding'];
const snack=['berry-smoothie','chia-pudding','eggs-sourdough'];
export const MORNING_RITUALS=[
 {title:'Green smoothie with breakfast',detail:'Spinach + kiwi/berries + banana + water/soy milk. A food, not a cleanse.'},
 {title:'Ginger-lemon water',detail:'A small diluted ginger-lemon drink if you enjoy it; plain water is equally fine. Skip if reflux worsens.'},
 {title:'Plain water + fruit',detail:'Water first; berries or banana alongside breakfast. No supplement required.'},
 {title:'Collagen water — optional',detail:'Collagen is not necessary for skin or muscle; evidence is limited. Water or a fruit smoothie is a fine alternative.'},
 {title:'Soaked chia with breakfast',detail:'Enjoy your soaked chia pudding; start with a smaller portion if it causes gas.'},
 {title:'Spinach smoothie',detail:'Greens + banana + fortified soy milk; have protein with breakfast.'},
 {title:'Water + yogurt if tolerated',detail:'Fermented yogurt is optional; probiotics are not a daily requirement for clear skin.'}
];
// Week-level batch cooking: five planned servings of one main lunch/dinner,
// two easy alternate meals in each category. Each new week changes both mains.
// Freeze portions you will not eat within 3–4 days; refresh midweek.
// The plan deliberately does NOT demand seven different home-cooked dishes.
export const WEEKLY_BATCHES=[
 {lunchMain:'veggie-khichdi',lunchAlt:'chickpea-feta-wrap',dinnerMain:'brinjal-bhaji',dinnerAlt:'sheet-pan-veg'},
 {lunchMain:'rajma-rice',lunchAlt:'egg-bowl',dinnerMain:'palak-paneer',dinnerAlt:'ginger-soup'},
 {lunchMain:'spinach-dal',lunchAlt:'jalapeno-wrap',dinnerMain:'bhindi-bhaji',dinnerAlt:'potato-pea-bhaji'},
 {lunchMain:'lentil-pasta',lunchAlt:'egg-bowl',dinnerMain:'fajita-paneer',dinnerAlt:'butternut-soup'},
 {lunchMain:'potato-pea-bhaji',lunchAlt:'chickpea-feta-wrap',dinnerMain:'sheet-pan-veg',dinnerAlt:'paneer-pizza'},
 {lunchMain:'brinjal-bhaji',lunchAlt:'rajma-rice',dinnerMain:'ginger-soup',dinnerAlt:'palak-paneer'},
 {lunchMain:'chickpea-feta-wrap',lunchAlt:'egg-bowl',dinnerMain:'buffalo-cauliflower',dinnerAlt:'spinach-dal'},
 {lunchMain:'bhindi-bhaji',lunchAlt:'sabudana-bhaji',dinnerMain:'butternut-soup',dinnerAlt:'paneer-pizza'}
];
const LUNCH_ALTERNATE_DAYS=[3,6];
const DINNER_ALTERNATE_DAYS=[2,5];
export function weeklyBatchSummary(week){
 const plan=WEEKLY_BATCHES[week-1];
 if(!plan)return null;
 return {
  lunch:[{id:plan.lunchMain,name:recipeById(plan.lunchMain)?.name,servings:5,role:'Main prep'},
         {id:plan.lunchAlt,name:recipeById(plan.lunchAlt)?.name,servings:2,role:'Quick alternate'}],
  dinner:[{id:plan.dinnerMain,name:recipeById(plan.dinnerMain)?.name,servings:5,role:'Main prep'},
          {id:plan.dinnerAlt,name:recipeById(plan.dinnerAlt)?.name,servings:2,role:'Quick alternate'}]
 };
}
const dateIndex=key=>Math.round((Date.parse(key+'T12:00:00Z')-Date.parse('2026-11-25T12:00:00Z'))/86400000);
export const recipeById=id=>RICH_RECIPES.find(r=>r.id===id);
export function mealIdsForDate(date){
 const idx=dateIndex(date);if(idx<0||idx>=56)return null;
 const week=Math.floor(idx/7),day=idx%7;
 const batch=WEEKLY_BATCHES[week];
 return {week:week+1,breakfast:breakfast[(day+week)%7],
  lunch:LUNCH_ALTERNATE_DAYS.includes(day)?batch.lunchAlt:batch.lunchMain,
  dinner:DINNER_ALTERNATE_DAYS.includes(day)?batch.dinnerAlt:batch.dinnerMain,
  lunchPrep:LUNCH_ALTERNATE_DAYS.includes(day)?'Quick alternate':'Main meal prep',
  dinnerPrep:DINNER_ALTERNATE_DAYS.includes(day)?'Quick alternate':'Main meal prep',
  snack:snack[day%3],morning:MORNING_RITUALS[(day+week)%7]};
}
export function namedMeal(date,kind,fitness={}){
 const p=mealIdsForDate(date);if(!p)return null;
 return fitness.mealOverrides?.[date]?.[kind]||recipeById(p[kind])?.name||'Flexible nourishing meal';
}
export function weeklyGrocery(week,fitness={}){
 if(week<1||week>8)return [];
 const totals=new Map();
 const first=new Date(Date.parse('2026-11-25T12:00:00Z')+(week-1)*7*86400000);
 for(let d=0;d<7;d++){
  const date=new Date(first.valueOf()+d*86400000).toISOString().slice(0,10);
  const p=mealIdsForDate(date);
  for(const kind of ['breakfast','lunch','dinner','snack']){
   const override=fitness.mealOverrides?.[date]?.[kind];
   const recipe=override?RICH_RECIPES.find(x=>x.name===override):recipeById(p[kind]);
   if(!recipe)continue;
   for(const ingredient of recipe.shop||[]){
    const info=G[ingredient];if(!info)continue;
    const [category,amount,unit]=info;
    const key=ingredient+'|'+unit;
    totals.set(key,{key:ingredient,category,amount:(totals.get(key)?.amount||0)+amount,unit});
   }
  }
 }
 return [...totals.values()].sort((a,b)=>a.category.localeCompare(b.category)||a.key.localeCompare(b.key))
 .map(v=>({...v,amount:Math.round(v.amount*10)/10,label:v.key.replaceAll('_',' ')}));
}
export function weeklyMealDates(week){
 return Array.from({length:7},(_,i)=>new Date(Date.parse('2026-11-25T12:00:00Z')+((week-1)*7+i)*86400000).toISOString().slice(0,10));
}
