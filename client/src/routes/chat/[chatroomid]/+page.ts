import { PUBLIC_BASE_URL } from '$env/static/public';
import { writableChatroom } from '$lib/stores/ChatroomStore';
import { writableContactList } from '$lib/stores/ContactListStore';
import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	writableContactList.subscribe(async (contactList) => {
		writableChatroom.set(contactList.find((contact) => contact._id === params.chatroomid));
	});
	try {
		const response = await fetch(`${PUBLIC_BASE_URL}/api/messages/${params.chatroomid}?step=0`, {
			credentials: 'include'
		});
		const { messages } = await response.json();
		return { messages };
	} catch (err) {
		console.error(err);
		return {};
	}
}) satisfies PageLoad;
