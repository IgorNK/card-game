<script lang="ts">
  import { send, receive } from "../../utils/transition";
  import { flip } from 'svelte/animate';
  import { type TCard, TPile } from "../../types";
  import type { ICardsStore } from "../../store/cards";
  import Card from '../card/card.svelte';
  export let cards: ICardsStore;
  const pile: TPile = TPile.drop;
  
  $: dropPile = $cards.filter(card => card.pile === pile);
  $: dropCard = dropPile.length ? dropPile[dropPile.length - 1] : null;

  const handleClick = (card: TCard | null) => {

  }
</script>

<ul class="drop">
  {#each [dropCard] as card (card?.uid)}
    <li
      in:receive={{ key: card?.uid }}
      out:send={{ key: card?.uid }}
      animate:flip={{ duration: 200 }}
    >
      {#if card}
      <Card {card} on:click={() => handleClick(card)} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  .drop {
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