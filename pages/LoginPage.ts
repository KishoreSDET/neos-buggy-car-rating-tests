import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly logoutLink: Locator;
  private readonly greeting: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="login"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.locator('button.btn-success[type="submit"]');
    this.logoutLink    = page.locator('a.nav-link:has-text("Logout")');
    this.greeting      = page.locator('span.nav-link.disabled');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 10000 });
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
    await this.waitForNetworkIdle();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible();
  }

  async getGreeting(): Promise<string> {
    return (await this.greeting.textContent()) ?? '';
  }
}
