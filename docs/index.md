---
title: "DoppelDown Documentation"
description: "Complete documentation for DoppelDown — AI-powered brand protection and phishing detection"
category: index
audience: external
last_updated: 2026-02-05
author: ernie
review_due: 2026-05-05
status: current
---

# DoppelDown Documentation

> **Protect your brand from typosquatting, phishing, and impersonation.**

Welcome to the DoppelDown docs. Whether you're setting up your first brand scan or integrating our API into your security stack, you'll find what you need here.

---

## 🚀 Getting Started

New to DoppelDown? Start here.

| Guide | Description | Time |
|-------|-------------|------|
| [Quick Start](./QUICKSTART.md) | Create a brand and run your first scan | 5 min |
| [Core Concepts](#core-concepts) | Understand brands, scans, threats, and evidence | 3 min |
| [Self-Hosting Setup](./SCAN_WORKER_VPS_SETUP.md) | Deploy DoppelDown on your own infrastructure | 30 min |

---

## 📖 User Guides

Step-by-step guides for common tasks.

| Guide | Description |
|-------|-------------|
| [Webhook Integration](./WEBHOOKS.md) | Get real-time notifications when threats are detected |
| [SDK Examples](./SDK_EXAMPLES.md) | Copy-paste code in JavaScript, Python, and cURL |
| [Error Handling](./ERROR_HANDLING.md) | Error codes, retry strategies, and resilience patterns |
| [Email System](./EMAIL_SYSTEM.md) | Email alert configuration and templates |
| [Onboarding Optimization](./ONBOARDING_OPTIMIZATION_REPORT.md) | User onboarding flow details |

---

## 🔧 API Reference

Complete API documentation for developers.

| Resource | Description |
|----------|-------------|
| [Full API Reference](./API.md) | All endpoints, parameters, and response schemas |
| [OpenAPI Spec](./openapi.yaml) | Machine-readable OpenAPI 3.0 specification |
| [API Changelog](./CHANGELOG.md) | All API changes, versioned |
| [API Versioning](./API_VERSIONING_STRATEGY.md) | Versioning policy and migration guides |
| [Rate Limiting](./API.md#rate-limiting) | Tier-based rate limits and headers |
| [Error Codes](./API.md#error-codes) | Complete error code reference |

---

## 🏠 Self-Hosting

Deploy DoppelDown on your own infrastructure.

| Guide | Description |
|-------|-------------|
| [Scan Worker VPS Setup](./SCAN_WORKER_VPS_SETUP.md) | Set up a scan worker on Oracle Cloud |
| [Environment Variables](../README.md#environment-variables) | Complete `.env` reference |
| [Paid APIs](./PAID_APIS.md) | Third-party API costs and configuration |

---

## 🔒 Security & Compliance

| Resource | Description |
|----------|-------------|
| [Security Overview](./security/) | Security architecture and practices |
| [Compliance Audit](./COMPLIANCE_SECURITY_AUDIT.md) | SOC 2, GDPR, and compliance status |
| [Data Governance](./DATA_GOVERNANCE_PRIVACY_STRATEGY.md) | How we handle and protect your data |

---

## 📊 Product & Strategy

| Resource | Description |
|----------|-------------|
| [Product Roadmap](./PRODUCT_ROADMAP_STRATEGY.md) | Where DoppelDown is headed |
| [Feature Backlog](./FEATURE_BACKLOG.md) | Upcoming features and priorities |
| [Pricing Strategy](./PRICING_STRATEGY.md) | Tier structure and rationale |
| [Competitive Tracker](./COMPETITIVE_TRACKER.md) | How we compare to alternatives |

---

## 🛠️ Engineering

| Resource | Description |
|----------|-------------|
| [Caching Strategy](./CACHING.md) | Redis and in-memory caching architecture |
| [Error Handling Patterns](./error-handling.md) | Internal error handling conventions |
| [Monitoring](./MONITORING.md) | Observability, alerts, and dashboards |
| [ML Threat Detection](./ML_THREAT_DETECTION.md) | Machine learning threat analysis |
| [Technical Debt](./TECHNICAL_DEBT_STRATEGY.md) | Tech debt register and remediation plan |
| [CI/CD](./CICD.md) | Continuous integration and deployment pipeline |
| [Localization](./LOCALIZATION_STRATEGY.md) | i18n and l10n strategy |
| [DevX Strategy](./DEVX_STRATEGY.md) | Developer experience improvements |

---

## 📝 Admin & Operations

| Resource | Description |
|----------|-------------|
| [Admin Dashboard Models](./ADMIN_MODEL_DASHBOARD.md) | Admin panel data models |
| [Disaster Recovery](./DISASTER_RECOVERY_PLAN.md) | DR procedures and RTO/RPO targets |
| [Customer Support](./CUSTOMER_SUPPORT_SUCCESS_STRATEGY.md) | Support operations strategy |
| [Penetration Testing](./PENTEST_VULNERABILITY_STRATEGY.md) | Vulnerability management |
| [SEO Toolkit](./SEO_TOOLKIT.md) | SEO optimization tools and checklists |

---

## 📈 Business & Marketing

| Resource | Description |
|----------|-------------|
| [Brand Positioning](./BRAND_POSITIONING_MESSAGING_STRATEGY.md) | Messaging and positioning strategy |
| [Fundraising](./FUNDRAISING_STRATEGY.md) | Investment strategy and materials |
| [User Onboarding](./USER_ONBOARDING_STRATEGY.md) | User activation and retention |
| [I18N Strategy](./I18N_STRATEGY.md) | Internationalization roadmap |
| [Integrations Ecosystem](./INTEGRATIONS_ECOSYSTEM_STRATEGY.md) | Partner and integration strategy |

---

## Core Concepts

### Brands
A **brand** is a domain and its associated social media handles that you want DoppelDown to protect. Each brand gets its own monitoring dashboard and threat history.

### Scans
A **scan** checks the internet for threats against your brand. Scan types:
- **Full scan** — checks domains, web, and social media
- **Domain-only** — checks for typosquatting domains
- **Social-only** — checks for fake social media accounts

### Threats
A **threat** is a detected instance of brand impersonation — a typosquat domain, phishing page, or fake social account. Each threat has a severity score and evidence.

### Evidence
**Evidence** includes screenshots, WHOIS records, and HTML snapshots collected as proof that a threat exists. Evidence powers takedown reports.

### Takedown Reports
A **takedown report** is a formatted document you send to domain registrars or social platforms to request removal of impersonating content.

---

## Need Help?

- **Email:** support@doppeldown.com
- **API Status:** `GET /api/health`
- **Report a Bug:** [GitHub Issues](https://github.com/RADobson/doppeldown/issues)
