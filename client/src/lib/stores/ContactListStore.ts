import { writable } from 'svelte/store';

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

export const writableContactList = writable<Chatroom[]>([]);
