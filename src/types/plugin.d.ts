/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IJodit } from './jodit';
import type { CanPromise, IDestructible, IInitable } from './types';
import type { IViewBased } from './view';
import type { ButtonGroup, IControlType } from './toolbar';

export interface IPluginButton {
	name: string;
	group?: ButtonGroup;
	position?: number;
	options?: IControlType;
}

export class IPlugin<T extends IViewBased = IViewBased>
	implements IDestructible, IInitable
{
	jodit: T;

	static requires?: string[];
	requires?: string[];

	hasStyle?: boolean;

	/**
	 * Plugin buttons
	 */
	buttons?: IPluginButton[];

	init(jodit: T): void;
	destruct(jodit?: T): void;

	constructor(jodit?: T);
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
	add(name: string, plugin: any): void;
	get(name: string): PluginType | void;
	remove(name: string): void;
	init(jodit: IJodit): CanPromise<void>;
}
