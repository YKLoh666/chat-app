import { get, writable } from 'svelte/store';
import { writableUsername } from './UserStore';
import { page } from '$app/stores';

export type Chatroom = {
	_id: string;
	room_type: string;
	name: string;
	active: boolean;
	members: {
		username: string;
	}[];
	message_seen: {
		index: number;
		date: Date;
	};
	newest_message: {
		sent_by: {
			username: string;
		};
		message: string;
		updatedAt: Date;
	};
};

export type ChatroomFromDB = {
	_id: string;
	room_type: string;
	name: string;
	public: boolean;
	members: {
		username: string;
		active: boolean;
	}[];
	newest_message: {
		message: string;
		sent_by: {
			username: string;
		};
		updatedAt: Date;
	};
	message_seen_list: [
		{
			user: {
				username: string;
			};
			message_seen: number;
			seen_date: Date;
		}
	];
};

function createContactListStore(initialValue: Chatroom[]) {
	const contactListStore = writable<Chatroom[]>(initialValue);

	const setContactList = (contactList: ChatroomFromDB[], username: string) => {
		contactListStore.set(morphContactList(contactList, username));
	};

	const updateAtReceiveMessage = ({
		sent_by,
		updatedAt,
		chatroom,
		message
	}: {
		sent_by: { username: string };
		updatedAt: Date;
		message: string;
		chatroom: {
			_id: string;
			name?: string;
			room_type?: string;
			message_seen_list?: { user: { username: string }; message_seen: number; seen_date: Date }[];
			active?: boolean;
		};
	}) => {
		contactListStore.update((contactList) => {
			const updatedList = [...contactList];
			const index = updatedList.findIndex((contact) => contact._id === chatroom._id);

			if (index === -1 && chatroom.name && chatroom.room_type) {
				updatedList.unshift({
					_id: chatroom._id,
					room_type: chatroom.room_type,
					name: chatroom.name,
					active: chatroom.active || false,
					members: [sent_by, { username: get(writableUsername) }],
					message_seen: {
						index:
							chatroom.message_seen_list?.find((m) => m.user.username === get(writableUsername))
								?.message_seen || get(page).url.pathname.substring(6) === chatroom._id
								? 0
								: 1,
						date: new Date()
					},
					newest_message: {
						sent_by,
						message,
						updatedAt
					}
				});
			} else {
				const movedChatroom = updatedList.splice(index, 1)[0];
				updatedList.unshift({
					_id: movedChatroom._id,
					room_type: movedChatroom.room_type,
					name: movedChatroom.name,
					active: chatroom.active || false,
					members: movedChatroom.members,
					message_seen: {
						index:
							get(page).url.pathname.substring(6) === chatroom._id
								? 0
								: movedChatroom.message_seen.index + 1,
						date: new Date()
					},
					newest_message: {
						sent_by,
						message,
						updatedAt
					}
				});
			}
			console.log(updatedList);

			return updatedList;
		});
	};

	const updateAtSeenMessage = (chatroomid: string) => {
		contactListStore.update((contactList) => {
			const updatedList = [...contactList];
			const index = updatedList.findIndex((contact) => contact._id === chatroomid);
			if (index !== -1) {
				updatedList[index] = {
					...updatedList[index],
					message_seen: {
						index: 0,
						date: new Date()
					}
				};
			}
			return updatedList;
		});
	};

	return {
		...contactListStore,
		setContactList,
		updateAtReceiveMessage,
		updateAtSeenMessage
	};
}

export const writableContactList = createContactListStore([]);

export const morphContactList = (chatrooms: ChatroomFromDB[], username: string) => {
	return chatrooms.map((chatroom) => {
		return morphChatroom(chatroom, username);
	}) as Chatroom[];
};

export const morphChatroom = (chatroom: ChatroomFromDB, username: string) => {
	const message_seen_obj = chatroom.message_seen_list?.find(
		(obj) => obj.user.username === username
	);
	let name;

	if (chatroom.room_type === 'GROUP') {
		name = chatroom.name;
	} else if (chatroom.room_type === 'DUO') {
		const otherMember = chatroom.members?.find((val) => val.username !== username);
		name = otherMember ? otherMember.username : 'unknown';
	} else {
		name = `${username} (me)`;
	}

	return {
		_id: chatroom._id,
		room_type: chatroom.room_type,
		name,
		active: chatroom.members.find((member) => member.username !== get(writableUsername))?.active,
		members: chatroom.members,
		message_seen: {
			index: message_seen_obj?.message_seen ?? 0,
			date: message_seen_obj?.seen_date ?? new Date()
		},
		newest_message: chatroom.newest_message
	} as Chatroom;
};
