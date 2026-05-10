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

This suite covers the full car rating user journey — login, navigate to a car model, vote with a comment, validate the result, and logout — automated using a production-grade BDD framework. Beyond the core UI scenario, the suite also includes API tests and negative tests to demonstrate coverage depth.

| Test type | What it covers | Status |
|---|---|---|
| UI (E2E) | Login → Vote → Validate → Logout, vote without comment, invalid login error, auth guard | ✅ Complete |
| API | Login (valid + invalid), user profile, model endpoint, response structure and timing | ✅ Complete |
| Performance | Page load time assertions | 📋 Future roadmap |
| Security | SQL injection, XSS, unauthenticated access | 📋 Future roadmap |

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
│              Gherkin Feature Files                       │
│   features/ui/     features/api/                        │
│         (plain English — readable by business)          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Step Definitions                       │
│   steps/ui/    steps/api/                               │
│      (maps Gherkin steps to page objects or axios)      │
└────────┬───────────────────────────────┬────────────────┘
         │                               │
┌────────▼────────┐             ┌────────▼────────────────┐
│   Page Objects  │             │   Cucumber World         │
│  pages/         │             │   support/world.ts       │
│  ├ BasePage.ts  │             │   (shared state across   │
│  ├ LoginPage.ts │             │    all steps per         │
│  ├ HomePage.ts  │             │    scenario)             │
│  └ CarModel...  │             └─────────────────────────┘
└────────┬────────┘
         │
┌────────▼────────────────────────────────────────────────┐
│                    Playwright Browser                    │
│              Chromium (headless) — @ui only             │
└─────────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────┐
│                 Hooks  support/hooks.ts                  │
│  BeforeAll: site health check (fail fast if unreachable) │
│  Before (@ui): launch browser                           │
│  AfterStep (@ui): screenshot on failure                  │
│  After (@ui): close browser                             │
│  AfterAll: suite completion log                          │
└─────────────────────────────────────────────────────────┘
```

**Design principles:**
- All selectors live in Page Objects — never in step definitions
- Steps read like plain English — no Playwright API exposed in Gherkin layer
- World holds shared state (browser, page, context) across all steps
- `BeforeAll` health check fails fast if the target site is unreachable — no wasted CI minutes
- Hooks are tag-scoped (`@ui`) — API tests never spin up a browser
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
| `npm run report:allure` | Generate Allure HTML from last run results |
| `npm run lint` | TypeScript type check (no emit) |

> **No browser window during local runs:** The suite runs Chromium in headless mode by default — correct for CI and consistent locally. Test execution is confirmed via terminal output and the reports in `reports/`.

---

## Test Reports

All reports are generated in the `reports/` directory (gitignored — not committed):

| Report | Path | How to open |
|---|---|---|
| Allure HTML | `reports/allure-report/index.html` | `npx allure open reports/allure-report` |
| Allure raw results | `reports/allure-results/` | Used by `npm run report:allure` |
| Cucumber HTML | `reports/cucumber-report.html` | `open reports/cucumber-report.html` |
| Cucumber JSON | `reports/cucumber-report.json` | Machine-readable |

**Generate and open the Allure report locally:**

```bash
npm test && npm run report:allure && npx allure open reports/allure-report
```

> `npm test` automatically cleans previous Allure results before each run via the `pretest` script — no manual cleanup needed. Opening via `npx allure open` is required as Allure reports use fetch calls that browsers block on `file://` protocol.

> Screenshots of failed steps are automatically embedded in the Allure report.

