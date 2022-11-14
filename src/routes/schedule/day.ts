import type { Task } from "$lib/task";

export class Day {
	hours;
	allocatedTime = 0;
	tasks : Task[] = [];

	constructor(hours: number) {
		this.hours = hours;
	}

	add(task: Task) {
		this.tasks.push(task);
		this.allocatedTime += task.prepTime ?? 0 + task.hours;
	}

	get timeLeft() {
		return this.hours - this.allocatedTime;
	}
}
