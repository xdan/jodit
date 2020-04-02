/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import {
	IControlTypeStrong,
	IToolbarCollection,
	IToolbarElement
} from '../../types/toolbar';
import { Component, STATUSES } from '../Component';
import { ToolbarIcon } from './icon';
import { Dom } from '../Dom';
import { IViewBased } from '../../types';
import { trim } from '../helpers/string';
import { isString } from '../helpers/checker';
import { css } from '../helpers';

export abstract class ToolbarElement<T extends IViewBased = IViewBased, N = unknown>
	extends Component<T>
	implements IToolbarElement {
	container!: HTMLElement;
	parentToolbar?: IToolbarCollection;

	constructor(jodit: T, ...args: N[]) {
		super(jodit);
		this.container = this.createContainer(...args);
	}

	/**
	 * Container factory
	 */
	protected abstract createContainer(...args: N[]): HTMLElement;

	/**
	 * Set parent toolbar to element
	 * @param parentToolbar
	 */
	setParentToolbar(parentToolbar: IToolbarCollection | null): void {
		this.parentToolbar = parentToolbar || undefined;

		if (parentToolbar) {
			parentToolbar.container.appendChild(this.container);
		} else {
			Dom.safeRemove(this.container);
		}
	}

	/**
	 * Set focus on element
	 */
	focus() {
		this.container.focus();
	}

	/**
	 * Element has focus
	 */
	isFocused(): boolean {
		const { activeElement } = this.jodit.ownerDocument;
		return Boolean(
			activeElement && Dom.isOrContains(this.container, activeElement)
		);
	}

	/** @override */
	destruct(): any {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);

		this.setParentToolbar(null);
		super.destruct();
	}
}

export function createIcon(
	jodit: IViewBased,
	clearName: string,
	control?: IControlTypeStrong
): HTMLElement {
	const icon: string = control ? control.icon || control.name : clearName;

	if (jodit.options.textIcons) {
		return jodit.create.fromHTML(
			`<span class="jodit_icon">${jodit.i18n(
				control ? control.name : clearName
			)}</span>`
		);
	}

	let iconSVG: string | void | HTMLElement = jodit.events.fire(
		'getIcon',
		icon,
		control,
		clearName
	);

	let iconElement: HTMLElement;

	if (control && control.iconURL && iconSVG === undefined) {
		iconElement = jodit.create.element('span');
		css(
			iconElement,
			'backgroundImage',
			'url(' + control.iconURL.replace('{basePath}', jodit.basePath) + ')'
		);
	} else {
		if (iconSVG === undefined) {
			iconSVG = ToolbarIcon.getIcon(
				ToolbarIcon.exists(icon) ? icon : 'empty'
			);
		}

		iconElement = isString(iconSVG)
			? jodit.create.fromHTML(trim(iconSVG))
			: iconSVG;
	}

	iconElement.classList.add('jodit_icon', 'jodit_icon_' + clearName);

	return iconElement;
}
