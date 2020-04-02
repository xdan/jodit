/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlTypeStrong, IToolbarButton, IToolbarCollection, IViewBased } from '../../types';
import { isJoditObject } from '../../core/helpers/checker';
import { ToolbarCollection } from './collection/collection';
import { ToolbarEditorCollection } from './collection/editorCollection';
import { ToolbarButton } from './button/button';
import { ToolbarButtonWithTrigger } from './button/buttonWithTrigger';

/**
 * Collection factory
 * @param jodit
 */
export function makeCollection(jodit: IViewBased): IToolbarCollection {
	const collection = isJoditObject(jodit)
		? new ToolbarEditorCollection(jodit)
		: new ToolbarCollection(jodit);

	if (jodit.options.textIcons) {
		collection.container.classList.add('jodit_text_icons');
	}

	return collection;
}

/**
 * Button factory
 *
 * @param jodit
 * @param control
 * @param [target]
 */
export function makeButton(jodit: IViewBased, control: IControlTypeStrong, target?: HTMLElement): IToolbarButton {
	let button;

	if (control.list || control.popup) {
		button = new ToolbarButtonWithTrigger(jodit, control, target);
	} else {
		button = new ToolbarButton(jodit, control, target);
	}

	return button;
}
