import {
  Before,
  After,
  AfterStep,
  BeforeAll,
  AfterAll,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CarRatingWorld } from './world';
import * as dotenv from 'dotenv';

dotenv.config();
setDefaultTimeout(30000);

BeforeAll(async function () {
  const baseUrl = process.env.BASE_URL ?? 'https://buggy.justtestit.org';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    const response = await page.goto(baseUrl, { timeout: 15000 });
    if (!response || !response.ok()) {
      throw new Error(`Site health check failed — ${baseUrl} returned ${response?.status()}`);
    }
    console.log(`✔ Site reachable: ${baseUrl}`);
  } finally {
    await page.close();
    await browser.close();
  }
});

AfterAll(async function () {
  console.log('✔ Test suite complete — all scenarios finished');
});

Before({ name: 'Launch browser and open page' }, async function (this: CarRatingWorld) {
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

After({ name: 'Close browser and release resources' }, async function (this: CarRatingWorld) {
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
