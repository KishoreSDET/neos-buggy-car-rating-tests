import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToModel(modelName: string): Promise<void> {
    await this.page.locator('.card').filter({ hasText: modelName }).locator('a').first().click();
    await this.waitForNetworkIdle();
  }
}
