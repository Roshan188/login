# Architectural Decisions Log

## 2026-04-16

### ADR-001: Next.js App Router
**Decision**: Use Next.js 14+ App Router (not Pages Router)
**Reason**: Better performance with React Server Components, streaming, parallel routes
**Trade-off**: Steeper learning curve, some ecosystem packages not yet compatible

### ADR-002: Drizzle ORM over Prisma
**Decision**: Use Drizzle ORM
**Reason**: Better TypeScript inference, lighter bundle, better edge runtime support
**Trade-off**: Less community resources than Prisma

### ADR-003: NextAuth.js v5
**Decision**: Use NextAuth v5 (beta) not v4
**Reason**: Native App Router support, better edge compatibility
**Trade-off**: Beta software, potential breaking changes

### ADR-004: Supabase PostgreSQL
**Decision**: Use Supabase for PostgreSQL hosting
**Reason**: Free tier, built-in connection pooling, edge-friendly
**Trade-off**: Vendor lock-in potential

### ADR-005: Cloudinary for images
**Decision**: Cloudinary over Vercel Blob or S3
**Reason**: Free tier generous, built-in transformations, CDN included
**Trade-off**: Another vendor dependency

### ADR-006: Resend for email
**Decision**: Resend over SendGrid/Mailgun
**Reason**: Developer-friendly, React email templates, good free tier
**Trade-off**: Newer, less battle-tested

### ADR-007: Dark mode first
**Decision**: Dark mode is the default, light mode optional
**Reason**: Matches futuristic design aesthetic, developer audience prefers dark
**Trade-off**: More CSS variables needed

### ADR-008: Replaced CRA with Next.js
**Decision**: Completely replace Create React App project with Next.js 14
**Reason**: CRA is deprecated, Next.js is the production standard
**Trade-off**: Complete rewrite required
