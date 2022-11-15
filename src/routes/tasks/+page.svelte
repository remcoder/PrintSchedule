<script lang=ts>
  import { tasks, removeTask, updateTasks } from '$lib/stores';
  import { lookupColor } from '$lib/palette';
  import TaskDialog from '$lib/TaskDialog.svelte';
	import type { Task } from '$lib/task';
	import { get } from 'svelte/store';

  let dialog : TaskDialog;

  function moveTask(task: Task, step : -1 | 1) {
    const taskIndex = $tasks.findIndex(t=>t === task);
    const newIndex = taskIndex + step;
    if (newIndex < 0 || newIndex == $tasks.length) {
      throw new Error ('Index out of bounds');
    }
    
    updateTasks(tasks => { 
        // moving left: -1
        // # # x
        // # x #

        // moving right +1
        // x # #
        // # x #
      tasks.splice(taskIndex, 1);
      tasks.splice(newIndex, 0, task);
      return tasks
    });

    console.log('moving task', taskIndex)
  }
</script>

<svelte:head>
	<title>Print Tasks</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<h1>Tasks</h1>

<TaskDialog bind:this={dialog} />

<table>
  {#each $tasks as task, index}
    <tr style="background-color: {lookupColor(task.cssColor)};">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => dialog.showEditTaskDialog(task)}>{task.title}</td>
      <td>{task.hours}</td>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => (index > 0) && moveTask(task, -1)} class="action">▲</td>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => (index < $tasks.length-1) && moveTask(task, 1)} class="action">▼</td>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td on:click={() => removeTask(task)} class="action button-delete">X</td>
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
  .action {
    text-align: center;
    width: 24px;
  }

  .button-delete {
    text-align: center;
    background-color: gray;
  }
</style>
