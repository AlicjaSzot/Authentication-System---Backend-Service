# AWS Repo Project

User login and registration application with AWS-based architecture.

## 🏗️ Application Architecture

```mermaid
graph TB
    FE["👤 Frontend<br/>React App"]
    BE["🔌 Backend<br/>Express.js"]
    PG["💾 PostgreSQL<br/>Users Table"]

    EB["📬 EventBridge<br/>app-event-bus"]
    RULE["routing rule<br/>BackendEventsRule"]
    SQS["📤 SQS Queue<br/>events-queue"]
    DLQ["❌ DLQ<br/>events-dlq"]
    LAMBDA["⚙️ Lambda Consumer<br/>events-consumer"]
    DDB["💾 DynamoDB<br/>EventsTable"]

    FE -->|POST /auth/login<br/>POST /auth/register| BE
    FE -->|GET /auth/profile| BE
    BE -->|Query/Create| PG

    BE -->|POST /events<br/>Publish event| EB
    EB -->|route event| RULE
    RULE -->|send message| SQS
    SQS -->|failed message| DLQ
    SQS -->|batch 5 messages| LAMBDA
    LAMBDA -->|write| DDB
    DDB -.->|idempotency check| LAMBDA

    style FE fill:#3b5998,stroke:#1a3a5c,color:#fff,stroke-width:2px
    style BE fill:#3b5998,stroke:#1a3a5c,color:#fff,stroke-width:2px
    style PG fill:#3b5998,stroke:#1a3a5c,color:#fff,stroke-width:2px
    style EB fill:#ff9900,stroke:#cc6600,color:#000,stroke-width:2px
    style RULE fill:#ff9900,stroke:#cc6600,color:#000,stroke-width:2px
    style SQS fill:#ff9900,stroke:#cc6600,color:#000,stroke-width:2px
    style DLQ fill:#ff4444,stroke:#cc0000,color:#fff,stroke-width:2px
    style LAMBDA fill:#ff9900,stroke:#cc6600,color:#000,stroke-width:2px
    style DDB fill:#ff9900,stroke:#cc6600,color:#000,stroke-width:2px

```

## 📁 Project Structure

```
aws-repo-project/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth middleware
│   │   ├── infrastructure/  # Logger
│   │   └── lib/          # Prisma client
│   └── prisma/           # Database schema & migrations
│
├── frontend/             # React application
│   ├── src/
│   │   ├── pages/        # Login, Register, Dashboard
│   │   ├── components/   # Reusable components
│   │   ├── api/          # API calls
│   │   ├── hooks/        # Custom React hooks
│   │   └── schema/       # Zod validation schemas
│
├── infra/                # AWS CDK Infrastructure
│   ├── lib/              # CDK stack definition
│   ├── lambda/           # Lambda functions
│   └── bin/              # CDK entry point
│
└── docker-compose.yml    # LocalStack, PostgreSQL, DynamoDB
```

## Quick Start

### Requirements

- Node.js 20.x
- Docker (for LocalStack, PostgreSQL)
- AWS CLI

### 1. Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Infrastructure
cd ../infra
npm install
```

### 2. Running the Application

```bash
# Start Docker
docker compose up -d

# Backend (in a separate terminal, from backend/ directory)
npm run dev

# Frontend (in a separate terminal, from frontend/ directory)
npm start
```

Application available at: `http://localhost:3000`
Backend available at: `http://localhost:3001`

## Documentation

- [Backend README](./backend/README.md) — API details
- [Frontend README](./frontend/README.md) — UI details
- [Infra README](./infra/README.md) — AWS CDK & LocalStack setup

## Key Features

✅ **Login & Registration** — JWT tokens + refresh mechanism
✅ **Password Reset** — Reset links with time-limited tokens
✅ **Validation** — Frontend (Zod) + Backend
✅ **Error Handling** — Global Axios interceptor
✅ **Monitoring** — CloudWatch Logs (LocalStack)
✅ **Security** — bcrypt hashing, httpOnly cookies, CORS

## Tech Stack

### Backend

- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- AWS SDK

### Frontend

- React
- Material-UI
- React Hook Form
- Zod (validation)
- Axios
- React Hot Toast

### Infrastructure

- AWS CDK
- AWS EventBridge
- AWS SQS
- AWS Lambda
- AWS DynamoDB
- AWS CloudWatch Logs
- Docker
- PostgreSQL
