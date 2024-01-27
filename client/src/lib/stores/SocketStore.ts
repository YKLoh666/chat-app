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

		writableContactList.updateAtReceiveMessage(data);
		if (get(page).params.chatroomid === data.chatroom._id) {
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
