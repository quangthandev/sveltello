## Introduction

A demo Trello clone fullstack application built with SvelteKit. UI and domain modeling are inspired by the Remix-run repository [https://github.com/remix-run/example-trellix](https://github.com/remix-run/example-trellix).

### Tech Stack

- UI: SvelteKit, TailwindCSS
- Auth: Lucia
- Database: SQLite (Turso)
- ORM: Drizzle
- Build: Vite
- Language: TypeScript

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`):

- Create .env file:

```bash
DATABASE_URL=[path to your local sqlite database file or turso database url]
TURSO_AUTH_TOKEN=[your turso auth token]

UNSPLASH_ACCESS_KEY=[your unsplash access key]

R2_ACCOUNT_ID=[your R2 account id]
R2_ACCESS_KEY=[your R2 access key]
R2_SECRET_KEY=[your R2 secret key]
R2_BUCKET_NAME=[your R2 bucket name]
R2_PUBLIC_BUCKET_URL=[your R2 public bucket url]
```

- Migrate database

```bash
npm run db:migrate
```

- Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
