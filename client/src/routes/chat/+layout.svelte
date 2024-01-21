<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import ContactList from '../../components/ContactList.svelte';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { writableContactList, type Chatroom } from '$lib/stores/ContactListStore';

	type ChatroomFromDB = {
		_id: string;
		room_type: string;
		name: string;
		public: boolean;
		members: {
			username: string;
		}[];
		message_updated: {
			message: string;
			sent_by: {
				username: string;
			};
			updatedAt: Date;
		};
		message_seen_list: [
			{
				user: {
					username: string;
				};
				message_seen: number;
				seen_date: Date;
			}
		];
	};

	onMount(async () => {
		const { validated, username } = (
			await axios.get(`${PUBLIC_BASE_URL}/api/users`, { withCredentials: true })
		).data;
		if (!validated) await goto('/', { invalidateAll: true, replaceState: true });
		else {
			writableUsername.set(username);
			socket.emit('authenticated', username);
			const { chatrooms }: { chatrooms: ChatroomFromDB[] } = (
				await axios.get(`${PUBLIC_BASE_URL}/api/chatrooms`, { withCredentials: true })
			).data;

			if (chatrooms) {
				writableUsername.subscribe((sUsername) => {
					writableContactList.set(
						chatrooms.map((chatroom) => {
							const message_seen_obj = chatroom.message_seen_list.find(
								(obj) => obj.user.username === sUsername
							);
							return {
								_id: chatroom._id,
								room_type: chatroom.room_type,
								name:
									chatroom.room_type === 'GROUP'
										? chatroom.name
										: chatroom.room_type === 'DUO'
											? chatroom.members.find((val) => val.username !== $writableUsername)?.username
											: `${$writableUsername} (me)`,
								members: chatroom.members,
								message_seen: {
									index: message_seen_obj?.message_seen || 0,
									date: message_seen_obj?.seen_date
								},
								message_updated: chatroom.message_updated
							};
						}) as Chatroom[]
					);
				});
				return {};
			}
		}
	});
</script>

<main class="h-[90vh] w-full box-border flex">
	<ContactList />
	<div class="flex flex-col h-full w-3/4">
		<slot />
	</div>
</main>
