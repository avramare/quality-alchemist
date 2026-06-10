# 🧪 Quality Alchemist 🧙‍♂️

![Playwright](https://img.shields.io/badge/-Playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-%232088FF?style=for-the-badge&logo=github-actions&logoColor=white)

QA portfolio demonstrating automation engineering proficiency in Playwright.

[![Playwright Tests](https://github.com/avramare/quality-alchemist/actions/workflows/playwright.yml/badge.svg)](https://github.com/avramare/quality-alchemist/actions/workflows/playwright.yml)

## Test Suite

Running against the [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), a Venmo-like financial application with authentication, transactions, notifications, and user profiles.

### 🎭 Playwright — TypeScript E2E

**Pattern**: Page Object Model | **Browsers**: Chromium, Firefox

```
tests/playwright/
├── pages/          → LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → login, signup, transaction, notification specs
└── playwright.config.ts
```

**Tests**: Successful/failed login · User registration · Transaction creation · Notifications
**Reports**: Interactive HTML with failure screenshots and traces for debugging

📂 [View code](tests/playwright/) · 📄 [View README](tests/playwright/README.md)


---

