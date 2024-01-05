<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from '../components/Header.svelte';
	import '../app.css';

	import { page } from '$app/stores';

	export let data: LayoutData;
</script>

<Header route={$page.url.pathname} />
<slot />
