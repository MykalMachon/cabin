import { prisma } from '@services/database';
import { hashPassword } from '@utils/crypto';
import { passwordValidations, validatePassword } from '@utils/passwords';
import type { APIRoute } from 'astro';

export const post: APIRoute = async ({ request, cookies }) => {
  // get the reset token from the request body 
  const data = await request.formData();
  const resetToken = data.get('token') as string | undefined;
  const newPassword = data.get('password') as string | undefined;

  // if email or password is missing, return error
  if (!resetToken || !newPassword) {
    return new Response(JSON.stringify({ message: "request is invalid. Try again." }), {
      status: 400
    })
  }

  // validate the token is still valid 
  const pwReset = await prisma.passwordResetToken.findFirst({
    select: {
      expiresAt: true,
      token: true,
      userId: true,
    },
    where: {
      token: resetToken,
      expiresAt: {
        gt: new Date(),
      }
    }
  });

  // if the token is invalid, return error
  if (!pwReset || resetToken != pwReset.token) {
    return new Response(JSON.stringify({ message: "your password reset request is expired or invalid" }), {
      status: 404,
    });
  }

  // ensure the password is strong enough 
  if (validatePassword(newPassword, passwordValidations).errors.length > 0) {
    return new Response(JSON.stringify({ message: "password is not strong enough" }), {
      status: 400,
    })
  }

  // hash the users password
  const hashedPassword = hashPassword(newPassword);

  // update the user's password
  await prisma.user.update({
    where: {
      id: pwReset.userId,
    },
    data: {
      password: hashedPassword,
    }
  })

  // delete the password reset token
  await prisma.passwordResetToken.delete({
    where: {
      token: resetToken,
    }
  })

  // return success
  return new Response(JSON.stringify({ message: "password reset successfully" }), {
    status: 200,
  });
}