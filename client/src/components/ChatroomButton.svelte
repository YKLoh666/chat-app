<script lang="ts">
	import Profile from './images/profile.png';
	import { writableUsername } from '$lib/stores/UserStore';
	import { page } from '$app/stores';
	import { getTimeDifference } from '$lib/utilities';

	type Chatroom = {
		_id: string;
		room_type: string;
		members: {
			username: string;
		}[];
	};

	export let chatroom: Chatroom;
	const { _id, room_type, members } = chatroom;

	let displayTitle: string;

	$: if (room_type === 'SELF') {
		displayTitle = $writableUsername;
	} else if (room_type === 'DUO' && members && members.length === 2) {
		if (members[0].username === $writableUsername) displayTitle = members[1].username;
		else displayTitle = members[0].username;
	}

	let date: string;
</script>

<a
	class={`flex justify-around items-center w-full text-left h-18 ${
		$page.params.chatroomid === chatroom._id && 'bg-sky-100'
	} hover:bg-neutral-100`}
	href={`/chat/${_id}`}
>
	<img src={Profile} alt="profile" class="w-12 rounded-full mx-2 my-4 shadow-[0px_1px_4px_#0005]" />
	<div class="flex flex-col justify-between h-20">
		<div class="text-ellipsis w-64 text-nowrap overflow-hidden text-black h-10 flex items-end">
			{displayTitle}
		</div>
		<div
			class="text-ellipsis w-64 text-nowrap overflow-hidden text-xs text-gray-500 h-9 items-start"
		>
			{`Message here · ${getTimeDifference(new Date(), new Date())}`}
		</div>
	</div>
	<div class="flex flex-col justify-between h-20">
		<div class="h-9 flex items-end justify-center">
			<!-- <div
				class="w-7 h-7 bg-sky-500 rounded-full text-center text-white font-bold leading-[1.65rem]"
			>
				11
			</div> -->
		</div>
		<div></div>
	</div>
</a>
