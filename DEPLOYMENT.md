# Deployment Notes

This portfolio can run locally with `portfolio.db`, but production hosting must use a persistent database so dashboard messages do not disappear.

## Required Environment Variables

Add these variables in Vercel Project Settings:

```env
JWT_SECRET=your-long-random-secret
ADMIN_USER=your-admin-username
ADMIN_PASS=your-admin-password
DATABASE_URL=your-postgres-connection-string
```

Use a hosted Postgres database such as Neon, Supabase, or Vercel Postgres. If the provider gives an SSL connection string, keep `?sslmode=require`.

## First Deployment Steps

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Deploy the project.
5. Seed the production database once:

```powershell
npm.cmd run db:seed
```

Run the seed command with the same `DATABASE_URL`, `ADMIN_USER`, `ADMIN_PASS`, and `JWT_SECRET` values used in Vercel. After that, contact form submissions will be stored in Postgres and will appear in `/admin`.

## Important

- Do not commit `.env`.
- Do not commit `portfolio.db`.
- The local SQLite database is only for development.
- Production messages are stored in the external Postgres database.
