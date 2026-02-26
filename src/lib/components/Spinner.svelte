<script lang="ts">
	interface Props {
		size?: string;
	}

	let { size = '4' }: Props = $props();
</script>

<span
	class="inline-block rounded-full border-2 border-current border-r-transparent animate-spin"
	style="width: {size === '4' ? '1rem' : '1.25rem'}; height: {size === '4' ? '1rem' : '1.25rem'}"
	role="status"
	aria-label="Loading"
></span>
