import { io } from 'socket.io-client';
import { get, writable } from 'svelte/store';
import { writableMessages } from './MessageStore';
import type { Message } from './MessageStore';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { page } from '$app/stores';

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
	({
		sent_by,
		updatedAt,
		chatroom,
		message
	}: {
		sent_by: { username: string };
		updatedAt: Date;
		message: string;
		chatroom: string;
	}) => {
		if (get(page).url.pathname.substring(6) === chatroom)
			writableMessages.update((existingMessages) => [
				{ sent_by, updatedAt, message } as Message,
				...existingMessages
			]);
	}
);

addListener('authorize status', (status) => {
	if (status) console.log(`Successfully authorized`);
	else console.error(`Failed to authorize`);
});
