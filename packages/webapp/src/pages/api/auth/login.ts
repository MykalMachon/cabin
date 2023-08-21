import type { APIRoute } from 'astro';

import { prisma } from '@utils/database';
import { comparePasswords } from '@utils/crypto';

export const get: APIRoute = async({ request, cookies }) => {
  return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
}

export const post: APIRoute = async ({ request, cookies }) => {
  const body = await request.formData();
  const email = body.get('email') as string | undefined;
  const password = body.get('password') as string | undefined;

  console.log(`someone is attempting to login as ${email}`);

  // if email or password is missing, return message
  if (!email || !password) {
    return new Response(JSON.stringify({ message: "email or password is missing" }), {
      status: 400,
    })
  }

  // get the user from the database
  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  // if user not found, or the user doesn't have a set password, return message
  if (!user || user.password === null) {
    return new Response(JSON.stringify({ message: "email or password is incorrect" }), {
      status: 401,
    })
  }

  // check user's password is valid
  const passwordIsValid = comparePasswords(password, user.password);

  // if password is invalid, return message
  if (!passwordIsValid) {
    return new Response(JSON.stringify({ message: "email or password is incorrect" }), {
      status: 401,
    })
  }

  // if password is valid, create a session for the user
  const session = await prisma.session.create({
    data: {
      userId: user.id,
    }
  });

  // set the session cookie 
  cookies.set('session', session.id, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });

  console.log(`user ${user.email} logged in`);

  // return the session to the user
  return new Response(JSON.stringify({ message: 'logged in' }), {
    status: 200,
  });
}