/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { CanUndef, HTMLTagNames, IDictionary, Nullable } from './types';
import type { IStyle, IStyleOptions } from './style';

export interface MarkerInfo {
	startId: string;
	endId?: string;
	collapsed: boolean;
	startMarker: string;
	endMarker?: string;
}

export type WindowSelection = Selection;

export interface ISelect {
	readonly sel: WindowSelection | null;
	readonly range: Range;
	readonly isInsideArea: boolean;
	readonly html: string;

	createRange(select?: boolean): Range;
	clear(): void;

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
	insertHTML(html: number | string | Node, insertCursorAfter?: boolean): void;
	insertImage(
		url: string | HTMLImageElement,
		styles?: Nullable<IDictionary<string>>,
		defaultWidth?: Nullable<number | string>
	): void;

	isCollapsed(): boolean;
	cursorInTheEdge(
		start: boolean,
		parentBlock: HTMLElement,
		fake?: Node | null
	): Nullable<boolean>;
	cursorOnTheLeft(
		parentBlock: HTMLElement,
		fake?: Node | null
	): Nullable<boolean>;
	cursorOnTheRight(
		parentBlock: HTMLElement,
		fake?: Node | null
	): Nullable<boolean>;

	expandSelection(): ISelect;
	insertCursorAtPoint(x: number, y: number): boolean;
	setCursorAfter(node: Node): Nullable<Text>;
	setCursorBefore(node: Node): Nullable<Text>;
	setCursorIn(node: Node, inStart?: boolean): Node;
	selectRange(range: Range, focus?: boolean): ISelect;
	select(
		node: Node | HTMLElement | HTMLTableElement | HTMLTableCellElement,
		inward?: boolean
	): ISelect;

	wrapInTagGen(): Generator<HTMLElement>;
	wrapInTag(
		tagOrCallback: HTMLTagNames | ((font: HTMLElement) => any)
	): HTMLElement[];

	/** @deprecated Instead use commitStyle */
	applyStyle(
		style: CanUndef<IStyle>,
		options?: {
			element?: HTMLTagNames;
			/** @deprecated Instead use attributes.class*/
			className?: string;
			attributes?: IDictionary<string | number>;
			defaultTag?: HTMLTagNames;
		}
	): void;

	commitStyle(options: IStyleOptions): void;

	eachSelection(callback: (current: Node) => void): void;
	splitSelection(currentBox: HTMLElement, edge?: Node): Nullable<Element>;
}
