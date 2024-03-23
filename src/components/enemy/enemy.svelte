<script lang="ts">
  import type { TEffect, TEnemy } from "../../types";
  export let enemy: TEnemy = {
    uid: 0,
    name: "",
    health: 1,
    currentHealth: 1,
    attack: 1,
    defense: 1,
    gold: 1,
    exp: 1,
  };
</script>

<button class=enemy on:click>
  <div class=name>{enemy.name}</div>
  <div class=health>{enemy.currentHealth}/{enemy.health}({enemy.defense})</div>
</button>

<style>
  .enemy {
    position: relative;
    aspect-ratio: var(--card-aspect-ratio);
    font-size: var(--card-font-size);
    height: var(--card-height);
  }
</style>