import type { Job, Processor } from "bullmq";
import sgMail from '@sendgrid/mail';

// initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const emailQueueProcessor: Processor = async (job: Job) => {
  console.log('sending email...')

  // TODO: clean this up to use templates and stuff 
  switch (job.name) {
    case 'password_reset': {
      const { email, resetToken } = job.data;
      const msg = {
        to: email,
        from: 'noreply@gregorycabin.ca',
        subject: 'Password Reset',
        text: `Someone requested to reset your password for the cabin app. 
        You can reset the password here: ${process.env.DOMAIN_PROTOCOL}://${process.env.DOMAIN}/password/reset/${resetToken}`,
        html: `<p>Someone requested to reset your password for the cabin app.</p>
        <p><a href="${process.env.DOMAIN_PROTOCOL}://${process.env.DOMAIN}/password/reset/${resetToken}">Click here to reset your password</a></p>`,
      }

      await sgMail.send(msg);
      console.log('email sent successfully')

      return;
    }
    default: {
      console.log('no email type specified')
    }
  }
}