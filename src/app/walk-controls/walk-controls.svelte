<script lang="ts">
    import Arrow from "../../components/arrow/arrow.svelte";
    import type { TInputCallbacks } from "../../types";
    export let callbacks: TInputCallbacks;
    
</script>

<div class=controls>
    <button class=button on:click={callbacks.onLeft}>
        <Arrow direction=left />
    </button>
    <div class=vertical>
        <button class=button on:click={callbacks.onUp}>
            <Arrow direction=up />
        </button>
        <button class=button on:click={callbacks.onDown}>
            <Arrow direction=down />
        </button>
    </div>
    <button class=button on:click={callbacks.onRight}>
        <Arrow direction=right />
    </button>    
</div>

<style>
    .controls {
        height: 40%;
        aspect-ratio: 1;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        justify-items: center;
    }

    .vertical {
        display: grid;
        width: 100%;
        height: 100%;
        grid-template-rows: 1fr 1fr;
        align-items: center;
        justify-content: center;
    }

    .button {
        background: none;
        border: none;
        cursor: pointer;
    }

</style>