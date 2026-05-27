# ByteBurger 🍔

A futuristic fast-food ordering and operations platform combining customer ordering, kitchen management, employee operations, and business analytics.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your credentials and update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
/app          # Next.js app directory
/components   # Reusable UI components
/lib          # Utility functions and Supabase clients
/hooks        # Custom React hooks
/types        # TypeScript type definitions
/public       # Static assets
```

## Features Roadmap

See `documentations/ByteBurger_Development_Roadmap.md` for the complete development plan.

## Phase 0 Status ✅

- [x] Next.js project with TypeScript
- [x] Tailwind CSS configured
- [x] Supabase configured
- [x] ESLint + Prettier configured
- [x] App runs successfully
- [x] No TypeScript errors
