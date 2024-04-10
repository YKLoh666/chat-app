<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { onMount } from 'svelte';
	import { writableUsername } from '$lib/stores/UserStore';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import { dev } from '$app/environment';

	$: email = '';

	let emailRef: HTMLInputElement | null = null;

	let url: undefined | string = undefined;

	let submitButton: HTMLInputElement | undefined = undefined;

	let errMessage: string | undefined = undefined;

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
		if (emailRef) emailRef.focus();
	});

	const handleSubmit = async () => {
		submitButton?.toggleAttribute('disabled', true);
		emailRef?.toggleAttribute('disabled', true);
		let text = 'Sending email';
		let textLength = text.length;
		submitButton?.setAttribute('value', text);
		const interval = setInterval(() => {
			if (text.length - textLength === 3) text = 'Sending email';
			else text += '.';
			submitButton?.setAttribute('value', text);
		}, 700);

		try {
			const data = (
				await axios.post(`${dev ? PUBLIC_BASE_URL : ''}/api/users/forgotpassword`, {
					email
				})
			).data;

			if (data.success) {
				alert('Email sent to your inbox');
				console.log(data);
				url = data.mail;
				errMessage = undefined;
			} else {
				console.error(data.message);
				errMessage = data.message;
			}
		} catch (error) {
			console.log(error);
		}

		submitButton?.toggleAttribute('disabled', false);
		clearInterval(interval);
		submitButton?.setAttribute('value', 'Send verification email');
		emailRef?.toggleAttribute('disabled', false);
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
	{#if errMessage}
		<div class="w-2/3">
			<p class="text-red-500 text-sm mt-4 border border-red-300 p-3 py-1 rounded">{errMessage}</p>
		</div>
	{/if}
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
