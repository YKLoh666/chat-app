<script lang="ts">
	import axios from 'axios';
	import { writableUsername } from '$lib/stores/UserStore';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { socket } from '$lib/stores/SocketStore';
	import { dev } from '$app/environment';

	export let route: string;

	const logout = async () => {
		try {
			await axios.post(
				`${dev ? PUBLIC_BASE_URL : ''}/api/users/logout`,
				{ username: $writableUsername },
				{ withCredentials: true }
			);
			writableUsername.set('');

			socket.emit('logout');
		} catch (err) {
			console.error(err);
		}
		location.href = '/';
	};
</script>

<header
	class="bg-sky-500 p-3 px-10 shadow-md flex flex-row justify-between items-center min-h-[10vh]"
>
	<h1 class="font-light text-2xl text-white">Chat App</h1>

	{#if route === '/register'}
		<a href="/" class="btn-secondary">Login</a>
	{:else if route === '/chat' || route.startsWith('/chat/')}
		<button on:click={logout} class="btn-secondary">Logout</button>
	{:else}
		<a href="/register" class="btn-secondary">Register</a>
	{/if}
</header>
