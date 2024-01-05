<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from '../components/Header.svelte';
	import '../app.css';

	import { page } from '$app/stores';
</script>

<Header route={$page.url.pathname} />
<slot />
