<script>
	import { onMount } from 'svelte';
	import { writableSocket } from '$lib/stores/SocketStore';
	import Message from './Message.svelte';
	import { messagesStore } from '$lib/stores/MessageStore';

	let socket;

	onMount(() => {
		writableSocket.subscribe((s) => {
			socket = s;

			socket.on('received message', (data) => {
				messagesStore.update((existingMessages) => [...existingMessages, data]);
			});
		});
	});
</script>

<div class="p-4">
	{#each $messagesStore as { sender, message }}
		<Message {sender} {message} />
	{/each}
</div>
