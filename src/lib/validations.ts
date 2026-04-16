import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  bio: z.string().max(500).optional(),
  headline: z.string().max(200).optional(),
  isPublic: z.boolean().default(true),
  template: z.string().default("default"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  socialLinks: z
    .record(z.string().url())
    .optional()
    .default({}),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  longDescription: z.string().max(5000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string().max(50)).max(20).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  metrics: z
    .object({
      users: z.number().optional(),
      revenue: z.number().optional(),
      stars: z.number().optional(),
      downloads: z.number().optional(),
    })
    .optional(),
  startDate: z.string().datetime().optional().or(z.literal("")),
  endDate: z.string().datetime().optional().or(z.literal("")),
});

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -")
    .optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(200).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
  githubUsername: z.string().max(50).optional(),
  twitterUsername: z.string().max(50).optional(),
  linkedinUsername: z.string().max(100).optional(),
  isHireable: z.boolean().optional(),
  experienceLevel: z.enum(["junior", "mid", "senior", "staff", "principal"]).optional(),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;
