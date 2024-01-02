/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/file-browser
 */

import type {
	IContextMenu,
	IFileBrowserDataProvider,
	IFileBrowserOptions,
	IUIElement,
	IViewBased
} from 'jodit/types';
import { ContextMenu } from 'jodit/modules/context-menu/context-menu';

import DataProvider from './data-provider';

export function makeDataProvider(
	parent: IViewBased,
	options: IFileBrowserOptions
): IFileBrowserDataProvider {
	return new DataProvider(parent, options);
}

export function makeContextMenu(parent: IViewBased): IContextMenu & IUIElement {
	return new ContextMenu(parent);
}
