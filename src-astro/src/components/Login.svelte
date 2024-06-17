<script lang="ts">
    // import the Astro Prop "authorised"
    const { authorised } = $$props;

    const status = authorised ? "Logout" : ("Login" as string);
</script>

{#if authorised}
    <button class="status log-out">🔒 {status}</button>
    <script>
        const clear_button = document.querySelector(".log-out");

        clear_button?.addEventListener("click", () => {
            fetch("/api/logout/", { method: "POST" })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Not OK!");
                    }
                    // Send to the home page
                    location.href = "/";
                })
                .catch((error) => {
                    console.warn("Fetch call failed");
                    console.error(error);
                });
        });
    </script>
{/if}
{#if !authorised}
    <a href="/login"><p class="status">🔒 {status}</p></a>
{/if}
