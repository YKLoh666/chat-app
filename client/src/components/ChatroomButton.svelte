<script lang="ts">
	import Profile from './images/profile.png';
	import { writableUsername } from '$lib/stores/UserStore';
	import { page } from '$app/stores';
	import { getTimeDifference } from '$lib/utilities';
	import type { Chatroom } from '$lib/stores/ContactListStore';
	import { writableChatroom } from '$lib/stores/ChatroomStore';

	export let chatroom: Chatroom;
	const {
		_id,
		name,
		room_type,
		message_seen: { index },
		newest_message: { message, updatedAt, sent_by },
		active
	} = chatroom;
</script>

<a
	class={`flex justify-around items-center w-full text-left relative h-18 cursor-pointer ${
		$page.params.chatroomid === chatroom._id && 'lg:bg-sky-100'
	} hover:bg-neutral-100`}
	href={_id !== $page.url.pathname.substring(6) ? `/chat/${_id}` : undefined}
>
	<div class="relative mx-2 my-2 lg:my-4">
		<img
			src={Profile}
			alt="profile"
			class="w-12 rounded-full shadow-[0px_1px_4px_#0005] {$page.params.chatroomid ===
				chatroom._id && 'border-2 lg:border-none border-sky-500'}"
		/>

		<div class="absolute right-0 bottom-0">
			{#if index}
				<div
					class="w-4 h-4 text-xs bg-red-500 rounded-full flex justify-center items-center text-white lg:hidden"
				>
					{index}
				</div>
			{:else}
				<div
					class="bg-green-400 w-4 h-4 rounded-full border-2 border-white {room_type === 'DUO' &&
					active
						? 'block'
						: 'hidden'}"
				></div>
			{/if}
		</div>
	</div>
	<div class="flex-col justify-between h-20 hidden w-[70%] lg:flex">
		<div
			class="text-ellipsis w-64 text-nowrap overflow-hidden text-black h-10 flex items-end
			{index ? 'font-bold' : ''}"
		>
			{name}
		</div>
		<div
			class="w-64 text-nowrap overflow-hidden text-xs h-9 items-start flex
			{index ? 'font-bold' : 'text-gray-500'}"
		>
			<span
				class="text-ellipsis overflow-hidden inline-block max-w-[calc(100%-40px)] items-center whitespace-nowrap"
			>
				{`${sent_by && sent_by.username === $writableUsername ? 'You: ' : ''} ${message}`}</span
			>
			&nbsp;·&nbsp; <span>{`${getTimeDifference(new Date(), new Date(updatedAt))}`}</span>
		</div>
	</div>
	<div class="flex-col justify-between h-20 hidden lg:flex">
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
</a>
