import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { AxiosResponse } from 'axios';

export class CarRatingWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  apiResponse!: AxiosResponse;
  apiResponseTimeMs: number = 0;
  authToken: string = '';

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CarRatingWorld);
