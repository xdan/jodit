/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from './jodit';
import { CanPromise, IDestructible, IInitable } from './types';
import { IViewBased } from './view';

export interface IPluginButton {
	name: string;
	group?: string;
	position?: number;
}

export class IPlugin implements IDestructible, IInitable {
	jodit: IJodit;

	static requires?: string[];
	requires?: string[];

	hasStyle?: boolean;

	/**
	 * Plugin buttons
	 */
	buttons?: IPluginButton[];

	init(jodit: IJodit): void;
	destruct(jodit?: IJodit): void;

	constructor(jodit?: IJodit);
}

interface PluginFunction {
	// eslint-disable-next-line @typescript-eslint/no-misused-new
	constructor(jodit: IViewBased): void;
}

export type PluginType = typeof IPlugin | IPlugin | PluginFunction;
export type PluginInstance = IPlugin | object;

export interface IExtraPlugin {
	name: string;
	url?: string;
}

export interface IPluginSystem {
	add(name: string, plugin: PluginType): void;
	get(name: string): PluginType | void;
	remove(name: string): void;
	init(jodit: IJodit): CanPromise<void>;
}
