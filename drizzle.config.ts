import { defineConfig } from 'drizzle-kit';
import path from 'path';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.NODE_ENV === 'production' 
      ? '/tmp/permissions.db' 
      : path.join(process.cwd(), 'data', 'permissions.db'),
  },
});
