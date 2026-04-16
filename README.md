# DevFolio

> The premium portfolio platform for developers. Showcase your projects, get discovered by top companies, and accelerate your career.

## Stack

- **Framework**: Next.js 15 (App Router) + TypeScript strict
- **Styling**: Tailwind CSS + custom design system (glassmorphism, gradient, dark mode)
- **Animations**: Framer Motion
- **Database**: PostgreSQL (Supabase) via Drizzle ORM
- **Auth**: NextAuth.js v5 (GitHub + Google OAuth)
- **Payments**: Stripe (subscriptions)
- **File Storage**: Cloudinary
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/devfolio
cd devfolio
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up the database

```bash
# Push schema to Supabase
npm run db:push

# Or generate and run migrations
npm run db:generate
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for all required variables:

- **Database**: `DATABASE_URL` (Supabase PostgreSQL)
- **Auth**: `AUTH_SECRET`, `AUTH_GITHUB_ID/SECRET`, `AUTH_GOOGLE_ID/SECRET`
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`
- **Resend**: `RESEND_API_KEY`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages + API routes
│   ├── [slug]/             # Public portfolio pages
│   ├── api/                # API routes (auth, portfolios, projects, stripe, upload)
│   ├── auth/               # Sign-in + error pages
│   ├── dashboard/          # Protected dashboard pages
│   └── explore/            # Public developer discovery
├── components/
│   ├── auth/               # Sign-in form
│   ├── dashboard/          # Dashboard UI (sidebar, overview, forms, analytics)
│   ├── explore/            # Discovery grid
│   ├── landing/            # Landing page sections
│   ├── layout/             # Header, footer, theme toggle
│   ├── portfolio/          # Public portfolio view
│   ├── providers/          # Theme provider
│   └── ui/                 # Design system primitives
├── db/                     # Drizzle schema + relations + client
├── lib/                    # Auth, Stripe, utils, validations
├── styles/                 # Global CSS
└── types/                  # TypeScript types
```

## Features

### Developer Features
- **Portfolio builder**: Create unlimited portfolios (Pro) with custom slugs
- **Project showcase**: Add projects with images, tech stack, metrics, demo links
- **Public pages**: SEO-optimized portfolio pages at `devfolio.dev/your-slug`
- **Analytics**: Track portfolio views and project engagement

### Company Features
- **Developer discovery**: Search and filter developers by tech stack, location, etc.
- **Tiered access**: Startup / Growth / Enterprise plans

### Platform
- Dark mode first (default), light mode available
- Futuristic design: glassmorphism, neon accents, Framer Motion animations
- Stripe subscriptions with webhook handling
- Cloudinary image optimization

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema directly (dev)
npm run db:studio    # Open Drizzle Studio
```

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

### Stripe Webhooks

Set your Stripe webhook endpoint to:
```
https://your-domain.com/api/webhooks/stripe
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## License

MIT
