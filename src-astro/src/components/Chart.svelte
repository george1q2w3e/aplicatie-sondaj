<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    // import the Astro Prop "givenId"
    const { answers, givenId } = $$props;

    export let dataArray = answers;

    let elementCounts;
    let chartData;
    let ctx;

    onMount(async () => {
        // Function to count element occurrences
        function countOccurrences(arr) {
            const counts = {};
            for (const element of arr) {
                if (counts[element]) {
                    counts[element]++;
                } else {
                    counts[element] = 1;
                }
            }
            return counts;
        }

        // Get element counts
        elementCounts = countOccurrences(dataArray);

        // Calculate total elements
        const totalElements = dataArray.length;

        // Prepare data for Chart.js
        chartData = {
            labels: Object.keys(elementCounts), // Extract labels (unique elements)
            datasets: [
                {
                    data: Object.values(elementCounts).map(
                        (count) =>
                            // Round to nearest .5
                            Math.round((count / totalElements) * 100 * 2) / 2
                    ), // Calculate percentages and round to .5
                    backgroundColor: [
                        // Example colors, customize as needed
                        "hsl(256, 80%, 70%)",
                        "hsl(240, 80%, 70%)",
                        "hsl(208, 80%, 70%)",
                        "hsl(112, 80%, 70%)",
                        "hsl(70, 100%, 70%)",
                        "hsl(48, 80%, 70%)",
                        "hsl(16, 80%, 70%)",
                        "hsl(0, 80%, 70%)",
                    ],
                },
            ],
        };

        ctx = document.getElementById(givenId).getContext("2d");

        if (!ctx) {
            throw new Error("Could not get the canvas context");
        }

        new Chart(ctx, {
            type: "pie",
            data: chartData,
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (
                                    context.label + ": " + context.parsed + "%"
                                );
                            },
                        },
                    },
                },
            },
        });
    });

</script>

{#if answers == null}
    <br>
{/if}
{#if answers}
    <div class="chart-container" style="position: relative; height:40vh;">
        <canvas id={givenId}></canvas>
    </div>
{/if}



