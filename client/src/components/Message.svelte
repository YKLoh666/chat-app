<script lang="ts">
	import { writableUsername } from '$lib/stores/UserStore';
	import { generateProfile } from '$lib/utilities';
	export let sent_by: { username: string } | undefined;
	export let message: string;
	export let updatedAt: Date;
</script>

{#if sent_by}
	{#if sent_by.username === $writableUsername}
		<div class="flex items-end mb-1 flex-row-reverse">
			<div
				class="bg-sky-200 inline-block px-4 py-1 rounded-md break-words max-w-xs md:max-w-lg"
				title={new Date(updatedAt).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: 'numeric'
				})}
			>
				{message}
			</div>
		</div>
	{:else}
		<div class="flex items-end mb-1">
			<img
				class="w-6 h-6 rounded-xl inline-block mr-2"
				src={generateProfile(sent_by.username)}
				alt="profile img"
			/>
			<div
				class="bg-gray-200 inline-block px-4 py-1 rounded-md break-words max-w-xs md:max-w-lg"
				title={new Date(updatedAt).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: 'numeric'
				})}
			>
				{message}
			</div>
		</div>
	{/if}
{:else}
	<div class="flex items-center justify-center mb-1">
		<div class="text-gray-500 inline-block px-4 py-1">
			{`${message} · ${
				Date.now() - new Date(updatedAt).getTime() < 24 * 60 * 60 * 1000
					? new Date(updatedAt).toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: 'numeric'
						})
					: new Date(updatedAt).toLocaleDateString('en-US', {
							day: 'numeric',
							month: 'short',
							year: 'numeric'
						})
			}`}
		</div>
	</div>
{/if}
