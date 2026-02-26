# Dynamo Idea Hub

Internal tool for submitting and managing ideas tied to contracts and use cases.

## Tech Stack

- **SvelteKit** with TypeScript
- **Tailwind CSS** v4 (dark mode via `class` strategy)
- **Supabase Auth** (Azure AD / Microsoft OAuth + email/password)
- **Docker** for containerized deployment

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` and fill in your Supabase credentials:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `PUBLIC_SUPABASE_URL` — Your Supabase project URL
   - `PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous key

3. **Run the dev server:**

   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:5173](http://localhost:5173)

## Demo Credentials

For demo/testing without Supabase configured:

| Email                      | Password   |
|----------------------------|------------|
| `admin.one@dynamo.works`   | `password` |

This bypasses Supabase auth entirely and uses a cookie-based session.

## Building

```bash
npm run build
npm run preview
```

## Docker

```bash
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

It pulls Supabase credentials from your `.env` file automatically. Without one, it defaults to placeholders so the demo login still works.
