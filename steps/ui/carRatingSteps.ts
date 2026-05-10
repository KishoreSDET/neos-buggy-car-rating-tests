import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CarRatingWorld } from '../../support/world';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { CarModelPage } from '../../pages/CarModelPage';

Given('I am on the Buggy car rating site', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

Given('I log in with valid credentials', async function (this: CarRatingWorld) {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in .env');
  }

  const loginPage = new LoginPage(this.page);
  await loginPage.login(username, password);

  const loggedIn = await loginPage.isLoggedIn();
  expect(loggedIn).toBe(true);
});

When('I navigate to the Lamborghini Diablo model page', async function (this: CarRatingWorld) {
  this.expectedModelName = 'Diablo';
  const homePage = new HomePage(this.page);
  await homePage.navigateToModel(this.expectedModelName);
  const carModelPage = new CarModelPage(this.page);
  this.voteCountBefore = await carModelPage.getVoteCount();
});

When('I submit a vote with the comment {string}', async function (this: CarRatingWorld, comment: string) {
  const carModelPage = new CarModelPage(this.page);
  this.voteWasCast = await carModelPage.vote(comment);
});

When('I submit a vote without a comment', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  this.voteWasCast = await carModelPage.vote();
});

When('I log out', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.logout();
});

Then('the model name should be displayed on the page', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  const modelName = await carModelPage.getModelName();
  expect(modelName).toContain(this.expectedModelName);
});

Then('the vote confirmation message should be displayed', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  expect(await carModelPage.isVoteSuccessful()).toBe(true);
});

Then('the model page should show my vote was counted', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  const currentCount = await carModelPage.getVoteCount();
  if (this.voteWasCast) {
    expect(currentCount).toBe(this.voteCountBefore + 1);
  } else {
    expect(currentCount).toBeGreaterThanOrEqual(this.voteCountBefore);
  }
});

Then('I should see the login form', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  expect(await loginPage.isLoginFormVisible()).toBe(true);
});

Then('the vote button should not be visible', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  expect(await carModelPage.isVoteButtonVisible()).toBe(false);
});

When('I log in with invalid credentials', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.loginWithInvalidCredentials();
});

Then('I should see a login error message', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  const message = await loginPage.getLoginErrorMessage();
  expect(message).toContain('Invalid');
});
