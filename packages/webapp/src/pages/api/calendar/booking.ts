import type { APIRoute } from "astro";

import { prisma } from '@services/database';

export const get: APIRoute = async ({ request, locals }) => {
  if (!locals.isLoggedIn) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  return new Response(JSON.stringify({ message: 'stub: only admins should see this' }));
}

export const post: APIRoute = async ({ request, locals }) => {
  if (!locals.isLoggedIn && locals.user !== null) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  const body = await request.formData();

  const name = locals.user?.name;
  const email = locals.user?.email;
  const notes = body.get('notes') as string | undefined; 
  const checkIn = body.get('check-in') as string;
  const checkOut = body.get('check-out') as string;
  const requestDate = new Date();

  return new Response(JSON.stringify({ message: 'stub: only admins should see this' }));
}