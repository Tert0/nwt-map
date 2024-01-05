<script lang="ts">
	import * as L from 'leaflet';
	import { getContext } from 'svelte';

	export let popup: L.Popup | undefined = undefined;

	const layer = getContext<() => L.Layer>('layer')();
	function createPopup(node: HTMLElement) {
		popup = L.popup().setContent(node);
		layer.bindPopup(popup);

		return {
			destroy() {
				layer.unbindPopup();
				popup?.remove();
				popup = undefined;
			}
		};
	}
</script>

<div style="display:none">
	<div use:createPopup>
		<slot />
	</div>
</div>
