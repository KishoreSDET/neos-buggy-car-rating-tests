Feature: Car Model Rating
  As a registered user
  I want to vote on a car model and leave a comment
  So that my rating is recorded and visible on the model page

  Background:
    Given I am on the Buggy car rating site
    And I log in with valid credentials

  Scenario: Complete car rating journey — login, vote with comment, validate and logout
    When I navigate to the Toyota Corolla model page
    Then the model name should be displayed on the page
    When I submit a vote with the comment "Great reliable car for everyday driving"
    Then the vote confirmation message should be displayed
    And the model page should show my vote was counted
    When I log out
    Then I should be returned to the home page as a guest

  Scenario: Vote on a car model without a comment
    When I navigate to the Toyota Corolla model page
    And I submit a vote without a comment
    Then the vote confirmation message should be displayed
    And the model page should show my vote was counted

  Scenario: Logout clears the authenticated session
    When I navigate to the Toyota Corolla model page
    And I submit a vote with the comment "Solid build quality"
    And I log out
    Then I should be returned to the home page as a guest
