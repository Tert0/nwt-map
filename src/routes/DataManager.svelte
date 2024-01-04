<script lang="ts">
	import { writable } from 'svelte/store';
	import type { DataEntry } from '../app';
	import type { Writable } from 'svelte/store';
	import { parseData } from './parser';

	let data: Writable<{ [key in string]: Array<DataEntry> }> = !localStorage
		? writable({})
		: writable(JSON.parse(localStorage.getItem('data') || '{}'));

	async function upload_file(e: Event) {
		let target: HTMLInputElement = e.target as HTMLInputElement;
		if (target.files?.length == 1) {
			let file: File = target.files[0];
			let raw = await file.arrayBuffer();
			
			data.update((d) => {
				let k = file.name;
				return { ...d, [k]: parseData(raw) };
			});
		}
	}

	data.subscribe((d) => {
		localStorage.setItem('data', JSON.stringify(d));
	});
</script>

<div>
	{#if Object.keys(data).length == 0}
		Currently no data uploaded.
	{:else}
		<ul>
			{#each Object.entries($data) as [key, value]}
				<li>
					{key} ({value.length} entries)
					<button
						on:click={() => {
							data.update((d) => {
								const { [key]: _, ...n } = d;
								return n;
							});
						}}>Delete</button
					>
					<a href="/map/{key}"><button>Map</button></a>
				</li>
			{/each}
		</ul>
	{/if}
	<br />
	<input type="file" accept="DATA" on:change={upload_file} />
</div>
