# Woundtech Assessment

This repository contains a full-stack application for managing Patients, Clinicians, and Visits.

The application consists of:

- `backend/` — NestJS REST API with PostgreSQL
- `frontend/` — React application built with Vite

---

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Swagger / OpenAPI
- class-validator
- nestjs-pino

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui

---

## Features

### Patients

- Create patient
- View patient details
- Update patient
- Delete patient
- Search patients
- Pagination
- Sorting

### Clinicians

- Create clinician
- View clinician details
- Update clinician
- Delete clinician
- Search clinicians
- Pagination
- Sorting

### Visits

- Create visit
- View visit details
- Update visit
- Delete visit
- Search visit notes
- Filter by patient
- Filter by clinician
- Pagination
- Sorting by visit date

---

## Additional Features

- OpenAPI / Swagger documentation
- Generated TypeScript SDK for frontend
- Database migrations
- Database indexes for performance
- Soft deletes
- Cascading deletes for visits
- Request logging with Pino
- Unit tests
- Responsive UI
- Toast notifications
- Confirmation dialogs

---

## Project Structure

```text
.
├── backend/
│   ├── src/
│   ├── test/
│   └── README.md
│
├── frontend/
│   ├── src/
│   └── README.md
│
└── README.md
```

---

## Prerequisites

- Node.js 22+
- pnpm 10+
- PostgreSQL 15+

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd woundtech-assessment
```

---

### 2. Start PostgreSQL

Create a database:

```sql
CREATE DATABASE woundtech;
```

---

### 3. Setup Backend

```bash
cd backend
pnpm install
```

Create `.env`:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=woundtech
PORT=8000
```

Run migrations:

```bash
pnpm migration:run
```

Start backend:

```bash
pnpm start:dev
```

Backend will be available at:

```text
http://localhost:8000
```

Swagger UI:

```text
http://localhost:8000/api
```

---

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
pnpm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:8000
```

Generate API SDK:

```bash
npx @hey-api/openapi-ts \
  --input http://localhost:8000/api-json \
  --output src/api
```

Start frontend:

```bash
pnpm dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

## Running Tests

Backend unit tests:

```bash
cd backend
pnpm test
```

Coverage:

```bash
pnpm test:cov
```

---

## Database Migrations

Run migrations:

```bash
pnpm migration:run
```

Revert migration:

```bash
pnpm migration:revert
```

---

## Assumptions

- A visit belongs to exactly one patient and one clinician.
- Patients and clinicians can have multiple visits.
- Visits are ordered by `visitedAt` in reverse chronological order by default.
- Deleting a patient or clinician removes associated visits via cascading deletes.
- Soft deletes are used for entity removal.

---

## Author

**Akshay Rajpurohit**
