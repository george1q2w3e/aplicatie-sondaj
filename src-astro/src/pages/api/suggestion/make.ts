import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();

    const response = await fetch("http://127.0.0.1:3050/api/suggestion/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        return new Response(
            JSON.stringify("Error adding response"),
            { status: 500 }
        );
    }

    return new Response(
        JSON.stringify("Response Added!"),
        { status: 200 }
    );
};
