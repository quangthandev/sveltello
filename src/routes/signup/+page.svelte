<script>
	import { enhance } from '$app/forms';
	import IconLoading from '$lib/components/icons/icon-loading.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	export let form;

	$: error = form?.error;

	let isLoading = false;
</script>

<div class="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Sign Up
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
					<Label for="email">Email address</Label>
					<Input id="email" name="email" type="email" autocomplete="email" required />
					{#if error}
						<p class="text-red-700 mt-4">{error}</p>
					{/if}
				</div>

				<div>
					<Label for="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						minlength={8}
					/>
				</div>

				<Button
					type="submit"
					class="flex items-center justify-center gap-2 w-full"
					disabled={isLoading}
				>
					{#if isLoading}
						<IconLoading />
					{:else}
						<span>Sign up</span>
					{/if}
				</Button>

				<div class="text-sm text-slate-500">
					Already have an account?{' '}
					<a class="underline" href="/login">Log in</a>
					.
				</div>
			</form>
		</div>
		<div class="mt-8 space-y-2 mx-2">
			<h3 class="font-bold text-black">Privacy Notice</h3>
			<p>
				We won't use your email address for anything other than authenticating with this demo
				application. This app doesn't send email anyway, so you can put whatever fake email address
				you want.
			</p>
			<h3 class="font-bold text-black">Terms of Service</h3>
			<p>
				This is a demo app, there are no terms of service. Don't be surprised if your data
				dissappears.
			</p>
		</div>
	</div>
</div>
