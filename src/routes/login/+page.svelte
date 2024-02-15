<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';

	export let form;

	$: error = form?.error;

	let isLoading = false;
</script>

<div class="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Sign In
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
		<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
			<form
				class="space-y-6"
				method="POST"
				use:enhance={() => {
					isLoading = true;

					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
			>
				<div>
					<Input
						label="Email address"
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
					/>
				</div>

				<div>
					<Input
						label="Password"
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						minlength={8}
					/>
					{#if error}
						<p class="text-red-700 mt-4">{error}</p>
					{/if}
				</div>

				<Button type="submit" disabled={isLoading}>
					{#if isLoading}
						<span>Loading...</span>
					{:else}
						<span>Sign in</span>
					{/if}
				</Button>

				<div class="text-sm text-slate-500">
					Don't have an account?{' '}
					<a class="underline" href="/signup"> Sign up </a>
					.
				</div>
			</form>
		</div>
	</div>
</div>
