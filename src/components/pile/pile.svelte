<script lang="ts">
  import { send, receive } from "../../utils/transition";
  import { TCard } from "../../types";
  import Card from '../card/card.svelte';
  export let cards: Array<TCard> = [];
</script>

<div class="hand">
  <slot>
  </slot>
</div>

<style>
  .hand {
    display: flex;
    flex-direction: row;
    column-gap: 1em;
  }

</style>