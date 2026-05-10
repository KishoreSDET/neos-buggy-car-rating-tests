import { When, Then, Given, Before } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'https://k51qryqov3.execute-api.ap-southeast-2.amazonaws.com/prod';
const MODEL_ID = 'ckl2phsabijs71623vk0|ckl2phsabijs71623vqg';

let response: AxiosResponse;
let responseTimeMs: number;
let authToken: string;

Before({ tags: '@api' }, async function () {
  response = undefined as unknown as AxiosResponse;
  responseTimeMs = 0;
  authToken = '';
});

Given('I have a valid auth token', async function () {
  const res = await axios.post(
    `${API_BASE}/oauth/token`,
    `grant_type=password&username=${encodeURIComponent(process.env.TEST_USERNAME!)}&password=${encodeURIComponent(process.env.TEST_PASSWORD!)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  authToken = res.data.access_token;
  expect(authToken).toBeTruthy();
});

When('I POST to the login endpoint with valid credentials', async function () {
  const start = Date.now();
  response = await axios.post(
    `${API_BASE}/oauth/token`,
    `grant_type=password&username=${encodeURIComponent(process.env.TEST_USERNAME!)}&password=${encodeURIComponent(process.env.TEST_PASSWORD!)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  responseTimeMs = Date.now() - start;
});

When('I POST to the login endpoint with invalid credentials', async function () {
  try {
    response = await axios.post(
      `${API_BASE}/oauth/token`,
      `grant_type=password&username=invalid@example.com&password=wrongpassword`,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      response = err.response;
    } else {
      throw err;
    }
  }
});

When('I GET the car model details', async function () {
  response = await axios.get(
    `${API_BASE}/models/${encodeURIComponent(MODEL_ID)}`,
    { headers: { Authorization: `Bearer ${authToken}` } }
  );
});

Then('the response status should be {int}', function (expectedStatus: number) {
  expect(response.status).toBe(expectedStatus);
});

Then('the response body should contain an access token', function () {
  expect(response.data).toHaveProperty('access_token');
  expect(typeof response.data.access_token).toBe('string');
  expect(response.data.access_token.length).toBeGreaterThan(0);
});

Then('the response body should contain model name, make and vote count', function () {
  const data = response.data;
  expect(data).toHaveProperty('name');
  expect(data).toHaveProperty('make');
  expect(data).toHaveProperty('votes');
  expect(typeof data.votes).toBe('number');
});

Then('the response time should be under {int} milliseconds', function (threshold: number) {
  expect(responseTimeMs).toBeLessThan(threshold);
});
