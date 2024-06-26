<script lang="ts">
  import { send, receive } from "../../utils/transition";
  import { flip } from 'svelte/animate';
  import DeckPile from '../../components/deck-pile/deck-pile.svelte';
  import UsePile from '../../components/use-pile/use-pile.svelte';
  import DropPile from '../../components/drop-pile/drop-pile.svelte';
  import HandPile from '../../components/hand-pile/hand-pile.svelte';
  import Enemy from '../../components/enemy/enemy.svelte';
  import PlayerStats from "../../components/player-stats/player-stats.svelte"; 
  import * as cardsJson from "../../data/cards.json";
  import * as enemiesJson from "../../data/enemies.json"
  import { TPile, type TCard, type TCost, type TEffect, type TEnemy, type TPlayerStats } from "../../types";
  import { createCardsStore } from '../../store/cards';
  import { createEnemiesStore } from '../../store/enemies';   

  type TDesignKey = keyof typeof cardsJson.designs;

  const cardData: Array<TCard> = Array.from(cardsJson.cards).map(data => {
    const design = data.design as TDesignKey;    
    return {
      uid: 0,
      ...data,
      pile: null,
      design: cardsJson.designs[design],
    }
  });
  const cards = createCardsStore([ 
    {...cardData[0], pile: TPile.hand}, 
    {...cardData[0], pile: TPile.hand}, 
    {...cardData[1], pile: TPile.hand},
    {...cardData[0], pile: TPile.deck},
    {...cardData[0], pile: TPile.deck},
    {...cardData[0], pile: TPile.deck},
    {...cardData[1], pile: TPile.deck},
    {...cardData[2], pile: TPile.deck},
  ]);
  const enemyData: Array<TEnemy> = Array.from(enemiesJson.enemies).map(data => {
    return {
      uid: 0,
      ...data,
      currentHealth: data.health,
    }
  });
  const enemies = createEnemiesStore([
    {...enemyData[0]},
    {...enemyData[1]},
  ]);
  let playerStats: TPlayerStats = {
    health: 10,
    currentHealth: 10,
    defense: 1,
    manaRed: 3,
    currentManaRed: 3,
    manaBlue: 3,
    currentManaBlue: 3,
    manaGreen: 3,
    currentManaGreen: 3,
    exp: 0,
    expNext: 30,
    handSize: 5,
  };

  const effectHandler = (effect: TEffect) => {
    console.log('effect handler');
    switch (effect.type) {
      case "damage": {
        break;
      }
      case "defense": {
        break;
      }
      case "health": {
        break;
      }
    }  
  }

  $: usedPile = $cards.filter(card => card.pile === TPile.use);
  $: deckPile = $cards.filter(card => card.pile === TPile.deck);
  $: handPile = $cards.filter(card => card.pile === TPile.hand);
  $: usedCard = usedPile.length > 0 ? usedPile[0] : null;

  const enemyEffectHandler = (enemy: TEnemy) => {
    console.log('enemy effect handler');
    if (!usedCard) {
      return;
    }
    for (let effect of usedCard.effects) {
      switch (effect.type) {
        case "damage": {
          enemies.changeHealth(enemy, -effect.amount);
          cards.move(usedCard, TPile.drop);
          break;
        }
      }
    }
  }

  const enemyAct = async (enemy: TEnemy) => {
    console.log(`${enemy.name}'s turn'`);
  }

  let deckFlipped = true;

  const drawCard = async() => {
    if (deckPile.length < 1) {
      return;
    }
    deckFlipped = false;
    await new Promise(resolve => setTimeout(resolve, 200));
    cards.move(deckPile[0], TPile.hand);
    deckFlipped = true;
  }

  const endTurnHandler = async (e: MouseEvent) => {
    for (let enemy of $enemies) {
      await enemyAct(enemy);
    }
    while (handPile.length < playerStats.handSize && deckPile.length ) {
      await drawCard();
    }
  }
</script>

<div class=battle-screen>
  <ul class=enemies>
  {#each $enemies as enemy (enemy.uid)}
    <li
      in:receive={{ key: enemy.uid }}
      out:send={{ key: enemy.uid }}
      animate:flip={{ duration: 200 }}
    >
      <Enemy on:click={() => enemyEffectHandler(enemy)} {enemy} />
    </li>
  {/each}
  </ul>
  <div class=use>
    <UsePile {effectHandler} {cards} />
  </div>  
  <div class=deck>
    <DeckPile flipped={deckFlipped} {cards} />
  </div>
  <div class=hand>
    <HandPile size={playerStats.handSize} {cards} />
  </div>
  <div class=drop>
    <DropPile {cards} />
  </div>
  <div class=stats>
    <PlayerStats {playerStats} />
    <button class=endTurn on:click={endTurnHandler}>End Turn</button>
  </div>
  
</div>

<style>
  .battle-screen {
    margin: 16em;
    width: 100%;
    display: grid;
    grid-template-areas:
      ".        enemies   enemies   ."
      ".        use       .         ."
      "hand     hand      hand      hand"
      "deck     stats     stats     drop";
    justify-content: center;
    align-items: center;
  }

  .enemies {
    display: grid;
    grid-auto-flow: column dense;
    list-style-type: none;
    grid-area: enemies;
  }

  .use {
    grid-area: use;
  }

  .deck {
    grid-area: deck;
  }

  .hand {
    grid-area: hand;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drop {
    grid-area: drop;
  }

  .stats {
    grid-area: stats;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
  }
</style>
