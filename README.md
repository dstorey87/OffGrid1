# OffGrid Platform

A comprehensive, monetizable multi-site platform combining modern web technologies with AI capabilities. Built for scalability, performance, and easy deployment.

## 🚀 Features

- **Next.js 15 Frontend**: Modern React framework with TypeScript, Tailwind CSS, and dark mode support
- **WordPress Multisite CMS**: Flexible content management with custom plugin for directory and calculators
- **AI Service**: FastAPI-based proxy supporting OpenAI and Anthropic APIs
- **Docker Orchestration**: Complete containerized environment with docker-compose
- **Kubernetes Ready**: Production-ready K8s manifests with auto-scaling and health checks
- **Monetization**: Stripe integration ready for subscriptions and payments
- **Testable & Linted**: Comprehensive testing setup with ESLint, Prettier, Pytest, and type checking

## 📋 Architecture

```
┌─────────────────┐
│   Next.js 15    │  Frontend (Port 3000)
│   + TypeScript  │  - Dark mode with next-themes
│   + Tailwind    │  - React Query for data fetching
└────────┬────────┘  - Stripe integration ready
         │
    ┌────┴─────┬─────────────┐
    │          │             │
┌───▼────┐ ┌──▼──────┐ ┌────▼──────┐
│WordPress│ │AI Service│ │  Redis   │
│Multisite│ │ FastAPI  │ │  Cache   │
│Port 8080│ │ Port 8000│ │Port 6379 │
└────┬────┘ └──────────┘ └──────────┘
     │
┌────▼────┐
│  MySQL  │
│Port 3306│
└─────────┘
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS 3.4 with custom design system
- **State Management**: React Query (TanStack Query)
- **Theme**: next-themes with dark mode
- **UI Components**: Custom components with Lucide icons
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe integration

### CMS

- **Platform**: WordPress 6.4 (Multisite)
- **Plugin**: PT Hub (Custom)
  - Directory functionality with custom post types
  - Calculator widgets (Solar, Savings, etc.)
  - REST API endpoints
  - Taxonomies for categorization

### AI Service

- **Framework**: FastAPI 0.109
- **Language**: Python 3.12
- **AI Providers**: OpenAI, Anthropic (Claude)
- **Caching**: Redis
- **Validation**: Pydantic
- **Testing**: Pytest with async support
- **Linting**: Black, Ruff, MyPy

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes with HPA
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Reverse Proxy**: Nginx Ingress (K8s)

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (Windows) or Docker Engine + Docker Compose
- Git
- (Optional) Node.js 20+ for local development
- (Optional) Python 3.12+ for local development

### 1. Clone and Setup

```powershell
# Clone the repository
git clone https://github.com/yourusername/offgrid.git
cd offgrid

# Copy environment file
Copy-Item .env.example .env

# Edit .env with your actual values
notepad .env
```

### 2. Start with Docker Compose

```powershell
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 3. Access Services

- **Frontend**: http://localhost:3000
- **WordPress Admin**: http://localhost:8080/wp-admin
- **AI Service API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. WordPress Multisite Setup

1. Visit http://localhost:8080 and complete WordPress installation
2. Go to Dashboard → Tools → Network Setup
3. Follow instructions to enable multisite
4. Activate the "PT Hub" plugin network-wide

## 📦 Project Structure

```
offgrid/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and API clients
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.ts
├── ai-service/              # FastAPI service
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Configuration & dependencies
│   │   └── services/       # Business logic
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── wordpress/
│   └── plugins/
│       └── pt-hub/         # Custom WordPress plugin
│           ├── includes/   # Plugin classes
│           └── pt-hub.php
├── k8s/                    # Kubernetes manifests
│   ├── 00-namespace.yaml
│   ├── 01-secrets.yaml
│   ├── 02-persistent-volumes.yaml
│   ├── 03-mysql.yaml
│   ├── 04-redis.yaml
│   ├── 05-wordpress.yaml
│   ├── 06-ai-service.yaml
│   ├── 07-frontend.yaml
│   ├── 08-ingress.yaml
│   └── 09-hpa.yaml
├── docker/
│   └── mysql/
│       └── init.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔧 Development

### Frontend Development

```powershell
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format

# Run tests
npm test
```

### AI Service Development

```powershell
cd ai-service

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .

# Type check
mypy .
```

### WordPress Plugin Development

The PT Hub plugin is located in `wordpress/plugins/pt-hub/`. It's automatically mounted in the WordPress container.

To develop:

1. Edit files in `wordpress/plugins/pt-hub/`
2. Changes are immediately reflected in the container
3. Activate the plugin in WordPress admin

## 🐳 Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build frontend

# View logs for specific service
docker-compose logs -f ai-service

# Execute command in container
docker-compose exec frontend npm run build

# Clean everything (including volumes)
docker-compose down -v
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, k3s, EKS, GKE, AKS, etc.)
- kubectl configured
- Nginx Ingress Controller installed
- cert-manager for SSL (optional)

### Build Images

```powershell
# Build frontend
cd frontend
docker build -t offgrid/frontend:latest -f Dockerfile --target production .

