import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();
type Bindings = {
  accountId: string;
  databaseId: string;
  token: string;
}

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  out: 'drizzle',
  schema: './src/db/schema.ts',
  dbCredentials: {
   accountId: process.env.ACCOUNT_ID || '',
    databaseId: process.env.DATABASE_ID || '',
    token: process.env.DB_TOKEN || '',
  },
});