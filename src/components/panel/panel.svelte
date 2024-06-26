<script lang="ts">
    export let image: string = "";
    export let style: string = "";
</script>

<div class=panel>
    <div class=borders style="border-image-source: url('{image}'); {style}" />

    <div class=inner>
        <slot />
    </div>    
</div>

<style>
    .panel {
        position: relative;
        width: min-content;
        height: min-content;
        position: relative;
        padding: 2rem;
    }
    .borders {
        position: absolute;
        border-style: ridge;
        border-width: 4rem;
        border-image-slice: 30% fill;
        border-image-repeat: repeat;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
    }    
    .inner {
        width: fit-content;
        height: fit-content;
    }

</style>