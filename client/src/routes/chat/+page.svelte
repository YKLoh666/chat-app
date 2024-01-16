<script lang="ts">
	import { onMount } from 'svelte';
	import Chatbox from '../../components/Chatbox.svelte';
	import Messages from '../../components/Messages.svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import ContactList from '../../components/ContactList.svelte';
	import type { PageData } from '../chat/$types';
	import { socket } from '$lib/stores/SocketStore';
	import { writableUsername } from '$lib/stores/UserStore';

	export let data: PageData;

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

<main class="h-[90vh] w-full flex box-border">
	<ContactList {data} />
	<div class="flex flex-col flex-grow-[5] h-full">
		<Messages />
		<Chatbox />
	</div>
</main>
