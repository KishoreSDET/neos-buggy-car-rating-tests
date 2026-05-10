import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CarModelPage extends BasePage {
  private readonly commentTextarea: Locator;
  private readonly voteButton: Locator;
  private readonly successMessage: Locator;
  private readonly voteCount: Locator;
  private readonly modelHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.commentTextarea = page.locator('textarea#comment');
    this.voteButton      = page.locator('button.btn-success:has-text("Vote!")');
    this.successMessage  = page.locator('p.card-text:has-text("Thank you for your vote!")');
    this.voteCount       = page.locator('h4:has-text("Votes:") strong');
    this.modelHeading    = page.locator('h3').first();
  }

  async vote(comment?: string): Promise<boolean> {
    if (await this.isVoteSuccessful()) return false;
    if (comment) {
      await this.commentTextarea.fill(comment);
    }
    await this.voteButton.click();
    await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }

  async isVoteSuccessful(): Promise<boolean> {
    return this.successMessage.isVisible();
  }

  async isVoteButtonVisible(): Promise<boolean> {
    return this.voteButton.isVisible();
  }

  async getVoteCount(): Promise<number> {
    const text = (await this.voteCount.textContent()) ?? '0';
    return parseInt(text.replace(/,/g, ''), 10);
  }

  async getModelName(): Promise<string> {
    return (await this.modelHeading.textContent()) ?? '';
  }
}
