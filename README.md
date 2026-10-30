# Task Management REST API

**SkillForge Technologies (Pvt) Ltd.**  
*Software Engineering Internship – Day 1 Task*

---

## 📌 Project Overview

This is a robust, modular, and production-ready **Task Management REST API** built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**. It allows users to manage daily tasks with full CRUD capabilities, advanced filtering, priority management, due dates, and input validation.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Logging & Security**: `morgan`, `cors`
- **Testing**: [Postman](https://www.postman.com/)

---

## 📂 Project Structure

```text
intern/
├── prisma/
│   └── schema.prisma            # Prisma schema (Task model, Enums, relations)
├── src/
│   ├── config/
│   │   └── prisma.ts            # Prisma client singleton instance
│   ├── controllers/
│   │   └── task.controller.ts   # Express request & response controllers
│   ├── middlewares/
│   │   ├── error.middleware.ts  # Global error & Prisma exception handler
│   │   └── validate.middleware.ts # Request validation middleware (Zod)
│   ├── routes/
│   │   ├── index.ts             # Main API routing hub
│   │   └── task.routes.ts       # Task REST endpoints
│   ├── schemas/
│   │   └── task.schema.ts       # Zod validation schemas & types
│   ├── services/
│   │   └── task.service.ts      # Core business logic & database queries
│   ├── utils/
│   │   └── apiResponse.ts       # Standardized API response format helper
│   ├── app.ts                   # Express app configuration & middlewares
│   └── server.ts                # Server entry point & graceful shutdown
├── postman/
│   └── Task_Management_API.postman_collection.json # Ready-to-import Postman tests
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation & setup instructions
```

---

## 🚀 Quick Setup Guide

### 1. Prerequisites
Ensure you have installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (installed locally or use a free cloud PostgreSQL like [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com))

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd intern
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/Taskdb?schema=public"
```

> **Tip for Cloud PostgreSQL (Neon / Supabase)**: If you don't have PostgreSQL installed on Windows, you can create a free database at [Neon.tech](https://neon.tech) in 30 seconds and paste the connection string into `DATABASE_URL`.

### 5. Run Prisma Migrations
Generate the Prisma Client and apply migrations to your PostgreSQL database:
```bash
# Push schema to database
npx prisma db push

# Or run migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 6. Start the Server
- **Development Mode (with auto-reload)**:
  ```bash
  npm run dev
  ```
- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

Server will run at `http://localhost:5000`.

---

## 📡 API Endpoints Specification

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Check API server status | None |
| `POST` | `/tasks` | Create a new task | **Body**: `{ title, description?, status?, priority?, dueDate? }` |
| `GET` | `/tasks` | Get all tasks (with filters) | **Query**: `status`, `priority`, `search`, `page`, `limit`, `sortBy`, `sortOrder` |
| `GET` | `/tasks/:id` | Get a single task by UUID | **Params**: `id` (UUID) |
| `PUT` | `/tasks/:id` | Update all or partial task details | **Params**: `id`, **Body**: `{ title?, description?, status?, priority?, dueDate? }` |
| `PATCH` | `/tasks/:id` | Partial update of task details | **Params**: `id`, **Body**: Fields to update |
| `DELETE` | `/tasks/:id` | Delete a task | **Params**: `id` (UUID) |

---

### Data Models & Enums

#### Task Status (`TaskStatus`)
- `PENDING` *(default)*
- `IN_PROGRESS`
- `COMPLETED`

#### Task Priority (`TaskPriority`)
- `LOW`
- `MEDIUM` *(default)*
- `HIGH`

#### Example Request Body (`POST /api/tasks`):
```json
{
  "title": "Complete Day 1 Internship Backend Task",
  "description": "Build and test Task Management REST API with TypeScript and Prisma",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-10-25T18:00:00.000Z"
}
```

#### Example Standard API Response (`201 Created`):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "e6a41f62-3c22-48a5-812e-1c6f37920ab4",
    "title": "Complete Day 1 Internship Backend Task",
    "description": "Build and test Task Management REST API with TypeScript and Prisma",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2026-10-25T18:00:00.000Z",
    "createdAt": "2026-10-20T10:00:00.000Z",
    "updatedAt": "2026-10-20T10:00:00.000Z"
  }
}
```

---

## 🧪 Postman Testing

A comprehensive Postman Collection is provided in the repository:
`postman/Task_Management_API.postman_collection.json`

### How to test:
1. Open **Postman**.
2. Click **Import** (top left).
3. Select `postman/Task_Management_API.postman_collection.json`.
4. Execute the requests in sequence:
   - **0. Health Check** (Verify server is running)
   - **1. Create Task** (Automatically saves `taskId` in collection variable)
   - **2. Create Task (Minimal)**
   - **3. Create Task - Validation Error** (Tests 400 Bad Request error handling)
   - **4. Get All Tasks**
   - **5. Filter by Status (IN_PROGRESS)**
   - **6. Filter by Priority (HIGH)**
   - **7. Filter by both Status and Priority**
   - **8. Search Tasks by Keyword**
   - **9. Get Task by ID**
   - **10. Update Task**
   - **11. Delete Task**
   - **12. Verify Deleted Task returns 404**
5. Take screenshots of successful test responses for your internship submission evidence.

---

## 🌿 Git & GitHub Submission Instructions

As per SkillForge internship guidelines:
1. **Initialize Git**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial setup of Task Management REST API"
   ```
2. **Create and Switch to Feature Branch**:
   ```bash
   git checkout -b feature/task-management-api
   ```
3. **Push to Remote Repository**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin feature/task-management-api
   ```
4. **Create a Pull Request**:
   - Go to GitHub -> compare `feature/task-management-api` with `main`.
   - Open a Pull Request titled: `feat: Day 1 - Task Management REST API`.
5. **Prepare Submission**:
   - GitHub Repository URL
   - Pull Request URL
   - Postman Testing Screenshots
   - This `README.md` file
