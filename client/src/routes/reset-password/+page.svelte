<script lang="ts">
	import Eye from '../../components/icons/Eye.svelte';
	import EyeOff from '../../components/icons/EyeOff.svelte';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';

	export let data: PageData;

	onMount(async () => {
		if (!data.success) {
			alert(data.message);
			await goto('/');
		}
	});

	$: isShowing1 = false;
	$: isShowing2 = false;
	$: password1 = '';
	$: password2 = '';

	let errMessage = '';

	const handleSubmit = async () => {
		if (password1 !== password2) {
			errMessage = 'Passwords do not match';
			return;
		}

		try {
			const response = await fetch(`${dev && PUBLIC_BASE_URL}/api/users/reset-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + data.token
				},
				body: JSON.stringify({
					username: data.username,
					password: password1
				})
			});

			if (response.ok) {
				const { success, message } = await response.json();
				if (success) {
					alert('Password is reset successfully.');
					await goto('/');
				} else {
					errMessage = message;
				}
			} else {
				errMessage = 'Internal Server Error, please try again later.';
			}
		} catch (err) {
			console.error(err);
		}
	};
</script>

<form
	class="w-5/6 box-border mx-auto my-24 flex flex-col items-center border rounded-md p-0 py-10 shadow-lg lg:w-1/3 justify-center"
	on:submit|preventDefault={handleSubmit}
>
	<h1 class="text-2xl m-4">Reset Password</h1>
	<div class="form-group">
		{#if isShowing1}
			<input type="text" bind:value={password1} class="form-control" placeholder="" required />
		{:else}
			<input type="password" bind:value={password1} class="form-control" placeholder="" required />
		{/if}
		<div class="form-label">New Password</div>
		<div class="absolute bottom-0 p-2 w-full flex justify-end pointer-events-none">
			<button
				type="button"
				class="pointer-events-auto"
				on:mousedown={() => (isShowing1 = !isShowing1)}
				on:click={() => {
					isShowing1 = !isShowing1;
				}}
			>
				{#if !isShowing1}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		</div>
	</div>
	<div class="form-group">
		{#if isShowing2}
			<input type="text" bind:value={password2} class="form-control" placeholder="" required />
		{:else}
			<input type="password" bind:value={password2} class="form-control" placeholder="" required />
		{/if}
		<div class="form-label">Confirm Password</div>
		<div class="absolute bottom-0 p-2 w-full flex justify-end pointer-events-none">
			<button
				type="button"
				class="pointer-events-auto"
				on:mousedown={() => (isShowing2 = !isShowing2)}
				on:click={() => {
					isShowing2 = !isShowing2;
				}}
			>
				{#if !isShowing2}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		</div>
	</div>
	{#if errMessage}
		<div class="w-2/3">
			<p class="text-red-500 text-sm mt-4 border border-red-300 p-3 py-1 rounded">{errMessage}</p>
		</div>
	{/if}
	<div class="form-group m-4 mt-8">
		<input type="submit" value="Submit" class="btn-primary" />
	</div>
</form>
