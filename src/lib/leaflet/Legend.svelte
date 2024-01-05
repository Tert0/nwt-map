<script lang="ts">
	import * as L from 'leaflet';
	import { getContext } from 'svelte';
	import { writable } from 'svelte/store';
	class Legend extends L.Control {
		node: HTMLElement;

		constructor(node: HTMLElement) {
			super({ position: 'bottomleft' });
			this.node = node;
		}

		onAdd(): HTMLElement {
			L.DomEvent.disableClickPropagation(this.node);
			L.DomEvent.disableScrollPropagation(this.node);
			return this.node;
		}

		onRemove(): void {}
	}

	export let legend: Legend | undefined = undefined;

	function createLegend(node: HTMLElement) {
		legend = new Legend(node).addTo(map);
		return {
			destroy() {
				legend?.remove();
				legend = undefined;
			}
		};
	}

	let open = writable((localStorage.getItem('legendOpen') || 'true') == 'true');

	open.subscribe((value) => {
		localStorage.setItem('legendOpen', JSON.stringify(value));
	});

	const map = getContext<() => L.Map>('map')();
</script>

<div use:createLegend>
	<div class="legend {open ? 'open' : 'close'}">
		{#if legend}
			{#if $open}
				<h3>Legende</h3>
				<slot />
				<br />
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span
				class="toggleOpen"
				role="button"
				tabindex={0}
				on:click={() => {
					$open = !$open;
				}}>{$open ? '[Einklappen]' : '[Ausklappen]'}</span
			>
		{/if}
	</div>
</div>

<style>
	.legend {
		user-select: none;
		background-color: white;
		border: 2px solid rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.legend.open {
		padding: 5px 20px;
	}

	.legend.close {
		padding: 5px 20px !important;
		padding-left: 20px;
		padding-bottom: 5px;
	}

	.toggleOpen {
		color: #0645ad;
	}

	.toggleOpen:hover {
		text-decoration: underline;
	}
</style>
