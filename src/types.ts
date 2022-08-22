export interface Profile {
  entities: { [s: string]: EntityEntry[] };
  blocks: { [s: string]: BlockEntry[] };
  chunks: { [s: string]: ChunkEntry[] };
  ticks: number;
}

export interface Entry {
  type: string;
  rate: number;
  ticks: number;
  traces?: any;
}

export interface EntityEntry extends Entry {
  obj: number;
}

export interface BlockEntry extends Entry {
  obj: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ChunkEntry {
  first: {
    x: number;
    z: number;
  };
  second: number;
}
