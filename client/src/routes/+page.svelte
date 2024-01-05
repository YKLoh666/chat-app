<script>
	$: uid = '';
	$: password = '';
	$: rmbMe = false;

	const login = () => {
		console.log('Hello');
	};
</script>

<div class="p-3 mx-auto mt-16 container flex items-center">
	<div class="w-7/12 m-3 p-4"></div>
	<div class="w-5/12 m-3 p-4">
		<form
			class="mx-auto w-4/5 flex flex-col items-center border rounded p-6 pb-12 shadow-lg"
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
				<input
					type="password"
					name="password"
					id="password"
					class="form-control"
					placeholder=""
					bind:value={password}
					required
				/>
				<div class="form-label">Password</div>
			</div>
			<label for="rmb-me" class="form-group px-1 pt-2 gap-2 flex items-center text-sm">
				<input type="checkbox" name="rmb-me" id="rmb-me" bind:checked={rmbMe} />
				Remember Me
			</label>
			<div class="form-group">
				<input type="submit" value="Login" class="btn-primary" />
			</div>
			<div class="form-group flex justify-between mt-6 text-sm items-center">
				<a href="/register" class="hover:underline text-blue-600">No account</a>
				<a href="/ForgotPassword" class="hover:underline text-blue-600">Forgot password</a>
			</div>
		</form>
	</div>
</div>
