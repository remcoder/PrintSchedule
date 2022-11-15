<script lang=ts>
  import { onMount } from 'svelte';
  import { addTask, updateTask } from '$lib/stores';
	import type { Task } from './task';
  	let newTask : Task | undefined;
	let editTask : Task | undefined;

	function showCreateTaskDialog() {
		newTask = {
			title: '',
			hours: 1,
			cssColor : 'red'
		};
	}

	function closeCreateTaskDialog() {
		newTask = undefined;
		editTask = undefined;
	}

	function createTask() {
		addTask(newTask as Task);
		newTask = undefined;
	}

  export function showEditTaskDialog(task: Task) {
		console.log('editing', task);
		
		editTask = newTask = task;
	}

	function saveTask() {
		updateTask(editTask as Task, newTask as Task);
		editTask = undefined;
		newTask = undefined;
	}

  function handleKeydown(evt: KeyboardEvent) {
		
		if (evt.key == 'Escape' && newTask) {
			closeCreateTaskDialog()
		}
	}

	onMount(() => {
		// TODO: remove in onDestroy?
		document.addEventListener('keydown', handleKeydown);
	});
</script>

<button class="new-task" on:click={showCreateTaskDialog}>+ new task</button>
	
{#if newTask}
  <div class="glasspane" on:click={closeCreateTaskDialog} />
  <div class="dialog">
    <h3>{ editTask? 'Edit' : 'Create new'} print task</h3>
    <div>
      <label>title</label><input autofocus type=text bind:value={newTask.title} />
    </div>
    <div>
      <label>hours</label><input type=number bind:value={newTask.hours} min=0 step=0.5 />
    </div>
    <div>
      <label>color</label>
        <select bind:value={newTask.cssColor}>
          {#each ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown', 'black', 'white', 'grey'] as color}
            <option >{color}</option>
          {/each}
        </select>
    </div>

    <button on:click={closeCreateTaskDialog}>cancel</button>
    {#if editTask}
      <button on:click={saveTask}>save task</button>
    {:else}
      <button on:click={createTask}>create task</button>
    {/if}
  </div>
{/if}

<style>
button.new-task {
	margin-bottom: 60px;
	max-width: 170px;
	background-color: #d290df;
	border: 0;
	padding: 8px;
	border-radius: 20px;
	color: white;
	transition: transform 0.3s;
}

@keyframes hue-rotate {
  from {filter: hue-rotate(0deg)}
  to {filter: hue-rotate(360deg)}
}

button.new-task:hover {
	transform: scale(1.1, 1.1) rotatez(-2deg);
}

.glasspane {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top:0;
	left:0;
	background-color: rgba(0,0,0,0.5);
	z-index: 9999;
}
.dialog {
	z-index: 1;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%,-50%,0);
	background-color: lightgrey;
	padding: 20px;

	text-align: center;
	z-index: 9999;
}

.dialog label {
	display: inline-block;
	width: 40%;
	text-align:left;
}

.dialog select, .dialog input {
	display: inline-block;
	width: 40%;
}
</style>