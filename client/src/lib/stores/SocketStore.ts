import { Socket, io } from 'socket.io-client';
import { get, writable, type Writable } from 'svelte/store';
import { writableMessages } from './MessageStore';
import { writableUsername } from './UserStore';
import type { Message } from './MessageStore';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { page } from '$app/stores';
import { writableContactList } from './ContactListStore';
import { dev } from '$app/environment';

export let socket: Socket;
export let writableSocket: Writable<Socket>;
export let addListener: <T>(event: string, callback: (...args: T[]) => void) => void;
export let removeListener: (event: string) => void;

if (typeof window !== 'undefined') {
	socket = io(dev ? PUBLIC_BASE_URL : window.location.origin, {
		withCredentials: true
	});

	writableSocket = writable(socket);

	addListener = <T>(event: string, callback: (...args: T[]) => void) => {
		if (!socket.hasListeners(event)) {
			socket.on(event, callback);
		}
	};

	removeListener = (event: string) => {
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
				active: boolean;
				members: {
					username: string;
					active: boolean;
				}[];
				message_seen_list: { user: { username: string }; message_seen: number; seen_date: Date }[];
			};
		}) => {
			console.log('message received');

			writableContactList.updateAtReceiveMessage({
				...data,
				chatroom: {
					...data.chatroom,
					message_seen: { index: 0, date: new Date() }
				}
			});
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
}
