import { PUBLIC_BASE_URL } from '$env/static/public';
import { type ChatroomFromDB } from '$lib/stores/ContactListStore';
import type { Message } from '$lib/stores/MessageStore';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	try {
		const response = await fetch(`${PUBLIC_BASE_URL}/api/messages/${params.chatroomid}?skip=0`, {
			credentials: 'include'
		});
		const { messages }: { messages: Message[] | boolean } = await response.json();
		const { chatroom }: { chatroom: ChatroomFromDB } = await (
			await fetch(`${PUBLIC_BASE_URL}/api/chatrooms/${params.chatroomid}`, {
				credentials: 'include'
			})
		).json();
		if (messages) return { messages, chatroom };
	} catch (err) {
		console.error(err);
	}
	error(404, { message: 'Messages not found' });
}) satisfies PageServerLoad;
