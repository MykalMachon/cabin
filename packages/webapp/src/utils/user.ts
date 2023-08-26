import { prisma } from "./database";

/**
 * looks at the request from the browser, validates the session,
 * and returns the user if it's found.
 * 
 * @param request the request from the browser
 * @returns {Promise<User | null>} The user if found, otherwise null
 */
export const getUserByRequest = async (request: Request) => {
  // get the session cookie from the request
  const cookies = request.headers.get('cookie');
  const sessionId = cookies?.split(';').find((cookie: string) => cookie.trim().startsWith('session='))?.split('=')[1];
  
  // if session cookie is missing, return null
  if(!sessionId) return null;

  // get the session and corresponding user from the database
  const sessionAndUser = await prisma.session.findFirst({
    where: { id: sessionId },
    select: {
      id: true,
      user: {
        select: {
          id: true, 
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          roles: true,
        }
      }
    }
  });

  // if session is missing, return null
  if(!sessionAndUser) return null;

  // return the user
  return sessionAndUser.user;
};

export const getUserBySession = async (sessionId: string) => {

};