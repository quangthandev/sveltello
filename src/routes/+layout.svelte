<script>
	import '../app.css';
</script>

<div
	class="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border"
>
	<a href="/" class="font-black text-white text-2xl"> Home </a>
	<div class="flex items-center gap-6">links</div>
	<div class="w-1/3 flex justify-end">
		<a href="/login" class="text-slate-500 text-xs uppercase font-bold">Login</a>
	</div>
</div>

<slot />
