# Buena Case Study

## Stack

**Backend:** NestJS with TypeORM, PostgreSQL, and OpenAI integration for document processing.

**Frontend:** React 19 with Vite, Material UI, Zustand for state management, and TypeScript.

## Quickstart

### 1. Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/your_database
OPENAI_API_KEY=sk-your-openai-api-key
```

### 2. Run the Backend

```bash
cd backend
npm install
npm run start:dev
```

The backend will be available at `http://localhost:3000`.

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

