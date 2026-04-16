import { relations } from "drizzle-orm";
import {
  users,
  accounts,
  sessions,
  portfolios,
  projects,
  subscriptions,
  companies,
  portfolioViews,
  projectViews,
  contactRequests,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  portfolios: many(portfolios),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  projects: many(projects),
  views: many(portfolioViews),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  portfolio: one(portfolios, {
    fields: [projects.portfolioId],
    references: [portfolios.id],
  }),
  views: many(projectViews),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  contactRequests: many(contactRequests),
}));

export const portfolioViewsRelations = relations(portfolioViews, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioViews.portfolioId],
    references: [portfolios.id],
  }),
}));

export const projectViewsRelations = relations(projectViews, ({ one }) => ({
  project: one(projects, {
    fields: [projectViews.projectId],
    references: [projects.id],
  }),
}));

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
  company: one(companies, {
    fields: [contactRequests.companyId],
    references: [companies.id],
  }),
  developer: one(users, {
    fields: [contactRequests.developerId],
    references: [users.id],
  }),
}));
