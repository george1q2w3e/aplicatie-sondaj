<script lang="ts">
    // Import the Astro Prop "givenId"
    const { surveys, authorised } = $$props;
    export let dataArray = surveys;
    const status = authorised ? true : (false as boolean);
</script>

<ul class="pt-5" style="list-style-type: none;">
    {#each dataArray as survey}
        <li class="question">
            {#if status}
                <button type="button" class="icon close-icon remove_survey">
                    <img src="/remove_box.svg" alt="Remove Survey" />
                </button>
            {/if}
            <h2 id={survey.survey_id}>
                <a href={`/survey/${survey.survey_id}`}>
                    {survey.survey_name}
                </a>
                <p class="text-sm text-gray-500 font-medium">
                    {survey.description}
                </p>
            </h2>
            {#if status}
                <div class="flex gap-3">
                    <a href={`/survey/edit/${survey.survey_id}`}>
                        <img src="/edit.svg" alt="Edit" class="edit-icon w-5" />
                    </a>
                    <p class="m-0 font-medium text-sm">
                        <a href={`/survey/responses/${survey.survey_id}`}>
                            Vezi Rezultate
                        </a>
                    </p>
                </div>
            {/if}
        </li>
    {/each}
    <script>
        const remove_survey_buttons =
            document.querySelectorAll(".remove_survey");
        remove_survey_buttons.forEach(async function (button) {
            button.addEventListener("click", (event) => {
                const button = event.target.closest("button");
                if (button) {
                    // Do something with the parent element
                    const div = button.parentNode;
                    const h2 = div.querySelector("h2");
                    const id = h2.id;

                    const url = `/api/survey/${id}`;

                    fetch(url, {
                        method: "DELETE",
                    })
                        // Check if the response is OK
                        .then((response) => {
                            if (response.ok) {
                                // Remove the parent element
                                div.remove();
                            }
                        });
                }
            });
        });
    </script>
</ul>
