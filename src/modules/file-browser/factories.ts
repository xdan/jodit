/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IContextMenu,
	IFileBrowserDataProvider,
	IFileBrowserOptions,
	IUIElement,
	IViewBased
} from '../../types';
import DataProvider from './data-provider';
import { ContextMenu } from '../context-menu/context-menu';

export function makeDataProvider(
	parent: IViewBased,
	options: IFileBrowserOptions
): IFileBrowserDataProvider {
	return new DataProvider(parent, options);
}

export function makeContextMenu(parent: IViewBased): IContextMenu & IUIElement {
	return new ContextMenu(parent);
}
