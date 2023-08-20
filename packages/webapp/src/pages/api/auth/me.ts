import type { APIRoute } from "astro";
import { getUserByRequest } from '@utils/user';

export const get: APIRoute = async ({ request }) => {
    const user = await getUserByRequest(request);

    if(!user){
        return new Response(JSON.stringify({message: 'not logged in'}), {status: 401});
    }

    return new Response(JSON.stringify(user || {}));
}