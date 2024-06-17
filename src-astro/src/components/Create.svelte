<script>
    // import the Astro Prop "authorised"
    const { authorised } = $$props;
</script>

{#if authorised}
    <h2>📝 Crează un sondaj</h2>
    <div class="interact">
        <textarea
            class="input survey_description"
            placeholder="Descriere"
            rows="4"
            cols="40"
            style="resize: none;"
        ></textarea>
    </div>
    <div class="interact">
        <textarea
            class="input survey_name"
            placeholder="Nume"
            rows="1"
            cols="40"
            style="resize: none;"
        ></textarea>
        <button type="button" class="create_survey">Crează</button>
        <p class="text-sm pl-2">
            <a href="/suggestions">Vezi Sugestii</a>
        </p>
    </div>
    <script>
        document
            .querySelector(".create_survey")
            .addEventListener("click", () => {
                const name = document.querySelector(".survey_name").value;
                const description = document.querySelector(
                    ".survey_description"
                ).value;

                // Check if the name or description is empty
                if (name === "" || description === "") {
                    alert("Te rog completează numele și descrierea");
                    return;
                }
                if (name.length > 100) {
                    alert("Name is too long");
                    return;
                }

                const body = {
                    name: name,
                    description: description,
                };

                document.querySelector(".loading").style.display = "flex";

                // Make a POST request to the server to create a new survey
                const url = "http://localhost:4321/api/survey/make/";

                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        // Remove input from the textarea
                        document.querySelector(".survey_name").value = "";
                        document.querySelector(".survey_description").value =
                            "";

                        // Send the user to the edit page
                        window.location.href = `/survey/edit/${data}`;
                    })
                    .catch((error) => {
                        // Hide the loading screen
                        document.querySelector(".loading").style.display =
                            "none";
                        console.error("Error:", error);
                    });
            });
    </script>
{/if}
{#if !authorised}
    <h2>💡 Sugerează un sondaj</h2>
    <div class="interact">
        <textarea
            class="input suggestion_survey_description"
            placeholder="Descriere"
            rows="4"
            cols="40"
            style="resize: none;"
        ></textarea>
    </div>
    <div class="interact">
        <textarea
            class="input suggestion_survey_name"
            placeholder="Nume"
            rows="1"
            cols="40"
            style="resize: none;"
        ></textarea>
        <button type="button" class="create_suggestion_survey">Sugerează</button
        >
    </div>
    <script>
        document
            .querySelector(".create_suggestion_survey")
            .addEventListener("click", () => {
                document.querySelector(".loading").style.display = "flex";

                const name = document.querySelector(
                    ".suggestion_survey_name"
                ).value;
                const description = document.querySelector(
                    ".suggestion_survey_description"
                ).value;

                // Check if the name or description is empty
                if (name === "" || description === "") {
                    alert("Please fill in the name and description");
                    return;
                }
                if (name.length > 100) {
                    alert("Name is too long");
                    return;
                }

                const json = {
                    name: name,
                    description: description,
                };

                const url = "/api/suggestion/make/";

                fetch(url, {
                    method: "POST",
                    body: JSON.stringify(json),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        // Remove input from the textarea
                        document.querySelector(
                            ".suggestion_survey_name"
                        ).value = "";
                        document.querySelector(
                            ".suggestion_survey_description"
                        ).value = "";
                        document.querySelector(".loading").style.display =
                            "none";
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            });
    </script>
{/if}
<hr class="mx-[-50px]" />
