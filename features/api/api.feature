@api
Feature: Login and Voting API
  As a quality engineer
  I want to validate the core API endpoints directly
  So that I can confirm the backend contract independently of the UI

  Scenario: Login with valid credentials returns a token
    When I POST to the login endpoint with valid credentials
    Then the response status should be 200
    And the response body should contain an access token

  Scenario: Login with invalid credentials is rejected
    When I POST to the login endpoint with invalid credentials
    Then the response status should be 401

  Scenario: Authenticated model endpoint returns correct structure
    Given I have a valid auth token
    When I GET the car model details
    Then the response status should be 200
    And the response body should contain model name, make and vote count

  Scenario: API responses are returned within acceptable time
    When I POST to the login endpoint with valid credentials
    Then the response time should be under 2000 milliseconds
