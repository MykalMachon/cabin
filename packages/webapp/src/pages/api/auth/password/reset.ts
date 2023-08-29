import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, cookies }) => {
  return new Response(JSON.stringify({ message: 'this is a stub right now' }), { status: 418 });

  // get the reset token from the request body 
  // get the new password from the request body 
  // validate both the token and the password

  // if the token is invalid, return error

  // if the password is invalid, return error

  // if the token is valid, update the user's password
  // redirect the user to the login page
}