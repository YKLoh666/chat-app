<script lang="ts">
	import { onMount } from 'svelte';
	import ContactList from '../../components/ContactList.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';
	import Searchbox from '../../components/Searchbox.svelte';
	onMount(async () => {
		const { validated, username } = await (
			await fetch(`${PUBLIC_BASE_URL}/api/users/validate`, { credentials: 'include' })
		).json();
		if (!validated) {
			goto(`/?redirect=${$page.url.pathname}${$page.url.search}`, {
				invalidateAll: true,
				replaceState: true
			});
		} else {
			socket.emit('authenticated', username);
			writableUsername.set(username);
		}
	});
</script>

<main class="h-[90vh] min-w-[320px] box-border flex">
	<div
		class="h-full border w-[15%] box-border flex-grow-0 flex-shrink-0 md:w-96 2xl:w-1/5 flex flex-col"
	>
		<h1 class="text-2xl font-bold p-4 pb-0 hidden self-start md:block">Chats</h1>
		<Searchbox />
		<ContactList />
	</div>
	<div class="flex flex-col h-full w-[85%] md:w-3/4 2xl:w-4/5">
		<slot />
	</div>
</main>
