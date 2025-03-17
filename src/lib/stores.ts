import { writable } from 'svelte/store';
import type { DataWithDiagnostics, Profile } from './types';

export const notification = writable('');

export const localData = writable<DataWithDiagnostics | Profile | null>(null);
