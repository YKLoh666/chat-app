import { get, writable } from 'svelte/store';
import { writableUsername } from './UserStore';
import { page } from '$app/stores';

export type Chatroom = {
	_id: string;
	room_type: string;
	name: string;
	members: {
		username: string;
	}[];
	message_seen: {
		index: number;
		date: Date;
	};
	message_updated: {
		sent_by: {
			username: string;
		};
		message: string;
		updatedAt: Date;
	};
};

function createContactListStore(initialValue: Chatroom[]) {
	const contactListStore = writable<Chatroom[]>(initialValue);

	const updateAtReceiveMessage = ({
		sent_by,
		updatedAt,
		chatroom,
		message
	}: {
		sent_by: { username: string };
		updatedAt: Date;
		message: string;
		chatroom: {
			_id: string;
			name?: string;
			room_type?: string;
			message_seen_list?: { user: { username: string }; message_seen: number; seen_date: Date }[];
		};
	}) => {
		contactListStore.update((contactList) => {
			const updatedList = [...contactList];
			const index = updatedList.findIndex((contact) => contact._id === chatroom._id);
			if (index === -1 && chatroom.name && chatroom.room_type && chatroom.message_seen_list) {
				updatedList.unshift({
					_id: chatroom._id,
					room_type: chatroom.room_type,
					name: chatroom.name,
					members: [sent_by, { username: get(writableUsername) }],
					message_seen: {
						index:
							get(page).url.pathname.substring(6) === chatroom._id
								? 0
								: chatroom.message_seen_list.find((m) => m.user.username === get(writableUsername))
										?.message_seen || 1,
						date: new Date()
					},
					message_updated: {
						sent_by,
						message,
						updatedAt
					}
				});
			} else {
				const movedChatroom = updatedList.splice(index, 1)[0];
				updatedList.unshift({
					_id: movedChatroom._id,
					room_type: movedChatroom.room_type,
					name: movedChatroom.name,
					members: movedChatroom.members,
					message_seen: {
						index:
							get(page).url.pathname.substring(6) === chatroom._id
								? 0
								: movedChatroom.message_seen.index + 1,
						date: new Date()
					},
					message_updated: {
						sent_by,
						message,
						updatedAt
					}
				});
			}
			return updatedList;
		});
	};

	const updateAtSeenMessage = (chatroomid: string) => {
		contactListStore.update((contactList) => {
			const updatedList = [...contactList];
			const index = updatedList.findIndex((contact) => contact._id === chatroomid);
			if (index !== -1) {
				updatedList[index] = {
					...updatedList[index],
					message_seen: {
						index: 0,
						date: new Date()
					}
				};
			}
			return updatedList;
		});
	};

	return {
		...contactListStore,
		updateAtReceiveMessage,
		updateAtSeenMessage
	};
}

export const writableContactList = createContactListStore([]);
