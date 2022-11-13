
<script>
  import { onMount } from 'svelte';
  import { Day } from './day';
	import { tasks as taskStore, removeTask, addTask 
	} from '$lib/stores';

	import { lookupColor } from '$lib/palette';
	
	let tasks = [];
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const curDayIndex = new Date().getDay();
	const weekDay = weekDays[curDayIndex];
	const prepTime = 0.5;
	// const totalPrintTime = tasks.map(t=>t.hours).reduce((acc,next) => acc+next ,0);
	const pxPerHour = 30;

	let newTask = undefined;
	let curTask = undefined;
	let plannedDays = [];

	function allocateTasks() {
		plannedDays = [];
		for (const task of tasks) {
			
			let day = findDay(task);
			if (!day) {
				day = new Day(8);
				plannedDays.push(day);
				plannedDays = plannedDays;
			}
			allocate(task, day);
		}
	}

	function allocate(task, day) {
		// console.log('allocating', task, day)
		const i = tasks.findIndex(t=>t === task);
		if (i == -1) throw new Error('cannot find task')
		task.prepTime = task.prepTime ?? prepTime;
		day.add(task);
	}

	function findDay(task) {
		for(const day of plannedDays) {
			// console.log('for task' , task, ' considering day', day);
			if (day.timeLeft >= (task.prepTime ?? prepTime) + task.hours) { // TODO: put preptime centrally 
				return day;
			}
		}
		return undefined;
	}

	function getWeekDay(index) {
		return weekDays [(curDayIndex + index) % 7];
	}

	function showCreateTaskDialog() {
		newTask = {
			title: '',
			hours: 1,
			cssColors : 'red'
		};
	}

	function closeCreateTaskDialog() {
		newTask = undefined;
	}

	function createTask() {
		addTask(newTask);
		newTask = undefined;
	}

	function handleKeydown(evt) {
		// console.log(evt);
		if (evt.key == 'd') {
			handleDelete();
		}

		if (evt.key == 'Escape' && newTask) {
			closeCreateTaskDialog()
		}
	}

	function handleDelete() {
		if (curTask) {
			removeTask(curTask)
			// console.log(curTask, tasks)
			
				// allocateTasks();
		}
	}

	onMount(() => {
		// TODO: remove in onDestroy?
		document.addEventListener('keydown', handleKeydown);
	});

	$: { 
		tasks = $taskStore;
		console.log(tasks)
		if (tasks)
			allocateTasks(); 
	}
</script>

<svelte:head>
	<title>Print Queue</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<div class="text-column">
	
	<button class="new-task" on:click={showCreateTaskDialog}>new task</button>
	
	{#if newTask}
		<div class="glasspane" on:click={closeCreateTaskDialog} />
		<div class="dialog">
			<h3>Create new print task</h3>
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
			<button on:click={createTask}>create task</button>
		</div>
	{/if}

	<main>
		{#each plannedDays as curDay, dayIndex}
			<div class="day-box">
			<header>{getWeekDay(dayIndex)} </header>
			<div class="day" style="height: {pxPerHour * 8}px;">

				{#each curDay.tasks as task}
					<div class="task" class:hover={task == curTask} 
						on:mouseenter={e=>curTask = task}
						on:mouseleave={e=>curTask = undefined}
						style="background-color: {lookupColor(task.cssColor)}; 
						height: {task.hours*pxPerHour}px;
						margin-top: {prepTime*pxPerHour}px">
						{task.title}
						<!-- time: {task.hours}h  -->
						</div>
				{/each}
			</div>
				<div class="footer">
				{curDay.allocatedTime}h of print time 
				<!-- {#if curDay.timeLeft}
					{curDay.timeLeft}h unused
				{/if} -->
				</div>
			</div>
		{/each}
	</main>

</div>

<style>
button.new-task {
	margin-bottom: 60px;
	max-width: 170px;
}

.glasspane {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top:0;
	left:0;
	background-color: rgba(0,0,0,0.5);
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

.task {
	/* border-radius: 10px; */
	/* border: 3px solid dimgrey; */
	box-sizing: border-box;
	overflow: hidden;
	padding: 5px 0;
	/* filter: brightness(250%) grayscale(30%); */
	text-align:center;
	color: white;
	font-size: 90%;
}

.task.hover {
	filter: brightness(150%);
}

.day-box {
	margin-bottom: 40px;
	margin-right: 20px;
	width: 270px;
}

.day {
	xoverflow: hidden;
	background-color: #D9D9D9;
	display: flex;
	flex-direction: column;
	/* outline: 1px solid black; */
	/* padding: 10px; */
	margin: 20px 0
}

main {
	display: flex;
	flex-direction: row;
}
.footer {
	font-size: 90%;
	color: grey;
	text-align: center;
}
header {
	font-weight: bold;
	text-align: center;
}
</style>