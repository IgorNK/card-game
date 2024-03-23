<script lang="ts">
  import Card from '../card/card.svelte';
</script>

<button class="deck" on:click>
  <div class="card bottom">
    <Card flipped={true} />
  </div>
  <div class="card top">
    <slot>
      <Card flipped={true} />
    </slot>
  </div>
</button>

<style>
  .deck {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    aspect-ratio: var(--card-aspect-ratio);
    font-size: var(--card-font-size);
    height: var(--card-height);
    background: none;
    border: none;
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    perspective: 100vh;
  }

  .card.top {

  }

  .card.bottom {

  }

</style>