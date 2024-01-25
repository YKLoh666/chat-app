import type { LayoutLoad } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { writableContactList, type ChatroomFromDB } from '$lib/stores/ContactListStore';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ fetch, url }) => {
	const { validated, username } = await (
		await fetch(`${PUBLIC_BASE_URL}/api/users/validate`, { credentials: 'include' })
	).json();
	// redirect cannot be inside try/catch block
	if (!validated) redirect(307, `/?redirect=${url.pathname}${url.search}`);
	try {
		const response = await fetch(`${PUBLIC_BASE_URL}/api/chatrooms?skip=0`, {
			credentials: 'include'
		});
		const { chatrooms }: { chatrooms: ChatroomFromDB[] } = await response.json();

		if (chatrooms) {
			writableContactList.setContactList(chatrooms, username);

			return { chatrooms };
		} else {
			return {};
		}
	} catch (err) {
		console.error(err);
	}
}) satisfies LayoutLoad;
