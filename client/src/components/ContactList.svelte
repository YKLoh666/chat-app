<script lang="ts">
	import {
		morphContactList,
		writableContactList,
		type ChatroomFromDB
	} from '$lib/stores/ContactListStore';
	import { onMount } from 'svelte';
	import ChatroomButton from './ChatroomButton.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import axios from 'axios';
	import { writableUsername } from '$lib/stores/UserStore';
	import { dev } from '$app/environment';

	$: contactList = $writableContactList;

	let sentinel: HTMLDivElement;

	onMount(() => {
		let isLoading = false;
		if (typeof IntersectionObserver !== 'undefined') {
			const observer = new IntersectionObserver(async (entries) => {
				const firstEntry = entries[0];
				if (firstEntry.isIntersecting && contactList.length && !isLoading) {
					console.log('User scrolled to the top');
					isLoading = true;
					const data: { chatrooms: ChatroomFromDB[] } = (
						await axios.get(`${dev && PUBLIC_BASE_URL}/api/chatrooms?skip=${contactList.length}`, {
							withCredentials: true
						})
					).data;

					if (!data.chatrooms.length) observer.disconnect();

					contactList = [...contactList, ...morphContactList(data.chatrooms, $writableUsername)];
					isLoading = false;
				}
			});
			observer.observe(sentinel);
		}
	});
</script>

<div class="overflow-y-auto h-full lg:h-[81vh]" id="contact-list">
	{#key contactList}
		{#each contactList as chatroom}
			<ChatroomButton {chatroom} />
		{:else}
			<p class="flex justify-center items-center h-[50vh] p-8 text-lg text-center">
				Search for your friend's username and start to CHAT!
			</p>
		{/each}
	{/key}
	<div bind:this={sentinel} style="height: 1px;"></div>
</div>

<style lang="postcss">
	@media (max-width: 768px) {
		#contact-list::-webkit-scrollbar {
			display: none !important;
		}
	}
</style>
