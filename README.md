<div align="center">

![Playwright](https://img.shields.io/badge/-Playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![k6](https://img.shields.io/badge/-k6-%237D64FF?style=for-the-badge&logo=k6&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-%232088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white)

  <img height="200" src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmIyN2hvMXpyaTdwbzJyNGdmdTB5aHp4MzUydGR5M25zNHZhcmYwdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ok3E3BExQIV8ngWYTg/giphy.gif"  />

[![Playwright Tests](https://github.com/avramare/quality-alchemist/actions/workflows/playwright.yml/badge.svg)](https://github.com/avramare/quality-alchemist/actions/workflows/playwright.yml)
[![k6 Tests](https://github.com/avramare/quality-alchemist/actions/workflows/k6.yml/badge.svg)](https://github.com/avramare/quality-alchemist/actions/workflows/k6.yml)

</div>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=20&pause=1000&color=a855f7&center=true&vCenter=true&width=600&lines=Quality%20Alchemist%20🧪⭑⋆｡˚%20;QA%20Automation%20Engineering%20)](https://git.io/typing-svg)
</div>

## Architecture

```mermaid
graph TB
    subgraph "Quality Alchemist"
        subgraph "apps/"
            RWA_SUB[cypress-realworld-app/]
        end
        subgraph "tests/"
            PW[playwright/]
            K6[k6/]
        end
        DC[docker-compose.yml]
        MK[Makefile]
        GH[.github/workflows/]
    end

    subgraph "Application Under Test (Docker Compose)"
        RWA[cypress-realworld-app]
        API[REST API :3001]
        UI[React Frontend :3000]
        DB[(SQLite DB)]
    end

    RWA_SUB -.->|submodule| RWA
    DC -->|starts| RWA
    MK -->|orchestrates| PW
    MK -->|orchestrates| K6

    PW -->|E2E Tests| UI
    K6 -->|Performance Tests| API

    UI --> API
    API --> DB
```



## Test Suites

Running against the [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), a Venmo-like financial application with authentication, transactions, notifications, and user profiles.

### 🎭 Playwright — TypeScript E2E

**Pattern**: Page Object Model | **Browsers**: Chromium, Firefox

```
tests/playwright/
├── pages/          → LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → api, login, signup, transaction, notification specs
└── playwright.config.ts
```

**Tests**: Successful/failed login · User registration · Transaction creation · Notifications
**Reports**: Interactive HTML with failure screenshots and traces for debugging

📂 [View code](tests/playwright/) · 📄 [View README](tests/playwright/README.md)

---

### ⚡ k6 — Performance Testing

```
tests/k6/
├── scripts/        → load-test.js, soak-test.js, stress-test.js, spike-test.js
└── helpers/        → config.js (URLs, credentials)
```

| Scenario | Virtual Users | Duration | Thresholds |
|---|---|---|---|
| **Load** | Ramp-up to 20 VUs | ~5 min | p(95) < 2s, errors < 5% |
| **Soak** | Moderate load to 50 VUs | ~35 min | p(95) < 1.5s, errors < 5% |
| **Stress** | 10 → 50 → 100 → 200 VUs | ~14 min | p(95) < 3s, errors < 10% |
| **Spike** | Sudden ramp-up to 100 VUs | ~2 min | p(95) < 3s, errors < 15% |

**Endpoints**: POST /login · GET /transactions/public · GET /users · GET /notifications

📂 [View code](tests/k6/) · 📄 [View README](tests/k6/README.md)

---

## CI/CD

Each framework has its own GitHub Actions workflow. They run in parallel on every push/PR to `main`.

```
.github/workflows/
├── playwright.yml    → Build Docker → Playwright tests → Publish HTML report
└── k6.yml            → Build Docker → k6 load test     → Publish JSON summary
```

Workflow steps:
1. Clones the repo with the AUT submodule
2. Builds and starts the app with Docker Compose
3. Runs the test suite
4. Publishes reports as downloadable artifacts (from the Actions tab)
5. Tears down the container

---

## Project Structure

```
quality-alchemist/
├── apps/
│   └── cypress-realworld-app/    # AUT (Git submodule)
├── tests/
│   ├── playwright/               # TypeScript E2E
│   └── k6/                       # Performance
├── .github/workflows/            # CI/CD pipeline
├── docker-compose.yml            # AUT orchestration
├── Dockerfile                    # AUT Docker image
├── Makefile                      # Unified interface
└── .env                          # Environment variables
```

---

## Running Locally

<details>
<summary><strong>Prerequisites</strong></summary>

| Tool | Verify |
|---|---|
| Git | `git --version` |
| Docker + Docker Compose | `docker compose version` |
| Node.js 18+ | `node --version` |
| k6 | `k6 version` |

</details>

<details>
<summary><strong>Installation</strong></summary>

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/avramare/quality-alchemist.git
cd quality-alchemist

# If you already cloned without submodules
git submodule update --init --recursive

# Install dependencies
cd tests/playwright && npm install && npx playwright install --with-deps
```

</details>

<details>
<summary><strong>Running tests</strong></summary>

```bash
# Start the app
make start-aut

# Run all suits
make test-all

# Run a single suite
make test-playwright
make test-k6

# Stop the app
make stop-aut
```

</details>

---

## Tech Stack

| Category | Technologies |
|---|---|
| **E2E Testing** | Playwright |
| **Performance** | k6 (Grafana) |
| **Languages** | TypeScript, JavaScript |
| **Test Runners** | Playwright Test |
| **CI/CD** | GitHub Actions (2 independent workflows) |
| **Infrastructure** | Docker Compose, Makefile |
| **Reports** | Playwright HTML, k6 JSON |

---
