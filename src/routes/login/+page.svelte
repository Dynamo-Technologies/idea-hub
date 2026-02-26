<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';
	import MicrosoftLogo from '$lib/components/MicrosoftLogo.svelte';

	let { data, form } = $props();
	let { supabase } = $derived(data);

	let loading = $state(false);
	let ssoLoading = $state(false);

	async function handleMicrosoftSSO() {
		ssoLoading = true;
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'azure',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
		if (error) {
			ssoLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In — Dynamo Idea Hub</title>
</svelte:head>

<div class="flex-1 flex items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<!-- Login Card -->
		<div class="bg-white dark:bg-dark-surface rounded-2xl shadow-lg overflow-hidden">
			<!-- Top accent bar -->
			<div class="h-1 bg-primary"></div>

			<div class="px-6 py-8 sm:px-8 sm:py-10">
				<!-- Branding -->
				<div class="text-center mb-8">
					<div class="flex items-center justify-center gap-2 mb-2">
						<img src="/dynamo_simple.png" alt="Dynamo" class="h-5" />
						<span class="text-sm font-semibold tracking-widest text-gray-400 uppercase">Idea Hub</span>
					</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">Submit &amp; Track Ideas</p>
				</div>

				<!-- Email/Password Form -->
				<form
					method="POST"
					action="?/login"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							required
							value={form?.email ?? ''}
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
							placeholder="you@company.com"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							required
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
							placeholder="Enter your password"
						/>
					</div>

					<!-- Error message -->
					{#if form?.error}
						<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm" role="alert" aria-live="polite">
							{form.error}
						</div>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg py-3 mt-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-dark-surface disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if loading}
							<Spinner />
							Signing in...
						{:else}
							Sign In
						{/if}
					</button>
				</form>

				<!-- Divider -->
				<div class="flex items-center my-6">
					<div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
					<span class="px-4 text-sm text-gray-400 dark:text-gray-500">or</span>
					<div class="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
				</div>

				<!-- Microsoft SSO -->
				<button
					onclick={handleMicrosoftSSO}
					disabled={ssoLoading}
					class="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input rounded-lg py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-dark-surface disabled:opacity-80 disabled:cursor-not-allowed"
				>
					{#if ssoLoading}
						<Spinner />
						Redirecting...
					{:else}
						<MicrosoftLogo />
						Sign in with Microsoft
					{/if}
				</button>

				<!-- Demo Credentials -->
				<div class="mt-6 bg-gray-100 dark:bg-dark-header rounded-lg px-4 py-3">
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Demo credentials</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 font-mono">admin.one@dynamo.works / password</p>
				</div>
			</div>
		</div>
	</div>
</div>
