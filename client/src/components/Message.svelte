<script lang="ts">
	import { onMount } from 'svelte';
	import { writableSocket } from '$lib/stores/SocketStore';
	import type { Socket } from 'socket.io-client';

	export let sender: string;
	export let message: string;
	let socketID: string;

	onMount(() => {
		writableSocket.subscribe((s: Socket) => {
			if (s.id) socketID = s.id;
		});
	});
</script>

{#if sender === socketID}
	<div class="flex items-center mb-2 flex-row-reverse">
		<div class="bg-gray-400 w-6 h-6 rounded-2xl inline-block ml-2"></div>
		<div class="bg-sky-200 inline-block px-4 py-1 rounded-2xl">{message}</div>
	</div>
{:else}
	<div class="flex items-center mb-2">
		<div class="bg-gray-400 w-6 h-6 rounded-2xl inline-block mr-2"></div>
		<div class="bg-sky-200 inline-block px-4 py-1 rounded-2xl">{message}</div>
	</div>
{/if}
