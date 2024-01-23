import type { LayoutLoad } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { writableContactList, type Chatroom } from '$lib/stores/ContactListStore';
import { redirect } from '@sveltejs/kit';
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

export const load = (async ({ fetch, url }) => {
	try {
		const { validated, username } = await (
			await fetch(`${PUBLIC_BASE_URL}/api/users`, { credentials: 'include' })
		).json();
		if (!validated) redirect(307, `/?redirect=${url.pathname}${url.search}`);

		const response = await fetch(`${PUBLIC_BASE_URL}/api/chatrooms`, { credentials: 'include' });
		const { chatrooms }: { chatrooms: ChatroomFromDB[] } = await response.json();

		if (chatrooms) {
			const contactList = chatrooms.map((chatroom) => {
				const message_seen_obj = chatroom.message_seen_list.find(
					(obj) => obj.user.username === username
				);
				return {
					_id: chatroom._id,
					room_type: chatroom.room_type,
					name:
						chatroom.room_type === 'GROUP'
							? chatroom.name
							: chatroom.room_type === 'DUO'
								? chatroom.members.find((val) => val.username !== username)?.username
								: `${username} (me)`,
					members: chatroom.members,
					message_seen: {
						index: message_seen_obj?.message_seen || 0,
						date: message_seen_obj?.seen_date
					},
					message_updated: chatroom.message_updated
				};
			}) as Chatroom[];

			writableContactList.set(contactList);

			return { contactList };
		} else {
			return {};
		}
	} catch (err) {
		console.error(err);
	}
}) satisfies LayoutLoad;
