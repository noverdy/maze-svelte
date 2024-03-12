import { writable } from "svelte/store";
import Status from "../enums/status.enum";

const status = writable(Status.DRAW);
const mouseDown = writable(false);
const pathfinding = writable(false);

const source = writable({ i: -1, j: -1 });
const destination = writable({ i: -1, j: -1 });

export { status, mouseDown, source, destination, pathfinding };
