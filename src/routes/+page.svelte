<script lang="ts">
  import App from "../app/app.svelte";
  let canvas: HTMLCanvasElement;
</script>

<svelte:head>
	<title>Card game</title>
	<meta name="description" content="Card game demo" />
</svelte:head>

<section>
  <App {canvas} />
</section>

<canvas bind:this={canvas} />

<style>

</style>
