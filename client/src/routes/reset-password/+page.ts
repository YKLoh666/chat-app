import { PUBLIC_BASE_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const token = url.searchParams.get('token');

	const response = await fetch(`${PUBLIC_BASE_URL}/api/users/validate-reset-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});

	if (response.ok) {
		const { success, message, username } = await response.json();
		if (!success) {
			return { success, message };
		}
		return { success: true, username, token };
	} else return { success: false, message: 'Invalid token' };
}) satisfies PageLoad;
