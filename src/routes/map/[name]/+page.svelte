<script lang="ts">
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { DataEntry } from '../../../app';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import MapPopup from './MapPopup.svelte';
	import marker_red from '$lib/images/marker-red.svg';
	import marker_yellow from '$lib/images/marker-yellow.svg';
	import marker_shadow from '$lib/images/marker-shadow.svg';
	import marker_svg from '$lib/images/marker.svg';
	import { dangerLevelByEntry } from './analysis';
	import type { PageData } from './$types';
	import { parseData } from '../../parser';

	export let data: PageData;

	let storedData = JSON.parse(localStorage.getItem('data') || '{}') as {
		[key in string]: DataEntry[];
	};
	if (
		storedData == null ||
		storedData == undefined ||
		!Object.hasOwn(storedData, $page.params.name)
	) {
		if(data.data != undefined) {
			let entries = parseData(Uint8Array.from(atob(data.data), c => c.charCodeAt(0)).buffer);
			console.log(entries);
			storedData[$page.params.name] = entries;
			localStorage.setItem("data", JSON.stringify(storedData));
		} else {
			goto('/', { replaceState: true });
			setTimeout(() => {alert('Invalid map!');}, 200)
		}
	}


	let dataEntries = storedData[$page.params.name];

	function centerDataPosition(): [number, number] {
		let latitude_sum = dataEntries
			.map((entry) => entry.latitude)
			.reduce((partialSum, a) => partialSum + a, 0);
		let longitude_sum = dataEntries
			.map((entry) => entry.longitude)
			.reduce((partialSum, a) => partialSum + a, 0);

		return [latitude_sum / dataEntries.length, longitude_sum / dataEntries.length];
	}

	let map: L.Map;
	const MARKER_RED_ICON = new L.Icon({
		iconUrl: marker_red,
		shadowUrl: marker_shadow,
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	});
	const MARKER_YELLOW_ICON = new L.Icon({
		iconUrl: marker_yellow,
		shadowUrl: marker_shadow,
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	});
	const MARKER_ICON = new L.Icon({
		iconUrl: marker_svg,
		shadowUrl: marker_shadow,
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	});

	function bindPopup(marker: L.Marker<any>, createFn: any) {
		let popupComponent: any;
		marker.bindPopup(
			() => {
				let container = L.DomUtil.create('div');
				popupComponent = createFn(container);
				return container;
			},
			{
				maxWidth: window.innerWidth / 3
			}
		);

		marker.on('popupclose', () => {
			if (popupComponent) {
				let old = popupComponent;
				popupComponent = null;
				// Wait for the popup to completely fade out before destroying it.
				// Otherwise the fade out looks weird as the contents disappear too early.
				setTimeout(() => {
					old.$destroy();
				}, 500);
			}
		});
	}

	function createMap(container: HTMLElement) {
		let markersByDangerLevel: {[key in 0 | 1 | 2]: Array<L.Marker>} = {0: [], 1: [], 2: []};

		for (const entry of dataEntries) {
			let icon = {0: MARKER_ICON, 1: MARKER_YELLOW_ICON, 2: MARKER_RED_ICON}[dangerLevelByEntry(entry)];
			let marker = L.marker([entry.latitude, entry.longitude], { icon });
			markersByDangerLevel[dangerLevelByEntry(entry)].push(marker);
			bindPopup(marker, (markerContainer: HTMLElement) => {
				let component = new MapPopup({
					target: markerContainer,
					props: {
						data: entry
					}
				});
				return component;
			});
		}

		

		let dangerLowLayerGroup = L.layerGroup(markersByDangerLevel[0]);
		let dangerMediumLayerGroup = L.layerGroup(markersByDangerLevel[1]);
		let dangerHighLayerGroup = L.layerGroup(markersByDangerLevel[2]);

		let m = L.map(container, {
			layers: [dangerLowLayerGroup, dangerMediumLayerGroup, dangerHighLayerGroup]
		}).setView(centerDataPosition(), 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: `&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
			minZoom: 10,
			maxZoom: 19
		}).addTo(m);

		L.control.layers(
			undefined, {
				[`<img src="${marker_svg}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Geringe gemessene Gefahr`]: dangerLowLayerGroup,
				[`<img src="${marker_yellow}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Mittlere gemessene Gefahr`]: dangerMediumLayerGroup,
				[`<img src="${marker_red}" style="width: 1em;height: 1em;vertical-align: text-top;"/> Hohe gemessene Gefahr`]: dangerHighLayerGroup
			}, undefined
			).addTo(m);


		return m;
	}

	function mapAction(container: HTMLElement) {
		map = createMap(container);
		return {
			destroy: () => {
				map.remove();
			}
		};
	}

	function resizeMap() {
		if (map) {
			map.invalidateSize();
		}
	}
</script>

<svelte:window on:resize={resizeMap} />

<div id="map" style="width:98vw;height:100%;margin-left: 1vw" use:mapAction />

<style>
</style>
