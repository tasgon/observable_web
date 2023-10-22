export interface Profile {
  entities: Record<string, Entry[]>;
  blocks: Record<string, Entry[]>;
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

export interface Diagnostics {
  user: string;
  start: number;
  duration: number;
  minecraftVersion: string;
  modLoader: string;
  observableVersion: string;
  additionalDiagnostics: { [s: string]: any };
}

export interface DataWithDiagnostics {
  data: Profile;
  diagnostics: Diagnostics;
}
