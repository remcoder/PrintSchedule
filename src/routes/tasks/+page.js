export const csr = true;

export const prerender = false;

const url = '';
const key = '';

export async function getTasks() {
	const resp = await fetch(url, {
		headers: new Headers({
			'X-Master-Key': key
		})
	});

	return (await resp.json()).record;
}

/** @type {import('./$types').PageLoad} */
export async function load() {
	const res = await getTasks();
	// console.log('res', res);
	return res;
}
