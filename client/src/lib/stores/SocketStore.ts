import { io } from 'socket.io-client';
import { writable } from 'svelte/store';
import { messagesStore } from './MessageStore';
import type { Message } from './MessageStore';

export const socket = io();

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
