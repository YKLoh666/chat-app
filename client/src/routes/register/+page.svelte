<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import Eye from '../../components/icons/Eye.svelte';
	import EyeOff from '../../components/icons/EyeOff.svelte';
	import { onMount } from 'svelte';
	import { writableUsername } from '$lib/stores/UserStore';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { dev } from '$app/environment';

	$: username = '';
	$: email = '';
	$: password = '';
	$: isShowing = false;

	let usernameRef: HTMLInputElement | null = null;

	onMount(async () => {
		try {
			const { validated, username } = (
				await axios.get(`${dev ? PUBLIC_BASE_URL : ''}/api/users/validate`, {
					withCredentials: true
				})
			).data;
			if (validated) await goto('/chat', { invalidateAll: true, replaceState: true });
			writableUsername.set(username);
		} catch (err) {
			console.error(err);
		}
		if (usernameRef) usernameRef.focus();
	});

	const handleSubmit = async () => {
		try {
			const data = (
				await axios.post(
					`${dev ? PUBLIC_BASE_URL : ''}/api/users/register`,
					{
						username,
						email,
						password
					},
					{ withCredentials: true }
				)
			).data;

			if (data.success) {
				alert('Successfully registered user.');
				location.href = '/chat';
			} else {
				console.error(data.message);
				alert(data.message);
			}
		} catch (error) {
			console.log(error);
		}
	};
</script>

<form
	class="w-5/6 box-border mx-auto my-24 flex flex-col items-center border rounded-md p-0 pb-10 shadow-lg lg:w-1/3 lg:p-4"
	on:submit|preventDefault={handleSubmit}
>
	<h1 class="text-2xl m-4">Register</h1>
	<div class="form-group">
		<input
			type="text"
			id="username"
			bind:value={username}
			class="form-control"
			placeholder=""
			bind:this={usernameRef}
			pattern="^[a-zA-Z0-9._]+$"
			required
		/>
		<div class="form-label">Username</div>
	</div>
	<div class="form-group">
		<input type="email" bind:value={email} class="form-control" placeholder="" required />
		<div class="form-label">Email</div>
	</div>
	<div class="form-group">
		{#if isShowing}
			<input type="text" bind:value={password} class="form-control" placeholder="" required />
		{:else}
			<input type="password" bind:value={password} class="form-control" placeholder="" required />
		{/if}
		<div class="form-label">Password</div>
		<div class="absolute bottom-0 p-2 w-full flex justify-end pointer-events-none">
			<button
				type="button"
				class="pointer-events-auto"
				on:mousedown={() => (isShowing = !isShowing)}
				on:click={() => {
					isShowing = !isShowing;
				}}
			>
				{#if !isShowing}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		</div>
	</div>
	<div class="form-group">
		<input type="submit" value="Register" class="btn-primary" />
	</div>
	<div class="form-group flex justify-center mt-6">
		<a href="/" class="text-sm text-blue-600 hover:underline">Already have an account</a>
	</div>
</form>
