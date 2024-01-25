<script lang="ts">
	import Message from './Message.svelte';
	import { writableMessages } from '$lib/stores/MessageStore';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import axios from 'axios';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { writableChatroom } from '$lib/stores/ChatroomStore';
	$: messages = $writableMessages;
	let sentinel: HTMLDivElement;

	type MessageType = {
		updatedAt: Date;
		message: string;
		sent_by:
			| {
					username: string;
			  }
			| undefined;
	};

	onMount(() => {
		let isLoading = false;
		if (typeof IntersectionObserver !== 'undefined') {
			const observer = new IntersectionObserver(async (entries) => {
				const firstEntry = entries[0];
				if (firstEntry.isIntersecting && messages.length && !isLoading) {
					console.log('User scrolled to the top');
					isLoading = true;
					const data: { messages: MessageType[] } = (
						await axios.get(
							`${PUBLIC_BASE_URL}/api/messages/${$page.url.pathname.substring(6)}?skip=${
								messages.length
							}`,
							{
								withCredentials: true
							}
						)
					).data;

					if (!data.messages.length) observer.disconnect();

					messages = [...messages, ...data.messages];
					isLoading = false;
				}
			});
			observer.observe(sentinel);
		}
	});

	$: chatroomTitle = $writableChatroom?.name ?? undefined;
</script>

{#if chatroomTitle}
	<h3 class="font-bold text-lg p-2 border-b">{chatroomTitle}</h3>
{/if}
<div class="p-4 flex-grow flex flex-col-reverse overflow-y-auto">
	{#if messages}
		{#each messages as { sent_by, message, updatedAt }}
			<Message {sent_by} {message} {updatedAt} />
		{:else}
			<Message
				sent_by={undefined}
				message="Send a message to start the conversation"
				updatedAt={new Date()}
			/>
		{/each}
	{:else}
		<p class="flex justify-center">Loading...</p>
	{/if}
	<div bind:this={sentinel} style="height: 1px;"></div>
</div>
