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
