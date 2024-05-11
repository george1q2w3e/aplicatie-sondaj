import { errors, jwtVerify } from "jose";
import { defineMiddleware } from "astro/middleware";
import { TOKEN, PUBLIC_ROUTES } from "./constants";

// Add the secret key to the middleware from .env file
const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

const verifyAuth = async (token?: string) => {
    if (!token) {
        return {
            status: "unauthorized",
            msg: "please pass a request token",
        } as const;
    }

    try {
        const jwtVerifyResult = await jwtVerify(token, secret);
        return {
            status: "authorized",
            payload: jwtVerifyResult.payload,
            msg: "successfully verified auth token",
        } as const;
    } catch (err) {
        if (err instanceof errors.JOSEError) {
            return { status: "error", msg: err.message } as const;
        }

        console.debug(err);
        return {
            status: "error",
            msg: "could not validate auth token",
        } as const;
    }
};

// Define the onRequest middleware
export const onRequest = defineMiddleware(async (context, next) => {
    const token = context.cookies.get(TOKEN)?.value ?? "";
    const isPublicRoute =
        PUBLIC_ROUTES.includes(context.url.pathname) ||
        context.url.pathname.match(/^\/survey\/(?!edit)/);

    const validationResult = await verifyAuth(token);

    switch (validationResult.status) {
        case "authorized":
            context.locals.authorized = true;
            return next();
        case "error":
            context.locals.authorized = false;
        case "unauthorized":
            context.locals.authorized = false;

            // Ignore redirect for public routes
            if (isPublicRoute) {
                return next();
            }
            if (context.url.pathname.startsWith("/api/")) {
                return new Response(
                    JSON.stringify({ message: validationResult.msg }),
                    {
                        status: 401,
                    }
                );
            } else {
                context.locals.authorized = false;
                return Response.redirect(new URL("/login", context.url));
            }
        default:
            context.locals.authorized = false;
            return Response.redirect(new URL("/login", context.url));
    }
});
