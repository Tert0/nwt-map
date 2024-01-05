<script lang="ts">
	import { writable } from 'svelte/store';
	import type { DataEntry } from '../app';
	import type { Writable } from 'svelte/store';
	import { parseData } from './parser';

	let data: Writable<{ [key in string]: Array<DataEntry> }> = !localStorage
		? writable({})
		: writable(JSON.parse(localStorage.getItem('data') || '{}'));

	let selectedFile: File | undefined;
	let uploadName = '';

	async function upload_file() {
		if (selectedFile != undefined) {
			let file: File = selectedFile;
			if (file.type == 'application/json') {
				let content = await file.text();
				data.update((d) => {
					return { ...d, [uploadName]: JSON.parse(content) };
				});
			} else {
				let raw = await file.arrayBuffer();

				data.update((d) => {
					return { ...d, [uploadName]: parseData(raw) };
				});
			}
		}
	}

	function selected_file(e: Event) {
		let target: HTMLInputElement = e.target as HTMLInputElement;
		if (target.files?.length == 1) {
			selectedFile = target.files[0];
			uploadName = selectedFile.name.replace(/\.json$/, '');
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
					<a
						href={URL.createObjectURL(
							new Blob([JSON.stringify(value)], { type: 'application/json' })
						)}
						download="data.json"><button>Download (JSON)</button></a
					>
				</li>
			{/each}
		</ul>
	{/if}
	<br />
	<label for="upload_name">Dataset Name:</label>
	<input name="upload_name" type="text" bind:value={uploadName} disabled={!selectedFile} />
	<input type="file" accept="data,*.json" on:change={selected_file} />
	<button disabled={!selectedFile || uploadName == ''} on:click={upload_file}>Upload</button>
	{#if uploadName in $data}
		<span style="color: red;">WARNING: Overriding dataset!</span>
	{/if}
</div>
