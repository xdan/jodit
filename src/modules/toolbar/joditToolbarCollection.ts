/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { ToolbarCollection } from './collection';
import { ToolbarButton } from './button';
import { IDictionary, IToolbarCollection } from '../../types/';
import { IJodit } from '../../types/jodit';
import { IViewBased } from '../../types/view';
import { Dom } from '../Dom';
import { css } from '../helpers/css';
import * as consts from '../../constants';
import { isJoditObject } from '../helpers/checker/isJoditObject';

export class JoditToolbarCollection extends ToolbarCollection<IJodit> {
	checkActiveStatus = (
		cssObject:
			| IDictionary<string | string[]>
			| IDictionary<(editor: IViewBased, value: string) => boolean>,
		node: HTMLElement
	): boolean => {
		let matches: number = 0,
			total: number = 0;

		Object.keys(cssObject).forEach((cssProperty: string) => {
			const cssValue = cssObject[cssProperty];

			if (typeof cssValue === 'function') {
				if (cssValue(this.jodit, css(node, cssProperty).toString())) {
					matches += 1;
				}
			} else {
				if (
					cssValue.indexOf(css(node, cssProperty).toString()) !== -1
				) {
					matches += 1;
				}
			}

			total += 1;
		});

		return total === matches;
	};

	/**
	 * @override
	 */
	buttonIsActive(button: ToolbarButton): boolean {
		const active = super.buttonIsActive(button);

		if (active !== undefined) {
			return active;
		}

		const element: false | Node = this.jodit.selection
			? this.jodit.selection.current()
			: false;

		if (!element) {
			return false;
		}

		let tags: string[], elm: Node | false, css: IDictionary<string>;

		if (
			button.control.tags ||
			(button.control.options && button.control.options.tags)
		) {
			tags =
				button.control.tags ||
				(button.control.options && button.control.options.tags);

			elm = element;

			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (
							node &&
							tags.indexOf(node.nodeName.toLowerCase()) !== -1
						) {
							return true;
						}
					},
					this.jodit.editor
				)
			) {
				return true;
			}
		}

		// activate by supposed css
		if (
			button.control.css ||
			(button.control.options && button.control.options.css)
		) {
			css =
				button.control.css ||
				(button.control.options && button.control.options.css);

			elm = element;
			if (
				Dom.up(
					elm,
					(node: Node | null): boolean | void => {
						if (node && !Dom.isText(node)) {
							return this.checkActiveStatus(
								css,
								node as HTMLElement
							);
						}
					},
					this.jodit.editor
				)
			) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @override
	 */
	buttonIsDisabled(button: ToolbarButton): boolean | void {
		const disabled = super.buttonIsDisabled(button);

		if (disabled !== undefined) {
			return disabled;
		}

		const mode: number =
			button.control === undefined || button.control.mode === undefined
				? consts.MODE_WYSIWYG
				: button.control.mode;

		return !(
			mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode()
		);
	}

	/**
	 * @override
	 */
	getTarget(button: ToolbarButton): Node | void {
		return button.target || this.jodit.selection.current() || undefined;
	}

	/**
	 * Collection factory
	 * @param jodit
	 */
	static makeCollection(jodit: IViewBased): IToolbarCollection {
		const collection = isJoditObject(jodit)
			? new JoditToolbarCollection(jodit)
			: new ToolbarCollection(jodit);

		if (jodit.options.textIcons) {
			collection.container.classList.add('jodit_text_icons');
		}

		return collection;
	}
}
