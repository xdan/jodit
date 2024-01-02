/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDestructible, IInitable } from './types';
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
	static requires?: string[];

	hasStyle?: boolean;

	/**
	 * Additional plugin styles can be written simply as inline styles
	 * ```js
	 * class A extends Jodit.modules.Plugin {
	 *   styles = 'h1{color: red}';
	 * }
	 * ```
	 * Will only be applied if the plugin is activated
	 */
	styles?: string;

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

export type PluginType = typeof IPlugin | IPlugin | PluginFunction | Function;
export type PluginInstance = IPlugin | object;

export interface IExtraPlugin {
	name: string;
	url?: string;
}

export interface IPluginSystem {
	add(name: string, plugin: any): void;
	wait(name: string): Promise<void>;
	get(name: string): PluginType | void;
	remove(name: string): void;
}
