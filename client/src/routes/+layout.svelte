<script lang="ts">
	import Header from '../components/Header.svelte';
	import '../app.css';

	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
</script>

<Header route={$page.url.pathname} />
{#if $navigating}
	<p>Loading...</p>
{:else}
	<slot />
{/if}
