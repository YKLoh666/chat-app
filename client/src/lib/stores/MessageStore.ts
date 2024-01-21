import { writable } from 'svelte/store';

export type Message = {
	updatedAt: Date;
	message: string;
	sent_by:
		| {
				username: string;
		  }
		| undefined;
};

export const writableMessages = writable<Message[]>([]);
