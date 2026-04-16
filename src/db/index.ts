import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

const fullSchema = { ...schema, ...relations };

const connectionString = process.env.DATABASE_URL!;

// For queries (pooled)
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema: fullSchema });

export * from "./schema";
export * from "./relations";
