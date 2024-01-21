import axios from 'axios';
import type { LayoutLoad } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';

type Chatroom = {
	_id: string;
	room_type: string;
	members: {
		username: string;
	}[];
};

export const load = (async () => {
	try {
		const { chatrooms }: { chatrooms: Chatroom[] } = (
			await axios.get(`${PUBLIC_BASE_URL}/api/chatrooms`, { withCredentials: true })
		).data;

		if (!chatrooms) {
			return { success: false, message: 'Failed to fetch chatrooms' };
		} else {
			return { success: true, chatrooms };
		}
	} catch (error) {
		console.error(error);
		return { success: false, message: 'Failed to fetch chatrooms' };
	}
}) satisfies LayoutLoad;
