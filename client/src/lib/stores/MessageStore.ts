import { writable } from 'svelte/store';

export type Message = {
	sender: string;
	message: string;
};

export const messagesStore = writable<Message[]>([]);
