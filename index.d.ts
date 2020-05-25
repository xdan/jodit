import { Jodit as Super } from './src/jodit';
export * from './src/types';

declare global {
	const Jodit: typeof Super;
}

export { Jodit };
