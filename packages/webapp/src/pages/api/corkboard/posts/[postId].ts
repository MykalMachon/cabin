import type { APIRoute } from "astro";

export const get: APIRoute = async ({ request, params, locals }) => {
  if (!locals.isLoggedIn) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  // parse data 
  const postId = params.postId;

  return new Response(JSON.stringify({ id: postId }))
}

export const put: APIRoute = async ({ request, params, locals }) => {
  if (!locals.isLoggedIn) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  // parse data 
  const postId = params.postId;
  const userId = locals.user?.id;

  // lookup item in the database from this user with this ID

  // update this post int he database from this user with this ID

  return new Response(JSON.stringify({}));
}

export const del: APIRoute = async ({ request, params, locals }) => {
  if (!locals.isLoggedIn) {
    return new Response(JSON.stringify({ message: 'not logged in' }), { status: 401 });
  }

  // parse data 
  const postId = params.postId;

  // lookup item in the database from this user with this ID

  // delete post in the database if they created the post 

  return new Response(JSON.stringify({}));
}