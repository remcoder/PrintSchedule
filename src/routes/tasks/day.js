export class Day {
	hours;
	allocatedTime = 0;
	tasks = [];

	constructor(hours) {
		this.hours = hours;
	}

	add(task) {
		this.tasks.push(task);
		this.allocatedTime += task.prepTime + task.hours;
	}

	get timeLeft() {
		return this.hours - this.allocatedTime;
	}
}
