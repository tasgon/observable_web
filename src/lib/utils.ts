import { notification } from './stores';
import type { Position } from './types';

export function copyTPCommand(dimension: string, entry: number | Position) {
	let cmd = `/observable tp ${dimension} `;
	if (typeof entry === 'number') {
		cmd += `entity ${entry}`;
	} else {
		let { x, y, z } = entry;
		cmd += `position ${x} ${y} ${z}`;
	}
	window.navigator.clipboard.writeText(cmd);
	notification.set(`Copied <code>${cmd}</code> to clipboard`);
}
