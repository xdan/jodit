/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ordered-list
 */

import type { IControlType, IJodit, Nullable } from 'jodit/types';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { dataBind, toArray } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { autobind } from 'jodit/core/decorators';

const exec: IControlType<IJodit>['exec'] = (jodit, _, { control }): void => {
	const key = `button${control.command}`;

	const value = (control.args && control.args[0]) || dataBind(jodit, key);

	dataBind(jodit, key, value);

	jodit.execCommand(control.command as string, false, value);
};

Config.prototype.controls.ul = {
	command: 'insertUnorderedList',
	tags: ['ul'],
	tooltip: 'Insert Unordered List',

	list: {
		default: 'Default',
		circle: 'Circle',
		disc: 'Dot',
		square: 'Quadrate'
	},
	exec
} as IControlType;

Config.prototype.controls.ol = {
	command: 'insertOrderedList',
	tags: ['ol'],
	tooltip: 'Insert Ordered List',

	list: {
		default: 'Default',
		'lower-alpha': 'Lower Alpha',
		'lower-greek': 'Lower Greek',
		'lower-roman': 'Lower Roman',
		'upper-alpha': 'Upper Alpha',
		'upper-roman': 'Upper Roman'
	},
	exec
} as IControlType;

/**
 * Process commands insertOrderedList and insertUnOrderedList
 */
export class orderedList extends Plugin {
	override buttons: Plugin['buttons'] = [
		{
			name: 'ul',
			group: 'list'
		},
		{
			name: 'ol',
			group: 'list'
		}
	];

	protected afterInit(jodit: IJodit): void {
		jodit
			.registerCommand('insertUnorderedList', this.onCommand)
			.registerCommand('insertOrderedList', this.onCommand);
	}

	@autobind
	private onCommand(command: string, _: unknown, type: string): false {
		this.jodit.s.applyStyle(
			{
				listStyleType: type ?? null
			},
			{
				element: command === 'insertunorderedlist' ? 'ul' : 'ol'
			}
		);

		this.jodit.setEditorValue();

		return false;
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

export function orderedList1(editor: IJodit): void {
	const isOurCommand = (command: string) =>
			/insert(un)?orderedlist/i.test(command),
		getListWrapper = () =>
			Dom.up(
				editor.s.current() as Node,
				(tag: Node | null) => tag && /^UL|OL$/i.test(tag.nodeName),
				editor.editor
			),
		listStyleTypeEqual = (el: HTMLElement, listStyleType: string) => {
			const value = el.style.listStyleType;

			return (
				value === listStyleType ||
				(!value && listStyleType === 'default')
			);
		},
		setListStyleType = (el: HTMLElement, value: string) => {
			if (value === 'default' || !value) {
				el.style.removeProperty('list-style-type');
			} else {
				el.style.setProperty('list-style-type', value);
			}
		};

	editor.e
		.on(
			'beforeCommand',
			(command: string, _, listStyleType: string): false | void => {
				if (isOurCommand(command) && listStyleType) {
					const ul = getListWrapper();

					if (ul && !listStyleTypeEqual(ul, listStyleType)) {
						if (
							(Dom.isTag(ul, 'ul') &&
								/unordered/i.test(command)) ||
							(Dom.isTag(ul, 'ol') && !/unordered/i.test(command))
						) {
							setListStyleType(ul, listStyleType);
							return false;
						}
					}
				}
			}
		)
		.on(
			'afterCommand',
			(command: string, _, listStyleType: string): false | void => {
				if (isOurCommand(command)) {
					const ul = getListWrapper();

					if (ul) {
						setListStyleType(ul, listStyleType);
						editor.createInside.applyCreateAttributes(ul);

						ul.querySelectorAll('li').forEach(li => {
							editor.createInside.applyCreateAttributes(li);
						});
					}

					const unwrapList: Node[] = [],
						shouldUnwrap = (elm: Nullable<Node>): void => {
							if (
								Dom.isTag(elm, [
									'p',
									'h1',
									'h2',
									'h3',
									'h4',
									'h5',
									'h6'
								])
							) {
								unwrapList.push(elm);
							}
						};

					if (ul) {
						shouldUnwrap(ul.parentNode);

						ul.querySelectorAll('li').forEach(li =>
							shouldUnwrap(li.firstChild)
						);

						if (unwrapList.length) {
							editor.s.save();

							toArray(ul.childNodes).forEach(li => {
								if (Dom.isTag(li.lastChild, 'br')) {
									Dom.safeRemove(li.lastChild);
								}
							});

							unwrapList.forEach(elm => Dom.unwrap(elm));

							editor.s.restore();
						}
					}

					editor.setEditorValue();
				}
			}
		);
}
