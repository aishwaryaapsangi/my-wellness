// All recurrence rules are interpreted in the user's local calendar, not UTC.
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const LONG_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const PHASES = [
  { id:'sunrise', label:'Sunrise ritual', icon:'sunrise', strap:'A softer start to your day' },
  { id:'after', label:'After work', icon:'heart', strap:'Move, refuel & give yourself some space' },
  { id:'sunset', label:'Sunset ritual', icon:'moon', strap:'A little reset, then real rest' },
];
export const keyOf = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function fromKey(key){const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d,12)}
export const offset = (key,number)=>{const d=fromKey(key);d.setDate(d.getDate()+number);return keyOf(d)};
export const weekday = (key)=>fromKey(key).getDay();
export const dateTitle = (key)=>new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric'}).format(fromKey(key));
export const monthTitle = (key)=>new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(fromKey(key));
export function monthGrid(key){const d=fromKey(key);const first = new Date(d.getFullYear(),d.getMonth(),1,12);const start=new Date(first);start.setDate(1-first.getDay());return Array.from({length:42},(_,i)=>{const v=new Date(start);v.setDate(start.getDate()+i);return keyOf(v)})}
export const PERIOD_START='2026-11-16', PERIOD_END='2026-12-31';
export const inPeriod=k=>typeof k==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(k)&&k>=PERIOD_START&&k<=PERIOD_END;
export const clampPeriod=k=>!k||k<PERIOD_START?PERIOD_START:k>PERIOD_END?PERIOD_END:k;
export const standard = {type:'daily',days:[],every:2,anchor:'2026-11-16'};
const daily = ()=>({...standard});
const days = (...numbers)=>({type:'days',days:numbers,every:2,anchor:'2026-11-16'});
const interval = (every,anchor='2026-11-16')=>({type:'interval',days:[],every,anchor});
const optional = ()=>({type:'optional',days:[],every:2,anchor:'2026-11-16'});
function task(id,phase,title,tag,subtitle,schedule,steps=[],time='',note='',icon='sparkles'){
 return {id,phase,title,tag,subtitle,schedule,steps,time,note,icon};
}
export const DEFAULT_TASKS = [
 task('early-code','sunrise','5 AM quiet coding / Google prep','work','Mon · Wed · Fri: a short DSA or portfolio focus block before the day gets busy.',days(1,3,5),['Only start if you slept enough; otherwise move this block later.','Pick one small target: review a Java pattern, solve one practice problem, or improve a portfolio component.','Use a 25-minute focused timer and finish by writing the one thing learned.','Stop when the block ends—no guilt if you choose sleep.'],'5:00 AM','Optional early-start goal, not a reason to sacrifice sleep.','laptop'),
 task('early-run','sunrise','6 AM optional run / sunrise movement','move','Tue · Thu · Sat: alternate with your early coding mornings.',days(2,4,6),['Choose this run only if sleep and commute permit; on office mornings you can replace it with a short walk or move it to a remote day.','Warm up with 5 minutes of easy walking.','Choose 15–25 minutes of comfortable jogging or a walk; shorten it on heavy gym days.','Cool down, drink to thirst and enjoy your morning light.','Skip if exhausted, in pain or short on sleep.'],'6:00 AM','During isotretinoin treatment, stop for unusual muscle pain or weakness.','sunrise'),
 task('morning-prayer','sunrise','A quiet prayer to God ♡','mind','A few grateful minutes to ground the start of your day.',daily(),['Settle into a quiet corner for 2–5 minutes.','Offer a prayer of gratitude, ask for clarity and kindness, or use the words meaningful to you.','Set one intention for how you want to treat yourself and others today.'],'5:55 AM','This is personal time—no perfect words required.','heart'),

 task('sunlight','sunrise','Sunlight, breath & a softer start','mind','A calm, screen-free start before your early workday.',daily(),['Open the blinds and get some outdoor light when the sun is up. If it is still dark, use a softly lit indoor space instead.','Drink water and take three steady breaths.','Set one feeling or intention for the day; small is enough.'],'5:45 AM','Move your wake time gradually; consistency matters more than an exact early hour.','sun'),
 task('morning-drink','sunrise','Today’s nourishing drink','nourish','Rotates by weekday; no detox claims or extra supplements.',daily(),['Make the drink suggested in the Nourish card.','Include the fiber instead of straining smoothies.','For chia, fully hydrate seeds before consuming.'],'6:05 AM','Plain water is always a good alternative.','glass-water'),
 task('skincare-am','sunrise','Gentle glow + skin barrier + SPF','skin','Hydrating cleanser if needed, moisturizer, lip care and sunscreen.',daily(),['If needed, cleanse gently without exfoliation.','Apply fragrance-free moisturizer and lip balm.','Use broad-spectrum SPF 30+; reapply outdoors.'],'6:25 AM','Avoid retinoids, strong acids, harsh scrubs and waxing during isotretinoin.','sparkles'),
 task('gua-sha','sunrise','Gua sha / face massage (only if comfortable)','glow','A short, low-pressure option after moisturizer; skip irritated skin.',daily(),['Wash your hands and use a clean, smooth gua sha tool only if your skin feels comfortable.','Apply bland moisturizer for plenty of slip; glide outward gently for 1–2 minutes, never tug.','Avoid active acne lesions, broken skin and the delicate eyelid area.','Skip entirely when skin is flaking, stinging, red or unusually sensitive.'],'6:30 AM','Massage cannot detox your body or change facial bone structure.','flower'),
 task('morning-mind','sunrise','Journal, gratitude & five-minute calm','mind','A little planning plus one kind thought about yourself.',daily(),['Write one gratitude and one thing you look forward to.','Pick your top three priorities without crowding your day.','Do 3–5 minutes of breathing, calming music or mindful sitting.','Notice your mood without trying to force positivity.'],'6:34 AM','The goal is consistency without pressure to feel happy every day.','book-open'),
 task('get-ready','sunrise','Get ready gracefully · pressed & polished ✦','glow','Your put-together ritual: pressed outfit, freshly cared-for hair and simple finishing touches.',daily(),['Choose a comfortable, coordinated outfit that feels elegant; check for wrinkles and steam or iron it safely when needed.','Keep your hair clean and polished without overwashing: refresh or softly style it, tidy flyaways, and follow the actual wash days in your evening scalp cycle.','Add simple finishing touches if you enjoy them: a tidy bag, clean shoes, small accessories, or light makeup that agrees with your skin.','Pause for a final mirror check: relaxed shoulders, confident posture, and one kind thought about yourself.'],'6:40 AM','Elegant means cared-for and comfortable, not flawless or expensive.','sparkles'),
 task('hair-keto','sunset','Hair ritual · dandruff wash','hair','Monday + Friday: detailed evening ketoconazole wash, if approved for your scalp.',days(1,5),['BEFORE SHOWER · Gently detangle ends to roots; if dry, smooth a little oil on hair ends only (not an inflamed scalp).','SHOWER · Wet the scalp thoroughly with lukewarm water, then apply ketoconazole shampoo to the scalp ONLY if clinician-approved.','Massage gently with fingertips, never nails; follow your own bottle or prescription for how long to leave it on (many products say 3–5 minutes).','Rinse completely; use conditioner from mid-lengths to ends and rinse well.','AFTER SHOWER · Squeeze water with a microfiber towel; add leave-in if needed and a few drops of oil to ends only.','Avoid tight hairstyles; skip irritant treatments if your scalp is red, sore or unusually dry.'],'7:30 PM','If the scalp burns, flakes worsen, or feels excessively dry while on isotretinoin, stop the new product and ask your dermatologist.','droplets'),
 task('hair-moisture','sunset','Hair ritual · moisture wash','hair','Wednesday: gentle shampoo, conditioner and a mask on your lengths.',days(3),['BEFORE SHOWER · Detangle from ends upward; add a little oil to dry ends only if helpful.','SHOWER · Wet hair with lukewarm water. Work moisturizing shampoo over the scalp without scratching.','Rinse, then apply conditioner or a hair mask to mid-lengths and ends only.','Leave the mask on for the label-directed time (not a fixed 10 minutes for every product).','Rinse with cool to lukewarm water; squeeze gently with a microfiber towel.','AFTER SHOWER · Apply leave-in to lengths and a little end oil if needed. Air dry or use gentle heat protection.'],'7:30 PM','Skip additional washes if your scalp is excessively dry and your clinician advises fewer washes.','flower'),
 task('hair-sun','sunset','Hair ritual · gentle wash OR rest','hair','Sunday: assess your scalp and choose a gentle wash or full rest.',days(0),['OPTION 1 · If scalp or hair is genuinely oily/dirty, use gentle moisturizing shampoo on the scalp.','Condition or mask lengths as directed, rinse thoroughly and apply a little leave-in or end oil.','OPTION 2 · If hair is fresh, skip washing. Detangle gently and rest the scalp.','Evening: stretch, relax, and avoid scratching or overmassaging irritated skin.'],'8:20 PM','An optional routine: it will appear under “If you need it” until scheduled.','flower'),
 task('breakfast','sunrise','Balanced breakfast & approved supplements','nourish','Protein, fiber, and fats; only supplements you and your clinician have approved.',daily(),['Use today’s breakfast idea in the Nourish card.','Check your isotretinoin formulation’s food instructions with the pharmacist.','Avoid adding vitamin A supplements; only use supplements cleared by your clinician.'],'6:55 AM','The app intentionally does not set medication doses or iPLEDGE reminders.','utensils'),
 task('workday-start','sunrise','Early workday · ready for 7:00–7:30','work','Weekdays: leave with enough travel time for the early shift you want.',days(1,2,3,4,5),['Check your meetings, office/remote status, and the commute before leaving.','Target starting work around 7:00–7:30 AM when it fits your team’s agreed hours.','Prepare your laptop, lunch, keys, and water the evening before to keep mornings comfortable.','Working remotely? Start your focus block early and skip the commute.'],'7:10 AM','Editable goal, not an automatic change to employer expectations or commute time.','laptop'),
 task('eyedrops','sunset','Nighttime eye comfort · lubricating drops','eyes','Every two evenings: a wind-down reminder for drops if your eyes feel dry. Use them on other days when needed and as directed.',interval(2),['During your evening wind-down, notice dryness, burning, or fluctuating blurry vision.','Use preservative-free lubricating artificial tears when needed, following the exact label instructions.','Remove contact lenses before using drops unless your product specifically says it is compatible with your lenses.','New persistent blurring, painful redness, or light sensitivity warrants prompt eye-care assessment.'],'9:17 PM','The reminder frequency is editable and does not limit use of artificial tears if your eyes feel dry.','eye'),
 task('home-by-three','after','3:30 homecoming goal · unwind & change gears','home','Weekday transition: start your personal time when you get home.',days(1,2,3,4,5),['If you want to be HOME by 3:30 PM, work backward from your actual commute time and discuss any early departure with your team.','A 7:00–3:30 office shift usually means arriving home AFTER 3:30 once travel is included.','When you reach home: wash up, take a few minutes without screens, and eat a small snack if hungry.','Celebrate the boundary between work and your own time; if you get home later, just shift the rest of the evening.'],'3:30 PM','Aspirational home-arrival target, not a guaranteed work finish; actual time depends on approved hours and travel.','home'),
 task('movement','after','Today’s strength / movement session','move','Your 3 abs + 1 upper + 1 lower weekly split.',days(1,2,3,4,5,6),['Check today’s exact routine in the Move card.','Use an effort level that leaves energy in reserve.','If you get unusual severe muscle pain or weakness while on isotretinoin, stop and seek medical advice.'],'4:00 PM','Rest days are part of progress. Keep intensity flexible.','dumbbell'),
 task('dinner','after','Cook or heat dinner + take your break','nourish','Nourish first, decompress, and enjoy your meal.',daily(),['Use the Nourish card for an easy dinner rotation.','Have protein and carbohydrates after training if hungry.','Take an unhurried break; the routine is meant to support your life, not control it.'],'5:45 PM','','utensils'),
 task('after-code','after','Protected coding block · Google SWE prep','work','Weekdays: an after-work study session so the 5 AM option never feels compulsory.',days(1,2,3,4,5),['Set aside 40–60 minutes, ideally after dinner and a short break.','MON · Java DSA patterns and review one previously solved problem.','TUE · New LeetCode pattern, then write why the solution works.','WED · Portfolio or React/TypeScript build session.','THU · Two-pointer, hashing or another spaced-repetition practice set.','FRI · Light weekly review, note your wins, and plan one next-week target.','Pick one item that matches today; if the gym runs late, shorten the study block instead of sacrificing sleep.'],'6:45 PM','A protected personal-learning block, distinct from optional evening work catch-up.','laptop'),
 task('work-catchup','after','Optional work catch-up (8–9 PM)','work','Only if genuinely needed; protect time for rest.',optional(),['Choose one concrete work item if there is an actual deadline.','Set a stop time, then close your laptop.','Skip when you can; sleep and recovery matter.'],'8:00 PM','This is optional, not an expectation to work after hours.','laptop'),
 task('room-reset','sunset','9 PM reset · room, desk & dishes','home','A 10-minute clean slate for tomorrow.',daily(),['Clear your desk or one visible surface.','Finish the dishes or prepare the kitchen for tomorrow.','Dim lights and put your phone in night mode.'],'9:00 PM','Enough is better than perfect.','home'),
 task('skincare-pm','sunset','PM skincare + oral reset','skin','Gentle double-cleanse if needed, barrier care, lip balm and teeth care.',daily(),['Remove sunscreen/makeup gently; use a non-stripping cleanser without rubbing.','Apply a rich fragrance-free moisturizer while skin is still slightly damp, then petrolatum on lips.','Keep strong actives, exfoliating acids, retinol and scrubs out of the routine unless your dermatologist approves.','Finish your normal evening teeth care (brush and floss).','If skin burns, simplify to cleanser + moisturizer and discuss persistent irritation with your dermatologist.'],'9:12 PM','Your evening skincare is about comfort and barrier care, not extra acne products.','moon'),
 task('hair-rest-tue','sunset','Hair ritual · rest & replenish','hair','Tuesday: no wash, no scrub or glycolic acid; nourish the ends only.',days(2),['No shampoo or aggressive scalp scrubbing today.','If ends feel dry, use one or two drops of end oil or a little leave-in.','Detangle from ends to roots without pulling.','Keep hair loose or in a soft braid/scrunchie; hydrate and eat a balanced dinner.'],'9:20 PM','Rest is part of scalp care; don’t treat itchy dandruff with unapproved acids.','leaf'),
 task('hair-tonic','sunset','Hair ritual · scalp tonic (if tolerated)','hair','Thursday • optional scalp tonic, never on irritated or broken skin.',days(4),['Part the hair into four to six loose sections on a clean, dry or slightly damp scalp.','If using a clinician-approved scalp tonic that you tolerate, follow the product’s exact amount and instructions (for example, a few drops per section).','Massage lightly for 1–2 minutes; do not rub broken or inflamed areas.','Leave on only when the product instructs you to. If burning or flakes worsen, discontinue and ask your dermatologist.','Evening: put a little oil on dry ends if needed; keep the style relaxed.'],'8:20 PM','Not all scalp tonics are suitable for a dry or inflamed scalp.','flower'),
 task('hair-recovery','sunset','Hair ritual · gentle recovery / ends','hair','Saturday • protect ends and keep scalp comfortable.',days(6),['Recovery day · check whether the scalp feels calm before adding products.','If your clinician has said scalp oil is suitable and it does not worsen dandruff, use a very small amount for a short pre-wash treatment only if you plan to rinse it out later.','If the scalp is itchy, inflamed or flaky, skip scalp oil entirely.','Apply a drop or two of oil to dry ends if helpful; use a soft braid or loose style.','No need to shampoo merely because it is Saturday.'],'8:20 PM','Oil on an inflamed scalp can worsen some dandruff conditions.','heart'),
 task('heatless','sunset','Heatless curls / protective hairstyle','hair','Optional styling for nights you want curls.',optional(),['Use a soft heatless-curler ribbon or loose braids.','Do not pull on the scalp or sleep in tight styles.','Skip when hair feels fragile, sore or irritated.'],'9:22 PM','','flower'),
 task('compress','sunset','Warm eye compress & relaxation','eyes','Tuesday, Friday, Sunday • if your eye clinician advises it.',days(2,5,0),['Apply a comfortably warm—not hot—clean compress to closed eyelids.','Try 5–10 minutes and avoid putting pressure on the eyeballs.','Skip if the eye is acutely painful, very red or sensitive to light; seek care instead.'],'9:25 PM','Not a substitute for assessment of infection or vision changes.','eye'),
 task('mind-day-0','sunset',"Sunday \u00b7 reflect & reset","mind","Look back compassionately and plan a gentler week.",days(0),["What made me happy or calm this week?", "What drained me? Where did I abandon my needs?", "Name one way I showed courage, and one small promise for next week.", "Choose the coming week’s weekend connection plans."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-1','sunset',"Monday \u00b7 self-image reset","mind","Start the workweek without comparisons.",days(1),["Name one thing your body helped you do today.", "Catch one harsh self-judgment and reframe it as you would for a friend.", "Name one win not related to appearance or performance."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-2','sunset',"Tuesday \u00b7 social confidence","mind","Practice showing up as yourself in small moments.",days(2),["Recall one conversation; what went well?", "Pick one tiny challenge for tomorrow: initiate a hello, ask a question or hold eye contact comfortably.", "Remind yourself: a pause or accent is not a flaw."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-3','sunset',"Wednesday \u00b7 stress release","mind","Name the stressor, then separate facts from fears.",days(3),["Write what happened without interpretation.", "Write the story your mind added, then one alternative explanation.", "Choose one supportive action and let the rest wait."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-4','sunset',"Thursday \u00b7 voice & boundaries","mind","Make room for your opinions and needs.",days(4),["Write one thing you wanted to say today.", "Practice one clear sentence that expresses a preference or boundary.", "Celebrate progress without evaluating yourself for perfection."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-5','sunset',"Friday \u00b7 play & creativity","mind","Notice joy and make room for hobbies.",days(5),["List one thing that made you smile or feel curious.", "Schedule 20 minutes of reading, designing, painting or filming just for enjoyment.", "Give yourself permission to have fun without earning it."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('mind-day-6','sunset',"Saturday \u00b7 explore & connect","mind","Let yourself experience life outside productivity.",days(6),["Choose one new place, activity, or friendly connection.", "Think of a low-stakes way to be social without forcing a performance.", "At night, record one moment you appreciated."],'9:37 PM','Use this as an optional reflection, not a judgment of your mood.','book-open'),
 task('night-journal','sunset','Five-minute reflection, gratitude & self-kindness','mind','What did you enjoy? What did you like about yourself?',daily(),['Write one specific thing that went well.','Write one thing you liked about yourself today.','Name a feeling without judging it; note any major changes worth discussing with your doctor.'],'9:32 PM','Your baseline feelings matter even if they predate isotretinoin.','book-open'),
 task('weekend-connection','after','My weekend connection & little adventure','mind','Saturday/Sunday: choose an experience, a meetup, or restful connection.',days(0,6),['Check the plans you entered in Mind & social.','If you have plans: prepare only what you need and go enjoy them.','If the calendar is empty: consider a coffee-and-book outing, museum, park, hobby class or gentle catch-up call.','Social time is an invitation, not an obligation; downtime counts.'],'3:00 PM','The selected date’s social plans will appear here once you add them in Mind & social.','heart'),
 task('reading','sunset','Read + meditation music','mind','Low-stimulation wind-down without pressure.',daily(),['Pick a book you look forward to.','Play calming music or meditate briefly if you like.','Avoid turning bedtime into another productivity competition.'],'9:43 PM','','book-open'),
 task('lights-out','sunset','10 PM lights-out goal · protect your sleep','rest','If you choose a 5 AM morning, 10 PM gives only seven hours in bed.',daily(),['Dim lights and put your phone aside.','Try a comfortable, consistent sleep and wake schedule.','A 10 PM target is a preference, not a failure condition.'],'10:00 PM','Most adults need 7–9 hours of sleep.','moon'),
];
export function due(task,date){const s=task.schedule || standard; const wd=weekday(date);
 switch(s.type){case 'daily':return true;case 'days':return (s.days||[]).includes(wd);case 'interval':{const anchor=fromKey(s.anchor || date);const current=fromKey(date);const delta=Math.round((current-anchor)/(24*60*60*1000));return delta>=0 && delta % Math.max(1,Number(s.every)||1)===0;}case 'optional':return false;default:return false;}
}
// Weekend mornings are deliberately slower. User-edited time overrides take priority.
export const WEEKEND_MORNING_TIMES = {
  'sunlight':'8:00 AM','morning-prayer':'8:10 AM','morning-drink':'8:20 AM',
  'skincare-am':'8:40 AM','gua-sha':'8:45 AM','morning-mind':'8:50 AM',
  'get-ready':'9:05 AM','breakfast':'9:20 AM','early-run':'8:25 AM',
};
export function timeForDate(t,date){
  if(![0,6].includes(weekday(date)))return t.time;
  if(!WEEKEND_MORNING_TIMES[t.id])return t.time;
  const original=DEFAULT_TASKS.find(x=>x.id===t.id);
  return original?.time===t.time?WEEKEND_MORNING_TIMES[t.id]:t.time;
}
export const optionalOn = t=>t.schedule?.type==='optional';
export const scheduleLabel = s=>s.type==='daily'?'Every day':s.type==='optional'?'When needed':s.type==='interval'?`Every ${s.every || 1} days`:(s.days||[]).map(x=>DAYS[x]).join(' · ') || 'Choose days';
export const WATER_ROTATION = [
 {name:'Ginger + warm water', desc:'A cozy drink, not a cleanse.', recipe:'Steep 2–3 slices ginger in warm water; enjoy with breakfast.'},
 {name:'Lemon water', desc:'Hydration with a citrus twist.', recipe:'A squeeze of lemon in water. Rinse mouth with plain water after acidic drinks.'},
 {name:'Green smoothie', desc:'Spinach + cucumber + kiwi + water.', recipe:'Blend, do not strain; add a fruit you enjoy and drink with food.'},
 {name:'Chia berry cup', desc:'Fiber with fully hydrated seeds.', recipe:'Soak 1 tsp chia in liquid until expanded; stir into yogurt or water.'},
 {name:'Lemon-mint water', desc:'Simple and refreshing.', recipe:'Add lemon and fresh mint to a glass of water. Plain water is equally good.'},
 {name:'Blueberry kefir blend', desc:'Fermented food if tolerated.', recipe:'Blend plain kefir or live-culture yogurt with berries. Use lactose-free if needed.'},
 {name:'Ginger tea / plain water', desc:'A relaxed Sunday option.', recipe:'Warm ginger infusion or plain water, whatever feels good.'},
];
export const MEALS = [
 {breakfast:'Greek yogurt, blueberries, oats & walnuts', pre:'Banana + yogurt (if moving today)', post:'Paneer with roasted potatoes & vegetables', dinner:'Vegetable dal, rice and raita',note:'Rest-day nourishment counts, too.'},
 {breakfast:'Cottage cheese, banana & nut butter bowl',pre:'Banana + small toast or yogurt',post:'Paneer rice bowl with spinach',dinner:'Moong dal + sautéed broccoli',note:'Pair training with food you enjoy.'},
 {breakfast:'Oats, berries, chia & Greek yogurt',pre:'Fruit + handful of nuts',post:'Egg-and-paneer wrap or tofu wrap',dinner:'Chickpea tomato bowl + quinoa',note:'Adjust portions to appetite and training load.'},
 {breakfast:'Avocado and paneer on toast',pre:'Banana + yogurt',post:'Greek yogurt smoothie + cereal',dinner:'Vegetarian chili with beans and rice',note:'Fiber is helpful; increase gradually if you feel bloated.'},
 {breakfast:'Savory dosa + sambar + yogurt',pre:'Fruit + nut butter',post:'Paneer + rice + vegetables',dinner:'Vegetable pulao with dal',note:'Support lower-body recovery with adequate meals.'},
 {breakfast:'Overnight oats, blueberries & seeds',pre:'Banana + small yogurt',post:'Tofu rice bowl or lentil soup + toast',dinner:'Pasta with mushrooms, spinach and beans',note:'Refuel, especially after your third ab day.'},
 {breakfast:'Egg-and-spinach breakfast wrap',pre:'Optional fruit before a walk',post:'Yogurt bowl with berries',dinner:'Homemade paneer tacos + veggies',note:'Hydrate and enjoy your weekend.'},
];
export const WORKOUTS = [
 {name:'Rest + restore', badge:'Recovery day',focus:'Walk, stretch or play something fun',steps:['Optional 20–40 minute comfortable walk','Gentle mobility or stretching','Full rest is allowed and useful'],note:'No workout to make up. Rest is training.'},
 {name:'Abs · deep core',badge:'Core day 1 / 3',focus:'Control and breathing over speed',steps:['Dead bugs · 3 × 8–12 / side','Reverse crunches · 3 × 10–12','Side plank · 2 × 20–40 sec / side','Easy cardio · 10–20 min optional'],note:'No need for high-rep exhaustion.'},
 {name:'Upper body',badge:'Upper day',focus:'Posture, pushing and pulling',steps:['Dumbbell rows · 3 × 8–12','Incline or wall push-ups · 3 × 6–12','DB shoulder press · 2–3 × 8–10','Lateral raises · 2 × 10–12'],note:'Use manageable weights, stop for unusual joint pain.'},
 {name:'Abs · stability',badge:'Core day 2 / 3',focus:'Anti-rotation and stability',steps:['Bird dogs · 3 × 8 / side','Pallof press (or plank) · 3 × 10','Heel taps · 3 × 10 / side','Easy walk or bike · 10–20 min'],note:'Pain-free control matters more than repetitions.'},
 {name:'Lower body · glutes',badge:'Lower day',focus:'Steady strength, no overtraining',steps:['Goblet squats · 3 × 8–12','Glute bridges or hip thrusts · 3 × 10–12','Romanian deadlifts · 3 × 8–10','Step-ups or split squats · 2 × 8 / side'],note:'Scale back if isotretinoin causes unusual soreness.'},
 {name:'Abs · gentle finish',badge:'Core day 3 / 3',focus:'Quality reps & recovery',steps:['Dead bugs · 2 × 10 / side','Knee raises · 3 × 8–12','Side plank · 2 × 20–30 sec','Stretch and breathe · 5 min'],note:'No pressure to train through muscle pain.'},
 {name:'Fun movement day',badge:'Optional active day',focus:'Badminton, walking, yoga or rest',steps:['Choose a fun activity for 20–45 minutes','Gentle stretching if you want','Or take a full rest day'],note:'Enjoyment is part of staying active.'}
];
export function mergedTasks(custom){let items=DEFAULT_TASKS.map(t=>({...t,...(custom?.[t.id]||{}),schedule:{...t.schedule,...(custom?.[t.id]?.schedule||{})}}));for(const t of Object.values(custom||{})){if(t.custom && !items.find(a=>a.id===t.id))items.push(t)}return items.filter(t=>!t.deleted)}

// The social calendar never lives in the repository: these are local-only entries.
export const SOCIAL_CHALLENGES = [
  {title:'Sunday · gentle reflection', detail:'Reach out to one person you appreciate, or plan one low-pressure connection for the week.', tip:'You can care about people and still protect your quiet time.'},
  {title:'Monday · one friendly hello', detail:'Initiate one small greeting or ask one friendly question at work.', tip:'You do not need a perfectly polished voice.'},
  {title:'Tuesday · curiosity first', detail:'Ask a follow-up question and listen without preparing a perfect reply.', tip:'Being interested is more powerful than being impressive.'},
  {title:'Wednesday · share one opinion', detail:'Contribute one thought in a conversation, chat, or meeting.', tip:'You are allowed to take up conversational space.'},
  {title:'Thursday · a small boundary', detail:'Practice a kind, clear “I prefer…” or “I need…” without overexplaining.', tip:'Boundaries make room for healthier relationships.'},
  {title:'Friday · invite some joy', detail:'Consider a simple invitation, hobby meetup, or message to a friend.', tip:'Connection should feel mutual, not like a performance test.'},
  {title:'Saturday · explore & feel alive', detail:'Choose a new café, bookstore, museum, park, class or social plan—or rest.', tip:'Experiences are not rewards you need to earn.'},
];
export const MIND_WEEK_LABELS = ['Reflect & reset','Self-image','Social confidence','Stress release','Voice & boundaries','Play & creativity','Explore & connect'];
export const HAIR_WEEK_LABELS = ['Gentle wash or rest','Dandruff wash','Rest & replenish','Moisture wash','Scalp treatment','Dandruff wash','Recovery & ends'];
export function socialPlansForDate(events,date){return (Array.isArray(events)?events:[]).filter(e=>e && e.date===date && e.title?.trim()).sort((a,b)=>(a.time||'').localeCompare(b.time||''));}
export function eventDisplayTime(value){if(!value)return '';const m=String(value).match(/^(\d{1,2}):(\d{2})$/);if(!m)return String(value);const h=Number(m[1]);return `${h%12||12}:${m[2]} ${h>=12?'PM':'AM'}`;}
export function timeValue(value){if(!value)return 9999;const m=String(value).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);if(!m)return 9999;let h=Number(m[1]);if(m[3])h=(h%12)+(m[3].toUpperCase()==='PM'?12:0);return h*60+Number(m[2]);}
export const SKINCARE_ROTATION=[
 'Sunday: gentle moisturization and lip care; no extra actives.',
 'Monday: barrier check; moisturize tight areas.',
 'Tuesday: care for dry lips and hands; avoid peels.',
 'Wednesday: hydrating night with a bland cream.',
 'Thursday: if anything stings, simplify your routine.',
 'Friday: gentle removal of sunscreen and soothing cream.',
 'Saturday: basic cleanser and moisturizer are enough.'
];
export function scheduledItems(tasks,date,state={}){
  const optionalIds=state.optional?.[date]||[];
  const items=tasks.filter(t=>due(t,date)||optionalIds.includes(t.id)).map(t=>{const a={...t,time:timeForDate(t,date)};return a.id==='skincare-pm'?{...a,subtitle:SKINCARE_ROTATION[weekday(date)],steps:[...a.steps,'TONIGHT · '+SKINCARE_ROTATION[weekday(date)]]}:a});
  const plans=socialPlansForDate(state.socialEvents,date);
  if(plans.length){
    const steps=plans.map(p=>`${p.time?`${eventDisplayTime(p.time)} · `:''}${p.title}${p.place?` at ${p.place}`:''}${p.note?` — ${p.note}`:''}`);
    const index=items.findIndex(t=>t.id==='weekend-connection');
    if(index>=0){items[index]={...items[index],readOnlyDetails:true,time:eventDisplayTime(plans[0].time)||items[index].time,subtitle:`${plans.length} saved plan${plans.length===1?'':'s'} for today · ${plans.map(p=>p.title).join(' + ')}`,steps:[...steps,'Show up as yourself, allow flexibility, and enjoy your time.']};}
    else items.push({id:'social-plans-for-date',phase:'after',title:`My social plans · ${plans.length} today`,tag:'mind',subtitle:plans.map(p=>p.title).join(' + '),schedule:{type:'days',days:[weekday(date)]},steps:[...steps,'You can edit these plans in Mind & social.'],time:eventDisplayTime(plans[0].time)||'3:00 PM',readOnlyDetails:true,note:'Local to your browser; no invitations are sent.',icon:'heart'});
  }
  return items.sort((a,b)=>timeValue(a.time)-timeValue(b.time)||a.id.localeCompare(b.id));
}

export function elapsedPeriodDates(asOf=keyOf(new Date())){
 if(asOf<PERIOD_START)return [];
 const last=asOf>PERIOD_END?PERIOD_END:asOf;const dates=[];
 for(let k=PERIOD_START;k<=last;k=offset(k,1))dates.push(k);
 return dates;
}
export function dayProgress(tasks,date,state={}){
 if(!inPeriod(date))return {date,completed:0,scheduled:0,percent:0};
 const items=scheduledItems(tasks,date,state),checked=state.completion?.[date]||{};
 const completed=items.filter(x=>checked[x.id]===true).length;
 return {date,completed,scheduled:items.length,percent:items.length?Math.round(completed/items.length*100):0};
}
export function periodProgress(tasks,state={},asOf=keyOf(new Date())){
 // Fixed denominator: the whole 46-day chapter counts from November 16 onward.
 const days=[];
 for(let date=PERIOD_START;date<=PERIOD_END;date=offset(date,1))days.push(dayProgress(tasks,date,state));
 const completed=days.reduce((n,d)=>n+d.completed,0),scheduled=days.reduce((n,d)=>n+d.scheduled,0);
 // One decimal means a single checkbox is visible as ~0.1% rather than 0% or 5%.
 const percent=scheduled?Number((100*completed/scheduled).toFixed(1)):0;
 return {completed,scheduled,percent,daysElapsed:elapsedPeriodDates(asOf).length,daysTotal:days.length,activeDays:days.filter(d=>d.completed>0).length,days};
}
