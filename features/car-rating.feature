Feature: Car Model Rating
  As a registered user
  I want to vote on a car model and leave a comment
  So that my rating is recorded and visible on the model page

  Background:
    Given I am on the Buggy car rating site
    And I log in with valid credentials

  Scenario: Vote on a car model with a comment
    When I navigate to the Toyota Corolla model page
    And I submit a vote with the comment "Great reliable car for everyday driving"
    Then the vote confirmation message should be displayed
    And the model page should show my vote was counted

  Scenario: Vote on a car model without a comment
    When I navigate to the Toyota Corolla model page
    And I submit a vote without a comment
    Then the vote confirmation message should be displayed

  Scenario: Logout after voting
    When I navigate to the Toyota Corolla model page
    And I submit a vote with the comment "Solid build quality"
    And I log out
    Then I should be returned to the home page as a guest
