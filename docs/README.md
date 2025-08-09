# CodePal

![Community Edition](https://img.shields.io/badge/Community%20Edition-Free-blue?style=flat-square)

> **CodePal Community Edition** is 100% free for individuals and open source! Upgrade to Pro or Team for more AI, plugins, and enterprise features.

[See Public Benchmarks →](./docs/benchmarks.md) | [What’s New →](./docs/whats-new.md) | [Cloud Credits →](./docs/cloud-credits.md) | [Partners →](./docs/partners.md)

---

CodePal is your AI-powered developer platform. Explore features, collaborate, and extend with plugins.

## 🚀 Features
- AI code generation & review
- Plugin ecosystem
- Real-time collaboration
- RBAC, audit logging, compliance
- SSO, Jira, Slack integrations
- 30-day enterprise trial

## 💡 Upgrade for More
- Pro: $25/mo — More AI, advanced collab, more plugins, integrations
- Team: $750/mo — All Pro features + team management, priority support

[See all plans & pricing →](./docs/pricing.md)

## Installation
1. Clone the repo: `git clone https://github.com/yalka2024/codeklay.git`
2. Install dependencies: `pnpm install`
3. Run locally: `pnpm dev`
   - Visit `http://localhost:3000` to see the app.

## GCP Deployment Overview

Minimal path on Google Cloud:
- Artifact Registry + Cloud Build for builds
- Cloud Run (dev web) and/or GKE (api stage/prod)
- Cloud SQL (Postgres), Memorystore (Redis)
- Secret Manager + KMS for secrets
- Logging/Monitoring + Vertex AI for AI endpoints

Quick build:

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/codepal/app:$(git rev-parse --short HEAD)
```

Quick deploy (Cloud Run example):

```bash
gcloud run deploy codepal-web \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/codepal/app:$(git rev-parse --short HEAD) \
  --region us-central1 \
  --allow-unauthenticated
```

Required env:
- NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL
- GCP_PROJECT_ID, GCP_REGION, KMS_KEY_NAME

## Contributing
We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License
MIT License. See [LICENSE](./LICENSE) for details.

---
