<script>
  import { tasks } from '$lib/stores';
  import { lookupColor } from '$lib/palette';
</script>

<svelte:head>
	<title>Print Tasks</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<h1>Tasks</h1>
<table>
  {#each $tasks as task}
    <tr
    style="background-color: {lookupColor(task.cssColor)};">
      <td>{task.title}</td>
      <td>{task.hours}</td>
    </tr>
  {/each}
</table>

<style>
  td {
    padding: 5px;
    color: #eee;
  }
</style>