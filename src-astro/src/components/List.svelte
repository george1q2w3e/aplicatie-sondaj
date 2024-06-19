<script>
    const { answers, group } = $$props;

    export let dataArray;

    if (!group) {
        dataArray = answers.map((obj) => obj.answer);
    } else {
        dataArray = answers
            .filter((obj) => obj.group === group)
            .map((obj) => obj.answer);
    }
</script>

{#if dataArray == ""}
    <br />
{/if}
{#if dataArray != ""}
    <div class="response_box">
        <ul class="pl-8" style="list-style-type:disc !important;">
            {#each dataArray as answer}
                <li
                    class="list-group-item list-group-item-action list-group-item-light"
                >
                    {answer}
                </li>
            {/each}
        </ul>
    </div>
{/if}
