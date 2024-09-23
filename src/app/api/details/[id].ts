import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// This function replaces `handler` from the Pages Router.
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch the link by `id` and include its category
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        category: true, // Include the category relationship
      },
    });

    // If link not found, return a 404 response
    if (!link) {
      return NextResponse.json({ message: 'Link not found' }, { status: 404 });
    }

    // Return the link details as JSON
    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
