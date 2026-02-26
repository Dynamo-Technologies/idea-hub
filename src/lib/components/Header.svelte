<script lang="ts">
	import DarkModeToggle from './DarkModeToggle.svelte';
	import type { User } from '@supabase/supabase-js';

	interface Props {
		user?: User | null;
		onSignOut?: () => void;
	}

	let { user = null, onSignOut }: Props = $props();
</script>

<header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-dark-header dark:border-gray-700 transition-colors duration-200">
	<div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
		<a href="/" class="flex items-center gap-2">
			<img src="/dynamo_simple.png" alt="Dynamo" class="h-6" />
		</a>

		<div class="flex items-center gap-3">
			{#if user}
				<span class="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
					{user.email}
				</span>
				<button
					onclick={onSignOut}
					class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
				>
					Sign Out
				</button>
			{/if}
			<DarkModeToggle />
		</div>
	</div>
</header>
