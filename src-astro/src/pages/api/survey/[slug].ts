import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ params }) => {
    const { slug } = params;

    const response = await fetch("http://127.0.0.1:3050/api/survey/" + slug, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        return new Response(
            JSON.stringify("Error deleting survey"),
            { status: 500 }
        );
    }

    return new Response(
        JSON.stringify("Deleted!"),
        { status: 200 }
    );
};