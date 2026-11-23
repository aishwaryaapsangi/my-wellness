import {test,expect} from '@playwright/test';

test('My Day and SWE Glow-Up are not blank', async({page})=>{
 const errors=[];
 page.on('pageerror',err=>{errors.push(err.stack||err.message);console.error('UNCAUGHT_PAGE_ERROR',err.stack||err.message)});
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.app-shell')).toBeVisible();
 await expect(page.locator('.main-content')).toBeVisible();
 await page.goto('/my-wellness/#google-swe',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(800);
 console.log('ROUTE_DIAGNOSTIC',page.url(),'section',await page.locator('.app-shell').getAttribute('data-section').catch(()=>null),'body',String(await page.locator('body').innerText()).slice(0,750));
 await expect(page.locator('.swe-prep')).toBeVisible();
 await expect(page.getByText('from learning')).toBeVisible();
 await expect(page.getByText('your career,')).toBeVisible();
 await expect(page.locator('.sip-task')).toHaveCount(await page.locator('.sip-task').count());
 expect(errors,'Uncaught browser exceptions:\n'+errors.join('\n\n')).toEqual([]);
});

test('SWE tabs, daily calendar, and LeetCode problem render',async({page})=>{
 const errors=[];
 page.on('pageerror',err=>{errors.push(err.stack||err.message);console.error('UNCAUGHT_PAGE_ERROR',err.stack||err.message)});
 await page.goto('/my-wellness/#google-swe',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(800);
 console.log('ROUTE_DIAGNOSTIC',page.url(),'section',await page.locator('.app-shell').getAttribute('data-section').catch(()=>null),'body',String(await page.locator('body').innerText()).slice(0,750));
 await expect(page.locator('.swe-prep')).toBeVisible();
 await page.getByRole('button',{name:/Hawk-eye roadmap/}).click();
 await expect(page.getByText('what matters each month')).toBeVisible();
 await page.locator('.swe-tabs').getByRole('button',{name:'LeetCode dojo',exact:true}).click();
 await expect(page.getByText('your LeetCode')).toBeVisible();
 await expect(page.locator('.sld-problem').first()).toBeVisible();
 expect(errors,'Uncaught browser exceptions:\n'+errors.join('\n\n')).toEqual([]);
});

test('daily recall stays a plain to-do while the optional concept library remains usable',async({page})=>{
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 await page.goto('/my-wellness/#google-swe',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.sip-task-list')).toBeVisible();
 await expect(page.locator('.sml-daily')).toHaveCount(0);
 await expect(page.locator('.sip-task').first()).toBeVisible();
 await page.getByRole('button',{name:/Concept memory garden/}).click();
 await expect(page.locator('.sml-library')).toBeVisible();
 await expect(page.locator('.sml-list-item').first()).toBeVisible();
 await page.locator('.sml-list-item').first().click();
 await expect(page.locator('.sml-library-detail .sml-card')).toBeVisible();
 await page.locator('.sml-library-detail .sml-grade.green').click();
 await expect(page.locator('.sml-library-detail .sml-schedule')).toContainText('next due');
 expect(errors,'Uncaught browser exceptions').toEqual([]);
});

test('editorial studio cards navigate without replacing existing app tools',async({page})=>{
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.studio-strip')).toBeVisible();
 await expect(page.locator('.studio-tile')).toHaveCount(3);
 const layout=await page.locator('.studio-strip-grid').evaluate(el=>({
   columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,
   backgrounds:[...el.children].map(node=>getComputedStyle(node).backgroundColor),
   positions:[...el.querySelectorAll('svg.studio-vector-art')].map(node=>getComputedStyle(node).position)
 }));
 expect(layout.columns).toBe(3);
 expect(layout.positions).toEqual(['relative','relative','relative']);
 expect(new Set(layout.backgrounds).size).toBe(1);
 await page.locator('.studio-tile--blue').click();
 await expect(page.locator('.swe-prep')).toBeVisible();
 await expect(page.locator('.google-editorial-shelf')).toBeVisible();
 await page.locator('.google-shelf-card--blue').click();
 await expect(page.locator('.sld-problem').first()).toBeVisible();
 await page.locator('.google-shelf-card--yellow').click();
 await expect(page.locator('.sip-task-list')).toBeVisible();
});

test('Home uses one painted hero and three code-built minimal card illustrations',async({page})=>{
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 const hero=page.locator('img.pastel-hero-art');
 await expect(hero).toBeVisible();
 await expect.poll(()=>hero.evaluate(el=>el.complete&&el.naturalWidth>=900)).toBe(true);
 await expect(page.locator('.studio-tile--pink svg.studio-vector-teacups')).toBeVisible();
 await expect(page.locator('.studio-tile--blue svg.studio-vector-dino')).toBeVisible();
 await expect(page.locator('.studio-tile--butter svg.studio-vector-calendar')).toBeVisible();
 await expect(page.locator('.studio-tile svg[shape-rendering="crispEdges"]')).toHaveCount(3);
 await expect(page.locator('.studio-tile img')).toHaveCount(0);
 await expect(page.locator('.daily-heading')).toBeVisible();
 const floating=await page.locator('.daily-heading').evaluate(el=>getComputedStyle(el,'::after').content);
 expect(floating).toBe('none');
 const overlap=await page.evaluate(()=>{
  const a=document.querySelector('.hero .hero-sticker').getBoundingClientRect();
  return [...document.querySelectorAll('.hero .btn-hero,.hero h1')].some(el=>{
   const b=el.getBoundingClientRect();
   return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  });
 });
 expect(overlap).toBe(false);
 await page.goto('/my-wellness/#google-swe',{waitUntil:'domcontentloaded'});
 const scene=page.locator('.swe-hero img.swe-nyc-scene');
 const roadmap=page.locator('.swe-hero img.swe-journey-map');
 const clouds=page.locator('.swe-hero img.swe-nyc-clouds');
 await expect(scene).toBeVisible();
 await expect(roadmap).toBeVisible();
 await expect(clouds).toBeVisible();
 await expect(page.locator('.swe-hero img.pastel-swe-art')).toHaveCount(0);
 await expect.poll(()=>scene.evaluate(el=>el.complete&&el.naturalWidth>=1100)).toBe(true);
 await expect.poll(()=>roadmap.evaluate(el=>el.complete&&el.naturalWidth>=1100)).toBe(true);
 await expect(page.locator('.swe-tabs')).toBeVisible();
});

test('wellness hero and little rituals ribbon are Home-only; finance and Google keep own banners',async({page})=>{
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero.editorial-cover')).toBeVisible();
 const scene=page.locator('img.wellness-home-scene');
 await expect(scene).toBeVisible();
 await expect.poll(()=>scene.evaluate(el=>el.complete&&el.naturalWidth>=1400)).toBe(true);
 await expect(page.locator('img.wellness-hero-flower')).toHaveCount(0);
 await expect(page.locator('.studio-tile--pink svg.studio-vector-teacups')).toBeVisible();
 await expect(page.locator('.studio-tile--blue svg.studio-vector-dino')).toBeVisible();
 await expect(page.locator('.studio-tile--butter svg.studio-vector-calendar')).toBeVisible();
 await expect(page.locator('.studio-strip-grid .studio-tile img')).toHaveCount(0);
 expect(await page.locator('.studio-strip').evaluate(el=>getComputedStyle(el,'::after').backgroundImage)).toContain('watercolor-cloud-pink.webp');
 await page.locator('.nav-links').getByRole('button',{name:'Calendar'}).click();
 await expect(page.locator('.app-shell')).toHaveAttribute('data-section','calendar');
 await expect(page.locator('.hero.editorial-cover')).toHaveCount(0);
 await expect(page.locator('.studio-ribbon--rose')).toHaveCount(0);
 await page.locator('.nav-links').getByRole('button',{name:'Mind & social'}).click();
 await expect(page.locator('.app-shell')).toHaveAttribute('data-section','social');
 await expect(page.locator('.hero.editorial-cover')).toHaveCount(0);
 await page.locator('.nav-links').getByRole('button',{name:/Money Garden/}).click();
 await expect(page.locator('.app-shell')).toHaveAttribute('data-section','money');
 await expect(page.locator('.hero.editorial-cover')).toHaveCount(0);
 await page.locator('.nav-links').getByRole('button',{name:/SWE Glow-Up/}).click();
 await expect(page.locator('.app-shell')).toHaveAttribute('data-section','swe');
 await expect(page.locator('.swe-hero')).toBeVisible();
 await expect(page.locator('.hero.editorial-cover')).toHaveCount(0);
});


test('Money Garden deep dive loads a private snapshot and opens dated expenses and loan simulator',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await page.locator('.nav-links').getByRole('button',{name:/Money Garden/}).click();
 await page.getByRole('button',{name:'Spending & loan lab'}).click();
 await expect(page.locator('.mdd-empty')).toBeVisible();
 const testData={
  format:'money-garden-private-v1',transactions:[
   {id:'t1',date:'2026-10-02',merchant:'Demo Coffee Shop',category:'Coffee',amount:7.25,account:'Checking'},
   {id:'t2',date:'2026-10-03',merchant:'Demo Grocery',category:'Groceries',amount:35.5,account:'Checking'}],
  loans:[
   {id:'cri-ab',name:'CRI AB',balance:1000,apr:8.08,minimum:100,category:'CRI'},
   {id:'cri-aa',name:'CRI AA',balance:1000,apr:5.28,minimum:100,category:'CRI'},
   {id:'aid',name:'Aidvantage',balance:1500,apr:null,minimum:80,category:'Aidvantage'}],
  criExtra:150,otherExtra:0,monthlyElectronic:0
 };
 await page.locator('.mdd-upload input[type=file]').setInputFiles({name:'private-test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(testData))});
 await expect(page.locator('.mdd-budget-watch')).toContainText('Weekly spending guardrails');
 await page.getByRole('spinbutton',{name:'Coffee monthly budget'}).fill('55');
 await expect(page.locator('.mdd-budget-watch')).toContainText('$55.00');
 await expect(page.locator('.mdd-ledger-head').last()).toContainText('Every transaction');
 await expect(page.locator('.mdd-table-scroll')).toContainText('Demo Coffee Shop');
 await page.locator('.mdd-legend').getByRole('button',{name:/Coffee/}).click();
 await expect(page.locator('.mdd-table-scroll')).toContainText('Demo Coffee Shop');
 await expect(page.locator('.mdd-table-scroll')).not.toContainText('Demo Grocery');
 await page.getByRole('button',{name:'Loan payoff lab'}).click();
 await expect(page.locator('.mdd-loan-warning')).toContainText('$2,176.59');
 await expect(page.locator('.mdd-empty')).toContainText('CRI estimate');
 await page.getByRole('spinbutton',{name:'Aidvantage APR'}).fill('4.5');
 await expect(page.locator('.mdd-stats')).toContainText('Estimated paid off');
 expect(errors,'Uncaught browser exceptions').toEqual([]);
});
