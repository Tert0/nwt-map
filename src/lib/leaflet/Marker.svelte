<script lang="ts">
	import * as L from 'leaflet';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { MARKER_ICON } from './icons';

	export let latLng: L.LatLngExpression;
	export let icon: L.Icon = MARKER_ICON;

	let layerGroup = getContext<() => L.LayerGroup>('layerGroup')();
	let marker = new L.Marker(latLng, { icon }).addTo(layerGroup);

	setContext('layer', () => marker);

	onDestroy(() => {
		marker.remove();
	});
</script>

<slot />
