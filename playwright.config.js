import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',
 timeout:45000,
 expect:{timeout:12000},
 reporter:'line',
 use:{baseURL:'http://127.0.0.1:4173/my-wellness/',headless:true,trace:'retain-on-failure'},
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173/my-wellness/',reuseExistingServer:!process.env.CI,timeout:120000}
});
