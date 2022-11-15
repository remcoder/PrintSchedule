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
  <tr>
    <th>hours</th>
    <th>title</th>
    <th colspan="3">action</th>
  </tr>
  {#each $tasks as task, index}
    <tr >
      <td class="hours">{task.hours}</td>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <td class="title" style="background-color: {lookupColor(task.cssColor)};" on:click={() => dialog.showEditTaskDialog(task)}>{task.title}</td>
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
  th {
    text-align: left;
    /* font-weight: normal; */
    xtext-decoration: underline;
  }
  td {
    border-radius: 5px;
    border: 1px solid grey;
  }
  td.title {
    padding: 5px;
    color: #eee;
    background-color: inherit;
    border: 0;
  }

  td:hover {
    filter: brightness(150%);
  }
  .action {
    text-align: center;
    width: 24px;
  }
  .hours {
    padding: 5px;
    width: 50px
  }

  .button-delete {
    text-align: center;
    xbackground-color: gray;
  }
</style>
