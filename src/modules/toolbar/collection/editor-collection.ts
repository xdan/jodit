/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/toolbar/collection
 */

import { ToolbarCollection } from './collection';
import * as consts from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom';
import type {
	IDictionary,
	IToolbarButton,
	IViewBased,
	IJodit,
	IBound
} from 'jodit/types';
import { css, isFunction } from 'jodit/core/helpers';
import { component } from 'jodit/core/decorators';

@component
export class ToolbarEditorCollection extends ToolbarCollection<IJodit> {
	/** @override */
	override className(): string {
		return 'ToolbarEditorCollection';
	}

	/** @override */
	override shouldBeDisabled(button: IToolbarButton): boolean {
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
	override shouldBeActive(button: IToolbarButton): boolean {
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
	override getTarget(button: IToolbarButton): Node | null {
		return button.target || this.j.s.current() || null;
	}

	/** @override */
	constructor(jodit: IJodit) {
		super(jodit);
		this.prependInvisibleInput(this.container);
	}

	/**
	 * Adds an invisible element to the container that can handle the
	 * situation when the editor is inside the <label>
	 *
	 * @see https://github.com/jodit/jodit-react/issues/138
	 */
	private prependInvisibleInput(container: HTMLElement): void {
		const input = this.j.create.element('input', {
			tabIndex: -1,
			disabled: true, // Because <label> can trigger click
			style: 'width: 0; height:0; position: absolute; visibility: hidden;'
		});

		Dom.appendChildFirst(container, input);
	}

	/**
	 * Show the inline toolbar inside WYSIWYG editor.
	 * @param bound - you can set the place for displaying the toolbar,
	 * or the place will be in the place of the cursor
	 */
	override showInline(bound?: IBound): void {
		this.jodit.e.fire('showInlineToolbar', bound);
	}

	override hide(): void {
		this.jodit.e.fire('hidePopup');
		super.hide();
		this.jodit.e.fire('toggleToolbar');
	}

	override show(): void {
		super.show();
		this.jodit.e.fire('toggleToolbar');
	}
}
