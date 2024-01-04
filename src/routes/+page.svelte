<script>
	import DataManager from "./DataManager.svelte";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="NWT Fahrradverkehr Map" />
</svelte:head>

<section>
	<h1>
		Measured Data
	</h1>

	<DataManager />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
