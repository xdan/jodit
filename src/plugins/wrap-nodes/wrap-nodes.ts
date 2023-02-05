/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/wrap-nodes/README.md]]
 * @packageDocumentation
 * @module plugins/wrap-nodes
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { autobind } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Wrap single text nodes in block wrapper
 */
class wrapNodes extends Plugin {
	/** @override **/
	protected afterInit(jodit: IJodit): void {
		if (jodit.o.enter.toLowerCase() === 'br') {
			return;
		}

		jodit.e
			.on(
				'drop.wtn focus.wtn keydown.wtn mousedown.wtn afterInit.wtn',
				this.preprocessInput,
				{
					top: true
				}
			)
			.on(
				'afterInit.wtn postProcessSetEditorValue.wtn',
				this.postProcessSetEditorValue
			);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('.wtn');
	}

	/**
	 * Process changed value
	 */
	@autobind
	private postProcessSetEditorValue(): void {
		const { jodit } = this;

		if (!jodit.isEditorMode()) {
			return;
		}

		let child: Nullable<Node> = jodit.editor.firstChild,
			isChanged: boolean = false;

		while (child) {
			child = this.checkAloneListLeaf(child, jodit);

			if (this.isSuitableStart(child)) {
				if (!isChanged) {
					jodit.s.save();
				}

				isChanged = true;
				const box = jodit.createInside.element(jodit.o.enter);

				Dom.before(child, box);

				while (child && this.isSuitable(child)) {
					const next: Nullable<Node> = child.nextSibling;
					box.appendChild(child);
					child = next;
				}

				box.normalize();
				child = box;
			}

			child = child && child.nextSibling;
		}

		if (isChanged) {
			jodit.s.restore();

			if (jodit.e.current === 'afterInit') {
				jodit.e.fire('internalChange');
			}
		}
	}

	private checkAloneListLeaf(child: Node, jodit: IJodit): Node {
		let result = child;
		let next: Nullable<Node> = child;

		do {
			if (
				Dom.isElement(next) &&
				Dom.isTag(next, 'li') &&
				!Dom.isTag(next.parentElement, ['ul', 'ol'])
			) {
				const nextChild: Nullable<Node> = Dom.findNotEmptySibling(
					next,
					false
				);
				if (Dom.isTag(result, 'ul')) {
					result.appendChild(next);
				} else {
					result = Dom.wrap(next, 'ul', jodit.createInside);
				}
				next = nextChild;
			} else {
				break;
			}
		} while (next);

		return result;
	}

	/**
	 * Found Node which should be wrapped
	 */
	private isSuitableStart = (n: Nullable<Node>): boolean =>
		(Dom.isText(n) && isString(n.nodeValue) && /[^\s]/.test(n.nodeValue)) ||
		(this.isNotClosed(n) && !Dom.isTemporary(n));

	/**
	 * Node should add in block element
	 */
	private isSuitable = (n: Nullable<Node>): boolean =>
		Dom.isText(n) || this.isNotClosed(n);

	/**
	 * Some element which need append in block
	 */
	private isNotClosed = (n: Nullable<Node>): n is Element =>
		Dom.isElement(n) &&
		!(Dom.isBlock(n) || Dom.isTag(n, this.j.o.wrapNodes.exclude));

	/**
	 * Process input without parent box
	 */
	@autobind
	private preprocessInput(): void {
		const { jodit } = this,
			isAfterInitEvent = jodit.e.current === 'afterInit';

		if (
			!jodit.isEditorMode() ||
			jodit.editor.firstChild ||
			(!jodit.o.wrapNodes.emptyBlockAfterInit && isAfterInitEvent)
		) {
			return;
		}

		const box = jodit.createInside.element(jodit.o.enter);
		const br = jodit.createInside.element('br');
		Dom.append(box, br);
		Dom.append(jodit.editor, box);

		jodit.s.isFocused() && jodit.s.setCursorBefore(br);
		jodit.e.fire('internalChange');
	}
}

pluginSystem.add('wrapNodes', wrapNodes);
