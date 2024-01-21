<script lang="ts">
	import { onMount } from 'svelte';
	import Chatbox from '../../../components/Chatbox.svelte';
	import Messages from '../../../components/Messages.svelte';
	import type { PageData } from '../[chatroomid]/$types';
	import { writableMessages } from '$lib/stores/MessageStore';

	export let data: PageData;

	onMount(() => {
		writableMessages.set(data.messages);
	});
</script>

<Messages />
<Chatbox />
