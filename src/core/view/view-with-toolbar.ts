/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module view
 */

import './view-with-toolbar.less';

import type {
	IViewWithToolbar,
	IToolbarCollection,
	Buttons,
	IDictionary,
	IPluginButton,
	IViewOptions,
	ButtonsGroups
} from 'jodit/types';
import { View } from './view';
import { isString, resolveElement, splitArray } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { makeCollection } from 'jodit/modules/toolbar/factory';
import { STATUSES } from '../component';
import { isButtonGroup } from '../ui/helpers/buttons';
import { autobind } from 'jodit/core/decorators';

export abstract class ViewWithToolbar extends View implements IViewWithToolbar {
	TOOLBAR!: IToolbarCollection;
	readonly toolbar: this['TOOLBAR'] = makeCollection(this);

	private defaultToolbarContainer: HTMLElement =
		this.c.div('jodit-toolbar__box');

	/**
	 * Container for toolbar
	 */
	get toolbarContainer(): HTMLElement {
		if (
			!this.o.fullsize &&
			(isString(this.o.toolbar) || Dom.isHTMLElement(this.o.toolbar))
		) {
			return resolveElement(this.o.toolbar, this.o.shadowRoot || this.od);
		}

		this.o.toolbar &&
			Dom.appendChildFirst(this.container, this.defaultToolbarContainer);

		return this.defaultToolbarContainer;
	}

	/**
	 * Change panel container
	 */
	setPanel(element: HTMLElement | string): void {
		this.o.toolbar = element;
		this.buildToolbar();
	}

	/**
	 * Helper for append toolbar in its place
	 */
	protected buildToolbar(): void {
		if (!this.o.toolbar) {
			return;
		}

		const buttons = this.o.buttons
			? (splitArray(this.o.buttons) as Buttons)
			: [];

		this.toolbar
			.setRemoveButtons(this.o.removeButtons)
			.build(buttons.concat(this.o.extraButtons || []))
			.appendTo(this.toolbarContainer);
	}

	registeredButtons: Set<IPluginButton> = new Set();
	private groupToButtons: IDictionary<string[]> = {};

	getRegisteredButtonGroups(): IDictionary<string[]> {
		return this.groupToButtons;
	}

	/**
	 * Register button for group
	 */
	registerButton(btn: IPluginButton): this {
		this.registeredButtons.add(btn);
		const group = btn.group ?? 'other';

		if (!this.groupToButtons[group]) {
			this.groupToButtons[group] = [];
		}

		if (btn.position != null) {
			this.groupToButtons[group][btn.position] = btn.name;
		} else {
			this.groupToButtons[group].push(btn.name);
		}

		return this;
	}

	/**
	 * Remove button from group
	 */
	unregisterButton(btn: IPluginButton): this {
		this.registeredButtons.delete(btn);

		const groupName = btn.group ?? 'other',
			group = this.groupToButtons[groupName];

		if (group) {
			const index = group.indexOf(btn.name);

			if (index !== -1) {
				group.splice(index, 1);
			}

			if (group.length === 0) {
				delete this.groupToButtons[groupName];
			}
		}

		return this;
	}

	/**
	 * Prepare toolbar items and append buttons in groups
	 */
	@autobind
	private beforeToolbarBuild(items: ButtonsGroups): ButtonsGroups | void {
		if (Object.keys(this.groupToButtons).length) {
			return items.map(item => {
				if (
					isButtonGroup(item) &&
					item.group &&
					this.groupToButtons[item.group]
				) {
					return {
						group: item.group,
						buttons: [
							...item.buttons,
							...this.groupToButtons[item.group]
						]
					};
				}

				return item;
			});
		}
	}

	override readonly isJodit: boolean = false;

	/** @override **/
	protected constructor(
		options?: Partial<IViewOptions>,
		isJodit: boolean = false
	) {
		super(options, isJodit);
		this.isJodit = isJodit;

		this.e.on('beforeToolbarBuild', this.beforeToolbarBuild);
	}

	override destruct(): void {
		if (this.isDestructed) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);
		this.e.off('beforeToolbarBuild', this.beforeToolbarBuild);
		this.toolbar.destruct();
		super.destruct();
	}
}
