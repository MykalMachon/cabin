import type { APIRoute } from 'astro';
import { prisma } from '@services/database';
import { emailQueue } from '@services/queue';

export const post: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string | undefined;

    // if there is no email, return a transparent message "if you have a valid email, you'll get an email with further instructions"
    if (!email) {
      return new Response(JSON.stringify({ message: 'please include a valid email' }), { status: 400 });
    }

    // validate that the email is valid and belongs to an actual user 
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    // if the email is invalid, return a transparent message "if you have a valid email, you'll get an email with further instructions"
    if (user) {
      // if the email is valid, create a reset token for the user
      console.log(`creating a reset token for ${email} and enqueuing an email task`);

      // create a reset token for the user
      const newResetToken = await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
        }
      });

      // kick off a background job (to the workers!) to send the email to the user
      emailQueue.add('send-password-reset-email', { email: email, passwordResetTokenId: newResetToken.id });
    } else {
      console.log(`someone tried to reset the password for ${email} but a user with that email doesn't exist in the database`);
    }
    // return a transparent message "if you have a valid email, you'll get an email with further instructions"
    return new Response(JSON.stringify({ message: 'if you have a valid email, you\'ll get an email with further instructions' }), { status: 200 });
  } catch (err) {
    // check if the error is because of the wrong format 
    if (err instanceof TypeError) {
      return new Response(JSON.stringify({ message: 'please send data as form data' }), { status: 400 });
    }

    // check if error is otherwise and return a 500 error
    return new Response(JSON.stringify({ message: 'something went wrong' }), { status: 500 });
  }
}