import { Jodit as Super } from './src/Jodit';
export * from "./src/types"

declare global {
	const Jodit: typeof Super;
}

export {
	Jodit
};
