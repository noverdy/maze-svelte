<script lang="ts">
  import Status from "../enums/status.enum";
  import { status, mouseDown, pathfinding } from "../stores/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let floating = false;
</script>

<nav
  class="fixed select-none left-4 right-4 flex gap-3 text-lg text-white pointer-events-none transition-all {$mouseDown || $pathfinding
    ? '-bottom-48'
    : 'bottom-4'}"
>
  <div class="backdrop-blur rounded-3xl shadow-lg flex overflow-hidden pointer-events-auto max-lg:hidden">
    <label for="add_wall" class="bg-slate-400/15 hover:bg-slate-400/50 has-[:checked]:bg-slate-400/70 px-6 py-3 transition-colors cursor-pointer">
      <input checked type="radio" id="add_wall" name="action" value="add_wall" class="hidden" on:change={() => dispatch("toggle", Status.DRAW)} />
      Add Wall
    </label>

    <label for="remove_wall" class="bg-slate-400/15 hover:bg-slate-400/50 has-[:checked]:bg-slate-400/70 px-6 py-3 transition-colors cursor-pointer">
      <input type="radio" id="remove_wall" name="action" value="remove_wall" class="hidden" on:change={() => dispatch("toggle", Status.ERASE)} />
      Remove Wall
    </label>

    <label for="put_source" class="bg-slate-400/15 hover:bg-slate-400/50 has-[:checked]:bg-slate-400/70 px-6 py-3 transition-colors cursor-pointer">
      <input type="radio" id="put_source" name="action" value="put_source" class="hidden" on:change={() => dispatch("toggle", Status.SOURCE)} />
      Put Source
    </label>

    <label for="put_destination" class="bg-slate-400/15 hover:bg-slate-400/50 has-[:checked]:bg-slate-400/70 px-6 py-3 transition-colors cursor-pointer">
      <input type="radio" id="put_destination" name="action" value="put_destination" class="hidden" on:change={() => dispatch("toggle", Status.DESTINATION)} />
      Put Destination
    </label>
  </div>

  <div class="grow max-lg:hidden" />

  <div class="backdrop-blur rounded-3xl shadow-lg flex overflow-hidden pointer-events-auto max-lg:hidden">
    <button on:click={() => dispatch("generate")} class="bg-slate-400/15 hover:bg-slate-400/50 px-6 py-3 transition-colors">Generate Maze</button>
    <button on:click={() => dispatch("pathfind")} class="bg-slate-400/15 hover:bg-slate-400/50 px-6 py-3 transition-colors">Pathfind! 🚀</button>
  </div>

  <!-- Mobile -->
  <select
    name="status"
    bind:value={$status}
    on:change={() => dispatch("toggle", $status)}
    class="pointer-events-auto backdrop-blur rounded-3xl shadow-lg bg-slate-400/15 px-6 py-3 outline-none border-r-[16px] border-transparent lg:hidden"
  >
    <option value={Status.DRAW}>Add Wall</option>
    <option value={Status.ERASE}>Remove Wall</option>
    <option value={Status.SOURCE}>Put Source</option>
    <option value={Status.DESTINATION}>Put Destination</option>
  </select>

  <div class="grow lg:hidden"></div>

  <div class="relative pointer-events-auto lg:hidden">
    <div class="absolute bottom-12 right-0 overflow-hidden transition-all w-48 {floating ? 'max-h-60 py-3' : 'max-h-0'}">
      <div class="flex justify-end items-center gap-3 mb-2">
        <span class="drop-shadow-lg">Generate Maze</span>
        <button
          on:focus={() => {
            floating = false;
            dispatch("generate");
          }}
          class="bg-slate-400/15 backdrop-blur rounded-3xl shadow-lg w-10 h-10">💡</button
        >
      </div>
      <div class="flex justify-end items-center gap-3">
        <span class="drop-shadow-lg">Pathfind!</span>
        <button
          on:focus={() => {
            floating = false;
            dispatch("pathfind");
          }}
          class="bg-slate-400/15 backdrop-blur rounded-3xl shadow-lg w-10 h-10">🚀</button
        >
      </div>
    </div>
    <button on:click={() => (floating = !floating)} class="bg-slate-400/15 backdrop-blur rounded-3xl shadow-lg px-3 h-full">🚀</button>
  </div>
</nav>
