<script>
	import Message from './Message.svelte';
	import { messagesStore } from '$lib/stores/MessageStore';

	let socket;
</script>

<div class="p-4 flex-grow">
	{#each $messagesStore as { sender, message }}
		<Message {sender} {message} />
	{/each}
</div>
