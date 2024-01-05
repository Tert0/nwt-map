<script lang="ts">
	import type { DataEntry } from '../../../app';
	import { dangerLevelByDistance } from './analysis';

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
</style>
