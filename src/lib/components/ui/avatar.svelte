<!-- Reference: https://svelte.dev/repl/015d1627a7ec49f6a0c070b59d1b4608?version=4.2.12 -->
<script lang="ts">
	import { cn } from '$lib/utils';

	export let userName: string;
	export let avatarColors = [
		'#1abc9c',
		'#2ecc71',
		'#3498db',
		'#9b59b6',
		'#34495e',
		'#16a085',
		'#27ae60',
		'#2980b9',
		'#8e44ad',
		'#2c3e50',
		'#f1c40f',
		'#e67e22',
		'#e74c3c',
		'#ecf0f1',
		'#95a5a6',
		'#f39c12',
		'#d35400',
		'#c0392b',
		'#bdc3c7',
		'#7f8c8d'
	];
	import { onMount } from 'svelte';
	export let width = 32;
	export let round = true;
	export let src = '';
	let avatarImage: HTMLImageElement;

	/*
	 * LetterAvatar
	 *
	 * Artur Heinze
	 * Create Letter avatar based on Initials
	 * based on https://gist.github.com/leecrossley/6027780
	 *
	 * This component is based on https://codepen.io/arturheinze/pen/ZGvOMw
	 */
	function LetterAvatar(name: string, size: number) {
		name = name || '';
		size = size || 60;

		let colours: string[] = avatarColors,
			nameSplit = String(name).toUpperCase().split(' '),
			initials: string,
			charIndex: number,
			colourIndex: number,
			canvas: HTMLCanvasElement | null,
			context: CanvasRenderingContext2D | null,
			dataURI;

		if (nameSplit.length == 1) {
			initials = nameSplit[0] ? nameSplit[0].charAt(0) : '?';
		} else {
			initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
		}

		if (window.devicePixelRatio) {
			size = size * window.devicePixelRatio;
		}

		charIndex = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
		colourIndex = charIndex % 20;
		canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		context = canvas.getContext('2d');

		if (context) {
			context.fillStyle = colours[colourIndex - 1];
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.font = Math.round(canvas.width / 2) + 'px Arial';
			context.textAlign = 'center';
			context.fillStyle = '#FFF';
			context.fillText(initials, size / 2, size / 1.5);
		}

		dataURI = canvas.toDataURL();
		canvas = null;

		return dataURI;
	}

	onMount(() => {
		avatarImage.src = src !== '' ? src : LetterAvatar(userName, width);
	});
</script>

<img
	bind:this={avatarImage}
	class={cn({ 'rounded-full': round })}
	{width}
	height={width}
	alt={userName}
/>
