<script lang="ts">
	import Spinner from '$lib/components/Spinner.svelte';
	import MicrosoftLogo from '$lib/components/MicrosoftLogo.svelte';

	let { data } = $props();
	let { supabase } = $derived(data);

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
			</div>
		</div>
	</div>
</div>
