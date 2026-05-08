import { Before, After, AfterStep, ITestCaseHookParameter, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CarRatingWorld } from './world';
import * as dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(30000);

Before(async function (this: CarRatingWorld) {
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page    = await this.context.newPage();
});

AfterStep(async function (this: CarRatingWorld, { result }: ITestCaseHookParameter) {
  if (result?.status === 'FAILED') {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
});

After(async function (this: CarRatingWorld) {
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
