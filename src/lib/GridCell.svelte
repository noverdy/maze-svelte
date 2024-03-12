<script lang="ts">
  export let type: Cell;
  export let tabindex: number;
  export let isSource: boolean;
  export let isDestination: boolean;
  export let pathType: string | null;

  import Cell from "../enums/cell.enum";
  import { mouseDown } from "../stores/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const gridSize = 30;
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  on:mousedown={(e) => {
    if (e.buttons === 1) {
      $mouseDown = true;
      dispatch("toggle");
    }
  }}
  on:mouseup={(e) => e.buttons !== 1 && ($mouseDown = false)}
  on:touchmove={() => ($mouseDown = true)}
  on:touchend={() => ($mouseDown = false)}
  on:keydown={(e) => e.key === "ENTER" && dispatch("toggle")}
  on:mouseover={(e) => e.buttons === 1 && dispatch("toggle")}
  class="{type === Cell.WALL
    ? 'bg-slate-800 border-slate-800'
    : 'bg-slate-600 border-slate-700'} border border-dashed select-none relative hover:brightness-125"
  style="width: {gridSize}px; height: {gridSize}px"
  role="gridcell"
  {tabindex}
>
  {#if pathType}
    <div class="-m-0.5">
      <img src={pathType} alt={pathType} class="pointer-events-none" />
    </div>
  {/if}
  {#if isDestination}
    <div class="bg-pink-700 rounded absolute inset-0.5 aspect-square"></div>
  {/if}
  {#if isSource}
    <div class="bg-yellow-500 rounded-lg absolute inset-1 aspect-square"></div>
  {/if}
</div>
