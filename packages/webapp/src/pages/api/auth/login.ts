import { compare } from 'bcryptjs';
import type { APIRoute } from 'astro';

import { prisma } from '@utils/database';


export const post: APIRoute = async ({ params, request, cookies }) => {
  const body = await request.formData();
  const email = body.get('email') as string | undefined;
  const password = body.get('password') as string | undefined;

  // if email or password is missing, return error
  if (!email || !password) {
    return {
      body: JSON.stringify({ error: "email or password is missing" }),
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // get the user from the database
  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  // if user not found, or the user doesn't have a set password, return error
  if (!user || user.password === null) {
    return {
      body: JSON.stringify({ error: "email or password is invalid" }),
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  // check user's password is valid
  const passwordIsValid = await compare(password, user.password);

  // if password is invalid, return error
  if (!passwordIsValid) {
    return new Response(JSON.stringify({ error: "email or password is invalid" }), {status: 401});
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
    secure: import.meta.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });


  // return the session to the user
  return new Response(JSON.stringify({ message: 'logged in' }), {
    status: 200,
  });
}