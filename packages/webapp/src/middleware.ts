import { getUserByRequest } from "@utils/user";
import { defineMiddleware } from "astro/middleware";

const checkIfProtectedRoute = (url: URL): boolean => {
  // the only routes that should not be protected are 
  const unprotectedRoutes = [
    '/login',
    '/logout',
    '/signup',
    '/password/forgot',
    '/password/reset',
    '/api'
  ]
  const isProtectedRoute = unprotectedRoutes.every((route) => !url.pathname.startsWith(route));
  return isProtectedRoute;
};

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({ locals, request, redirect, url }, next) => {
  // determine if there is a valid session, and if this is a protected route. 
  const user = await getUserByRequest(request);
  const isProtectedRoute = checkIfProtectedRoute(url);

  // if no session and this is a protected route, redirect to /login 
  if (!user && isProtectedRoute) {
    return redirect('/login', 307);
  }

  // populate locals with user and isLoggedIn
  locals.user = user;
  locals.isLoggedIn = user != null;
  
  return next();
});