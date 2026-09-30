# Real Estate Lead Management System (Mini CRM)

A full-stack, production-ready Real Estate Lead Management System built with **Next.js (React + TypeScript)** on the frontend and **NestJS (Node.js + TypeScript + Prisma)** on the backend, with **PostgreSQL** in Docker.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules 
- **State & Auth**: React Context API + LocalStorage JWT token management

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript (OOP, Dependency Injection, Decorators)
- **Database ORM**: Prisma (PostgreSQL 16)
- **Validation**: `class-validator` + `class-transformer` via global `ValidationPipe`
- **Security & Auth**: Passport JWT + Bcrypt password hashing
- **Containerization**: Docker Compose (`lead_crm_postgres`)

---

##  Project Structure

```text
assignment/
├── backend/
│   ├── src/
│   │   ├── auth/              # JWT Auth, Register, Login, Strategy, Guards
│   │   ├── leads/             # Leads CRUD, Filters, Search, Pagination
│   │   │   ├── dto/           # CreateLeadDto, UpdateLeadDto, UpdateStatusDto
│   │   │   └── entities/      # Lead entity (Prisma)
│   │   ├── notes/             # Lead Notes (One-to-Many relation with cascade)
│   │   ├── dashboard/         # Aggregated stats (total, closed, conversion rate)
│   │   ├── app.module.ts      # Root NestJS module connecting Prisma & features
│   │   ├── main.ts            # Entrypoint with CORS, prefix, global ValidationPipe
│   │   └── seed.ts            # Database seeder (admin user + 12 realistic leads)
│   ├── .env                   # DB configuration & JWT secrets
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/     # Real estate KPI metrics & visual distribution
│   │   │   ├── leads/         # Leads table with search, filter, pagination
│   │   │   │   ├── [id]/      # Lead detail page with timeline & notes
│   │   │   │   └── new/       # New lead creation form
│   │   │   ├── login/         # Login page with demo autofill
│   │   │   └── register/      # Register page
│   │   ├── components/        # Sidebar, ClientLayout navigation
│   │   ├── context/           # AuthContext (login, logout, auth guards)
│   │   ├── lib/api.ts         # Centralized typed API client
│   │   └── types/             # Shared TypeScript interfaces & enums
│   └── package.json
│
└── docker-compose.yml         # PostgreSQL 16 container definition
```

---

## Demo Credentials

- **Email**: `admin@crm.com`
- **Password**: `password123`

---

##  How to Run Locally

### 1. Database (PostgreSQL via Docker)
```bash
docker compose up -d
```
Runs on `localhost:5432` with database `realestate_crm`.

### 2. Backend (NestJS)
```bash
cd backend
npm install
npx ts-node src/seed.ts     # Populates demo admin & 12 leads
npm run start:dev            # Starts server on http://localhost:5000/api
```

### 3. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev                  # Starts frontend on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

##  Key Architectural Talking Points for Interviewers

1. **Object-Oriented Programming (OOP) in NestJS**:
   - Controller-Service-Repository pattern.
   - Encapsulation: Controllers handle HTTP routing; Services encapsulate business logic; Repositories manage database queries.
   - Dependency Injection: Services and repositories are injected via constructor injection, making units loosely coupled and easily testable.

2. **Database Modeling & Relational Integrity**:
   - `Lead` entity has a `@OneToMany` relationship with `Note` (`CASCADE` delete).
   - Strict enums for `PropertyType` (1BHK, 2BHK, 3BHK, 4BHK, Plot, Commercial), `LeadSource` (Facebook, Google, Referral, Website, Walk-in, Other), and `LeadStatus` (New, Contacted, Site Visit, Closed).
   - Indexes added on `status`, `created_at` for high-performance querying and filtering.

3. **Authentication & Authorization**:
   - Passwords hashed using `bcrypt` (10 rounds).
   - Stateless JWT tokens generated on login.
   - Protected endpoints secured with `@UseGuards(JwtAuthGuard)`.

4. **Robust Validation & Error Handling**:
   - Input payloads strongly typed with DTOs using `class-validator` (`@Matches(/^\d{10}$/)` for Indian phone numbers, `@IsPositive()` for budget, `@IsEnum()`).
   - Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`.
   - Unique constraint errors (Prisma `P2002`) gracefully mapped to `409 Conflict`.

5. **Clean Next.js Frontend Architecture**:
   - Next.js App Router with React client components.
   - Dynamic routing for `/leads/[id]`, `/leads/[id]/edit`, `/leads/new`.
   - Centralized typed fetch client in `lib/api.ts` with automatic bearer token injection and 401 handling.
