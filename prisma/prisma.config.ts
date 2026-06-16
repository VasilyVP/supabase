import { loadEnvConfig } from '@next/env';
import type { PrismaConfig } from "prisma";
import { defineConfig, env } from 'prisma/config';

loadEnvConfig(process.cwd());

const datasourceUrl = process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL;

export default defineConfig({
  schema: './schema.prisma',
  datasource: {
    url: datasourceUrl ?? env('DATABASE_URL'),
  },
}) satisfies PrismaConfig;
