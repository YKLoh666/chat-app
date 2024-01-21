<script lang="ts">
	import { writableUsername } from '$lib/stores/UserStore';

	export let sent_by: { username: string } | undefined;
	export let message: string;
	export let updatedAt: Date;
</script>

{#if sent_by}
	{#if sent_by.username === $writableUsername}
		<div
			class="flex items-center mb-2 flex-row-reverse"
			title={new Date(updatedAt).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric'
			})}
		>
			<div class="bg-gray-400 w-6 h-6 rounded-2xl inline-block ml-2"></div>
			<div class="bg-sky-200 inline-block px-4 py-1 rounded-2xl">{message}</div>
		</div>
	{:else}
		<div
			class="flex items-center mb-2"
			title={new Date(updatedAt).toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: 'numeric'
			})}
		>
			<div class="bg-gray-400 w-6 h-6 rounded-2xl inline-block mr-2"></div>
			<div class="bg-sky-200 inline-block px-4 py-1 rounded-2xl">{message}</div>
		</div>
	{/if}
{:else}
	<div class="flex items-center justify-center mb-2">
		<div class="text-gray-500 inline-block px-4 py-1 rounded-2xl">
			{`${message} · ${new Date(updatedAt).toLocaleTimeString(
				'en-US',
				Date.now() - new Date(updatedAt).getTime() < 24 * 60 * 60 * 1000
					? {
							hour: 'numeric',
							minute: 'numeric'
						}
					: {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						}
			)}`}
		</div>
	</div>
{/if}
