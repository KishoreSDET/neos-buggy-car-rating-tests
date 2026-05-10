@ui
Feature: Authentication
  As a user of the Buggy car rating site
  I want login to behave correctly under both valid and invalid conditions
  So that access is secure and errors are communicated clearly

  Scenario: Login with invalid credentials shows an error message
    Given I am on the Buggy car rating site
    When I log in with invalid credentials
    Then I should see a login error message
