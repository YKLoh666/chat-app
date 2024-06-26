<script lang="ts">
	import SearchIcon from './icons/Search.svelte';
	import { generateProfile, search } from '$lib/utilities';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';

	export let boxClassName: string;
	export let inputClassName: string;

	let searchString: string = '';
	let lastSearch: string = '';
	let result: { username: string; active: boolean }[] | boolean | number = -1;
	let isFocus: boolean = false;
	let shouldShow = false;
	let timeout: NodeJS.Timeout;

	$: if (searchString === '') {
		result = -1;
		lastSearch = '';
	}
	$: {
		if (isFocus) {
			shouldShow = true;
			if (timeout) clearTimeout(timeout);
		} else {
			timeout = setTimeout(() => {
				shouldShow = false;
			}, 500);
		}
	}
	setInterval(async () => {
		if (searchString !== '' && searchString !== lastSearch) {
			result = -2;
			lastSearch = searchString;
			result = await search(searchString, 0);
		}
	}, 1000);

	const focused = () => (isFocus = true);
	const blurred = () => (isFocus = false);

	const navigate = async (username: string) => {
		try {
			const {
				chatroom: { _id }
			} = (
				await axios.get(`${dev ? PUBLIC_BASE_URL : ''}/api/chatrooms/duo?username=${username}`, {
					withCredentials: true
				})
			).data;
			console.log(_id);

			await goto(`/chat/${_id}`, { invalidateAll: true, replaceState: true });
		} catch (err) {
			console.error(err);
		}
	};
</script>

<div class="m-3 relative justify-center flex-col {boxClassName}">
	<div class="flex flex-row">
		<SearchIcon />
		<input
			type="text"
			class="p-1 pl-8 rounded-md border self-center {inputClassName}"
			placeholder="Search"
			bind:value={searchString}
			on:focus={focused}
			on:blur={blurred}
		/>
	</div>
	<div
		class="absolute top-[2.1rem] z-10 bg-white w-full border p-3 rounded-b-lg max-h-[60vh] overflow-y-auto {!shouldShow
			? 'hidden'
			: ''} "
	>
		{#if !result}
			<p>Server error. Failed to fetch result.</p>
		{:else if result === -1}
			<p>Type in to explore</p>
		{:else if result === -2}
			<p>Searching...</p>
		{:else if result instanceof Array}
			{#each result as user}
				<!-- Show profile picture, username and active status -->
				<button
					class="w-full p-3 rounded-md flex justify-between items-center hover:bg-gray-100"
					on:click={() => navigate(user.username)}
					on:focus={focused}
					on:blur={blurred}
				>
					<img class="w-12 h-12 rounded-full" src={generateProfile(user.username)} alt="Profile" />
					<p class="text-lg text-gray-600">
						{user.username}
					</p>
				</button>
			{:else}
				<p>No result.</p>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	::-webkit-scrollbar {
		display: block;
	}
	::-webkit-scrollbar-track {
		background-color: #fff;
	}

	::-webkit-scrollbar-thumb {
		background-color: #0005;
	}
</style>
