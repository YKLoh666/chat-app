import { io } from 'socket.io-client';
import { get, writable } from 'svelte/store';
import { writableMessages } from './MessageStore';
import { writableUsername } from './UserStore';
import type { Message } from './MessageStore';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { page } from '$app/stores';
import { writableContactList } from './ContactListStore';

export const socket = io(PUBLIC_BASE_URL, { withCredentials: true });

export const writableSocket = writable(socket);

export const addListener = <T>(event: string, callback: (...args: T[]) => void) => {
	if (!socket.hasListeners(event)) {
		socket.on(event, callback);
	}
};

export const removeListener = (event: string) => {
	socket.off(event);
};

addListener(
	'received message',
	(data: {
		sent_by: { username: string };
		updatedAt: Date;
		message: string;
		chatroom: {
			_id: string;
			name: string;
			room_type: string;
			message_seen_list: { user: { username: string }; message_seen: number; seen_date: Date }[];
		};
	}) => {
		console.log('message received');

		updateContactList(data);
		if (get(page).url.pathname.substring(6) === data.chatroom._id) {
			writableMessages.updateMessages(
				data.chatroom._id,
				get(writableUsername),
				(existingMessages) => [
					{ sent_by: data.sent_by, updatedAt: data.updatedAt, message: data.message } as Message,
					...existingMessages
				]
			);
		}
	}
);

addListener('authorize status', (status) => {
	if (status) console.log(`Successfully authorized`);
	else console.error(`Failed to authorize`);
});

export const updateContactList = ({
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
	writableContactList.update((contactList) => {
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
