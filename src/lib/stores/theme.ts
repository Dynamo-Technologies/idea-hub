import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const stored = browser ? localStorage.getItem('theme') : null;
	const initial = stored === 'dark' || (!stored && browser && window.matchMedia('(prefers-color-scheme: dark)').matches);

	const { subscribe, set, update } = writable<boolean>(initial);

	function applyTheme(dark: boolean) {
		if (browser) {
			document.documentElement.classList.toggle('dark', dark);
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		}
	}

	// Apply initial theme
	if (browser) {
		applyTheme(initial);
	}

	return {
		subscribe,
		toggle: () => {
			update((dark) => {
				const next = !dark;
				applyTheme(next);
				return next;
			});
		},
		set: (dark: boolean) => {
			applyTheme(dark);
			set(dark);
		}
	};
}

export const darkMode = createThemeStore();
