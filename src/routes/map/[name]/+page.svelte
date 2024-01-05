<script lang="ts">
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { DataEntry } from '../../../app';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import DataEntryPopupContent from './DataEntryPopupContent.svelte';
	import { dangerLevelByEntry } from './analysis';
	import type { PageData } from './$types';
	import { parseData } from '../../parser';
	import Leaflet from '$lib/leaflet/Leaflet.svelte';
	import LayerGroup from '$lib/leaflet/LayerGroup.svelte';
	import Marker from '$lib/leaflet/Marker.svelte';
	import Popup from '$lib/leaflet/Popup.svelte';
	import {
		MARKER_BLUE_ICON,
		MARKER_ICON_SVGS,
		MARKER_RED_ICON,
		MARKER_ORANGE_ICON
	} from '$lib/leaflet/icons';
	import Legend from '$lib/leaflet/Legend.svelte';

	export let data: PageData;

	let storedData = JSON.parse(localStorage.getItem('data') || '{}') as {
		[key in string]: DataEntry[];
	};
	if (
		storedData == null ||
		storedData == undefined ||
		!Object.hasOwn(storedData, $page.params.name)
	) {
		if (data.data != undefined) {
			let entries = parseData(Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0)).buffer);
			console.log(entries);
			storedData[$page.params.name] = entries;
			localStorage.setItem('data', JSON.stringify(storedData));
		} else {
			goto('/', { replaceState: true });
			setTimeout(() => {
				alert('Invalid map!');
			}, 200);
		}
	}

	let dataEntries = storedData[$page.params.name];

	function dataBounds() {
		let latitude_min = Math.min(...dataEntries.map((entry) => entry.latitude));
		let latitude_max = Math.max(...dataEntries.map((entry) => entry.latitude));
		let longitude_min = Math.min(...dataEntries.map((entry) => entry.longitude));
		let longitude_max = Math.max(...dataEntries.map((entry) => entry.longitude));
		return new L.LatLngBounds([latitude_min, longitude_min], [latitude_max, longitude_max]).pad(
			0.05
		);
	}

	let entriesByDangerLevel: { [key in 0 | 1 | 2]: Array<DataEntry> } = { 0: [], 1: [], 2: [] };

	for (const entry of dataEntries) {
		entriesByDangerLevel[dangerLevelByEntry(entry)].push(entry);
	}
</script>

<Leaflet bounds={dataBounds()}>
	<Legend>
		<img
			src={MARKER_ICON_SVGS[0]}
			style="width: 1em;height: 1em;vertical-align: text-top;"
			alt="Low Danger Marker"
		/>
		Geringe gemessene Gefahr
		<br />
		<img
			src={MARKER_ICON_SVGS[1]}
			style="width: 1em;height: 1em;vertical-align: text-top;"
			alt="Medium Danger Marker"
		/>
		Mittlere gemessene Gefahr
		<br />
		<img
			src={MARKER_ICON_SVGS[2]}
			style="width: 1em;height: 1em;vertical-align: text-top;"
			alt="High Danger Marker"
		/> Hohe gemessene Gefahr
	</Legend>
	<LayerGroup
		name={`<img src="${MARKER_ICON_SVGS[0]}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Geringe gemessene Gefahr`}
	>
		{#each entriesByDangerLevel[0] as entry}
			<Marker latLng={[entry.latitude, entry.longitude]} icon={MARKER_BLUE_ICON}>
				<Popup>
					<DataEntryPopupContent data={entry} />
				</Popup>
			</Marker>
		{/each}
	</LayerGroup>
	<LayerGroup
		name={`<img src="${MARKER_ICON_SVGS[1]}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Mittlere gemessene Gefahr`}
	>
		{#each entriesByDangerLevel[1] as entry}
			<Marker latLng={[entry.latitude, entry.longitude]} icon={MARKER_ORANGE_ICON}>
				<Popup>
					<DataEntryPopupContent data={entry} />
				</Popup>
			</Marker>
		{/each}
	</LayerGroup>
	<LayerGroup
		name={`<img src="${MARKER_ICON_SVGS[2]}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Hohe gemessene Gefahr`}
	>
		{#each entriesByDangerLevel[2] as entry}
			<Marker latLng={[entry.latitude, entry.longitude]} icon={MARKER_RED_ICON}>
				<Popup>
					<DataEntryPopupContent data={entry} />
				</Popup>
			</Marker>
		{/each}
	</LayerGroup>
</Leaflet>
