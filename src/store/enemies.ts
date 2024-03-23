import type { TEnemy } from "../types";
import { writable, type Writable, type Subscriber, type Invalidator, type Unsubscriber } from "svelte/store";

export interface IEnemiesStore extends Writable<TEnemy[]> {
  subscribe: (this: void, run: Subscriber<TEnemy[]>, invalidate?: Invalidator<TEnemy[]>) => Unsubscriber,
  add: (enemy: TEnemy) => void,
  remove: (enemy: TEnemy) => void,
  changeHealth: (enemy: TEnemy, amount: number) => void,
};

export function createEnemiesStore(initial: TEnemy[]): IEnemiesStore {
  let uid = 1;

  const cards: TEnemy[] = initial.map(enemy => {
    const newCard: TEnemy = {
      ...enemy,
      uid: uid++,
    };
    return newCard;
  });

  const { subscribe, set, update } = writable<TEnemy[]>(cards);

  return {
    subscribe,

    add: (enemy: TEnemy) => {
      const newEnemy: TEnemy = {
        ...enemy,
        uid: uid++,
      };

      update($enemies => [...$enemies, newEnemy]);
    },

    remove: (enemy: TEnemy) => {
      update($enemies => $enemies.filter(e => e.uid !== enemy.uid));
    },

    changeHealth: (enemy: TEnemy, amount: number) => {
      update($enemies => $enemies.map(e => {
        if (e.uid === enemy.uid) {
          return {
            ...e,
            currentHealth: e.currentHealth + amount,
          }
        }
        return e;
      }))
    },

    set,
    update
  };
}
