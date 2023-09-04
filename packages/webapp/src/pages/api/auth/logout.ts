import type { APIRoute } from 'astro';

import { prisma } from '@services/database';

export const get: APIRoute = async ({ params, request, cookies }) => {
  const sessionCookie = cookies.get('session');
  const sessionId = sessionCookie.value;

  // if session cookie is missing, return error
  if (!sessionId) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  // delete the session from the database
  const sessionExists = await prisma.session.findFirst({ where: { id: sessionId } });
  if (sessionExists) {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  }

  // delete the session cookie
  cookies.delete('session', { path: '/' });

  // return a success error
  return new Response(JSON.stringify({ message: 'logged out' }), { status: 200 });
}