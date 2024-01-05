<script lang="ts">
	import { onMount } from 'svelte';
	import { writableSocket } from '$lib/stores/SocketStore';
	import { messagesStore } from '$lib/stores/MessageStore';
	import { Socket } from 'socket.io-client';

	let socket: Socket;

	$: message = '';

	onMount(() => {
		writableSocket.subscribe((s) => {
			socket = s;
		});
	});

	function submitText() {
		if (message && socket.id) {
			socket.emit('send message', message);
			messagesStore.update((existingMessages) => [
				...existingMessages,
				{ sender: socket.id!, message }
			]);
			message = '';
		}
	}
</script>

<form
	class="bg-neutral-300 p-3 fixed bottom-0 w-full flex justify-around"
	method="post"
	on:submit|preventDefault={submitText}
>
	<input type="text" class="w-11/12 rounded-full px-4 focus:outline-none" bind:value={message} />
	<button class="bg-sky-600 p-1 px-3 rounded text-white">Send</button>
</form>
