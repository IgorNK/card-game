<script lang="ts">
  import type { TCard } from "../../types";
  import { TPile } from "../../types";
  export let card: TCard = {
    uid: 0,
    title: "",
    cost: [],
    text: "",
    effects: [],
    pile: null,
  };
  export let flipped = false;
</script>

<button
  class="card"
  style:transform={flipped ? 'rotateY(180deg)' : ''}
  on:click
  on:drag
>
  <div class="front">
    <div class="price">
      <slot name="price">
        <span class="symbol-green">♠</span>
        <span class="symbol-blue">♠</span>
      </slot>
    </div>
    <div class="title">
      <i>{card.title}</i>
    </div>
    <div class="image">
      <slot name="image">
        <span class="symbol">♠</span>
      </slot>
    </div>
    <div class="text">
      <slot name="text" class="textn">
        <p>{card.text}</p>
      </slot>
    </div>
  </div>
  <div class="back">
    <div class="pattern"></div>
  </div>
</button>

<style>
  .card {
    position: relative;
    aspect-ratio: var(--card-aspect-ratio);
    font-size: var(--card-font-size);
    height: var(--card-height);
    background: var(--color-bg-0);
    border-radius: var(--card-border-radius);
    transform: rotateY(0);
    transition: transform 0.4s;
    transform-style: preserve-3d;
    padding: 0;
    user-select: none;
    cursor: pointer;
  }

  .front, .back {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    backface-visibility: hidden;
    border-radius: var(--card-border-radius);
    border: 1px solid var(--color-theme-2);
    box-sizing: border-box;
    padding: var(--card-padding);
  }

  .front {
    background-color: var(--color-bg-2);
    display: flex;
    flex-direction: column;
  }

  .back {
    transform: rotateY(180deg);
  }

  .symbol {
    font-size: 10em;
    color: var(--color-theme-1);
  }

  .symbol-green {    
    color: var(--color-theme-3);
  }

  .symbol-blue {
    color: var(--color-theme-2);
  }
  
  .pattern {
    width: 100%;
    height: 100%;
    background-color: var(--color-bg-1);
    /* pattern from https://projects.verou.me/css3patterns/#marrakesh */
    background-image:
    radial-gradient(var(--color-bg-2) 0.45em, transparent 0.5em),
    repeating-radial-gradient(var(--color-bg-2) 0, var(--color-bg-2) 0.2em, transparent 0.25em, transparent 1em, var(--color-bg-2) 1.05em, var(--color-bg-2) 1.05em, transparent 1.3em, transparent 2.5em);
    background-size: 1.5em 1.5em, 4.5em 4.5em;
    background-position: 0 0;
    border-radius: 1em;
  }

  .title {
    font-weight: 700;
  }

  .price {
    display: flex;
    column-gap: 0.2em;
    flex-direction: row;
    height: 10%;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-end;
    font-size: 1em;
  }

  .image {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .text {
    height: 50%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    text-align: left;
  }
  
</style>