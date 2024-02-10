<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { writableUsername } from '$lib/stores/UserStore';
	import { PUBLIC_BASE_URL } from '$env/static/public';

	$: email = '';

	let emailRef: HTMLInputElement | null = null;

	let url: undefined | string = undefined;

	let submitButton: HTMLInputElement | undefined = undefined;

	onMount(async () => {
		try {
			const { validated, username } = (
				await axios.get(`${PUBLIC_BASE_URL}/api/users/validate`, { withCredentials: true })
			).data;
			if (validated) await goto('/chat', { invalidateAll: true, replaceState: true });
			writableUsername.set(username);
		} catch (err) {
			console.error(err);
		}
		if (emailRef) emailRef.focus();
	});

	const handleSubmit = async () => {
		submitButton?.toggleAttribute('disabled', true);
		submitButton?.setAttribute('value', 'Sending email...');

		try {
			const data = (
				await axios.post(`${PUBLIC_BASE_URL}/api/users/forgotpassword`, {
					email
				})
			).data;

			if (data.success) {
				alert('Email sent to your inbox');
				console.log(data);
				url = data.mail;
			} else {
				console.error('Email failed to be sent, please try again later');
			}
		} catch (error) {
			console.log(error);
		}

		submitButton?.toggleAttribute('disabled', false);
		submitButton?.setAttribute('value', 'Send verification email');
	};
</script>

<form
	class="w-5/6 box-border mx-auto my-24 flex flex-col items-center border rounded-md p-0 pb-10 shadow-lg lg:w-1/3 lg:p-4 justify-center"
	on:submit|preventDefault={handleSubmit}
>
	<h1 class="text-2xl m-4">Forgot Password</h1>
	<p class="text-justify form-group py-4 text-neutral-500">
		A verification email will be sent into your email inbox. Click on the link attached in the email
		to redirect to reset password page.
	</p>
	<div class="form-group">
		<input
			type="email"
			id="username"
			bind:value={email}
			class="form-control"
			placeholder=""
			bind:this={emailRef}
			required
		/>
		<div class="form-label">Email</div>
	</div>
	<div class="form-group">
		<input
			bind:this={submitButton}
			type="submit"
			value="Send verification email"
			class="btn-primary disabled:bg-gray-500 disabled:shadow-none disabled:cursor-default"
		/>
	</div>
	{#if url}
		<a href={url} target="_blank" class="hover:underline text-red-500 mt-4">Preview email here</a>
	{/if}
	<div class="form-group flex justify-center mt-6">
		<a href="/" class="text-sm text-blue-600 hover:underline">Back to Login</a>
	</div>
</form>
