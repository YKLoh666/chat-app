<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import ContactList from '../../components/ContactList.svelte';
	import type { LayoutData } from './$types';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';

	export let data: LayoutData;

	onMount(async () => {
		const { validated, username } = (
			await axios.get('http://localhost:5000/api/users', { withCredentials: true })
		).data;
		if (!validated) await goto('/', { invalidateAll: true, replaceState: true });
		else {
			writableUsername.set(username);
			socket.emit('authenticated', username);
		}
	});
</script>

<main class="h-[90vh] w-full box-border flex">
	<ContactList {data} />
	<div class="flex flex-col h-full w-3/4">
		<slot />
	</div>
</main>
