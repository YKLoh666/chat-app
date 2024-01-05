<script lang="ts">
	import Chatbox from '../../components/Chatbox.svelte';
	import Messages from '../../components/Messages.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Messages />
<Chatbox />
