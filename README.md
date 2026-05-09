# NEOS Buggy Car Rating — Automated Test Suite

![CI](https://github.com/KishoreSDET/neos-buggy-car-rating-tests/actions/workflows/car-rating-feature-tests.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.x-orange)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-green)
![Allure](https://img.shields.io/badge/Allure-Report-orange)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

> Playwright + TypeScript + Cucumber BDD test suite for [buggy.justtestit.org](https://buggy.justtestit.org)  
> Built as part of the NEOS Life QA Engineer technical assignment.

📊 **Live Allure Report:** [kishoresdet.github.io/neos-buggy-car-rating-tests](https://kishoresdet.github.io/neos-buggy-car-rating-tests/)

---

## Overview

This suite covers the full car rating user journey — login, navigate to a car model, vote with a comment, validate the result, and logout — automated using a production-grade BDD framework. Beyond the core UI scenario, the suite also includes API, performance and security smoke tests to demonstrate coverage depth.

| Test type | What it covers | Status |
|---|---|---|
| UI (E2E) | Login → Vote → Validate → Logout | ✅ Complete |
| API | Login endpoint, vote endpoint, response structure and timing | 🔄 In progress |
| Performance | Page load time assertions (home + model pages < 3s) | 🔄 In progress |
| Security | SQL injection, XSS, unauthenticated access redirect | 🔄 In progress |

---

## Tech Stack

| Tool | Version | Why |
|---|---|---|
| [Playwright](https://playwright.dev) | 1.x | Auto-wait, cross-browser, built-in trace/screenshot — more reliable than Selenium for modern SPAs |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety catches bugs at compile time, better IDE support than plain JS |
| [Cucumber](https://cucumber.io) | 12.x | BDD Gherkin scenarios are readable by non-technical stakeholders — bridges QA and business |
| [Allure](https://allurereport.org) | 2.x | Rich interactive reports with trend charts, timeline view and GitHub Pages publishing |
| [ts-node](https://typestrong.org/ts-node) | 10.x | Run TypeScript directly without a compile step — faster feedback loop |
| [Axios](https://axios-http.com) | 1.x | Promise-based HTTP client for API test scenarios |
| [dotenv](https://github.com/motdotla/dotenv) | 17.x | Loads credentials from `.env` locally; GitHub Secrets in CI |

---

## Framework Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Gherkin Feature Files                  │
│              features/car-rating.feature                 │
│         (plain English — readable by business)          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Step Definitions                       │
│               steps/carRatingSteps.ts                    │
│      (maps Gherkin steps to page object methods)        │
└────────┬───────────────────────────────┬────────────────┘
         │                               │
┌────────▼────────┐             ┌────────▼────────────────┐
│   Page Objects  │             │   Cucumber World         │
│  pages/         │             │   support/world.ts       │
│  ├ BasePage.ts  │             │   (shared browser/page   │
│  ├ LoginPage.ts │             │    state across steps)   │
│  └ CarModel...  │             └─────────────────────────┘
└────────┬────────┘
         │
┌────────▼────────────────────────────────────────────────┐
│                    Playwright Browser                    │
│                  Chromium (headless)                     │
└─────────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────┐
│                 Hooks  support/hooks.ts                  │
│  BeforeAll: site health check (fail fast if unreachable) │
│  Before: launch browser  │  After: close browser        │
│  AfterStep: screenshot on failure                        │
│  AfterAll: suite completion log                          │
└─────────────────────────────────────────────────────────┘
```

**Design principles:**
- All selectors live in Page Objects — never in step definitions
- Steps read like plain English — no Playwright API exposed in Gherkin layer
- World holds shared state (browser, page, context) across all steps
- `BeforeAll` health check fails fast if the target site is unreachable — no wasted CI minutes
- Retry strategy: `retry: 1` scoped to `@flaky` tagged scenarios — targeted, not blanket

---

## Prerequisites

- **Node.js** >= 18 (`node --version`)
- **npm** >= 9 (`npm --version`)
- A registered account on [buggy.justtestit.org](https://buggy.justtestit.org)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone git@github.com:KishoreSDET/neos-buggy-car-rating-tests.git
cd neos-buggy-car-rating-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in your credentials:

```env
TEST_USERNAME=your_registered_username
TEST_PASSWORD=your_registered_password
BASE_URL=https://buggy.justtestit.org
```

> `.env` is gitignored and never committed. In CI, these are stored as GitHub Secrets.

---

## Running Tests

| Command | What it runs |
|---|---|
| `npm test` | Full suite |
| `npm run test:ui` | UI / E2E scenarios only (`@ui`) |
| `npm run test:api` | API scenarios only (`@api`) |
| `npm run test:perf` | Performance scenarios only (`@performance`) |
| `npm run test:security` | Security scenarios only (`@security`) |
| `npm run report:allure` | Generate Allure HTML from last run results |
| `npm run lint` | TypeScript type check (no emit) |

> **No browser window during local runs:** The suite runs Chromium in headless mode by default — correct for CI and consistent locally. Test execution is confirmed via terminal output and the reports in `reports/`.

---

## Test Reports

All reports are generated in the `reports/` directory (gitignored — not committed):

| Report | Path | How to open |
|---|---|---|
| Allure HTML | `reports/allure-report/index.html` | `open reports/allure-report/index.html` |
| Allure raw results | `reports/allure-results/` | Used by `npm run report:allure` |
| Cucumber HTML | `reports/cucumber-report.html` | `open reports/cucumber-report.html` |
| Cucumber JSON | `reports/cucumber-report.json` | Machine-readable |

**Generate and open the Allure report locally:**

```bash
npm test && npm run report:allure && open reports/allure-report/index.html
```

> Screenshots of failed steps are automatically embedded in the Allure report.

**Live report (updated on every scheduled and on-demand CI run):**  
[kishoresdet.github.io/neos-buggy-car-rating-tests](https://kishoresdet.github.io/neos-buggy-car-rating-tests/)

---

## Project Structure

```
neos-buggy-car-rating-tests/
├── features/
│   └── car-rating.feature        # Gherkin BDD scenarios
├── steps/
│   └── carRatingSteps.ts         # Step definitions (Gherkin → Page Objects)
├── pages/
│   ├── BasePage.ts               # Shared navigation, wait and performance helpers
│   ├── LoginPage.ts              # Login / logout actions and selectors
│   └── CarModelPage.ts           # Vote, comment, validation actions and selectors
├── support/
│   ├── world.ts                  # Cucumber World — shared browser state across steps
│   └── hooks.ts                  # Suite and scenario lifecycle hooks
├── .github/
│   └── workflows/
│       └── car-rating-feature-tests.yml  # GitHub Actions CI pipeline
├── reports/                      # Generated test output (gitignored)
├── cucumber.js                   # Cucumber runner configuration
├── tsconfig.json                 # TypeScript compiler configuration
├── package.json                  # Dependencies and npm scripts
└── .env.example                  # Environment variable template
```

---

## CI / CD Pipeline

The GitHub Actions workflow (`car-rating-feature-tests.yml`) runs on three triggers:

| Trigger | When | Purpose |
|---|---|---|
| `pull_request` to `main` | Every PR opened or updated | Gate — CI must pass before merge; pass/fail posted as PR comment with Allure link |
| `workflow_dispatch` | Manual trigger from Actions UI | On-demand run — trigger before requesting review to evidence results |
| `schedule` (cron `0 2 * * *`) | Daily at 02:00 UTC | Proactive monitoring — catches site-side regressions between code changes |

### Pipeline steps

1. Checkout code
2. Set up Node.js
3. `npm ci` — clean install from lockfile
4. Install Playwright browsers
5. Site health check (`BeforeAll`) — aborts early if site unreachable
6. Run full test suite
7. Generate Allure report
8. Upload Allure report as artifact (30 days)
9. Publish Allure report to GitHub Pages (scheduled + on-demand only)
10. Post test result summary as PR comment (PR runs only)
11. Write job summary with Allure link to Actions run page

### GitHub Environments

Credentials are scoped per environment using GitHub Environments (`production`, `staging`). The `workflow_dispatch` trigger accepts an `environment` input — selecting `staging` automatically loads staging-scoped secrets. No code changes needed to add a new environment.

---

## Environment Variables Reference

| Variable | Store | Required | Description |
|---|---|---|---|
| `TEST_USERNAME` | GitHub Secret | Yes | Registered username on buggy.justtestit.org |
| `TEST_PASSWORD` | GitHub Secret | Yes | Account password |
| `BASE_URL` | GitHub Variable | No | Defaults to `https://buggy.justtestit.org` |

---

## Author

**Kishore Atapaka**  
GitHub: [@KishoreSDET](https://github.com/KishoreSDET)

---

*Built for the NEOS Life QA Engineer technical assignment.*
