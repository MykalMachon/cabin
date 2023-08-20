import bcrypt from 'bcryptjs';
import type { APIRoute } from 'astro';

import { prisma } from '@utils/database';

export const post: APIRoute = async ({ params, request, cookies }) => {
  const body = await request.formData();
  const name = body.get('name') as string | undefined;
  const email = body.get('email') as string | undefined;
  const password = body.get('password') as string | undefined;

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('received signup request')
  }
  // if email or password is missing, return error
  if (!name || !email || !password) {
    return {
      body: JSON.stringify({ error: "name, email or password is missing" }),
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('signup info is all attached')
  }

  // TODO: validate that the password is strong enough


  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('checking for valid user ')
  }
  // see if there is an existing user with this email
  const user = await prisma.user.findFirst({
    where: { email: email },
    select: { id: true, email: true, password: true },
  });

  // if user not found, or the user doesn't have a set password, return error
  if (user) {
    return {
      body: JSON.stringify({ error: "user already exists with this email" }),
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('no user found... creating user')
  }

  // hash the users password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create the user 
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    }
  });

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('created user... creating session')
  }

  // if password is valid, create a session for the user
  const session = await prisma.session.create({
    data: {
      userId: newUser.id,
    }
  });

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('session created... setting cookie')
  }

  // set the session cookie 
  cookies.set('session', session.id, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24, // 1 day
  });

  if(import.meta.env.NODE_ENV !== 'production') {
    console.log('cookie set, returning response..')
  }

  // return the session to the user
  return {
    body: JSON.stringify({ message: 'user created and signed in' }),
    status: 200,
    headers: {
      'Content-Type': 'application/json' 
    }
  };
}