import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

// Enums
export const userRoleEnum = pgEnum("user_role", ["developer", "company", "admin"]);
export const subscriptionPlanEnum = pgEnum("subscription_plan", ["free", "pro"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "inactive",
]);
export const companyTierEnum = pgEnum("company_tier", ["startup", "growth", "enterprise"]);
export const projectStatusEnum = pgEnum("project_status", ["draft", "published", "archived"]);

// ─── NextAuth Tables ───────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    role: userRoleEnum("role").notNull().default("developer"),
    username: varchar("username", { length: 50 }).unique(),
    bio: text("bio"),
    headline: text("headline"),
    location: text("location"),
    website: text("website"),
    githubUsername: text("github_username"),
    twitterUsername: text("twitter_username"),
    linkedinUsername: text("linkedin_username"),
    isHireable: boolean("is_hireable").default(false),
    experienceLevel: text("experience_level"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: index("users_email_idx").on(t.email),
    usernameIdx: index("users_username_idx").on(t.username),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdIdx: index("accounts_user_id_idx").on(t.userId),
  }),
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    userIdIdx: index("sessions_user_id_idx").on(t.userId),
  }),
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.identifier, t.token] }),
  }),
);

// ─── Portfolios ────────────────────────────────────────────────────────────────

export const portfolios = pgTable(
  "portfolios",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    bio: text("bio"),
    headline: text("headline"),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    isPublic: boolean("is_public").default(true).notNull(),
    template: text("template").default("default").notNull(),
    customDomain: text("custom_domain").unique(),
    viewCount: integer("view_count").default(0).notNull(),
    accentColor: text("accent_color").default("#00d4ff"),
    socialLinks: jsonb("social_links").$type<Record<string, string>>(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("portfolios_slug_idx").on(t.slug),
    userIdIdx: index("portfolios_user_id_idx").on(t.userId),
    publicIdx: index("portfolios_public_idx").on(t.isPublic),
  }),
);

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    imageUrl: text("image_url"),
    images: jsonb("images").$type<string[]>().default([]),
    demoUrl: text("demo_url"),
    githubUrl: text("github_url"),
    techStack: jsonb("tech_stack").$type<string[]>().default([]).notNull(),
    featured: boolean("featured").default(false).notNull(),
    order: integer("order").default(0).notNull(),
    status: projectStatusEnum("status").default("published").notNull(),
    metrics: jsonb("metrics").$type<{
      users?: number;
      revenue?: number;
      stars?: number;
      downloads?: number;
      custom?: Record<string, string | number>;
    }>(),
    githubStars: integer("github_stars"),
    githubForks: integer("github_forks"),
    startDate: timestamp("start_date", { mode: "date" }),
    endDate: timestamp("end_date", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    portfolioIdIdx: index("projects_portfolio_id_idx").on(t.portfolioId),
    slugIdx: index("projects_slug_idx").on(t.slug),
    featuredIdx: index("projects_featured_idx").on(t.featured),
    orderIdx: index("projects_order_idx").on(t.order),
    statusIdx: index("projects_status_idx").on(t.status),
  }),
);

// ─── Subscriptions ─────────────────────────────────────────────────────────────

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    plan: subscriptionPlanEnum("plan").default("free").notNull(),
    status: subscriptionStatusEnum("status").default("inactive").notNull(),
    currentPeriodStart: timestamp("current_period_start", { mode: "date" }),
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(t.userId),
    stripeCustomerIdx: index("subscriptions_stripe_customer_idx").on(t.stripeCustomerId),
  }),
);

// ─── Companies ────────────────────────────────────────────────────────────────

export const companies = pgTable(
  "companies",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    logo: text("logo"),
    website: text("website"),
    description: text("description"),
    industry: text("industry"),
    size: text("size"),
    location: text("location"),
    tier: companyTierEnum("tier").default("startup").notNull(),
    contactsUsed: integer("contacts_used").default(0).notNull(),
    contactsLimit: integer("contacts_limit").default(10).notNull(),
    searchesUsed: integer("searches_used").default(0).notNull(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    subscriptionStatus: subscriptionStatusEnum("subscription_status").default("inactive"),
    currentPeriodEnd: timestamp("current_period_end", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("companies_slug_idx").on(t.slug),
    userIdIdx: index("companies_user_id_idx").on(t.userId),
  }),
);

// ─── Portfolio Analytics ──────────────────────────────────────────────────────

export const portfolioViews = pgTable(
  "portfolio_views",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id"),
    referrer: text("referrer"),
    country: text("country"),
    device: text("device"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    portfolioIdIdx: index("portfolio_views_portfolio_id_idx").on(t.portfolioId),
    createdAtIdx: index("portfolio_views_created_at_idx").on(t.createdAt),
  }),
);

export const projectViews = pgTable(
  "project_views",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    projectIdIdx: index("project_views_project_id_idx").on(t.projectId),
  }),
);

// ─── Contact Requests ─────────────────────────────────────────────────────────

export const contactRequests = pgTable(
  "contact_requests",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    developerId: text("developer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => ({
    companyIdIdx: index("contact_requests_company_id_idx").on(t.companyId),
    developerIdIdx: index("contact_requests_developer_id_idx").on(t.developerId),
  }),
);

// ─── Tech Stack Tags ──────────────────────────────────────────────────────────

export const techTags = pgTable(
  "tech_tags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    category: text("category"),
    iconUrl: text("icon_url"),
    color: text("color"),
    useCount: integer("use_count").default(0).notNull(),
  },
  (t) => ({
    nameIdx: uniqueIndex("tech_tags_name_idx").on(t.name),
  }),
);

// Export all table types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Portfolio = typeof portfolios.$inferSelect;
export type NewPortfolio = typeof portfolios.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type PortfolioView = typeof portfolioViews.$inferSelect;
