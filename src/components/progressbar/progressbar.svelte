<script lang="ts">
    export let value: number = 50;
    const imageEmpty = "/textures/ui/progressbar_0_empty.png";
    const imageFilled = "/textures/ui/progressbar_0_filled.png";
    const imageEdge = "/textures/ui/progressbar_0_edge.png";

    let width = 256;
    let edge = 16;
$:  fill = Math.min(Math.max(30, (width * (value / 100) - edge / 2)), 216);
$:  empty = width - fill - edge / 2;
</script>
{#if value > 99}
<div class="bar" style="grid-template-columns: {width}px">
    <div class="fill" style="background-image: url('{imageFilled}')" />
</div>
{:else if value > 1}
<div class="bar" style="grid-template-columns: {fill}px {edge}px {empty}px">
    <div class="fill" style="background-image: url('{imageFilled}')" />
    <div class="edge" style="background-image: url('{imageEdge}')" />
    <div class="empty" style="background-image: url('{imageEmpty}'); background-position-x: {-fill-edge}px" />
</div>
{:else}
<div class="bar" style="grid-template-columns: {width}px">
    <div class="empty" style="background-image: url('{imageEmpty}')" />
</div>
{/if}

    
<style>
    .bar {
        display: grid;
        height: 64px;
        width: 256px;
        margin-bottom: -16px;
        margin-top: -12px;
    }

    .empty {
        height: 64px;
    }

    .fill {
        height: 64px;
    }

    .edge {
        height: 64px;
    }
</style>