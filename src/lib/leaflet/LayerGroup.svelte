<script lang="ts">
	import * as L from 'leaflet';
	import { getContext, onDestroy, setContext } from 'svelte';

	export let name: string;

	const map = getContext<() => L.Map>('map')();
	const controlLayers: L.Control.Layers = getContext<() => L.Control.Layers>('controlLayers')();

	let layerGroup: L.LayerGroup | undefined = L.layerGroup();

	controlLayers.addOverlay(layerGroup, name);
	map.addLayer(layerGroup);

	setContext('layerGroup', () => layerGroup);

	onDestroy(() => {
		layerGroup?.remove();
	});
</script>

<slot />
