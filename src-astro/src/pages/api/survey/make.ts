import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    const response = await fetch("http://127.0.0.1:3050/api/survey/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
};
