import type { Position } from "./types";

export function get_tp_command(
  dimension: string,
  entry: number | Position
): string {
  let cmd = `/observable tp ${dimension} `;
  if (typeof entry === "number") {
    cmd += `entity ${entry}`;
  } else {
    let { x, y, z } = entry;
    cmd += `position ${x} ${y} ${z}`;
  }
  return cmd;
}