# Build AI service
cd ../ai-service
docker build -t offgrid/ai-service:latest .

# Push to registry (if using remote cluster)
docker tag offgrid/frontend:latest your-registry/offgrid/frontend:latest
docker push your-registry/offgrid/frontend:latest
docker tag offgrid/ai-service:latest your-registry/offgrid/ai-service:latest
docker push your-registry/offgrid/ai-service:latest
```

### Deploy

```powershell
# Update secrets in k8s/01-secrets.yaml first!

# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get all -n offgrid

# Check pods
kubectl get pods -n offgrid

# View logs
kubectl logs -n offgrid -l app=frontend

# Port forward for testing
kubectl port-forward -n offgrid svc/frontend 3000:3000
```

### Update Ingress Domains

Edit `k8s/08-ingress.yaml` and replace `offgrid.example.com` with your actual domain names.

## 💰 Monetization Setup

### Stripe Integration

1. Get API keys from https://dashboard.stripe.com/apikeys
2. Add to `.env`:

   ```
   STRIPE_PUBLIC_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. The frontend is pre-configured with Stripe - add your payment components in:
   - `frontend/src/app/pricing/page.tsx`
   - `frontend/src/app/api/stripe/`

### Revenue Models Supported

- **Subscriptions**: Monthly/annual plans
- **One-time Payments**: For services or products
- **Usage-based**: AI API calls, calculator usage
- **Freemium**: Free tier with paid upgrades
- **Marketplace**: Commission on directory listings

## 🧪 Testing & Quality Gates

Every change—whether written by a human or AI assistant—**must** satisfy:

1. ✅ All unit, integration, and end-to-end tests pass.
2. ✅ A full Playwright regression run proves the website renders and routes correctly.
3. ✅ Linting and type checks pass (ESLint, MyPy, Ruff, etc.).
4. ✅ No console or server errors during the Playwright run.
5. ✅ Coverage ≥ 90 % on all layers.

If any step fails, the CI pipeline automatically re-runs a _bug-fix job_ until all checks are green.  
No code is merged or deployed until this loop completes successfully.

````

## 📊 Monitoring & Logging

### Health Checks
- Frontend: `GET /api/health`
- AI Service: `GET /health`, `/health/ready`, `/health/live`
- WordPress: `GET /wp-json/`

### Logs
```powershell
# Docker Compose
docker-compose logs -f [service-name]

# Kubernetes
kubectl logs -n offgrid -l app=frontend --tail=100 -f
````

## 🗺️ Roadmap

### Phase 1: Foundation ✅

- [x] Docker Compose setup
- [x] Next.js frontend with dark mode
- [x] FastAPI AI service
- [x] WordPress multisite
- [x] PT Hub plugin with directory & calculators
- [x] Kubernetes manifests
- [x] Documentation

### Phase 2: Enhanced Features (Q1 2026)

- [ ] User authentication & authorization
- [ ] Advanced directory search & filters
- [ ] More calculator types (Energy, ROI, Cost comparison)
- [ ] AI chat interface in frontend
- [ ] Stripe payment flows
- [ ] Email notifications (SendGrid/AWS SES)
- [ ] Analytics dashboard

### Phase 3: Scaling & Optimization (Q2 2026)

- [ ] CDN integration (Cloudflare/CloudFront)
- [ ] Advanced caching strategies
- [ ] Database optimization & read replicas
- [ ] Elasticsearch for search
- [ ] Monitoring (Prometheus + Grafana)
- [ ] CI/CD pipelines (GitHub Actions)
- [ ] Automated backups

### Phase 4: Advanced Features (Q3-Q4 2026)

- [ ] Multi-tenant SaaS model
- [ ] White-label capabilities
- [ ] Advanced AI features (image generation, analysis)
- [ ] Mobile apps (React Native)
- [ ] API marketplace
- [ ] Affiliate program
- [ ] Advanced reporting & BI

## 🔒 Security

- Change all default passwords in `.env`
- Use secrets management in production (Vault, AWS Secrets Manager, etc.)
- Enable HTTPS in production (cert-manager in K8s)
- Configure CORS properly for your domains
- Keep dependencies updated
- Regular security audits
- Rate limiting on API endpoints

## ✅ Definition of Done

- All lint, unit, integration, and Playwright E2E tests pass.
- Coverage ≥ 90 %.
- No visual diff failures.
- All /health endpoints return HTTP 200.
- Documentation updated.
- Merged to main only after green CI badge.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: https://github.com/yourusername/offgrid/issues
- **Discussions**: https://github.com/yourusername/offgrid/discussions
- **Email**: support@offgrid.example.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- WordPress community
- FastAPI creators
- All open-source contributors

---

**Built with ❤️ for sustainable, scalable web platforms**
Alpha stage - local development, to begin creating the skeleton
