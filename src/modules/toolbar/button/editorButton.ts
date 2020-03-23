import { ToolbarButton } from './button';
import * as consts from '../../../constants';
import { IDictionary, IJodit, IViewBased } from '../../../types';
import { Dom } from '../../Dom';
import { css } from '../../helpers';

export class ToolbarEditorButton extends ToolbarButton<IJodit> {
	/** @override */
	isShouldBeDisabled(): boolean  {
		const disabled = super.isShouldBeDisabled();

		if (disabled !== undefined) {
			return disabled;
		}

		const mode: number =
			this.control === undefined || this.control.mode === undefined
				? consts.MODE_WYSIWYG
				: this.control.mode;

		return !(
			mode === consts.MODE_SPLIT || mode === this.jodit.getRealMode()
		);
	}

	/** @override */
	isShouldBeActive(): boolean {
		const active = super.isShouldBeActive();

		if (active !== undefined) {
			return active;
		}

		const element: false | Node = this.jodit.selection
			? this.jodit.selection.current()
			: false;

		if (!element) {
			return false;
		}

		let elm: Node | false;

		if (this.control.tags) {
			let tags: string[] = this.control.tags;

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
		if (this.control.css) {
			const css = this.control.css;

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
}
