/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module view
 */

import type {
	Buttons,
	ButtonsGroups,
	IDictionary,
	IPluginButton,
	IToolbarCollection,
	IViewOptions,
	IViewWithToolbar
} from 'jodit/types';
import { STATUSES } from 'jodit/core/component/statuses';
import { autobind } from 'jodit/core/decorators/autobind/autobind';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { splitArray } from 'jodit/core/helpers/array';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { resolveElement } from 'jodit/core/helpers/utils/selector';
import { isButtonGroup } from 'jodit/core/ui/helpers/buttons';
import { View } from 'jodit/core/view/view';
import { makeCollection } from 'jodit/modules/toolbar/factory';

import './view-with-toolbar.less';

export abstract class ViewWithToolbar extends View implements IViewWithToolbar {
	TOOLBAR!: IToolbarCollection;
	toolbar: this['TOOLBAR'] = makeCollection(this);

	private __defaultToolbarContainer: HTMLElement =
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
			Dom.appendChildFirst(
				this.container,
				this.__defaultToolbarContainer
			);

		return this.__defaultToolbarContainer;
	}

	/**
	 * Change panel container
	 */
	setPanel(element: HTMLElement | string): void {
		this.o.toolbar = element;
		this.buildToolbar();
	}

	/**
	 * Helper for appended toolbar in its place
	 */
	@watch(':rebuildToolbar')
	protected buildToolbar(): void {
		if (!this.o.toolbar) {
			return;
		}

		const buttons = this.o.buttons
			? (splitArray(this.o.buttons) as Buttons)
			: [];

		this.toolbar
			?.setRemoveButtons(this.o.removeButtons)
			.build(buttons.concat(this.o.extraButtons || []))
			.appendTo(this.toolbarContainer);
	}

	registeredButtons: Set<IPluginButton> = new Set();
	private groupToButtons: IDictionary<string[]> = {};

	getRegisteredButtonGroups(): IDictionary<string[]> {
		return this.groupToButtons;
	}

	/**
	 * Register button for a group
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
	 * Remove button from a group
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
		// @ts-ignore After destruct, we are not responsible for anything
		this.toolbar = undefined;
		super.destruct();
	}
}
