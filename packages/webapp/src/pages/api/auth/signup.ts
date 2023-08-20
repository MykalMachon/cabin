import bcrypt from 'bcryptjs';
import type { APIRoute } from 'astro';

import { prisma } from '@utils/database';

export const post: APIRoute = async ({ params, request, cookies }) => {
  const body = await request.formData();
  const name = body.get('name') as string | undefined;
  const email = body.get('email') as string | undefined;
  const password = body.get('password') as string | undefined;

  // if email or password is missing, return error
  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: "name, email or password is missing" }), {
      status: 400
    })
  }

  // TODO: validate that the password is strong enough

  // see if there is an existing user with this email
  const user = await prisma.user.findFirst({
    where: { email: email },
    select: { id: true, email: true, password: true },
  });

  // if user not found, or the user doesn't have a set password, return error
  if (user) {
    return new Response(JSON.stringify({ message: "user already exists with this email" }), {
      status: 400,
    })
  }

  // hash the users password
  const hashedPassword = await bcrypt.hash(password, import.meta.env.NODE_ENV !== 'production' ? 1 : 10);

  // create the user 
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    }
  });

  // if password is valid, create a session for the user
  const session = await prisma.session.create({
    data: {
      userId: newUser.id,
    }
  });

  // set the session cookie 
  cookies.set('session', session.id, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });

  // return the session to the user
  return new Response(JSON.stringify({ message: 'user created and signed in' }), {
    status: 200,
  })
}