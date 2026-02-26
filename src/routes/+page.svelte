<script lang="ts">
	import { enhance } from '$app/forms';
	import Spinner from '$lib/components/Spinner.svelte';

	let { form } = $props();

	let loading = $state(false);
	let showSuccess = $state(false);

	// Show success banner when form returns success
	$effect(() => {
		if (form?.success) {
			showSuccess = true;
			const timer = setTimeout(() => {
				showSuccess = false;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>Submit an Idea — Dynamo Idea Hub</title>
</svelte:head>

<div class="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
	<div class="w-full max-w-2xl">
		<!-- Form Card -->
		<div class="bg-white dark:bg-dark-surface rounded-2xl shadow-lg overflow-hidden">
			<!-- Top accent bar -->
			<div class="h-1 bg-primary"></div>

			<div class="px-6 py-8 sm:px-8 sm:py-10">
				<!-- Page Title -->
				<div class="mb-8">
					<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Submit an Idea</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your idea with the team</p>
				</div>

				<!-- Success Banner -->
				{#if showSuccess}
					<div class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg px-4 py-3 text-sm flex items-center gap-2" role="status" aria-live="polite">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
						Idea submitted successfully!
					</div>
				{/if}

				<form
					method="POST"
					action="?/submit"
					use:enhance={() => {
						loading = true;
						return async ({ update, result }) => {
							loading = false;
							if (result.type === 'success') {
								const formEl = document.querySelector('form') as HTMLFormElement;
								formEl?.reset();
							}
							await update();
						};
					}}
					class="space-y-5"
				>
					<!-- Your Name -->
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Your Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={form?.name ?? ''}
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
							placeholder="e.g. Jane Smith"
						/>
						{#if form?.errors?.name}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{form.errors.name}</p>
						{/if}
					</div>

					<!-- Contract / Use Case -->
					<div>
						<label for="contract" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Contract / Use Case
						</label>
						<input
							type="text"
							id="contract"
							name="contract"
							value={form?.contract ?? ''}
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
							placeholder="e.g. Project Atlas — Phase 2"
						/>
						{#if form?.errors?.contract}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{form.errors.contract}</p>
						{/if}
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							rows="6"
							class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-input px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors min-h-[200px] resize-y"
							placeholder="Describe your idea in detail — what problem does it solve, how would it work, and what's the expected impact?"
						>{form?.description ?? ''}</textarea>
						{#if form?.errors?.description}
							<p class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{form.errors.description}</p>
						{/if}
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-dark-surface disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if loading}
							<Spinner />
							Submitting...
						{:else}
							Submit Idea
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
