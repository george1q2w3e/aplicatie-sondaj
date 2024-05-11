import type { APIRoute } from "astro";
import { TOKEN } from "../../constants";

export const POST: APIRoute = async () => {
    try {
		// clearCookie
		const headers = new Headers();
		headers.append("set-cookie", `${TOKEN}=; path=/; Max-Age=0`);

        // Return a success response
        return new Response(
            JSON.stringify({
                message: "You're logged out!",
            }),
            {
                status: 200,
				headers, // Use the custom headers
            }
        );
    } catch (error) {
        console.debug(error);

        return new Response(
            JSON.stringify({
                message: "Logout failed",
            }),
            {
                status: 500,
            }
        );
    }
};
