<script lang="ts">
	import '../app.css';
	import { invalidate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { darkMode } from '$lib/stores/theme';

	let { data, children } = $props();
	let { supabase, session, user } = $derived(data);
	let isLoginPage = $derived($page.url.pathname === '/login');

	onMount(() => {
		const { data: authData } = supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => authData.subscription.unsubscribe();
	});

	async function handleSignOut() {
		await fetch('/logout', { method: 'POST' });
		goto('/login');
	}
</script>

<div class="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
	<Header user={isLoginPage ? null : user} onSignOut={handleSignOut} />
	<main class="flex-1 flex flex-col">
		{@render children()}
	</main>
	<Footer />
</div>
