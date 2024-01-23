<script lang="ts">
	import { writableContactList } from '$lib/stores/ContactListStore';
	import ChatroomButton from './ChatroomButton.svelte';
</script>

<div class="h-full border w-20 box-border flex-grow-0 flex-shrink-0 md:w-96">
	<h1 class="text-2xl font-bold p-4">Chats</h1>
	<div class="overflow-y-auto h-[81vh]">
		{#key $writableContactList}
			{#each $writableContactList as chatroom (chatroom._id)}
				<ChatroomButton {chatroom} />
			{:else}
				<p>Loading...</p>
			{/each}
		{/key}
	</div>
</div>
