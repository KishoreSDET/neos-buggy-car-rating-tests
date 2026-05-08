# NEOS Buggy Car Rating — Automated Test Suite

![CI](https://github.com/KishoreSDET/neos-buggy-car-rating-tests/actions/workflows/playwright-bdd-tests.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.x-orange)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-green)
![License](https://img.shields.io/badge/license-UNLICENSED-lightgrey)

> Playwright + TypeScript + Cucumber BDD test suite for [buggy.justtestit.org](https://buggy.justtestit.org)  
> Built as part of the NEOS Life QA Engineer technical assignment.

---

## Overview

This suite covers the full car rating user journey — login, navigate to a car model, vote with a comment, validate the result, and logout — automated using a production-grade BDD framework. Beyond the core UI scenario, the suite also includes API, performance and security smoke tests to demonstrate coverage depth.

| Test type | What it covers |
|---|---|
| UI (E2E) | Login → Vote → Validate → Logout |
| API | Login endpoint, vote endpoint, response structure and timing |
| Performance | Page load time assertions (home + model pages < 3s) |
| Security | SQL injection, XSS, unauthenticated access redirect |

---

## Tech Stack

| Tool | Version | Why |
|---|---|---|
| [Playwright](https://playwright.dev) | 1.x | Auto-wait, cross-browser, built-in trace/screenshot — more reliable than Selenium for modern SPAs |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Type safety catches bugs at compile time, better IDE support than plain JS |
| [Cucumber](https://cucumber.io) | 12.x | BDD Gherkin scenarios are readable by non-technical stakeholders — bridges QA and business |
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
│            (Chromium / Firefox / WebKit)                 │
└─────────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────┐
│              Hooks  support/hooks.ts                     │
│   Before: launch browser │ After: screenshot on failure  │
└─────────────────────────────────────────────────────────┘
```

**Design principles:**
- All selectors live in Page Objects — never in step definitions
- Steps read like plain English — no Playwright API exposed in Gherkin layer
- World holds shared state (browser, page, context) across all steps
- Hooks manage browser lifecycle and failure artifacts automatically

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

> To install all browsers (Chromium, Firefox, WebKit):
> ```bash
> npx playwright install
> ```

### 4. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then fill in your credentials:

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
| `npm test` | Full suite (all tags) |
| `npm run test:ui` | UI / E2E scenarios only (`@ui`) |
| `npm run test:api` | API scenarios only (`@api`) |
| `npm run test:perf` | Performance scenarios only (`@performance`) |
| `npm run test:security` | Security scenarios only (`@security`) |
| `npm run lint` | TypeScript type check (no emit) |

### Example

```bash
# Run full suite
npm test

# Run only UI tests
npm run test:ui

# Type check without running tests
npm run lint
```

---

## Test Reports

After each run, reports are generated in the `reports/` directory (gitignored — not committed):

| Report | Path | Format |
|---|---|---|
| HTML | `reports/cucumber-report.html` | Open in browser |
| JSON | `reports/cucumber-report.json` | Machine-readable, used by CI |

Open the HTML report:

```bash
open reports/cucumber-report.html        # macOS
start reports/cucumber-report.html       # Windows
xdg-open reports/cucumber-report.html   # Linux
```

> Screenshots of failed steps are automatically embedded in the HTML report.

---

## Project Structure

```
neos-buggy-car-rating-tests/
├── features/
│   └── car-rating.feature        # Gherkin BDD scenarios
├── steps/
│   └── carRatingSteps.ts         # Step definitions (Gherkin → Page Objects)
├── pages/
│   ├── BasePage.ts               # Shared navigation and wait helpers
│   ├── LoginPage.ts              # Login / logout actions and selectors
│   └── CarModelPage.ts           # Vote, comment, validation actions
├── support/
│   ├── world.ts                  # Cucumber World — shared browser state
│   └── hooks.ts                  # Before/After hooks, screenshot on failure
├── .github/
│   └── workflows/
│       └── playwright-bdd-tests.yml   # GitHub Actions CI pipeline
├── reports/                      # Generated test output (gitignored)
├── cucumber.js                   # Cucumber runner configuration
├── tsconfig.json                 # TypeScript compiler configuration
├── package.json                  # Dependencies and npm scripts
└── .env.example                  # Environment variable template
```

---

## CI / CD Pipeline

The GitHub Actions workflow runs on three triggers:

| Trigger | When | Purpose |
|---|---|---|
| `pull_request` to `main` | Every PR | Gate — tests must pass before merge |
| `push` to `main` | After merge | Confirm main is always green |
| `workflow_dispatch` | Manual | On-demand run from GitHub Actions UI |
| `schedule` (cron) | Daily 6am AEST | Overnight regression — catches site changes |

### Pipeline steps

1. Checkout code
2. Set up Node.js
3. `npm ci` — clean install from lockfile
4. Install Playwright browsers
5. Run full test suite
6. Upload HTML report as build artifact
7. Post test result summary to PR

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `TEST_USERNAME` | Yes | Registered username on buggy.justtestit.org |
| `TEST_PASSWORD` | Yes | Account password |
| `BASE_URL` | No | Defaults to `https://buggy.justtestit.org` |

---

## Author

**Kishore Atapaka**  
GitHub: [@KishoreSDET](https://github.com/KishoreSDET)

---

*Built for the NEOS Life QA Engineer technical assignment.*
