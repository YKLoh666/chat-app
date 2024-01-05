import { writable } from 'svelte/store';

type Message = {
	sender: string;
	message: string;
};

export const messagesStore = writable<Message[]>([]);
