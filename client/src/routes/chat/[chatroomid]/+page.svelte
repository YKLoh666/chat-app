<script lang="ts">
	import type { PageData } from './$types';
	import Chatbox from '../../../components/Chatbox.svelte';
	import Messages from '../../../components/Messages.svelte';

	export let data: PageData;
</script>

<Messages />
<Chatbox />
