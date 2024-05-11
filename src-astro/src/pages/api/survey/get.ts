import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const response = await fetch("http://127.0.0.1:3050/api/survey/");
    const data = await response.json();

    return new Response(
        JSON.stringify(data),
        { status: 200 }
    );
};