<script lang="ts">
  import { SvelteToast, toast } from "@zerodevx/svelte-toast";

  import Cell from "./enums/cell.enum";
  import Status from "./enums/status.enum";

  import GridCell from "./lib/GridCell.svelte";
  import NavigationBar from "./lib/NavigationBar.svelte";
  import { status, source, destination, pathfinding } from "./stores/store";

  import { findPath, encodePath, generate } from "./services/maze.service";

  const gridSize = 30;
  const pathfindSpeed = 20;
  let gridWidth = Math.ceil(window.innerWidth / gridSize);
  let gridHeight = Math.ceil(window.innerHeight / gridSize);
  if (gridWidth % 2 === 0) {
    gridWidth++;
  }

  const paths = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));
  const grids = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));

  function handle(type: Status, i: number, j: number) {
    if ($pathfinding) return;
    switch (type) {
      case Status.DRAW:
        grids[i][j] = Cell.WALL;
        break;
      case Status.ERASE:
        grids[i][j] = Cell.EMPTY;
        break;
      case Status.SOURCE:
        source.set({ i: i, j: j });
        break;
      case Status.DESTINATION:
        destination.set({ i: i, j: j });
        break;
    }
  }

  function followPath(path: string) {
    let index = 0;
    const interval = setInterval(() => {
      paths[$source.i][$source.j] = null;
      if (index < path.length) {
        const c = path[index];
        if (c === "U") {
          $source.i--;
        } else if (c === "D") {
          $source.i++;
        } else if (c === "L") {
          $source.j--;
        } else if (c === "R") {
          $source.j++;
        }
        index++;
      } else {
        clearInterval(interval);
        $pathfinding = false;
      }
    }, pathfindSpeed);
  }

  function renderPath() {
    if ($source.i === $destination.i && $source.j === $destination.j) return;
    try {
      const path = findPath(grids, $source, $destination);
      const encodedPath = encodePath(path);
      $pathfinding = true;

      let i = $source.i,
        j = $source.j,
        index = 0;
      const interval = setInterval(() => {
        if (index < encodedPath.length) {
          paths[i][j] = encodedPath[index];
          const c = path[index];
          if (c === "U") {
            i--;
          } else if (c === "D") {
            i++;
          } else if (c === "L") {
            j--;
          } else if (c === "R") {
            j++;
          }
          index++;
        } else {
          clearInterval(interval);
          followPath(path);
        }
      }, pathfindSpeed);
    } catch (error) {
      toast.push(String(error));
    }
  }

  function generateMaze() {
    const generated = generate(gridHeight, gridWidth);
    generated.forEach((row, i) => {
      row.forEach((el, j) => {
        grids[i][j] = el;
      });
    });
  }

  function handleTouch(e: TouchEvent) {
    e.preventDefault();
    const cell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if (cell && cell.getAttribute("role") === "gridcell") {
      const tabindex = cell.getAttribute("tabindex");
      if (tabindex) {
        const index = parseInt(tabindex, 10) - 1;
        const i = Math.floor(index / gridWidth);
        const j = index % gridWidth;
        handle($status, i, j);
      }
    }
  }
</script>

<div class="w-screen h-screen bg-slate-600" on:touchmove={(e) => handleTouch(e)}>
  <div class="cursor-crosshair">
    {#each grids as row, i}
      <div class="flex">
        {#each row as type, j}
          <GridCell
            {type}
            pathType={paths[i][j]}
            isSource={$source.i === i && $source.j === j}
            isDestination={$destination.i === i && $destination.j === j}
            tabindex={i * gridWidth + j + 1}
            on:toggle={() => handle($status, i, j)}
          />
        {/each}
      </div>
    {/each}
  </div>
</div>

<NavigationBar on:toggle={(e) => ($status = e.detail)} on:pathfind={() => renderPath()} on:generate={() => generateMaze()} />
<SvelteToast />
