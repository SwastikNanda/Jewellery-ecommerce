# Aurelle · Fine Jewellery E‑Commerce

A production‑ready, full‑stack jewellery store built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma + PostgreSQL** and **Stripe**. Aesthetic, modern and minimal with subtle champagne/ivory tones.

## ✨ Features

- **Landing page** — hero, shop‑by‑category, featured pieces, editorial banners, new arrivals.
- **Collections** — Wedding, Vintage, Modern, Aesthetic.
- **Catalogue** — search, filter by collection / type, sort by price, responsive product grid.
- **Product pages** — image gallery, quantity selector, **Add to cart** & **Buy now**.
- **Authentication** — email/password sign‑up & login. Secure, hashed passwords (bcrypt) + signed **HTTP‑only JWT** sessions (jose). Role‑based access (`USER` / `ADMIN`).
- **Cart & checkout** — server‑persisted cart, login‑gated **Stripe Checkout** (test mode) with webhook order fulfilment. Falls back to a simulated payment if Stripe keys aren’t set, so it runs out of the box.
- **Account dashboard** — order history & wishlist.
- **Admin panel** (`/admin`) — dashboard stats, product CRUD (set price, stock, images, collection, feature flag) and order management.
- **Data safety** — server‑side authorization on every admin/order route, Zod validation, parameterized Prisma access, secrets only in env.

## 🧱 Tech stack

| Layer        | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 16 (App Router) + React 19       |
| Styling      | Tailwind CSS v4                          |
| Database     | PostgreSQL via Prisma ORM                |
| Auth         | bcryptjs + jose (JWT in HTTP‑only cookie)|
| Payments     | Stripe Checkout (test mode)              |
| Validation   | Zod                                      |
| Hosting      | Render (web service + Render Postgres)   |

---

## 🚀 Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in values:

```bash
cp .env.example .env
```

| Variable                | Required | Notes                                                         |
| ----------------------- | -------- | ------------------------------------------------------------- |
| `DATABASE_URL`          | ✅       | PostgreSQL connection string.                                 |
| `AUTH_SECRET`           | ✅       | Long random string. Generate: `openssl rand -base64 32`.      |
| `NEXT_PUBLIC_APP_URL`   | ✅       | e.g. `http://localhost:3000`.                                 |
| `STRIPE_SECRET_KEY`     | optional | Stripe **test** secret key. Omit to use simulated checkout.   |
| `STRIPE_WEBHOOK_SECRET` | optional | Webhook signing secret (see below).                           |
| `SEED_ADMIN_EMAIL`      | optional | Admin account created by the seed (default `admin@aurelle.com`). |
| `SEED_ADMIN_PASSWORD`   | optional | Admin password (default `Admin@123`).                         |

> **Need a database?** Use a free [Render](https://render.com) or [Neon](https://neon.tech) Postgres and paste its connection string into `DATABASE_URL`.

### 3. Create the schema & seed demo data

```bash
npm run db:push     # or: npx prisma migrate deploy
npm run db:seed     # loads 24 demo products + admin & customer accounts
```

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

**Demo logins (after seeding):**

- Admin — `admin@aurelle.com` / `Admin@123` → `/admin`
- Customer — `customer@aurelle.com` / `Customer@123`

---

## 💳 Stripe (test mode)

1. Get your **test** secret key from <https://dashboard.stripe.com/test/apikeys> → set `STRIPE_SECRET_KEY`.
2. Forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
3. Pay with test card `4242 4242 4242 4242`, any future expiry & CVC.

If Stripe keys are absent, checkout is **simulated** (order is marked paid immediately) so you can demo the full flow without configuration.

---

## ☁️ Deploy to Render

This repo includes a [`render.yaml`](./render.yaml) Blueprint that provisions the web service **and** a managed Postgres database.

### Option A — Blueprint (recommended)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, select the repo. Render reads `render.yaml`.
3. After it provisions, set the `sync: false` env vars in the dashboard:
   - `NEXT_PUBLIC_APP_URL` → your Render URL (e.g. `https://aurelle-web.onrender.com`)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   `DATABASE_URL` and `AUTH_SECRET` are wired up automatically.
4. The build automatically runs `prisma migrate deploy` (creates tables) **and** `npm run db:seed`
   (loads the 24-piece demo catalogue + demo accounts). The seed is idempotent, so re-deploys
   won't duplicate data. To re-seed manually, open the service **Shell** and run:
   ```bash
   npm run db:seed
   ```
5. Add the Stripe webhook endpoint `https://<your-app>.onrender.com/api/webhooks/stripe` in the Stripe dashboard and paste its signing secret into `STRIPE_WEBHOOK_SECRET`.

### Option B — Manual

- **Database:** create a Render PostgreSQL instance, copy its **Internal/External Database URL**.
- **Web Service:** New → Web Service from the repo.
  - Build: `npm install && npx prisma migrate deploy && npm run db:seed && npm run build`
  - Start: `npm run start`
  - Env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

---

## 📜 Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start dev server                     |
| `npm run build`     | Generate Prisma client + production build |
| `npm run start`     | Start production server              |
| `npm run lint`      | ESLint                               |
| `npm run db:push`   | Sync schema to the database          |
| `npm run db:deploy` | Apply migrations (`migrate deploy`)  |
| `npm run db:setup`  | Migrate **and** seed in one step      |
| `npm run db:seed`   | Seed demo catalogue + accounts       |
| `npm run db:studio` | Open Prisma Studio                   |

---

## 🗂️ Project structure

```
prisma/
  schema.prisma         # data model
  migrations/0_init     # initial migration
  seed.ts               # demo data
src/
  app/
    (shop)/             # storefront (navbar + footer): home, shop, category, product, cart, checkout, account
    login/ register/    # auth screens
    admin/              # admin dashboard, products, orders (ADMIN only)
    api/                # auth, cart, checkout, webhooks, admin, wishlist
  components/           # ui, layout, product, admin, providers
  lib/                  # prisma, auth, stripe, products, cart, orders, utils, validations
```

## 🛠️ Troubleshooting

**"The catalogue is empty. Run `npm run db:seed`…"**
This means the database has no products yet — either `DATABASE_URL` isn't pointing at a real
Postgres, or the seed hasn't run. Fix it with:

```bash
npm run db:setup    # applies migrations + seeds the 24-piece demo catalogue
```

Make sure `DATABASE_URL` in `.env` (local) or the Render dashboard (deployed) points at a
reachable Postgres. On Render the Blueprint seeds automatically during build.

---

## 🔒 Notes on images

Demo images are served from Pexels (free licence). Admins add products with hosted image URLs (any CDN, Cloudinary, or Vercel Blob). Allowed image hosts are configured in `next.config.ts`.
