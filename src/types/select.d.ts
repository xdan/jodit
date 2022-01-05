/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { CanUndef, HTMLTagNames, IDictionary, Nullable } from './types';
import type { IStyle } from './style';

export interface MarkerInfo {
	startId: string;
	endId?: string;
	collapsed: boolean;
	startMarker: string;
	endMarker?: string;
}

export type WindowSelection = Selection;

export interface ISelect {
	area: HTMLElement;

	sel: WindowSelection | null;

	range: Range;
	createRange(select?: boolean): Range;
	selectRange(range: Range, focus?: boolean): void;
	clear(): void;

	html: string;

	current(checkChild?: boolean): Nullable<Node>;
	focus(options?: FocusOptions): boolean;
	isFocused(): boolean;

	remove(): void;
	removeNode(node: Node): void;

	save(silent?: boolean): MarkerInfo[];
	restore(): void;
	readonly hasMarkers: boolean;
	readonly markers: HTMLElement[];
	removeMarkers(): void;
	marker(atStart?: boolean, range?: Range): HTMLSpanElement;

	insertNode(
		node: Node,
		insertCursorAfter?: boolean,
		fireChange?: boolean
	): void;
	insertHTML(html: number | string | Node): void;
	insertImage(
		url: string | HTMLImageElement,
		styles?: Nullable<IDictionary<string>>,
		defaultWidth?: Nullable<number | string>
	): void;

	isCollapsed(): boolean;
	cursorInTheEdge(
		start: boolean,
		parentBlock: HTMLElement
	): Nullable<boolean>;
	cursorOnTheLeft(parentBlock: HTMLElement): Nullable<boolean>;
	cursorOnTheRight(parentBlock: HTMLElement): Nullable<boolean>;

	insertCursorAtPoint(x: number, y: number): boolean;
	setCursorAfter(node: Node): Nullable<Text>;
	setCursorBefore(node: Node): Nullable<Text>;
	setCursorIn(node: Node, inStart?: boolean): Node;
	select(
		node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement,
		inward?: boolean
	): void;

	wrapInTagGen(): Generator<HTMLElement>;
	wrapInTag(
		tagOrCallback: HTMLTagNames | ((font: HTMLElement) => any)
	): HTMLElement[];

	applyStyle(
		style: CanUndef<IStyle>,
		options?: {
			element?: HTMLTagNames;
			className?: string;
			defaultTag?: HTMLTagNames;
		}
	): void;

	eachSelection(callback: (current: Node) => void): void;
	splitSelection(currentBox: HTMLElement): Nullable<Element>;
}
