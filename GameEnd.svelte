<script>
    export let score = 0;
    let initials;
    let highscores = JSON.parse(localStorage.getItem('dontlookback_highscores') || '{}');

    $: localStorage.setItem('dontlookback_highscores', JSON.stringify(highscores));

    function save() {
        highscores[initials] = score;
    }
</script>
<style>
    div {
        text-align: center;
    }
    table {
        width: 50%;
        margin: auto;
        border: 1px solid white;
        border-radius: 3px;
        margin-top: 3px;
    }
</style>
<div>
    <h1>Your Score</h1>
    {score}
    <h1>Initials</h1>
    <input type="text" bind:value={initials}>
    <button on:click={save}>Save</button>
    <p>Press Cmd+R to restart.</p>
    <table>
        <tr>
            <th>Name</th>
            <th>Score</th>
        </tr>
        {#each Object.keys(highscores).sort().reverse() as name}
            <tr>
                <td>{name}</td>
                <td>{highscores[name]}</td>
            </tr>
        {/each}
    </table>
</div>