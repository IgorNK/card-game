<script lang="ts">
  import { send, receive } from "../../utils/transition";
  import { flip } from 'svelte/animate';
  import { type TCard, TPile } from "../../types";
  import type { ICardsStore } from "../../store/cards";
  import Card from '../card/card.svelte';

  export let cards: ICardsStore;
  export let size: number = 4;

  const pile: TPile = TPile.hand;
  const handleClick = (card: TCard) => {
    $cards.forEach(card => {
      if (card.pile === TPile.use) {
        cards.move(card, TPile.hand);
      }
    });
    cards.move(card, TPile.use);
  }
</script>

<ul class="pile">
  {#each $cards.filter(card => card.pile === pile) as card (card.uid)}
    <li
      in:receive={{ key: card.uid }}
      out:send={{ key: card.uid }}
      animate:flip={{ duration: 200 }}
    >
      <Card {card} on:click={() => handleClick(card)} />
    </li>
  {/each}
</ul>

<style>
  .pile {
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

</style>