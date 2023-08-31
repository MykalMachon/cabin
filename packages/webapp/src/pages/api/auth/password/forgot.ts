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

    if (!user) {
      console.log(`a password reset request was made for ${email} but no user exists with that email.`)
      return new Response(JSON.stringify({ message: 'if you have a valid email, you\'ll get an email with further instructions' }), { status: 200 });
    }

    // ensure there isn't already a valid reset token for this user
    const existingResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user?.id,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (existingResetToken) {
      console.log(`a password reset token already exists for this user: ${existingResetToken.token}`);
    }

    if (user && !existingResetToken) {
      console.log(`creating a reset token for ${email} and enqueuing an email task`);
      const newResetToken = await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
        }
      });
      emailQueue.add('send-password-reset-email', { email: email, resetToken: newResetToken.token });
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