<script lang="ts">
  import { onMount } from 'svelte';
  import { MainScene } from "$lib/scene";
  import BattleScreen from "./battle-screen/battle-screen.svelte";
  import WalkControls from './walk-controls/walk-controls.svelte';
  import * as assets from "../data/assets.json";
  import * as maps from "../data/maps.json";
  import type { TMapAsset, TTilesetAsset, TInputCallbacks } from "../types";
  import CurvedText from '../components/curved-text/curved-text.svelte';
  
  let canvas: HTMLCanvasElement;
  let scene: MainScene;
  let callbacks: TInputCallbacks = {
    onLeft: () => {},
    onRight: () => {},
    onUp: () => {},
    onDown: () => {}
  };

  onMount(() => {
    scene = new MainScene(canvas);
    scene.setEnvironment(assets.hdris.white);
    const mapAsset: TMapAsset = maps.dungeon;
    const tileset: TTilesetAsset = assets.tilesets.dungeon;
    scene.loadMap({ mapAsset, tileset });
    callbacks = scene.registerControls();
  })  
</script>
<!-- <CurvedText /> -->
<div class=main>
  <div class="gui">
    <!-- <WalkControls {callbacks} /> -->
    <BattleScreen />
  </div>
  <!-- <canvas bind:this={canvas} /> -->
</div>

<style>
  .main {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .gui {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
