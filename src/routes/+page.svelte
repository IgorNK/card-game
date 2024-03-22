<script lang="ts">
  import Card from "../components/card/card.svelte";
</script>

<svelte:head>
	<title>Cards</title>
	<meta name="description" content="Card demo app" />
</svelte:head>

<section>
  <Card />
</section>

<style>
  section {
    perspective: 100vh;
  }
</style>
