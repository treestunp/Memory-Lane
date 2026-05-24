# Memory Lane

Memory Lane is a simple, personal web app to upload photos and save short text notes so you can revisit memories later. This repository contains a Next.js full-stack app (TypeScript) with authentication, image upload, and a SQLite/Prisma-backed datastore.

## Features
- User registration and login (simple session-based auth)
- Create, upload, and view memories (image + note)
- Per-user dashboard to browse saved memories
- Local image storage (public/uploads) with a path stored in the database

## Quick start

Prerequisites

- Node.js 18+ (LTS recommended)
- npm (bundled with Node) or `pnpm`/`yarn`

Clone and install

```bash
git clone https://github.com/treestunp/Memory-Lane.git
cd "Memory Lane"
npm install
```

Environment

Copy the example or create a `.env` file in the project root. The app expects at least:

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
SESSION_MAX_AGE="86400"
```

Initialize the database (Prisma)

```bash
npx prisma generate
npx prisma db push
```

Start the app

```bash
npm run dev
# Open http://localhost:3000
```

Build for production

```bash
npm run build
npm run start
```

Notes

- Uploaded images are stored in `public/uploads` during development. Do not commit this folder to the repository (it's in `.gitignore`).
- The database uses SQLite by default at `dev.db`. For production use consider Postgres or MySQL and configure `DATABASE_URL` accordingly.

## Deployment

Recommended: Vercel (seamless for Next.js). Steps:

1. Push this repository to GitHub (already done).
2. Sign in to https://vercel.com and import the GitHub repo.
3. Set environment variables in the Vercel project settings (eg `DATABASE_URL`, `NEXT_PUBLIC_BASE_URL`, `SESSION_MAX_AGE`).
4. For image hosting in production switch `public/uploads` to an external service (S3/Cloudinary) and update the API accordingly.

## Contributing

Contributions are welcome. Open an issue or submit a pull request. Please keep changes focused and include tests where applicable.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

---

If you'd like, I can also add a short `README` usage section with screenshots, or add a GitHub Actions workflow to run `npm run build` on every push.