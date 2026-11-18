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
 await page.getByRole('button',{name:/LeetCode dojo/}).click();
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
