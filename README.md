# FinTest - Fintech Dashboard QA Project

![CI Suite](https://github.com/broman331/project-010-fintech-demo/actions/workflows/ci.yml/badge.svg)

A full-stack Fintech dashboard application built to demonstrate comprehensive testing strategies across backend, frontend, and end-to-end flows.

## 🚀 Tech Stack

- **Backend**: Laravel 11.x (PHP 8.4)
- **Database**: PostgreSQL 15
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Containerization**: Docker & Docker Compose

## 🧪 Testing Strategy

The project implements a multi-layered testing approach:

| Type | Tool | Scope | Source Location |
|------|------|-------|-----------------|
| **Unit** | PHPUnit | Backend logic (Atomic transfers, validation) | `backend/tests/Unit/TransactionServiceTest.php` |
| **API** | Codeception | REST API endpoints (Status, JSON structure) | `backend/tests/Api/TransferCest.php` |
| **Frontend Unit** | Vitest | UI Component logic (Form rendering, submission) | `frontend/src/components/TransferForm.test.tsx` |
| **E2E** | Playwright | Full user journey (Dashboard flow) | `e2e/tests/transfer.spec.ts` |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Docker & Docker Compose** (Recommended)
- **Node.js 20+** (For local frontend)
- **PHP 8.4 & Composer** (For local backend)
- **PostgreSQL** (For local database)

## 🛠️ Setup & Installation

### Option A: Docker (Recommended)

Run the entire stack with these commands:

```bash
# 1. Start containers
docker-compose up --build -d

# 2. Generate application key
docker-compose exec app php artisan key:generate

# 3. Setup database & seeds
docker-compose exec app php artisan migrate --seed --force
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8888](http://localhost:8888)

### Option B: Local Development

**1. Backend Setup**
```bash
cd backend
composer install
cp .env.example .env
# Edit .env to match your local PostgreSQL credentials
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8888
```

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### 👤 Demo Credentials
Login is automated in the demo, but you can use:
- **Email**: `test@example.com`
- **Password**: `password`

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for Continuous Integration. The workflow (`.github/workflows/ci.yml`) automatically runs on every push to the `main` branch and on pull requests.

The pipeline includes:
- **Backend Unit Tests**: Dedicated PHP 8.4 environment.
- **Frontend Unit Tests**: Node.js environment.
- **Integration & E2E**: 
    - Spins up full stack via Docker Compose.
    - Runs API tests inside the container.
    - Runs Playwright E2E tests against the live environment.

## 📊 Automated Test Reporting

The project includes a master test script that runs all test suites sequentially and generates timestamped HTML reports.

To run all tests and generate reports:
```bash
./run_all_tests.sh
```

### 📁 Test Results
All reports are saved in the `test results/` directory with a timestamp (e.g., `_20260203_223103.html`):
- **Backend Unit**: `backend_unit_[timestamp].html`
- **Backend API**: `backend_api_[timestamp].html`
- **Frontend Unit**: `frontend_unit_[timestamp].html`
- **E2E Report**: `e2e_report_[timestamp].html`

## 🏃‍♂️ Running Tests Individually

### Backend Tests
```bash
# Unit Tests
cd backend
php artisan test

# API Tests
vendor/bin/codecept run Api
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests
Ensure the app is running (Docker or Local), then:
```bash
cd e2e
npx playwright test
```

## 🔌 API Endpoints

- `POST /api/login` - Authenticate user
- `GET /api/user/accounts` - List user accounts
- `POST /api/transfers` - Initiate fund transfer
- `GET /api/transactions` - List recent transactions
