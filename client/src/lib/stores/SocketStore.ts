import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import { messagesStore } from './MessageStore';
import type { Message } from './MessageStore';
import axios from 'axios';

export const socket = io('http://localhost:5000', { withCredentials: true });

export const writableSocket = writable(socket);

export const addListener = <T>(event: string, callback: (...args: T[]) => void) => {
	if (!socket.hasListeners(event)) {
		socket.on(event, callback);
	}
};

export const removeListener = (event: string) => {
	socket.off(event);
};

addListener('received message', (data) => {
	messagesStore.update((existingMessages) => [...existingMessages, data as Message]);
});

addListener('join room', async (username) => {
	try {
		await axios.put(
			`http://localhost:5000/api/users/${username}`,
			{
				active: true,
				socketId: socket.id
			},
			{ withCredentials: true }
		);
	} catch (err) {
		console.error(err);
	}
});
