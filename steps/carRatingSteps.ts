import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CarRatingWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { CarModelPage } from '../pages/CarModelPage';

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

When('I navigate to the Toyota Corolla model page', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  await carModelPage.navigateToModel();
});

When('I submit a vote with the comment {string}', async function (this: CarRatingWorld, comment: string) {
  const carModelPage = new CarModelPage(this.page);
  await carModelPage.vote(comment);
});

When('I submit a vote without a comment', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  await carModelPage.vote();
});

When('I log out', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.logout();
});

Then('the vote confirmation message should be displayed', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  const voted = await carModelPage.isVoteSuccessful();
  expect(voted).toBe(true);
});

Then('the model page should show my vote was counted', async function (this: CarRatingWorld) {
  const carModelPage = new CarModelPage(this.page);
  const voteCount = await carModelPage.getVoteCount();
  expect(voteCount).toBeGreaterThan(0);
});

Then('I should be returned to the home page as a guest', async function (this: CarRatingWorld) {
  const loginPage = new LoginPage(this.page);
  const loggedIn = await loginPage.isLoggedIn();
  expect(loggedIn).toBe(false);
});
