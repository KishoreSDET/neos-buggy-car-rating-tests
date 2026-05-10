import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { CarRatingWorld } from '../../support/world';

dotenv.config();

const API_BASE = 'https://k51qryqov3.execute-api.ap-southeast-2.amazonaws.com/prod';
const MODEL_ID = 'ckl2phsabijs71623vk0|ckl2phsabijs71623vqg';

Given('I have a valid auth token', async function (this: CarRatingWorld) {
  const res = await axios.post(
    `${API_BASE}/oauth/token`,
    `grant_type=password&username=${encodeURIComponent(process.env.TEST_USERNAME!)}&password=${encodeURIComponent(process.env.TEST_PASSWORD!)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  this.authToken = res.data.access_token;
  expect(this.authToken).toBeTruthy();
});

When('I POST to the login endpoint with valid credentials', async function (this: CarRatingWorld) {
  const start = Date.now();
  this.apiResponse = await axios.post(
    `${API_BASE}/oauth/token`,
    `grant_type=password&username=${encodeURIComponent(process.env.TEST_USERNAME!)}&password=${encodeURIComponent(process.env.TEST_PASSWORD!)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  this.apiResponseTimeMs = Date.now() - start;
});

When('I POST to the login endpoint with invalid credentials', async function (this: CarRatingWorld) {
  try {
    this.apiResponse = await axios.post(
      `${API_BASE}/oauth/token`,
      `grant_type=password&username=invalid@example.com&password=wrongpassword`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      this.apiResponse = err.response;
    } else {
      throw err;
    }
  }
});

When('I GET the car model details', async function (this: CarRatingWorld) {
  const start = Date.now();
  this.apiResponse = await axios.get(
    `${API_BASE}/models/${encodeURIComponent(MODEL_ID)}`,
    { headers: { Authorization: `Bearer ${this.authToken}` } }
  );
  this.apiResponseTimeMs = Date.now() - start;
});

When('I GET the current user profile', async function (this: CarRatingWorld) {
  const start = Date.now();
  this.apiResponse = await axios.get(
    `${API_BASE}/users/current`,
    { headers: { Authorization: `Bearer ${this.authToken}` } }
  );
  this.apiResponseTimeMs = Date.now() - start;
});

Then('the response status should be {int}', function (this: CarRatingWorld, expectedStatus: number) {
  expect(this.apiResponse.status).toBe(expectedStatus);
});

Then('the response body should contain an access token', function (this: CarRatingWorld) {
  expect(this.apiResponse.data).toHaveProperty('access_token');
  expect(typeof this.apiResponse.data.access_token).toBe('string');
  expect(this.apiResponse.data.access_token.length).toBeGreaterThan(0);
});

Then('the response body should contain an error message', function (this: CarRatingWorld) {
  expect(String(this.apiResponse.data).length).toBeGreaterThan(0);
});

Then('the response body should contain model name, make and vote count', function (this: CarRatingWorld) {
  const data = this.apiResponse.data;
  expect(data.name).toBe('Diablo');
  expect(data.make).toBe('Lamborghini');
  expect(typeof data.votes).toBe('number');
  expect(data.votes).toBeGreaterThan(0);
});

Then('the response body should contain first name, last name and admin status', function (this: CarRatingWorld) {
  const data = this.apiResponse.data;
  expect(data).toHaveProperty('firstName');
  expect(data).toHaveProperty('lastName');
  expect(data).toHaveProperty('isAdmin');
  expect(typeof data.firstName).toBe('string');
  expect(typeof data.isAdmin).toBe('boolean');
});

Then('the response time should be under {int} milliseconds', function (this: CarRatingWorld, threshold: number) {
  expect(this.apiResponseTimeMs).toBeLessThan(threshold);
});
