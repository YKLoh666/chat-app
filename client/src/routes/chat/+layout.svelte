<script lang="ts">
	import { onMount } from 'svelte';
	import ContactList from '../../components/ContactList.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';
	onMount(async () => {
		const { validated, username } = await (
			await fetch(`${PUBLIC_BASE_URL}/api/users`, { credentials: 'include' })
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

<main class="h-[90vh] w-full box-border flex">
	<ContactList />
	<div class="flex flex-col h-full w-3/4">
		<slot />
	</div>
</main>
