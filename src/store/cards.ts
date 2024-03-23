import type { TCard, TPile } from "../types";
import { writable, type Writable, type Subscriber, type Invalidator, type Unsubscriber } from "svelte/store";

export interface ICardsStore extends Writable<TCard[]> {
  subscribe: (this: void, run: Subscriber<TCard[]>, invalidate?: Invalidator<TCard[]>) => Unsubscriber,
  add: (card: TCard) => void,
  remove: (card: TCard) => void,
  move: (card: TCard, pile: TPile) => void,
};

export function createCardsStore(initial: TCard[]): ICardsStore {
  let uid = 1;

  const cards: TCard[] = initial.map(card => {
    const newCard: TCard = {
      ...card,
      uid: uid++,
    };
    return newCard;
  });

  const { subscribe, set, update } = writable<TCard[]>(cards);

  return {
    subscribe,

    add: (card: TCard) => {
      const newCard: TCard = {
        ...card,
        uid: uid++,
      };

      update($cards => [...$cards, newCard]);
    },

    remove: (card: TCard) => {
      update($cards => $cards.filter(c => c.uid !== card.uid));
    },

    move: (card: TCard, pile: TPile) => {
      update($cards => [
        ...$cards.filter(c => c.uid !== card.uid),
        { ...card, pile }
      ]);
    },

    set,
    update
  };
}
