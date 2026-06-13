# Woundtech Assessment - Frontend

A React application for managing Patients, Clinicians, and Visits.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS v4
- shadcn/ui

---

## Prerequisites

- Node.js 22+
- pnpm
- Backend API running on port 8000

---

## Installation

```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

---

## API Client Generation

Generate API client from backend OpenAPI spec:

```bash
npx @hey-api/openapi-ts \
  --input http://localhost:8000/api-json \
  --output src/api
```

Regenerate whenever backend API contracts change.

---

## Running the Application

Development server:

```bash
pnpm dev
```

Application runs at:

```text
http://localhost:3000
```

---

## Build

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

---

## Features

### Patients

- List with pagination
- Search
- Sorting
- Create
- View
- Edit
- Delete

### Clinicians

- List with pagination
- Search
- Sorting
- Create
- View
- Edit
- Delete

### Visits

- List with pagination
- Search notes
- Filter by patient
- Filter by clinician
- Sorting
- Create
- View
- Edit
- Delete

---

## UI Features

- Responsive design
- Sort indicators
- Confirmation dialogs
- Loading states
- Form validation
- Toast notifications

---

## Folder Structure

```text
src/
├── api/
├── components/
├── features/
│   ├── patients/
│   ├── clinicians/
│   └── visits/
├── pages/
└── routes/
```

---

## Author

Akshay Rajpurohit
