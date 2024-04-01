<script lang="ts">
    export let text: string = "text";
    // export let style: string = "fill: #ff9800; font-size: 8;"
    export let width: number = 50;
    export let curve: number = 10;
    export let height: number = 20;
    export let offsetX: number = 0;
    export let offsetY: number = 0;
</script>




<svg class=container viewBox="0 0 {width} {height}">
    <path class="path" id="curve" d="M {offsetX} {height + offsetY} C {curve + offsetX} {offsetY}, {width - curve + offsetX} {offsetY}, {width + offsetX} {height + offsetY}" />
    <text width="500" text-anchor="middle">
      <textPath xlink:href="#curve" startOffset="50%">
        {text}
      </textPath>
    </text>
  </svg>




<style>
    .container {
        width: 100%;
        height: 100%;
    }
    .path {
        fill: transparent;
    }
</style>