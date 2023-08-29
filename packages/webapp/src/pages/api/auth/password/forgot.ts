import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, cookies }) => {
  return new Response(JSON.stringify({ message: 'this is a stub right now' }), { status: 418 });

  // get the email from the request body

  // validate that the email is valid and belongs to an actual user 

  // if the email is invalid, return a transparent message "if you have a valid email, you'll get an email with further instructions"

  // if the email is valid, create a reset token for the user
  // kick off a background job (to the workers!) to send the email to the user

  // return a transparent message "if you have a valid email, you'll get an email with further instructions"
}