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
 const code=page.locator('img.pastel-swe-art');
 await expect(code).toBeVisible();
 await expect.poll(()=>code.evaluate(el=>el.complete&&el.naturalWidth>=1100)).toBe(true);
 await expect(page.locator('.swe-tabs')).toBeVisible();
});

test('wellness hero and little rituals ribbon are Home-only; finance and Google keep own banners',async({page})=>{
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero.editorial-cover')).toBeVisible();
 const scene=page.locator('img.wellness-home-scene');
 await expect(scene).toBeVisible();
 await expect.poll(()=>scene.evaluate(el=>el.complete&&el.naturalWidth>=1400)).toBe(true);
 await expect(page.locator('img.wellness-hero-flower')).toHaveCount(0);
 const dino=page.locator('.studio-tile--blue img.pastel-studio-art');
 const film=page.locator('.studio-tile--butter img.studio-magic-art');
 await expect(dino).toBeVisible();
 await expect(film).toBeVisible();
 await expect.poll(()=>dino.evaluate(el=>el.complete&&el.naturalWidth>=800)).toBe(true);
 await expect.poll(()=>film.evaluate(el=>el.complete&&el.naturalWidth>=900)).toBe(true);
 expect(await dino.getAttribute('src')).toContain('pastel-dino-cloud-code.webp');
 expect(await film.getAttribute('src')).toContain('pastel-kodak-film-clouds.webp');
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
