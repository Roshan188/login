export type UserRole = "developer" | "company" | "admin";
export type SubscriptionPlan = "free" | "pro";
export type CompanyTier = "startup" | "growth" | "enterprise";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "inactive";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  username: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  githubUsername: string | null;
  twitterUsername: string | null;
  linkedinUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  slug: string;
  bio: string | null;
  headline: string | null;
  isPublic: boolean;
  template: string;
  customDomain: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  portfolioId: string;
  title: string;
  description: string;
  longDescription: string | null;
  slug: string;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  techStack: string[];
  featured: boolean;
  order: number;
  metrics: ProjectMetrics | null;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMetrics {
  users?: number;
  revenue?: number;
  stars?: number;
  downloads?: number;
  custom?: Record<string, string | number>;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
}

export interface Company {
  id: string;
  userId: string;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  tier: CompanyTier;
  contactsUsed: number;
  contactsLimit: number;
  searchesUsed: number;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export type SortOrder = "asc" | "desc";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchFilters {
  query?: string;
  techStack?: string[];
  location?: string;
  experienceLevel?: string;
  isHireable?: boolean;
}
