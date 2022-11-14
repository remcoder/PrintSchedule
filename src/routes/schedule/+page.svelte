
<script lang=ts>
	import type { Task } from '$lib/task';
  	import { onMount } from 'svelte';
  	import { Day } from './day';
	import { tasks as taskStore, removeTask } from '$lib/stores';

	import TaskDialog from '$lib/TaskDialog.svelte';
	import { lookupColor } from '$lib/palette';
	
	
	let dialog : TaskDialog;
	let tasks: Task[] = [];
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const curDayIndex = new Date().getDay();
	const weekDay = weekDays[curDayIndex];
	const prepTime = 0.5;
	const minDays = 5;
	const dayLength = 12;
	const hoursPerDay = [...Array(dayLength).keys()];
	const skippedDays = [];
	// const totalPrintTime = tasks.map(t=>t.hours).reduce((acc,next) => acc+next ,0);
	const pxPerHour = 30;

	
	let curTask : Task | undefined;
	let plannedDays : Day[] = [];

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

	function allocate(task : Task, day : Day) {
		// console.log('allocating', task, day)
		const i = tasks.findIndex(t=>t === task);
		if (i == -1) throw new Error('cannot find task')
		task.prepTime = task.prepTime ?? prepTime;
		day.add(task);
	}

	function findDay(task: Task) {
		for(const day of plannedDays) {
			// console.log('for task' , task, ' considering day', day);
			if (day.timeLeft >= (task.prepTime ?? prepTime) + task.hours) { // TODO: put preptime centrally 
				return day;
			}
		}
		return undefined;
	}

	function getWeekDay(index: number) {
		return weekDays [(curDayIndex + index) % 7];
	}

	function handleKeydown(evt: KeyboardEvent) {
		if (evt.key == 'd') {
			handleDelete();
		}
	}

	function handleDelete() {
		if (curTask) {
			removeTask(curTask)
		}
	}


	onMount(() => {
		// TODO: remove in onDestroy?
		document.addEventListener('keydown', handleKeydown);
	});

	$: { 
		tasks = $taskStore;
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
		<!-- <div class="day-box">
			<header>&nbsp;</header>
			<div class="day" style="height: {pxPerHour * dayLength}px; background-color: #f5f5f5; width:20px" >
				{#each hoursPerDay as hour}
					<div class="hour"
					style="height: {pxPerHour}px; top: {hour*pxPerHour}px;">
					{hour+1}
				</div>
				{/each}
			</div>
		</div> -->

		{#each plannedDays as curDay, dayIndex}
			<div class="day-box">
			<header>{getWeekDay(dayIndex)}</header>
			<div class="day" style="height: {pxPerHour * dayLength}px;">

				<div>
					{#each hoursPerDay as hour}
						<div class="hour"
						style="height: {pxPerHour}px; top: {hour*pxPerHour}px;">
						{#if dayIndex == 0}
							<div class="hourNumber">{hour+1}</div>
						{/if}
					</div>
					{/each}
				</div>

				{#each curDay.tasks as task, taskIndex}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="task" class:hover={task == curTask} 
						on:mouseenter={e=>curTask = task}
						on:mouseleave={e=>curTask = undefined}
						on:click={ e=> dialog.showEditTaskDialog(task)}
						style="background-color: {lookupColor(task.cssColor)}; 
						height: {task.hours*pxPerHour}px;
						margin-top: {prepTime*pxPerHour}px">
						{task.title}
						<!-- time: {task.hours}h  -->
						</div>
				{/each}
			</div>
				<!-- <div class="footer">
				{curDay.allocatedTime}h of print time 
				{#if curDay.timeLeft}
					{curDay.timeLeft}h unused
				{/if} 
				</div>-->
			</div>
		{/each}
	</main>

</div>

<style>

.task {
	border-radius: 5px;
	/* border: 3px solid dimgrey; */
	box-sizing: border-box;
	overflow: hidden;
	padding: 5px 5px;
	/* filter: brightness(250%) grayscale(30%); */
	text-align:center;
	color: #eee;
	font-size: 90%;
	z-index: 1;
	width: 90%;;
	margin-left: 18px;
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
	background-color: #e9e9e9;
	display: flex;
	flex-direction: column;
	/* outline: 1px solid black; */
	/* padding: 10px; */
	margin: 20px 0;
	position: relative;
}

.hour {
	position: absolute;
	border: 1px solid rgb(209, 209, 209);
	border-bottom: 0;
	width: 100%;
	box-sizing: border-box;
	z-index: 0;
	text-align: right;
	padding-right: 25px;
}
.hour:last-child {
	border: 1px solid rgb(209, 209, 209);
}

.hourNumber {
	text-align: left;
	position: relative;
	left: -25px;
	top: 18px;
	color: rgb(162, 161, 161);
}

.day-box:last-child .hour {
	width: 100%;
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