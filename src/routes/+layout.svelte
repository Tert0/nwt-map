<script lang="ts">
	import './styles.css';
	import github_logo from '$lib/images/github.svg';
</script>

<div class="app">
	<main>
		<slot />
	</main>

	<footer>
		<span>Weitere Informationen, Quellcode und Lizenzen: <a class="githubLogo" href="https://github.com/Tert0/nwt-map"><img src={github_logo} alt="Github Logo"/>Github</a></span>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	main {
		margin-top: 1vh;
		height: 98%;
		box-sizing: border-box;
	}

	footer {
		font-size: small;
		text-wrap: pretty;
		text-align: center;
	}

	footer a {
		font-weight: bold;
		display: inline;
	}

	.githubLogo img {
		width: 1em;
		height: 1em;
		vertical-align: text-top;
	}
</style>
