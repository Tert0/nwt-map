<script lang="ts">
	import * as L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { setContext } from 'svelte';

	export let height = '100%';
	export let width = '100%';
	export let defaultView: L.LatLngExpression | undefined = undefined;
	export let defaultZoom: number | undefined = undefined;
	export let bounds: L.LatLngBounds | undefined = undefined;

	let map: L.Map | undefined;
	let controlLayers: L.Control.Layers | undefined;

	const getMap = () => map;
	setContext('layerGroup', getMap);
	setContext('map', getMap);
	setContext('controlLayers', () => controlLayers);

	function createLeaflet(node: HTMLElement) {
		map = L.map(node, { zoomSnap: 0.5 });
		if (bounds) {
			map?.fitBounds(bounds);
		} else if (defaultView) {
			map.setView(defaultView, defaultZoom || 1);
		}
		controlLayers = new L.Control.Layers();
		controlLayers.addTo(map);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: `&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>`,
			minZoom: 10,
			maxZoom: 19
		}).addTo(map);

		return {
			destroy() {
				map?.remove();
				map = undefined;
				controlLayers?.remove();
				controlLayers = undefined;
			}
		};
	}
</script>

<svelte:window
	on:resize={() => {
		map?.invalidateSize();
	}}
/>

<div style="height: {height}; width: {width};" use:createLeaflet>
	{#if map}
		<slot />
	{/if}
</div>
