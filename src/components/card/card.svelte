<script lang="ts">
  import type { TCard } from "../../types";
  import { TPile } from "../../types";
  import CurvedText from "../curved-text/curved-text.svelte";
  
  export let card: TCard = {
    uid: 0,
    title: "",
    cost: [],
    text: "",
    effects: [],
    pile: null,
    image: "",
    design: "",
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
    <img class=design src={card.design} alt="card design" />
    <div class="price">
      <slot name="price">
        <span class="symbol-green">♠</span>
        <span class="symbol-blue">♠</span>
      </slot>
    </div>
    <div class="title">
      <!-- <i>{card.title}</i> -->
      <CurvedText text={card.title} width={100} height={36} offsetY={4} />
    </div>
      <slot name="image">
        <img class=image src={card.image} />
      </slot>
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
    font-family: var(--font-card);
    position: relative;
    aspect-ratio: var(--card-aspect-ratio);
    font-size: var(--card-font-size);
    height: var(--card-height);
    /* background: var(--color-bg-0); */
    border-radius: var(--card-border-radius);
    transform: rotateY(0);
    transition: transform 0.4s;
    transform-style: preserve-3d;
    padding: 0;
    user-select: none;
    cursor: pointer;
  }

  .design {
    position: absolute;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    z-index: 1
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
    overflow: hidden;
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
    position: absolute;
    top: 0;
    width: 80%;
    font-size: var(--card-title-curved-font-size);
    z-index: 2;
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
    z-index: 2;
  }

  .image {
    position: absolute;
    top:-5%;
    width: 120%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }

  .text {
    position: absolute;
    top: 60%;
    height: 50%;
    width: 100%;
    padding: 20%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    text-align: left;
    z-index: 2;
  }
  
</style>