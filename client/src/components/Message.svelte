<script lang="ts">
	import { writableUsername } from '$lib/stores/UserStore';
	import Profile from './images/profile.png';
	export let sent_by: { username: string } | undefined;
	export let message: string;
	export let updatedAt: Date;
</script>

{#if sent_by}
	{#if sent_by.username === $writableUsername}
		<div class="flex items-center mb-1 flex-row-reverse">
			<img class="w-6 h-6 rounded-full inline-block ml-2" src={Profile} alt="profile img" />
			<div
				class="bg-sky-200 inline-block px-4 py-1 rounded-md break-words max-w-72 sm:max-w-sm md:max-w-xs lg:max-w-lg"
				title={new Date(updatedAt).toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: 'numeric'
				})}
			>
				{message}
			</div>
		</div>
	{:else}
		<div class="flex items-center mb-1">
			<img class="w-6 h-6 rounded-full inline-block mr-2" src={Profile} alt="profile img" />
			<div
				class="bg-gray-200 inline-block px-4 py-1 rounded-md break-words max-w-72 sm:max-w-sm md:max-w-xs lg:max-w-lg"
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
		<div class="text-gray-500 inline-block px-4 py-1 rounded-md">
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
