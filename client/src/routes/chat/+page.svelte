<script lang="ts">
	import { onMount } from 'svelte';
	import Chatbox from '../../components/Chatbox.svelte';
	import Messages from '../../components/Messages.svelte';
	import { goto } from '$app/navigation';
	import axios from 'axios';

	onMount(async () => {
		if (
			!(await axios.get('http://localhost:5000/api/users', { withCredentials: true })).data
				.validated
		)
			await goto('/', { invalidateAll: true, replaceState: true });
	});
</script>

<Messages />
<Chatbox />
