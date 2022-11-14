<script lang=ts>
  import { tasks, removeTask } from '$lib/stores';
  import { lookupColor } from '$lib/palette';
  import TaskDialog from '$lib/TaskDialog.svelte';

  let dialog : TaskDialog;
</script>

<svelte:head>
	<title>Print Tasks</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<h1>Tasks</h1>

<TaskDialog bind:this={dialog} />

<table>
  {#each $tasks as task}
    <tr style="background-color: {lookupColor(task.cssColor)};">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => dialog.showEditTaskDialog(task)}>{task.title}</td>
      <td>{task.hours}</td>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => removeTask(task)} class="button-delete">X</td>
    </tr>
  {/each}
</table>

<style>
  td {
    padding: 5px;
    color: #eee;
    background-color: inherit;
  }

  td:hover {
    filter: brightness(150%);
  }

  .button-delete {
    width: 24px;
    text-align: center;
    background-color: gray;
  }
</style>