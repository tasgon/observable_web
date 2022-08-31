export interface Profile {
  entities: { [s: string]: Entry[] };
  blocks: { [s: string]: Entry[] };
  ticks: number;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Entry {
  entityId?: number;
  position: Position;
  type: string;
  rate: number;
  ticks: number;
  traces?: any;
}

export interface DataWithDiagnostics {
  data: Profile;
  diagnostics: { [s: string]: any };
}