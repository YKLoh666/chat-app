<script>
	import Message from './Message.svelte';
	import { writableMessages } from '$lib/stores/MessageStore';
	$: messages = $writableMessages;
</script>

<div class="p-4 flex-grow flex flex-col-reverse">
	{#if messages}
		{#each messages as { sent_by, message, updatedAt }}
			<Message {sent_by} {message} {updatedAt} />
		{/each}
	{:else}
		<p class="flex justify-center">Loading...</p>
	{/if}
</div>
