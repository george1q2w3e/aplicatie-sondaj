import { SignJWT } from "jose";
import type { APIRoute } from "astro";
import { TOKEN } from "../../constants";

// Add the secret key to the middleware from .env file
const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

export const POST: APIRoute = async ({request}) => {
    try {
        // Get the username and password from the request body
        const { user, password } = await request.json();

        // Check if the username and password are correct
        if (user !== "admin" || password !== "123") {
            return new Response( JSON.stringify({ message: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Generate a JWT token
        const token = await new SignJWT({
            username: user,
            password: password,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2h")
            .sign(secret); // Use the Uint8Array secret

        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 2, // 2 hours in seconds
        };

        // Construct the response body
        const responseBody = {
            message: "You're logged in!",
        };

        // Create custom headers
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set(
            "Set-Cookie",
            `${TOKEN}=${token}; ${Object.entries(cookieOptions)
                .map(([key, value]) => `${key}=${value}`)
                .join("; ")}`
        );

        // Return a success response
        return new Response(JSON.stringify(responseBody), {
            status: 200,
            headers, // Use the custom headers
        });
    } catch (error) {
        console.debug(error);

        // Return an error response
        return new Response(
            JSON.stringify({
                message: "Login failed",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
};
