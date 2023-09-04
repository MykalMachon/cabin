import type { APIRoute } from "astro";

import { prisma } from '@services/database';

export const get: APIRoute = async ({ request, locals }) => {
  if (!locals.isLoggedIn) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  const posts = await prisma.post.findMany({
    select: {
      createdAt: true,
      updatedAt: true,
      content: true,
      attachments: true,
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: [
      { createdAt: 'desc' }
    ]
  });

  return new Response(JSON.stringify({ posts: posts, meta: { length: 0, pages: 0 } }));
}

export const post: APIRoute = async ({ request, locals }) => {
  if (!locals.isLoggedIn && locals.user !== null) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  const body = await request.formData();
  const content = body.get('post') as string;
  const attachments: Array<string> = []; // TODO: get attachments

  if (content && content.trim() == '') {
    return new Response(JSON.stringify({ message: 'your post has to have text!' }), { status: 400 })
  }


  if (locals.user) {
    const newPost = await prisma.post.create({
      data: {
        userId: locals.user.id,
        content: content,
        attachments: attachments
      }
    });
    return new Response(JSON.stringify({ message: 'New post created', post: newPost }), { status: 201 });
  } else {
    return new Response(JSON.stringify({ message: 'Something went wrong... try again' }), { status: 400 });
  }
}