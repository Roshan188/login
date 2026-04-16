# RESUMPTION GUIDE

## Last Completed
Phases 0-3, 5, 6 complete. Build passing. All core infrastructure is in place.

## Currently In Progress
Nothing - clean state. Ready to continue.

## Next Immediate Tasks (in order)

### 1. Dashboard Portfolio List Page
- File: `src/app/dashboard/portfolios/page.tsx`
- File: `src/components/dashboard/portfolio-list.tsx`

### 2. Portfolio Create/Edit Form
- File: `src/app/dashboard/portfolios/new/page.tsx`
- File: `src/components/dashboard/portfolio-form.tsx`

### 3. Project Management UI
- File: `src/app/dashboard/projects/page.tsx`
- File: `src/app/dashboard/projects/new/page.tsx`
- File: `src/components/dashboard/project-form.tsx`

### 4. Settings Page
- File: `src/app/dashboard/settings/page.tsx`

### 5. Stripe Integration
- File: `src/app/api/stripe/checkout/route.ts`
- File: `src/app/api/webhooks/stripe/route.ts`
- File: `src/app/dashboard/billing/page.tsx`
- File: `src/lib/stripe.ts`

### 6. Pricing Page (standalone)
- File: `src/app/pricing/page.tsx`

## Context You Need
- Read PROGRESS.md for full file list
- Read DECISIONS.md for architectural choices
- DB schema is at `src/db/schema.ts`
- Auth is NextAuth v5 at `src/lib/auth.ts`
- Validations (Zod) at `src/lib/validations.ts`
- The `db` client supports `db.query.*` with relations (portfolios.with.projects, etc.)

## Commands to Run First
```bash
git log --oneline -5
git status
npm run build   # should pass
```

## Resumption Message
Say: "Resume DevFolio build. Read PROGRESS.md and NEXT_STEPS.md"
