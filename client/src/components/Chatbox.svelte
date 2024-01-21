<script lang="ts">
	import { page } from '$app/stores';
	import { writableMessages } from '$lib/stores/MessageStore';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';

	$: message = '';

	function submitText() {
		if (message && socket.id) {
			socket.emit('send message', {
				username: $writableUsername,
				message,
				chatroom: $page.url.pathname.substring(6)
			});
			writableMessages.update((existingMessages) => [
				{ sent_by: { username: $writableUsername }, message, updatedAt: new Date() },
				...existingMessages
			]);

			message = '';
		}
	}
</script>

<form
	class="bg-neutral-300 p-3 bottom-0 flex justify-around box-border w-full flex-grow-0"
	method="post"
	on:submit|preventDefault={submitText}
>
	<input type="text" class="w-11/12 rounded-full px-4 focus:outline-none" bind:value={message} />
	<button class="bg-sky-600 p-1 px-3 rounded text-white">Send</button>
</form>
