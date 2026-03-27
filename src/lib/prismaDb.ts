// src/lib/prismaDb.ts

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || ""
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;
