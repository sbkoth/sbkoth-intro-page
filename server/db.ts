import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Use standard pg Pool with connection details
const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

export { pool };
export const db = drizzle(pool, { schema });