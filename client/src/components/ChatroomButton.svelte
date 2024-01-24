<script lang="ts">
	import Profile from './images/profile.png';
	import { writableUsername } from '$lib/stores/UserStore';
	import { page } from '$app/stores';
	import { getTimeDifference } from '$lib/utilities';
	import type { Chatroom } from '$lib/stores/ContactListStore';

	export let chatroom: Chatroom;
	const {
		_id,
		name,
		message_seen: { index },
		newest_message: { message, updatedAt, sent_by }
	} = chatroom;
</script>

<a
	class={`flex justify-around items-center w-full text-left relative h-18 ${
		$page.params.chatroomid === chatroom._id && 'bg-sky-100'
	} hover:bg-neutral-100`}
	href={`/chat/${_id}`}
>
	<img
		src={Profile}
		alt="profile"
		class="w-10 md:w-12 rounded-full mx-2 my-2 md:my-4 shadow-[0px_1px_4px_#0005]"
	/>
	<div class="flex-col justify-between h-20 hidden md:flex">
		<div
			class="text-ellipsis w-64 text-nowrap overflow-hidden text-black h-10 flex items-end
			{index ? 'font-bold' : ''}"
		>
			{name}
		</div>
		<div
			class="text-ellipsis w-64 text-nowrap overflow-hidden text-xs h-9 items-start
			{index ? 'font-bold' : 'text-gray-500'}"
		>
			{`${
				sent_by && sent_by.username === $writableUsername ? 'You: ' : ''
			} ${message} · ${getTimeDifference(new Date(), new Date(updatedAt))}`}
		</div>
	</div>
	<div class="flex-col justify-between h-20 hidden md:flex">
		<div class="h-9 flex items-end justify-center">
			{#if index}
				<div class="w-6 h-6 bg-red-500 rounded-full flex justify-center items-center text-white">
					{index}
				</div>
			{:else}
				<div class="w-5 h-5 rounded-full text-center text-white leading-[1.15rem]"></div>
			{/if}
		</div>
		<div></div>
	</div>
	<div class="absolute">
		{#if index}
			<div class="w-6 h-6 bg-red-500 rounded-full flex justify-center items-center text-white">
				{index}
			</div>
		{:else}
			<div class="w-5 h-5 rounded-full text-center text-white leading-[1.15rem]"></div>
		{/if}
	</div>
</a>
