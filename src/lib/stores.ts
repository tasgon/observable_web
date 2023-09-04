import { writable } from 'svelte/store';
import type { DataWithDiagnostics } from './types';

export const notification = writable('');

export const localData = writable<DataWithDiagnostics | null>(null);
