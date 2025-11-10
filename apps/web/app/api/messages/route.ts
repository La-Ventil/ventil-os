import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { prismaClient } from '@repo/db';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const referer = headersList.get('referer') || '';
  console.log(referer);

  const body = await request.json();
  console.log(body);
  console.log(prismaClient);
  const createdMessage = await prismaClient.message.create({
    data: { contenu: 'hello world' }
  });

  return new Response(`Created message id ${createdMessage.id}`, {
    status: 200,
    headers: { referer: referer }
  });
}
