<script lang="ts">
  import Deck from '../components/deck/deck.svelte';
  import Card from '../components/card/card.svelte';
  import  * as cardsData from "../store/cards.json";
  import { TPile, TCard } from "../types";
  let deck: Array<TCard> = Array.from(cardsData.cards).map(data => {
    return {
      title: data.title,
      cost: Array.from(data.cost),
      text: data.text,
      effects: Array<TEffect>,
      pile: TPile,
    }
  });
  let use = [];
  let drop = [];
  let cards: Array<TCard> = [ {...deck[0], pile: TPile.hand}, {...deck[0], pile: Pile.hand}, {...deck[1], pile: Pile.hand} ]
  // let hand = [ {...deck[0]}, {...deck[0]}, {...deck[1]} ];
  // function draw(e: MouseEvent): void {
  //   topFlipped = !topFlipped;
  // }
</script>

<svelte:head>
	<title>Cards</title>
	<meta name="description" content="Card demo app" />
</svelte:head>

<section>
  <!-- <Deck on:click={draw}>Vjjjj
    {#key "deck"+cardId}
    <Card 
      title={deck[0].title} 
      flipped={topFlipped}
      out:send={{ key: "deck"+cardId }}
    >
      <p slot="description">{deck[0].text}</p>
    </Card>
    {/key}
  </Deck>
  <Hand>
    {#each hand as card, id (id)}
      <Card title={card.title} flipped={false}>
        <p slot="description">{card.text}</p>
      </Card>
    {/each}
  </Hand> -->
</section>

<style>
  section {

  }
</style>
