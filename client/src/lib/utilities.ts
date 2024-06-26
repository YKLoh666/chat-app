import { PUBLIC_BASE_URL } from '$env/static/public';
import { dev } from '$app/environment';

export const getTimeDifference = (currentDate: Date, receivedDate: Date): string => {
	const diffInMs = currentDate.getTime() - receivedDate.getTime();
	let timeMarker: string;

	if (diffInMs < 60 * 1000) timeMarker = `${Math.floor(diffInMs / 1000)}s`;
	else if (diffInMs < 60 * 60 * 1000) timeMarker = `${Math.floor(diffInMs / (1000 * 60))}m`;
	else if (diffInMs < 24 * 60 * 60 * 1000)
		timeMarker = `${Math.floor(diffInMs / (1000 * 60 * 60))}h`;
	else if (diffInMs < 7 * 24 * 60 * 60 * 1000)
		timeMarker = `${Math.floor(diffInMs / (1000 * 60 * 60 * 24))}d`;
	else timeMarker = `${Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7))}w`;

	return timeMarker;
};

export const search = async (searchString: string, skip: number) => {
	try {
		const { users } = await (
			await fetch(
				`${dev ? PUBLIC_BASE_URL : ''}/api/users/search?search=${encodeURIComponent(
					searchString
				)}&skip=${skip}`,
				{
					credentials: 'include'
				}
			)
		).json();
		return users as Array<{ username: string; active: boolean }>;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const generateProfile = (seed: string) =>
	`https://api.dicebear.com/7.x/initials/svg?seed=${seed}&fontFamily=Verdana&fontSize=51&backgroundColor=00897b,1e88e5,43a047,5e35b1,8e24aa,c0ca33,d81b60,f4511e,ffb300`;
