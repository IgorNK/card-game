import type { TCost } from './cost';
import type { TEffect } from './effect';
import type { TPile } from './pile';

export type TCard = {
  uid: number,
  title: string,
  cost: Array<TCost>,
  text: string,
  effects: Array<TEffect>,
  pile: TPile | null,
}
