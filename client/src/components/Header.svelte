<script lang="ts">
	export let route: string;
</script>

<header class="bg-sky-500 p-3 px-10 shadow-md flex flex-row justify-between items-center">
	<h1 class="font-light text-2xl text-white">Chat App</h1>

	{#if route === '/register'}
		<a href="/" class="btn-secondary">Login</a>
	{:else}
		<a href="/register" class="btn-secondary">Register</a>
	{/if}
</header>
