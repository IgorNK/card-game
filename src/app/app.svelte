<script lang="ts">
  import { onMount } from 'svelte';
  import { MainScene } from "$lib/scene";
  import BattleScreen from "./battle-screen/battle-screen.svelte";
  import * as assets from "../data/assets.json";
  import * as maps from "../data/maps.json";
  import type { TMapAsset, TTilesetAsset } from "../types";
  
  let canvas: HTMLCanvasElement;
  let scene: MainScene;

  onMount(() => {
    scene = new MainScene(canvas);
    scene.init();
    scene.setEnvironment(assets.hdris.white);
    const mapAsset: TMapAsset = maps.dungeon;
    const tileset: TTilesetAsset = assets.tilesets.dungeon;
    scene.loadMap({ mapAsset, tileset });
  })  
</script>

<div class=main>
  <div class="gui">
    <!-- <BattleScreen /> -->
  </div>  
</div>

<canvas bind:this={canvas} />

<style>
  .main {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .gui {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
