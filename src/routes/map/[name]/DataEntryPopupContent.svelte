<script lang="ts">
	import * as L from 'leaflet';
	import type { DataEntry } from '../../../app';
	import { dangerLevelByDistance } from './analysis';
	import { getContext } from 'svelte';

	let copied = false;

	// Workaround to reset copied after the popup closed because this Component is not destroyed on close (TODO)
	const layer = getContext<() => L.Layer>('layer')();
	layer.on('popupclose', () => {
		copied = false;
	});

	function copyPosition() {
		navigator.clipboard.writeText(`${data.latitude.toFixed(7)},${data.longitude}`);
		copied = true;
	}

	export let data: DataEntry;

	let dangerLevel1 = dangerLevelByDistance(data.distance1);
	let dangerLevel2 = dangerLevelByDistance(data.distance2);
	let dangerLevel3 = dangerLevelByDistance(data.distance3);

	const CLASS_BY_DANGER_LEVEL: { [key in number]: string } = {
		0: 'dangerLow',
		1: 'dangerMedium',
		2: 'dangerHigh'
	};
</script>

<section>
	<b>Abstand</b>
	<br />
	<table>
		<tbody>
			<tr class={CLASS_BY_DANGER_LEVEL[dangerLevel1]}>
				<td>Rechts:</td>
				<td>{data.distance1 / 10} cm</td>
			</tr>
			<tr class={CLASS_BY_DANGER_LEVEL[dangerLevel2]}>
				<td>Hinten:</td>
				<td>{data.distance2 / 10} cm</td>
			</tr>
			<tr class={CLASS_BY_DANGER_LEVEL[dangerLevel3]}>
				<td>Links:</td>
				<td>{data.distance3 / 10} cm</td>
			</tr>
		</tbody>
	</table>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span role="button" tabindex="0" class="copy-button" class:copied on:click={copyPosition}
		>[Position kopieren]</span
	>
</section>

<style>
	.dangerLow {
		color: green;
	}
	.dangerMedium {
		color: orange;
	}
	.dangerHigh {
		color: red;
	}

	.copy-button {
		user-select: none;
		color: #094ebd;
	}
	.copy-button:active,
	.copied {
		color: #05275f;
	}

	.copy-button:hover {
		text-decoration: underline;
	}
</style>
