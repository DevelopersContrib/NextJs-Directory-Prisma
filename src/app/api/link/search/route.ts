import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// })
export const POST = async (req: Request) => {
  const data = await req.json();
    
    let filter;
    if(data.category && data.search){
      filter = {
        AND: [
          {
            categoryId: {
              in: data.category.split(','),
            },
          },
          {
            OR: [
              {
                title: {
                  contains: data.search,
                },
              },
              {
                description: {
                  contains: data.search, 
                },
              },
            ],
          },
        ],
      }
    }else if(data.category){
      filter = {
        AND: [
          {
            categoryId: {
              in: data.category.split(','),
            },
          }
        ],
      }
    }else if(data.search){
      filter = {
        OR: [
          {
            title: {
              contains: data.search,
            },
          },
          {
            description: {
              contains: data.search, 
            },
          },
        ],
      }
    }
    
    const items = await prisma.link.findMany({
      include:{
        category:true
      },
      where: filter
    });

    return new Response(JSON.stringify(items), { status: 200 });    
};