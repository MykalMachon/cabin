import { getUserByRequest } from "@utils/user";
import { defineMiddleware } from "astro/middleware";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({locals, request}, next) => {
  const user = await getUserByRequest(request);
  
  locals.user = user;
  locals.isLoggedIn = user != null;
  
  const response = await next();
  return response;
});