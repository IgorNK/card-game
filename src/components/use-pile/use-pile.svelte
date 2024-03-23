<script lang="ts">
  import { send, receive } from "../../utils/transition";
  import { flip } from 'svelte/animate';
  import { type TCard, TPile, type TEffect } from "../../types";
  import type { ICardsStore } from "../../store/cards";
  import Card from '../card/card.svelte';

  export let cards: ICardsStore;
  export let effectHandler: (effect: TEffect) => void;
  
  const pile: TPile = TPile.use;
  
  $: usePile = $cards.filter(card => card.pile === pile);
  $: useCard = usePile.length ? usePile[0] : null;

  const handleClick = (card: TCard | null) => {
    if (card === null) {
      return;
    }
    cards.move(card, TPile.hand);
  }

  const handleConfirm = (card: TCard) => {
    cards.move(card, TPile.drop);
  }
</script>

<div class=container>
  <ul class="use">
  {#each [useCard] as card (card?.uid)}
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
  <div class=actions>
    {#if useCard}
      {#each useCard.effects as effect}
        {#if effect.type === "damage"}
          <p>Select a target</p>
        {/if}
        {#if effect.type === "defense" || effect.type === "health"}
          <button on:click={() => effectHandler(effect)}>Confirm</button>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .use {
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

  .actions {
    display: flex;
    flex-direction: column;
  }

</style>