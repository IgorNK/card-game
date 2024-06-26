<script lang="ts">
    export let direction: string;

    let angle = -45;
    let offsetX = -0.5;
    let offsetY = -0.5;
    switch (direction) {
        case "right":
            angle = 45;
            offsetX = 0;
            offsetY = -0.5;
            break;
        case "up":
            angle = -45;
            offsetX = -0.5;
            offsetY = 0;
            break;
        case "left":
            angle = -135;
            offsetY = 0.5;
            offsetX = 0;
            break;
        case "down":
            angle = 135;
            offsetX = 0.5;
            offsetY = 0;
            break;
    }
    
</script>
<div class=container style="transform: translate({offsetX}vmin, {offsetY}vmin)">
    <div class=arrow style="transform: rotate({angle}deg)" />
</div>


<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .arrow {
        width: 6vmin;
        height: 6vmin;
        box-sizing: border-box; 
    }

    .arrow::before {
        content: '';
        width: 100%;
        height: 100%;
        border-width: .8vmin .8vmin 0 0;
        border-style: solid;
        border-color: #fafafa;
        transition: .2s ease;
        display: block;
        transform-origin: 100% 0;
    }

    .arrow:after {
        content: '';
        float: left;
        position: relative;
        top: -100%;
        width: 100%;
        height: 100%;
        border-width: 0 .8vmin 0 0;
        border-style: solid;
        border-color: #fafafa;
        transform-origin: 100% 0;
        transition: .2s ease;
    }

    .arrow:hover::after {
        transform: rotate(45deg);
        border-color: orange;
        height: 120%;
    }

    .arrow:hover::before {
        border-color: orange;
        transform: scale(.8);
    }

</style>