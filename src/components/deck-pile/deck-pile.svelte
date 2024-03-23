<script lang="ts">
  import { tick } from 'svelte';
  import { send, receive } from "../../utils/transition";
  import { flip } from 'svelte/animate';
  import { type TCard, TPile } from "../../types";
  import type { ICardsStore } from "../../store/cards";
  import Card from '../card/card.svelte';

  export let cards: ICardsStore;
  export let flipped: boolean = true;

  const pile: TPile = TPile.deck;

  $: deck = $cards.filter(card => card.pile === pile);
  $: deckCard = deck.length ? deck[0] : null;

</script>

<ul class="deck">
  {#each [deckCard] as card (card?.uid)}
    <li
      class=container
      in:receive={{ key: card?.uid }}
      out:send={{ key: card?.uid }}
      animate:flip={{ duration: 200 }}
    >
      {#if card}
      <Card {flipped} {card} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  .deck {
    display: flex;
    flex-direction: row;
    column-gap: 1em;
    list-style-type: none;
    margin: 0;
    padding: 0;
    aspect-ratio: var(--card-aspect-ratio);
    font-size: var(--card-font-size);
    height: var(--card-height);
  }

  .container {
    perspective: 100vh;
  }

</style>