
<script>
  import { onMount } from 'svelte';
  import { Day } from './day';
	import { tasks as taskStore, removeTask, addTask, updateTask } from '$lib/stores';

	import TaskDialog from '$lib/TaskDialog.svelte';
	import { lookupColor } from '$lib/palette';
	
	let dialog ;
	let tasks = [];
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const curDayIndex = new Date().getDay();
	const weekDay = weekDays[curDayIndex];
	const prepTime = 0.5;
	const minDays = 5;
	const dayLength = 12;
	const skippedDays = [];
	// const totalPrintTime = tasks.map(t=>t.hours).reduce((acc,next) => acc+next ,0);
	const pxPerHour = 30;

	
	let curTask = undefined;
	let plannedDays = [];

	function allocateTasks() {
		plannedDays = [];
		for (const task of tasks) {
			
			let day = findDay(task);
			if (!day) {
				day = new Day(dayLength);
				plannedDays.push(day);
				
			}
			allocate(task, day);
		}

		// console.log('planned', plannedDays.length);
		while (plannedDays.length < minDays) {
			plannedDays.push(new Day(dayLength));
		}

		plannedDays = plannedDays;
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
		// console.log(tasks);
		if (tasks)
			allocateTasks(); 
	}
</script>

<svelte:head>
	<title>Print Schedule</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<div class="text-column">
	<h1>Schedule</h1>
	
	<TaskDialog bind:this={dialog} />

	<main>
		{#each plannedDays as curDay, dayIndex}
			<div class="day-box">
			<header>{getWeekDay(dayIndex)} </header>
			<div class="day" style="height: {pxPerHour * dayLength}px;">

				{#each curDay.tasks as task, taskIndex}
					<div class="task" class:hover={task == curTask} 
						on:mouseenter={e=>curTask = task}
						on:mouseleave={e=>curTask = undefined}
						on:click={ e=> dialog.showEditTaskDialog(curTask, dayIndex, taskIndex)}
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

.task {
	/* border-radius: 10px; */
	/* border: 3px solid dimgrey; */
	box-sizing: border-box;
	overflow: hidden;
	padding: 5px 0;
	/* filter: brightness(250%) grayscale(30%); */
	text-align:center;
	color: #eee;
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