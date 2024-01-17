import axios from 'axios';
import type { LayoutLoad } from './$types';

type Chatroom = {
	_id: string;
	room_type: string;
	members: {
		username: string;
	}[];
};

type Message = {
	sent_by: {
		username: string;
	};
	message: string;
	updatedAt: Date;
};

export const load = (async () => {
	try {
		const { chatrooms }: { chatrooms: Chatroom[] } = (
			await axios.get('http://localhost:5000/api/chatrooms', { withCredentials: true })
		).data;

		if (!chatrooms) {
			return { success: false, message: 'Failed to fetch chatrooms' };
		} else {
			const recentMessageList: Message[] = await Promise.all(
				chatrooms.map(async (chatroom) => {
					const { message } = (
						await axios.get(
							`http://localhost:5000/api/messages/get-newest-message/${chatroom._id}`,
							{
								withCredentials: true
							}
						)
					).data;
					return message;
				})
			);
			console.log(recentMessageList);

			return { success: true, chatrooms, recentMessageList };
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Failed to fetch chatrooms' };
	}
}) satisfies LayoutLoad;
