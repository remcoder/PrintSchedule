
<script>

  import { Day } from './day';
	import { tasks } from './testdata';

	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const curDayIndex = new Date().getDay();
	const weekDay = weekDays[curDayIndex];
	const prepTime = 0.5;
	const totalPrintTime = tasks.map(t=>t.hours).reduce((acc,next) => acc+next ,0);
	
	const pxPerHour = 20;

	function fillDay(day) {
		let i = 0;
		while(i < tasks.length) {
			const task = tasks[i];
			task.prepTime = task.prepTime ?? prepTime;

			if (day.timeLeft >= (task.hours + task.prepTime)) {
				// console.log('adding', task)
				day.add(task);
				tasks.splice(i,1);
			}
			else {
				// console.log('skipping', task)
				i++;
			}
		}
	}

	function allocateTasks() {
		const days = [];
		while (tasks.length) {
			let curDay = new Day(8)
			days.push(curDay);

			fillDay(curDay);
		}

		return days;
	}

	const plannedDays = allocateTasks();


	function getWeekDay(index) {
		return weekDays [(curDayIndex + index) % 7];
	}
</script>

<svelte:head>
	<title>Print Queue</title>
	<meta name="description" content="Manage tasks" />
</svelte:head>

<div class="text-column">
	<h1>Print Schedule</h1>

	<main>
		{#each plannedDays as curDay, dayIndex}
			<div class="day-box">
			<header>{getWeekDay(dayIndex)} </header>
			<div class="day" style="height: {pxPerHour * 8}px;">

				{#each curDay.tasks as task}
					<div class="task" style="background-color: {task.cssColor}; 
					height: {task.hours*pxPerHour}px;
					margin-top: {prepTime*pxPerHour}px">{task.title}<br>
					time:{task.hours}</div>
				{/each}
			</div>
				<div class="footer">day print time {curDay.allocatedTime}
				time left {curDay.timeLeft}
				</div>
			</div>
		{/each}
	</main>

</div>

<style>
.task {
	border: 1px solid black;
	box-sizing: border-box;
	overflow: hidden;
}
.day-box {

	margin-bottom: 40px;
	background-color: lightgrey;
}
.day {
	xoverflow: hidden;
	padding: 10px;
}

main {
	display: flex;
	flex-direction: column;
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