<script lang="ts">
	import EyeOff from '../components/icons/EyeOff.svelte';
	import Eye from '../components/icons/Eye.svelte';

	$: uid = '';
	$: password = '';
	$: isShowing = false;
	$: rmbMe = false;

	const login = () => {
		let isUsername = true;
		if (uid.includes('@')) isUsername = false; // is email

		if (isUsername) {
			// login with username
		} else {
			// login with email
		}

		// console.log(
		// 	`Login Credential: ${uid} is ${
		// 		isUsername ? 'username' : 'email'
		// 	}, the password is ${password}`
		// );
	};
</script>

<div class="p-3 mx-auto mt-16 container block items-center lg:flex">
	<div class="w-1/2 m-3 p-4 hidden lg:block"></div>
	<div class="w-full mx-auto m-3 p-4 lg:w-1/2 lg:mx-3">
		<form
			class="mx-auto w-full flex flex-col items-center border rounded p-0 pt-3 pb-12 shadow-lg lg:p-6 lg:w-4/6"
			on:submit|preventDefault={login}
		>
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					id="username"
					name="username"
					placeholder=""
					bind:value={uid}
					required
				/>
				<div class="form-label whitespace-nowrap">Username / Email</div>
			</div>
			<div class="form-group">
				{#if isShowing}
					<input
						type="text"
						name="password"
						id="password"
						class="form-control"
						placeholder=""
						bind:value={password}
						required
					/>
				{:else}
					<input
						type="password"
						name="password"
						id="password"
						class="form-control"
						placeholder=""
						bind:value={password}
						required
					/>
				{/if}
				<div class="form-label">Password</div>
				<div class="absolute bottom-0 p-2 w-full flex justify-end pointer-events-none">
					<button
						type="button"
						class="pointer-events-auto"
						on:click={() => (isShowing = !isShowing)}
					>
						{#if isShowing}
							<Eye />
						{:else}
							<EyeOff />
						{/if}
					</button>
				</div>
			</div>
			<label for="rmb-me" class="form-group px-1 pt-2 gap-2 flex items-center text-sm">
				<input type="checkbox" name="rmb-me" id="rmb-me" bind:checked={rmbMe} />
				Remember Me
			</label>
			<div class="form-group">
				<input type="submit" value="Login" class="btn-primary" />
			</div>
			<div class="form-group flex justify-between mt-6 text-sm items-center flex-wrap">
				<a href="/register" class="hover:underline text-red-600 mb-3">New account</a>
				<a href="/ForgotPassword" class="hover:underline text-blue-600 mb-3">Forgot password</a>
			</div>
		</form>
	</div>
</div>
