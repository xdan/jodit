/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/toolbar/README.md]]
 * @packageDocumentation
 * @module modules/toolbar
 */

import type {
	IControlTypeContent,
	IControlTypeStrong,
	IToolbarButton,
	IToolbarCollection,
	IUIElement,
	IViewBased,
	Nullable
} from 'jodit/types';
import { getComponentClass } from 'jodit/core/decorators/component/component';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { isJoditObject } from 'jodit/core/helpers/checker/is-jodit-object';

/**
 * Collection factory
 */
export function makeCollection(
	jodit: IViewBased,
	parentElement?: IUIElement
): IToolbarCollection {
	const ToolbarCollection =
		getComponentClass<IToolbarCollection>('ToolbarCollection');

	const ToolbarEditorCollection = getComponentClass<IToolbarCollection>(
		'ToolbarEditorCollection'
	);

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
 */
export function makeButton(
	jodit: IViewBased,
	control: IControlTypeStrong,
	target: Nullable<HTMLElement> = null
): IToolbarButton {
	if (isFunction(control.getContent)) {
		const ToolbarContent =
			getComponentClass<IToolbarButton>('ToolbarContent')!;

		return new ToolbarContent(
			jodit,
			control as IControlTypeContent,
			target
		);
	}

	const ToolbarButton = getComponentClass<IToolbarButton>('ToolbarButton')!;
	const button = new ToolbarButton(jodit, control, target);

	button.state.tabIndex = jodit.o.allowTabNavigation ? 0 : -1;

	return button;
}

export function makeSelect(
	view: IViewBased,
	control: IControlTypeStrong,
	target: Nullable<HTMLElement> = null
): IToolbarButton {
	const ToolbarSelect = getComponentClass<IToolbarButton>('ToolbarSelect')!;
	return new ToolbarSelect(view, control, target);
}
