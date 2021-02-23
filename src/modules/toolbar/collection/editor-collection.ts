/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { ToolbarCollection } from './collection';
import * as consts from '../../../core/constants';
import { Dom } from '../../../core/dom';
import type {
	IDictionary,
	IToolbarButton,
	IViewBased,
	IJodit
} from '../../../types';
import { css, isFunction } from '../../../core/helpers';
import { component } from '../../../core/decorators';

@component
export class ToolbarEditorCollection extends ToolbarCollection<IJodit> {
	/** @override */
	className(): string {
		return 'ToolbarEditorCollection';
	}

	/** @override */
	shouldBeDisabled(button: IToolbarButton): boolean {
		const disabled = super.shouldBeDisabled(button);

		if (disabled !== undefined) {
			return disabled;
		}

		const mode: number =
			button.control.mode === undefined
				? consts.MODE_WYSIWYG
				: button.control.mode;

		return !(mode === consts.MODE_SPLIT || mode === this.j.getRealMode());
	}

	/** @override */
	shouldBeActive(button: IToolbarButton): boolean {
		const active = super.shouldBeActive(button);

		if (active !== undefined) {
			return active;
		}

		const element = this.j.selection ? this.j.s.current() : null;

		if (!element) {
			return false;
		}

		let elm: Node | false;

		if (button.control.tags) {
			const tags: string[] = button.control.tags;

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
					this.j.editor
				)
			) {
				return true;
			}
		}

		// activate by supposed css
		if (button.control.css) {
			const css = button.control.css;

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
					this.j.editor
				)
			) {
				return true;
			}
		}

		return false;
	}

	private checkActiveStatus = (
		cssObject:
			| IDictionary<string | string[]>
			| IDictionary<(editor: IViewBased, value: string) => boolean>,
		node: HTMLElement
	): boolean => {
		let matches: number = 0,
			total: number = 0;

		Object.keys(cssObject).forEach((cssProperty: string) => {
			const cssValue = cssObject[cssProperty];

			if (isFunction(cssValue)) {
				if (cssValue(this.j, css(node, cssProperty).toString())) {
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

	/** @override */
	getTarget(button: IToolbarButton): Node | null {
		return button.target || this.j.s.current() || null;
	}
}
