import { CanUndef, HTMLTagNames, IDictionary, IJodit } from '../../../types';
import { IS_BLOCK } from '../../constants';
import { ApplyStyle } from './apply-style';

export type StyleValue = number | string | null | undefined;

export interface IStyle extends IDictionary<StyleValue> {}

export interface IStyleOptions {
	style: CanUndef<IStyle>;
	element: CanUndef<HTMLTagNames>;
	defaultTag: CanUndef<HTMLTagNames>;
}

export class Style {
	get element(): HTMLTagNames {
		return this.options.element || this.defaultTag;
	}

	/**
	 * New element is block
	 */
	protected get elementIsBlock(): boolean {
		return Boolean(
			this.options.element && IS_BLOCK.test(this.options.element)
		);
	}

	get defaultTag(): HTMLTagNames {
		if (this.options.defaultTag) {
			return this.options.defaultTag;
		}

		return this.elementIsBlock ? 'p' : 'span';
	}

	constructor(readonly options: IStyleOptions) {}

	apply(jodit: IJodit) {
		const applyStyle = new ApplyStyle(jodit, this);
		applyStyle.apply();
		// const collapsed = jodit.selection.isCollapsed();
		//
		// jodit.selection.wrapInTag(font => {
		// 	const suitElement = this.getSuitableElement(font, jodit.editor);
		//
		// 	if (suitElement) {
		// 		return this.toggleStyle(suitElement);
		// 	}
		//
		// 	const span = Dom.replace(font, this.element, jodit.createInside);
		//
		// 	this.toggleStyle(span);
		//
		// 	if (collapsed) {
		// 		jodit.selection.setCursorIn(span);
		// 	}
		// });
	}

	// private getSuitableElement(
	// 	font: HTMLElement,
	// 	root: HTMLElement
	// ): Nullable<HTMLElement> {
	// 	if (
	// 		font.parentElement !== root &&
	// 		this.isSuitableElement(font.parentElement, root)
	// 	) {
	// 		return font.parentElement;
	// 	}
	//
	// 	if (this.isSuitableElement(font.firstChild, root)) {
	// 		return font.firstChild;
	// 	}
	//
	// 	return null;
	// }
	//
	// private toggleStyle(suitElement: HTMLElement): void {
	// 	if (this.options.style) {
	// 		css(suitElement, this.options.style);
	// 	}
	// }
	//
	// private isSuitableElement(
	// 	elm: Nullable<Node>,
	// 	root: HTMLElement
	// ): elm is HTMLElement {
	//
	// }
}
