import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ params }) => {
    const { slug } = params;

    const response = await fetch(
        "http://127.0.0.1:3050/api/survey/question/" + slug,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify("Error deleting question"), {
            status: 500,
        });
    }

    return new Response(JSON.stringify("Response Added!"), { status: 200 });
};

export const POST: APIRoute = async ({ params, request }) => {
    const body = await request.json();
    const { slug } = params;

    const response = await fetch(
        "http://127.0.0.1:3050/api/survey/question/" + slug,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        return new Response(JSON.stringify("Error adding question"), {
            status: 500,
        });
    }

    return new Response(JSON.stringify("Response Added!"), { status: 200 });
};
