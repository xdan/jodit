/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IContextMenu, IFileBrowserDataProvider, IFileBrowserOptions, IViewBased } from '../../types';
import DataProvider from './dataProvider';
import { ContextMenu } from '../ContextMenu';

export function makeDataProvider(parent: IViewBased, options: IFileBrowserOptions): IFileBrowserDataProvider {
	return new DataProvider(parent, options);
}

export function makeContextMenu(parent: IViewBased): IContextMenu {
	return new ContextMenu(parent);
}
