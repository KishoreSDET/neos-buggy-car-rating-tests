import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly logoutLink: Locator;
  private readonly greeting: Locator;
  private readonly loginError: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Login');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton   = page.getByRole('button', { name: 'Login' });
    this.logoutLink    = page.getByRole('link', { name: 'Logout' });
    this.greeting      = page.locator('nav span').filter({ hasText: /^Hi,/ });
    this.loginError    = page.getByText('Invalid username/password');
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

  async loginWithInvalidCredentials(): Promise<void> {
    await this.usernameInput.fill('invalid@example.com');
    await this.passwordInput.fill('wrongpassword');
    await this.loginButton.click();
    await this.loginError.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getLoginErrorMessage(): Promise<string> {
    return (await this.loginError.textContent()) ?? '';
  }

  async isLoginFormVisible(): Promise<boolean> {
    return this.usernameInput.isVisible();
  }

  async getGreeting(): Promise<string> {
    return (await this.greeting.textContent()) ?? '';
  }
}
