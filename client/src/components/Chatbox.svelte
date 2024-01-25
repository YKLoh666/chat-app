<script lang="ts">
	import { page } from '$app/stores';
	import { writableChatroom } from '$lib/stores/ChatroomStore';
	import { writableContactList } from '$lib/stores/ContactListStore';
	import { writableMessages } from '$lib/stores/MessageStore';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';
	import autosize from 'svelte-autosize';

	$: message = '';

	function submitText() {
		if (message && socket.id) {
			console.log($writableContactList);

			socket.emit('send message', {
				username: $writableUsername,
				message,
				chatroom: $page.url.pathname.substring(6)
			});
			writableContactList.updateAtReceiveMessage({
				sent_by: { username: $writableUsername },
				updatedAt: new Date(),
				message,
				chatroom: {
					_id: $writableChatroom?._id || $page.url.pathname.substring(6),
					active: $writableChatroom?.active,
					name: $writableChatroom?.name,
					room_type: $writableChatroom?.room_type
				}
			});
			writableMessages.update((existingMessages) => [
				{ sent_by: { username: $writableUsername }, message, updatedAt: new Date() },
				...existingMessages
			]);

			message = '';
		}
	}

	// shiftEnterHandler function for replace enter to add new line become shift enter to add new line
	function shiftEnterHandler(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			submitText();
		}
	}
</script>

<form
	class="bg-neutral-300 p-3 bottom-0 flex justify-around box-border w-full flex-grow-0"
	method="post"
	on:submit|preventDefault={submitText}
>
	<!-- svelte-ignore a11y-autofocus -->
	<textarea
		class="w-11/12 h-4 resize-none rounded mr-2 px-2 py-1 focus:outline-none"
		bind:value={message}
		use:autosize
		on:keydown={shiftEnterHandler}
		autofocus={true}
	></textarea>
	<button class="bg-sky-600 p-1 px-3 rounded text-white">Send</button>
</form>
