// src/app/api/test-env/route.ts
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL || 'Not Found'
  });
}
