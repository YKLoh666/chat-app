<script lang="ts">
	import type { PageData } from '../routes/chat/$types';
	import ChatroomButton from './ChatroomButton.svelte';
	export let data: PageData;

	const { chatrooms } = data;
</script>

<div class="h-full border w-20 box-border flex-grow-0 flex-shrink-0 md:w-96">
	<h1 class="text-2xl font-bold p-4">Chats</h1>
	<div class="overflow-auto">
		{#if chatrooms}
			{#each chatrooms as chatroom}
				<ChatroomButton {chatroom} />
			{:else}
				<h2>There is no available chatroom.</h2>
			{/each}
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>
