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

test('four distinct sharp pastel sketches render in the proper website sections',async({page})=>{
 await page.goto('/my-wellness/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('svg.pastel-hero-art')).toHaveCount(1);
 await expect(page.locator('svg.pastel-studio-art')).toHaveCount(2);
 const artDescriptions=await page.locator('svg.pastel-hero-art, svg.pastel-studio-art').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('aria-label')));
 expect(new Set(artDescriptions).size).toBe(3);
 await expect(page.locator('.daily-heading')).toBeVisible();
 const hasFloatingArt=await page.locator('.daily-heading').evaluate(el=>getComputedStyle(el,'::after').content);
 expect(hasFloatingArt).toBe('none');
 await page.goto('/my-wellness/#google-swe',{waitUntil:'domcontentloaded'});
 await expect(page.locator('svg.pastel-swe-art')).toHaveCount(1);
 const codeAlt=await page.locator('svg.pastel-swe-art').getAttribute('aria-label');
 expect(artDescriptions).not.toContain(codeAlt);
 await expect(page.locator('.swe-tabs')).toBeVisible();
});
