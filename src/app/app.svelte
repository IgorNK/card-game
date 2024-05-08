<script lang="ts">
  import { onMount } from 'svelte';
  import { MainScene } from "$lib/scene";
  import BattleScreen from "./battle-screen/battle-screen.svelte";
  import WalkControls from './walk-controls/walk-controls.svelte';
  import * as assets from "../data/assets.json";
  import * as maps from "../data/maps.json";
  import type { TMapAsset, TTilesetAsset, TInputCallbacks } from "../types";
  import Panel from '../components/panel/panel.svelte';
  import ProgressBar from '../components/progressbar/progressbar.svelte';
  
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

<!-- <Panel image="/textures/ui/panel_01.png">
  <ProgressBar value={50} />
  <ProgressBar value={30} />
  <ProgressBar value={5} />
  <ProgressBar value={5} />
  <ProgressBar value={5} />
</Panel>
<Panel image="/textures/ui/panel_00.png">
  <ProgressBar value={98} />
  <ProgressBar value={99} />
  <ProgressBar value={100} />
</Panel>
<Panel image="/textures/ui/panel_02.png" style="border-image-slice: 30%;">
  <div class=inner>
    <ProgressBar value={98} />
    <ProgressBar value={99} />
    <ProgressBar value={100} />
  </div>  
  <div class=overlay />
</Panel> -->

<div class=main>
  <div class="gui">
    <!-- <WalkControls {callbacks} /> -->
    <BattleScreen />
  </div>
  <canvas bind:this={canvas} />
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

  .inner {
    z-index: 0;
  }

  .overlay {
        position: absolute;
        top: 1.5rem;
        bottom: 1.6rem;
        left: 1.8rem;
        right: 1.8rem;
        background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.9) 5%, rgba(0, 0, 0, 0.5) 10%, rgba(0, 0, 0, 0.1) 20%, rgba(0, 0, 0, 0) 92%, rgba(0, 0, 0, 0.2) 100%),
                    linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 8%, rgba(0, 0, 0, 0) 92%, rgba(0, 0, 0, 0.5) 100%);
        z-index: 1;
    }
</style>
