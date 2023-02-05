/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IViewBased } from 'jodit/types/view';
import type { IAsync } from 'jodit/types/async';

export type IDictionary<T = any, K extends string = string> = {
	[key in K]: T;
};

export type CanPromise<T> = T | Promise<T>;
export type CanUndef<T> = T | undefined;
export type CanArray<T> = T | Array<T>;
export type Nullable<T> = T | null;

export interface IInitable {
	init(jodit: IViewBased): any;
}

export interface IDestructible {
	destruct(jodit?: IViewBased): any;
}

export type ComponentStatus =
	| 'beforeInit'
	| 'ready'
	| 'beforeDestruct'
	| 'destructed';

export interface IContainer {
	container: HTMLElement;
}

interface IComponent<T extends IViewBased = IViewBased> extends IDestructible {
	readonly async: IAsync;
	readonly ownerDocument: Document;
	readonly od: this['ownerDocument'];
	readonly ownerWindow: Window;
	readonly ow: this['ownerWindow'];

	get<T>(chain: string, obj?: IDictionary): Nullable<T>;

	readonly componentName: string;
	className(): string;

	getFullElName(elementName: string): string;
	getFullElName(elementName: string, mod: string): string;
	getFullElName(
		elementName: string,
		mod?: string,
		modValue?: boolean | string
	): string;

	readonly uid: string;
	readonly isDestructed: boolean;
	readonly isInDestruct: boolean;
	readonly isReady: boolean;

	readonly componentStatus: ComponentStatus;
	setStatus(componentStatus: ComponentStatus): void;

	hookStatus(
		status: ComponentStatus,
		callback: (component: this) => void
	): void;

	bindDestruct(component: IComponent): this;
}

interface IViewComponent<T extends IViewBased = IViewBased> extends IComponent {
	jodit: T;
	readonly j: T;
	setParentView(jodit: T): this;
	readonly i18n: T['i18n'];
	readonly defaultTimeout: number;
}

export type NodeCondition<T extends Node = Node> = (
	node: Nullable<T>
) => boolean | null | false | void | '';

/**
 * Bound interface
 */
export interface IBound {
	top: number;
	left: number;
	width: number;
	height: number;
}

export interface IBoundP {
	top: number;
	left: number;
	width?: number;
	height?: number;
}

export interface IPoint {
	x: number;
	y: number;
}

export interface IPointBound extends IPoint {
	w: number;
	h: number;
}

export interface ISelectionRange {
	startContainer: Text;
	startOffset: number;
	endContainer: Text;
	endOffset: number;
}

export interface IRGB {
	r: number;
	g: number;
	b: number;
}

export interface IPermissions {
	allowFiles: boolean;
	allowFileMove: boolean;
	allowFileUpload: boolean;
	allowFileUploadRemote: boolean;
	allowFileRemove: boolean;
	allowFileRename: boolean;
	allowFolders: boolean;
	allowFolderCreate: boolean;
	allowFolderMove: boolean;
	allowFolderRemove: boolean;
	allowFolderRename: boolean;
	allowImageResize: boolean;
	allowImageCrop: boolean;
	[key: string]: boolean;
}

export type CallbackFunction<T = any> = (this: T, ...args: any[]) => any | void;
export type BooleanFunction<T = any> = (this: T, ...args: any[]) => boolean;

export type ExecCommandCallback<T, C extends string> =
	| ((
			this: T,
			command: C,
			value?: string,
			next?: any,
			...args: unknown[]
	  ) => void | boolean | Promise<void | boolean>)
	| ((
			this: T,
			command: C,
			value: string,
			next: string,
			...args: unknown[]
	  ) => void | boolean | Promise<void | boolean>);

export interface ICommandType<T, C extends string> {
	exec: ExecCommandCallback<T, C>;
	hotkeys?: string | string[];
}

export type CustomCommand<T, C extends string> =
	| ICommandType<T, C>
	| ExecCommandCallback<T, C>;

export interface IHasScroll {
	clientTop: number;
	clientLeft: number;
	scrollTop: number;
	scrollLeft: number;
}

export interface RangeType {
	startContainer: number[];
	startOffset: number;
	endContainer: number[];
	endOffset: number;
}

export interface SnapshotType {
	html: string;
	range: RangeType;
}

export interface ImageEditorOptions {
	min_width: number;
	min_height: number;
	/**
	 * Close editor after save image
	 */
	closeAfterSave: boolean;

	/**
	 * Default dialog width by screen
	 */
	width: string | number;

	/**
	 * Default dialog height by screen
	 */
	height: string | number;

	/**
	 * Show tab cropping
	 */
	crop: boolean;

	/**
	 * Show tab resizing
	 */
	resize: boolean;

	/**
	 * Keep aspect ratio on resize
	 */
	resizeUseRatio: boolean;

	/**
	 * Minimal width on resize
	 */
	resizeMinWidth: number;

	/**
	 * Minimal height on resize
	 */
	resizeMinHeight: number;

	/**
	 * Keep aspect ratio on crop
	 */
	cropUseRatio: boolean;

	/**
	 * In the tab, crop the image is displayed not in real size
	 */
	cropDefaultWidth: string | number;
	cropDefaultHeight: string | number;
}

export type InsertMode =
	| 'insert_as_html'
	| 'insert_as_text'
	| 'insert_clear_html'
	| 'insert_only_text';

export type ImageAction = 'resize' | 'crop';
export type ImageHAlign = 'normal' | 'left' | 'right' | 'center' | '';

export interface ImageBox {
	w: number;
	h: number;
	x?: number;
	y?: number;
}

export interface ImageEditorActionBox {
	action: ImageAction;
	box: ImageBox;
}

export interface EventHandlerBlock {
	event: string;
	originalCallback: CallbackFunction;
	syntheticCallback: CallbackFunction;
}

declare global {
	interface HTMLElementTagNameMap {
		jodit: HTMLDivElement;
		svg: HTMLElement;
		path: HTMLElement;
		font: HTMLElement;
		'jodit-media': HTMLElement;
	}
}

export type HTMLTagNames = keyof HTMLElementTagNameMap;

export type Modes = 1 | 2 | 3;

declare global {
	interface MouseEvent {
		buffer?: IDictionary;
	}
}

export interface FuzzySearch {
	(needle: string, haystack: string, offset?: number, maxDistance?: number): [
		number,
		number
	];
}
