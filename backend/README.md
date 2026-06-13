# Woundtech Assessment - Backend

A NestJS REST API for managing Patients, Clinicians, and Visits.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- Swagger / OpenAPI
- class-validator
- TypeScript

---

## Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL 15+

---

## Installation

```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=woundtech
PORT=8000
```

---

## Database Setup

Create the database:

```sql
CREATE DATABASE woundtech;
```

Run migrations:

```bash
pnpm migration:run
```

(Optional) Revert latest migration:

```bash
pnpm migration:revert
```

---

## Running the Application

Development:

```bash
pnpm start:dev
```

Application will run at:

```text
http://localhost:8000
```

---

## API Documentation

Swagger UI:

```text
http://localhost:8000/api
```

OpenAPI JSON:

```text
http://localhost:8000/api-json
```

---

## Features

### Patients

- Create patient
- List patients with pagination
- Search patients
- Sort patients
- Update patient
- Delete patient

### Clinicians

- Create clinician
- List clinicians with pagination
- Search clinicians
- Sort clinicians
- Update clinician
- Delete clinician

### Visits

- Create visit
- List visits with pagination
- Search visits
- Filter visits by patient
- Filter visits by clinician
- Sort visits
- Update visit
- Delete visit

---

## Database Features

- Soft delete support
- Foreign key constraints
- Cascading deletes
- Database indexes for performance

---

## Testing

Run tests:

```bash
pnpm test
```

Run e2e tests:

```bash
pnpm test:e2e
```

---

## Author

Akshay Rajpurohit
