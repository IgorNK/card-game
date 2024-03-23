import type TCost from './cost';
import type TEffect from './effect';
import type TPile from './pile';
type TCard = {
  title: string,
  cost: Array<TCost>,
  text: string,
  effects: Array<TEffect>,
  pile: TPile,
}

export default TCard;