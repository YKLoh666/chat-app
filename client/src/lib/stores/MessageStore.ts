import { get, writable } from 'svelte/store';
import { socket } from './SocketStore';
import { writableContactList } from './ContactListStore';

export type Message = {
	updatedAt: Date;
	message: string;
	sent_by:
		| {
				username: string;
		  }
		| undefined;
};

function createMessageStore(initialValue: Message[]) {
	const messagesStore = writable<Message[]>(initialValue);

	function setMessages(chatroomid: string, username: string, value: Message[]) {
		messagesStore.set(value);
		if (checkMessageSeenIndex(chatroomid))
			socket.emit('update seen list', { chatroomid, username });
		writableContactList.updateAtSeenMessage(chatroomid);
	}

	function updateMessages(
		chatroomid: string,
		username: string,
		updater: (messages: Message[]) => Message[]
	) {
		messagesStore.update(updater);
		console.log('message update');

		if (checkMessageSeenIndex(chatroomid))
			socket.emit('update seen list', { chatroomid, username });
	}

	return {
		...messagesStore,
		setMessages,
		updateMessages
	};
}

export const writableMessages = createMessageStore([]);

const checkMessageSeenIndex = (chatroomid: string) => {
	return get(writableContactList).find((contact) => contact._id === chatroomid)?.message_seen.index;
};
