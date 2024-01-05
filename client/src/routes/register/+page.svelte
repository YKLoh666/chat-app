<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: username = '';
	$: email = '';
	$: password = '';
</script>

<form
	class="w-1/3 box-border mx-auto my-24 flex flex-col items-center border rounded-md p-4 pb-10 shadow-lg"
>
	<h1 class="text-2xl m-4">Register</h1>
	<div class="form-group">
		<input type="text" bind:value={username} class="form-control" placeholder="" />
		<div class="form-label">Username</div>
	</div>
	<div class="form-group">
		<input type="email" bind:value={email} class="form-control" placeholder="" />
		<div class="form-label">Email</div>
	</div>
	<div class="form-group">
		<input type="password" bind:value={password} class="form-control" placeholder="" />
		<div class="form-label">Password</div>
	</div>
	<div class="form-group">
		<input type="submit" value="Register" class="btn-primary" />
	</div>
	<div class="form-group flex justify-center mt-6">
		<a href="/" class="text-sm text-blue-600 hover:underline">Already have an account</a>
	</div>
</form>
