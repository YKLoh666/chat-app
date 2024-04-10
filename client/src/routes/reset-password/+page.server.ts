import { PUBLIC_BASE_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load = (async ({ url, fetch }) => {
	console.log('first');
	const token = url.searchParams.get('token');

	const response = await fetch(`${dev ? PUBLIC_BASE_URL : ''}/api/users/validate-reset-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		credentials: 'include'
	});

	if (response.ok) {
		const { success, message, username } = await response.json();
		if (!success) {
			return { success, message };
		}
		return { success: true, username, token };
	} else return { success: false, message: 'Invalid token' };
}) satisfies PageServerLoad;
