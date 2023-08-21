import crypto from 'crypto';

const salt = import.meta.env.AUTH_SECRET;

export const hashPassword = (password: string) => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  const hashedPassword = hash.digest('hex');
  return hashedPassword;
}

export const comparePasswords = (password: string, hashedPassword: string) => {
  const hashedPass = hashPassword(password);
  return hashedPass === hashedPassword;
};