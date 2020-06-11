import { Nullable } from '../../types';
import { call } from '../../core/helpers/utils';
import { Dom } from '../../core/dom';
import { INSEPARABLE_TAGS } from '../../core/constants';
import { trim } from '../../core/helpers/string';

export function getNeighbor(
	node: Node,
	backspace: boolean,
	root: HTMLElement
): Nullable<Node> {
	return call(
		backspace ? Dom.prev : Dom.next,
		node,
		n => Boolean(n && (!Dom.isText(n) || n.nodeValue?.length)),
		root
	);
}

export function getSibling(node: Node, backspace: boolean): Nullable<Node> {
	return backspace ? node.previousSibling : node.nextSibling;
}

export function getNormalSibling(
	node: Node,
	backspace: boolean,
	normal: (n: Node) => boolean = (n: Node) => !Dom.isEmptyTextNode(n)
): Nullable<Node> {
	let start = getSibling(node, backspace);

	while (start && !normal(start)) {
		start = getSibling(start, backspace);
	}

	return start && normal(start) ? start : null;
}

export function getNotSpaceSibling(
	node: Node,
	backspace: boolean
): Nullable<Node> {
	return getNormalSibling(node, backspace, n => {
		return (
			!Dom.isEmptyTextNode(n) &&
			Boolean(
				!Dom.isText(n) || (n.nodeValue?.length && trim(n.nodeValue))
			)
		);
	});
}

export function normalizeCursorPosition(node: Node, backspace: boolean): void {
	let sibling = getNormalSibling(node, backspace),
		anotherSibling = getNormalSibling(node, !backspace);

	while (
		Dom.isElement(sibling) &&
		!Dom.isTag(sibling, INSEPARABLE_TAGS) &&
		!anotherSibling
	) {
		if (backspace || !sibling.firstChild) {
			sibling.appendChild(node);
		} else {
			Dom.before(sibling.firstChild, node);
		}

		sibling = getSibling(node, backspace);
		anotherSibling = getSibling(node, !backspace);
	}
}
