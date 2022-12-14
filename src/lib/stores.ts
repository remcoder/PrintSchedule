import { writable, get, type Updater, type Writable } from 'svelte/store';
import type { Task } from './task';

// inspired by https://www.reddit.com/r/sveltejs/comments/s8rsx9/where_to_put_api_calls_stores/

const url = 'https://api.jsonbin.io/v3/b/637028842b3499323bfdf65c';
const key = import.meta.env.VITE_BACKEND_KEY;
// console.log('key', key);

const headers = {
	Accept: 'application/json, text/plain',
	'Content-Type': 'application/json',
	'X-Master-Key': key
};

export let tasks = writable([] as Task[]);

export async function loadTasks() {
	const resp = await fetch(url, {
		headers: new Headers({
			'X-Master-Key': key
		})
	});

	const json = await resp.json();
	console.log(json);
	const data = json.record.tasks;
	tasks.set(data);
}

loadTasks();

export async function removeTask(task: Task) {
	const update = (tasks: Task[]) => {
		let newTasks = [...tasks];
		const index = newTasks.findIndex((t) => t === task);
		newTasks.splice(index, 1);
		return newTasks;
	};

	updateTasks(update);
}

export async function addTask(task: Task) {
	const update = (tasks: Task[]) => {
		let newTasks = [...tasks];
		newTasks.push(task);
		return newTasks;
	};

	updateTasks(update);
}

export async function updateTask(oldTask: Task, newTask: Task) {
	const update = (tasks: Task[]) => {
		let newTasks = [...tasks];
		const index = newTasks.findIndex((t) => t === oldTask);
		newTasks[index] = newTask;
		return newTasks;
	};

	updateTasks(update);
}

export function updateTasks(update: Updater<Task[]>) {
	tasks.update(update);

	let body = JSON.stringify({
		tasks: get(tasks)
	});

	// await?
	fetch(url, {
		method: 'PUT',
		headers: headers,
		body: body
	});
}
