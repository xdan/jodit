/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from './types';
import { keepNames } from './core/helpers/utils';

/**
 * Save origina class name for some modules for uglify keepName: false
 * @param modules
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function keepModuleNames(modules: IDictionary<Function>): void {
	keepNames.set(modules.UIButton, 'UIButton');
	keepNames.set(modules.UIElement, 'UIElement');
	keepNames.set(modules.UISeparator, 'UISeparator');
	keepNames.set(modules.UIList, 'UIList');
	keepNames.set(modules.UIGroup, 'UIGroup');
	keepNames.set(modules.UIForm, 'UIForm');
	keepNames.set(modules.UIInput, 'UIInput');
	keepNames.set(modules.UITextArea, 'UITextArea');
	keepNames.set(modules.UICheckbox, 'UICheckbox');
	keepNames.set(modules.UIBlock, 'UIBlock');
	keepNames.set(modules.Popup, 'Popup');
	keepNames.set(modules.ContextMenu, 'ContextMenu');
	keepNames.set(modules.ToolbarButton, 'ToolbarButton');
	keepNames.set(modules.ToolbarContent, 'ToolbarContent');
	keepNames.set(modules.ToolbarCollection, 'ToolbarCollection');
	keepNames.set(modules.ToolbarEditorCollection, 'ToolbarEditorCollection');
	keepNames.set(modules.Component, 'Component');
	keepNames.set(modules.Table, 'Table');
	keepNames.set(modules.Uploader, 'Uploader');
	keepNames.set(modules.FileBrowser, 'FileBrowser');
}
