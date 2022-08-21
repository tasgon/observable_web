export interface Profile {
  entities: { [s: string]: EntitySample[] };
  blocks: { [s: string]: BlockSample[] };
  chunks: { [s: string]: ChunkSample[] };
  ticks: number;
}

export interface Sample {
  type: string;
  rate: number;
  ticks: number;
  traces?: any;
}

export interface EntitySample extends Sample {
  obj: number;
}

export interface BlockSample extends Sample {
  obj: {
    x: number;
    y: number;
    z: number;
  };
}

export interface ChunkSample {
  first: {
    x: number;
    z: number;
  };
  second: number;
}
