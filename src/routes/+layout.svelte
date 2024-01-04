<script lang="ts">
	import './styles.css';
	import github_logo from '$lib/images/github.svg';
</script>

<div class="app">
	<main>
		<slot />
	</main>

	<footer>
		<p>Weitere Informationen, Quellcode und Lizenzen: <a class="githubLogo" href="https://github.com/Tert0/nwt-map"><img src={github_logo} alt="Github Logo"/>Github</a></p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		height: 100%;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 64rem;
		margin: 0 0.5vw;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	.githubLogo img {
		width: 1em;
		height: 1em;
		vertical-align: text-top;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
