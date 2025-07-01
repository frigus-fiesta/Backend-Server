import { defineConfig } from 'drizzle-kit';
// import 'bun:dotenv'; // or use dotenv package if on Node

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
    accountId: '357790e5f843008a2825b60f24fb7f9c',
    databaseId: 'd8f9ac08-56fe-4bbb-9348-9d0318b3d470',
    token: 'PJByB6d3CuKP0grkthBUOytpsmU2BRiabTxxIBBe',
  },
});