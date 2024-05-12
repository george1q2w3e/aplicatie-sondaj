import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const response = await fetch("http://127.0.0.1:3050/api/survey/");
    const data = await response.json();
    
    // Check if data is null
    if (!data) {
        const empty_array: string[] = [];

        return new Response(
            JSON.stringify(empty_array),
            { status: 404 }
        );
    }

    return new Response(
        JSON.stringify(data),
        { status: 200 }
    );
};