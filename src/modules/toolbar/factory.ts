/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	IControlTypeContent,
	IControlTypeStrong,
	IToolbarButton,
	IToolbarCollection,
	IUIElement,
	IViewBased,
	Nullable
} from '../../types';
import { isFunction, isJoditObject } from '../../core/helpers';
import { ToolbarCollection } from './collection/collection';
import { ToolbarEditorCollection } from './collection/editor-collection';
import { ToolbarButton } from './button/button';
import { ToolbarContent } from './button/content';

/**
 * Collection factory
 * @param jodit
 */
export function makeCollection(
	jodit: IViewBased,
	parentElement?: IUIElement
): IToolbarCollection {
	const collection = isJoditObject(jodit)
		? new ToolbarEditorCollection(jodit)
		: new ToolbarCollection(jodit);

	if (jodit.o.textIcons) {
		collection.container.classList.add('jodit_text_icons');
	}

	if (parentElement) {
		collection.parentElement = parentElement;
	}

	if (jodit.o.toolbarButtonSize) {
		collection.buttonSize = jodit.o.toolbarButtonSize;
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
export function makeButton(
	jodit: IViewBased,
	control: IControlTypeStrong,
	target: Nullable<HTMLElement> = null
): IToolbarButton {
	if (isFunction(control.getContent)) {
		return new ToolbarContent(
			jodit,
			control as IControlTypeContent,
			target
		);
	}

	const button = new ToolbarButton(jodit, control, target);

	button.state.tabIndex = jodit.o.allowTabNavigation ? 0 : -1;

	return button;
}
