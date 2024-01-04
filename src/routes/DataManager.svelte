<script lang="ts">
	import { writable } from 'svelte/store';
	import type { DataEntry } from '../app';
	import type { Writable } from 'svelte/store';

	const ENTRY_SIZE = 24;

	export const ssr = false;

	let data: Writable<{ [key in string]: Array<DataEntry> }> = !localStorage
		? writable({})
		: writable(JSON.parse(localStorage.getItem('data') || '{}'));

	function validate_checksum(entry_raw: ArrayBuffer): boolean {
		let bytes = new Uint8Array(entry_raw);
		let checksum = 0;
		for (const byte of bytes) {
			checksum ^= byte;
		}
		return checksum == 0;
	}

	async function upload_file(e: Event) {
		let target: HTMLInputElement = e.target as HTMLInputElement;
		if (target.files?.length == 1) {
			let file: File = target.files[0];
			let raw = await file.arrayBuffer();
			let entries_cnt = Math.trunc(raw.byteLength / ENTRY_SIZE);
			if (raw.byteLength % ENTRY_SIZE != 0) {
				alert(
					`Data length is correct. (Got: ${raw.byteLength} Expected: Block Size of ${ENTRY_SIZE})`
				);
			}
			data.update((d) => {
				let k = file.name;
				return { ...d, [k]: [] };
			});
			for (let i = 0; i < entries_cnt; i++) {
				let entry_raw = raw.slice(i * ENTRY_SIZE, (i + 1) * ENTRY_SIZE);
				let [distance1, distance2, distance3] = new Uint16Array(entry_raw.slice(0, 6));
				let [latitude, longitude] = new Float64Array(entry_raw.slice(6, 22));
				let [pulse, checksum] = new Uint8Array(entry_raw.slice(22, 24));
				let valid = validate_checksum(entry_raw);
				if (!valid) {
					alert('Found invalid entry in data');
					continue;
				}
				let entry: DataEntry = {
					distance1,
					distance2,
					distance3,
					latitude,
					longitude,
					pulse
				};
				data.update((d) => {
					let k = file.name;
					return { ...d, [k]: d[k].concat([entry]) };
				});
			}
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
