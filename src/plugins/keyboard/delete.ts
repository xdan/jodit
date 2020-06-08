import { Plugin } from '../../core/plugin';
import { CanUndef, IJodit, Nullable } from '../../types';
import * as consts from '../../core/constants';
import { Dom } from '../../core/dom';
import { trim } from '../../core/helpers/string';
import { INSEPARABLE_TAGS, INVISIBLE_SPACE } from '../../core/constants';
import { isVoid } from '../../core/helpers/checker';
import { call } from '../../core/helpers/utils';

export class Delete extends Plugin {
	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.e
			.on('afterCommand', (command: string) => {
				if (command === 'delete') {
					this.afterDeleteCommand();
				}
			})
			.on('keydown', (event: KeyboardEvent): false | void => {
				if (
					event.key === consts.KEY_BACKSPACE ||
					event.key === consts.KEY_DELETE
				) {
					return this.onDelete(event.key === consts.KEY_BACKSPACE);
				}
			});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('afterCommand').off('keydown');
	}

	/**
	 * After Delete command remove extra BR
	 */
	private afterDeleteCommand(): void {
		const jodit = this.j;

		const current = jodit.s.current();

		if (current && Dom.isTag(current.firstChild, 'br')) {
			jodit.s.removeNode(current.firstChild);
		}

		if (
			!trim(jodit.editor.textContent || '') &&
			!jodit.editor.querySelector('img') &&
			(!current || !Dom.closest(current, 'table', jodit.editor))
		) {
			jodit.editor.innerHTML = '';

			const node = jodit.s.setCursorIn(jodit.editor);

			jodit.s.removeNode(node);
		}
	}

	/**
	 * Listener BackSpace or Delete button
	 * @param backspace
	 */
	private onDelete(backspace: boolean): false {
		const sel = this.j.selection;

		if (!sel.isFocused()) {
			sel.focus();
		}

		if (!sel.sel?.rangeCount || this.checkNotCollapsed()) {
			return false;
		}

		const jodit = this.j;

		const range = sel.range;
		const fakeNode = jodit.createInside.text(consts.INVISIBLE_SPACE);

		try {
			range.insertNode(fakeNode);
			if (!Dom.isOrContains(jodit.editor, fakeNode)) {
				return false;
			}

			if (
				this.checkRemoveChar(fakeNode, backspace) ||
				this.checkRemoveInseparableElement(fakeNode, backspace) ||
				this.checkTableCell(fakeNode, backspace) ||
				this.checkRemoveEmptyElement(fakeNode, backspace) ||
				this.checkRemoveEmptyNeighbor(fakeNode, backspace) ||
				this.checkJoinNeighbors(fakeNode, backspace)
			) {
				return false;
			}
		} finally {
			Dom.safeRemove(fakeNode);
		}

		return false;
	}

	/**
	 * On Not collapsed selection - should only remove whole selected content
	 *
	 * @example
	 * ```html
	 * <p>first | stop</p><p>second | stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>first | stop</p>
	 * ```
	 */
	private checkNotCollapsed(): void | true {
		const jodit = this.j;

		if (!jodit.s.isCollapsed()) {
			jodit.execCommand('Delete');
			return true;
		}
	}

	/**
	 * Check possibility the char can be removed
	 *
	 * @example
	 * ```html
	 * te|st
	 * ```
	 * result
	 * ```html
	 * t|st
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveChar(fakeNode: Node, backspace: boolean): void | true {
		const step = backspace ? -1 : 1;

		let neighbor = this.getNeighbor(fakeNode, backspace),
			removeNeighbor: Nullable<Node> = null;

		let charRemoved: boolean = false,
			removed: CanUndef<string>;

		while (neighbor && Dom.isText(neighbor)) {
			if (neighbor.nodeValue?.length) {
				const value = neighbor.nodeValue;
				const length = value.length;

				let index = backspace ? length - 1 : 0;

				if (value[index] === INVISIBLE_SPACE) {
					while (value[index] === INVISIBLE_SPACE) {
						index += step;
					}
				}

				removed = value[index];

				if (value[index + step] === INVISIBLE_SPACE) {
					index += step;

					while (value[index] === INVISIBLE_SPACE) {
						index += step;
					}

					index += backspace ? 1 : -1;
				}

				neighbor.nodeValue = value.substr(
					backspace ? 0 : index + 1,
					backspace ? index : length
				);
			}

			if (!neighbor.nodeValue?.length) {
				removeNeighbor = neighbor;
			}

			if (!isVoid(removed) && removed !== INVISIBLE_SPACE) {
				charRemoved = true;
				break;
			}

			neighbor = this.getNeighbor(neighbor, backspace);

			if (removeNeighbor) {
				Dom.safeRemove(removeNeighbor);
				removeNeighbor = null;
			}
		}

		if (charRemoved) {
			this.j.s.setCursorBefore(fakeNode);
			this.checkRemoveEmptyElement(fakeNode, backspace);
		}

		return charRemoved || undefined;
	}

	private getNeighbor(node: Node, backspace: boolean): Nullable<Node> {
		return call(
			backspace ? Dom.prev : Dom.next,
			node,
			n => Boolean(n && (!Dom.isText(n) || n.nodeValue?.length)),
			this.j.editor
		);
	}

	/**
	 * Check possibility inseparable Element can be removed (img, hr etc.)
	 *
	 * @example
	 * ```html
	 * <p>first second <img>| stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>first second | stop</p>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveInseparableElement(
		fakeNode: Node,
		backspace: boolean
	): void | true {
		const neighbor = this.getNeighbor(fakeNode, backspace);

		if (Dom.isTag(neighbor, INSEPARABLE_TAGS)) {
			Dom.safeRemove(neighbor);
			this.j.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	/**
	 * Inside the CELL table - nothing to do
	 *
	 * @example
	 * ```html
	 * <table><tr><td>|test</td></tr></table>
	 * ```
	 * result
	 * ```html
	 * <table><tr><td>|test</td></tr></table>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkTableCell(fakeNode: Node, backspace: boolean): void | true {
		const cell = fakeNode.parentElement;

		if (Dom.isCell(cell, this.j.editorWindow)) {
			return true;
		}
	}

	/**
	 * Check if the current empty item can be removed
	 *
	 * @example
	 * ```html
	 * <p>first stop</p><p>|<br></p>
	 * ```
	 * result
	 * ```html
	 * <p>first stop|</p>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveEmptyElement(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		let found: boolean = false;

		let parent: Nullable<Node> = Dom.closest(
			fakeNode,
			Dom.isElement,
			this.j.editor
		);

		const neighbor = this.getNeighbor(fakeNode, backspace);

		do {
			if (
				parent &&
				Dom.isEmpty(parent) &&
				!Dom.isCell(parent, this.j.editorWindow)
			) {
				Dom.after(parent, fakeNode);

				const p = Dom.closest(
					parent,
					n => Dom.isElement(n) && n !== parent,
					this.j.editor
				);

				Dom.safeRemove(parent);

				found = true;

				parent = p;
			} else {
				break;
			}
		} while (parent);

		if (neighbor) {
			this.j.s.setCursorIn(neighbor, !backspace);
		} else {
			this.j.s.setCursorBefore(fakeNode);
		}

		return found || undefined;
	}

	/**
	 * Check if it is possible to remove an empty adjacent element.
	 *
	 * @example
	 * ```html
	 * <p><br></p><p>|second stop</p>
	 * ```
	 * result
	 * ```html
	 * <p>|second stop</p>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkRemoveEmptyNeighbor(
		fakeNode: Node,
		backspace: boolean
	): true | void {
		const neighbor = this.getNeighbor(fakeNode, backspace);

		if (neighbor && Dom.isEmpty(neighbor)) {
			Dom.safeRemove(neighbor);
			this.j.s.setCursorBefore(fakeNode);
			return true;
		}
	}

	/**
	 * Check if two separate elements can be connected
	 *
	 * @example
	 * ```html
	 * <p>a</p><p>|b</p>
	 * <ul><li>a</li></ul><ul><li>|b</li></ul>
	 * ```
	 * result
	 * ```html
	 * <p>a|b</p>
	 * <ul><li>a</li><li>|b</li></ul>
	 * ```
	 * @param fakeNode
	 * @param backspace
	 */
	private checkJoinNeighbors(
		fakeNode: Node,
		backspace: boolean
	): true | void {}
}
