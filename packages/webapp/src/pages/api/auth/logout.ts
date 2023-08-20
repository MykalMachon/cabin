import bcrypt from 'bcryptjs';
import type { APIRoute } from 'astro';

import { prisma } from '@utils/database';

export const get: APIRoute = async ({ params, request, cookies }) => {
  const sessionCookie = cookies.get('session');
  const sessionId = sessionCookie.toString();

  // if session cookie is missing, return error
  if (!sessionId) {
    return {
      body: JSON.stringify({ error: "You're not logged in." }),
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // delete the session from the database
  prisma.session.delete({
    where: { id: sessionId},
  });

  // delete the session cookie
  cookies.delete('session');

  // return a success error
  return { 
    body: JSON.stringify({ message: "logged out" }),
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }
}