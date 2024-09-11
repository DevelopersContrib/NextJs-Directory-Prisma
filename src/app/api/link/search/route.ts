import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  const data = await req.json();
    const filter = data.search ? {
      OR: [
        { title: { contains: String(data.search),  } },
        { description: { contains: String(data.search),  } },
      ],
    }: {}
    
    const items = await prisma.link.findMany({
      include:{
        category:true
      },
      where: filter,
    });

    return new Response(JSON.stringify(items), { status: 200 });    
};