**Live report (updated on every scheduled and on-demand CI run):**  
[kishoresdet.github.io/neos-buggy-car-rating-tests](https://kishoresdet.github.io/neos-buggy-car-rating-tests/)

---

## Project Structure

```
neos-buggy-car-rating-tests/
├── features/
│   ├── ui/
│   │   ├── car-rating.feature        # UI E2E scenarios (login, vote, validate, logout)
│   │   └── auth.feature              # Authentication negative tests (invalid login)
│   ├── api/
│   │   └── api.feature               # API scenarios (login endpoint, model endpoint, timing)
│   ├── security/                     # Security smoke tests (coming soon)
│   └── performance/                  # Performance assertions (coming soon)
├── steps/
│   ├── ui/
│   │   └── carRatingSteps.ts         # UI step definitions (Gherkin → Page Objects)
│   ├── api/
│   │   └── apiSteps.ts               # API step definitions (axios HTTP calls)
├── pages/
│   ├── BasePage.ts                   # Shared navigation, wait and performance helpers
│   ├── LoginPage.ts                  # Login / logout actions and selectors
│   ├── HomePage.ts                   # Home page navigation by model name
│   └── CarModelPage.ts               # Vote, comment, validation actions and selectors
├── support/
│   ├── world.ts                      # Cucumber World — shared state across steps per scenario
│   └── hooks.ts                      # Suite and scenario lifecycle hooks
├── .github/
│   └── workflows/
│       └── car-rating-feature-tests.yml  # GitHub Actions CI pipeline
├── reports/                          # Generated test output (gitignored)
├── cucumber.js                       # Cucumber runner configuration
├── tsconfig.json                     # TypeScript compiler configuration
├── package.json                      # Dependencies and npm scripts
└── .env.example                      # Environment variable template
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
6. Run full test suite — API scenarios execute before UI (alphabetical glob ordering ensures the backend contract is validated before a browser is launched)
7. Generate Allure report
8. Upload Allure report as artifact (30 days)
9. Publish Allure report to GitHub Pages (scheduled + on-demand only)
10. Post test result summary as PR comment (PR runs only)
11. Write job summary with Allure link to Actions run page

### GitHub Environments

Credentials are scoped per environment using GitHub Environments (`production`, `staging`). The `workflow_dispatch` trigger accepts an `environment` input — selecting `staging` automatically loads staging-scoped secrets. No code changes needed to add a new environment.

---

## Engineering Roadmap

The current suite covers the core assignment scenarios and demonstrates the foundational framework. The following improvements are prioritised by business impact — each mapped to the outcome it delivers.

### Test coverage

| Improvement | Impact |
|---|---|
| **Test data isolation** — dedicated account per run, or API-based state reset | Highest priority. The current account accumulates vote history across runs, silently weakening the vote-count assertion. Without this, the `+1` check degrades to `greaterThan(0)` on repeat runs — a false pass that masks real bugs. |
| **Parameterised model navigation** — model name as Gherkin test data, resolved against the `/overall` listing at runtime | Any model testable by changing a single Gherkin value — zero code changes. Directly maps to multi-product coverage (different policy types, coverage tiers). |
| **Security depth** — SQL injection via comment field, stored XSS, CSRF, auth token scope | The comment field is higher impact than the login form — a stored payload persists in the database and affects every user who views that model page. |
| **Cross-browser and mobile viewport coverage** — Safari, Firefox, and common device profiles via Playwright `devices` | Australian insurance customers use a wide range of browsers and devices. WebKit/Safari coverage matters and Playwright supports it natively with no additional tooling. |
| **Accessibility audit** — axe-core integration per scenario | Regulatory baseline for financial services products. Surface violations early in the pipeline rather than as a manual audit finding. |

### Pipeline

| Improvement | Impact |
|---|---|
| **Test sharding via GitHub Actions matrix** — parallel execution using `--shard=X/N` across a matrix of runners | At current scale, sequential execution is fine. At 100+ scenarios, a 4-shard matrix reduces CI time by ~75%, keeping PR feedback under 90 seconds. The World-per-scenario design means the framework is already parallel-safe — no architectural changes needed. A matrix job looks like: `strategy: { matrix: { shard: [1,2,3,4] } }` with `cucumber-js --shard=${{ matrix.shard }}/4`. |
| **Intelligent test selection** — run only tests covering changed files on PR | Full suite on every PR is expensive at scale. Mapping code changes to test coverage means PRs stay fast and full regression runs nightly. |
| **AI-assisted failure analysis** — pipe failure output and screenshot to an LLM, post plain-English diagnosis to the PR comment | Reduces time-to-diagnosis significantly. Instead of reading a raw stack trace, the developer sees: what failed, probable cause, suggested fix — without opening the Allure report. |
| **Dedicated environment pipeline stages** — separate jobs for API → UI, with `needs:` dependency chain | API tests validate the backend contract first. If the API is broken, UI tests are skipped — no wasted browser minutes. Each layer is a quality gate for the next. |

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
