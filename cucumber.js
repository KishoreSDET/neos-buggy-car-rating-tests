module.exports = {
  default: {
    require: ['support/hooks.ts', 'steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: { snippetInterface: 'async-await', resultsDir: 'reports/allure-results' },
    paths: ['features/**/*.feature'],
    retry: 1,
    retryTagFilter: '@flaky',
    publishQuiet: true,
  },
};
