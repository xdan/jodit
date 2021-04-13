/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased } from './view';

export interface IDictionary<T = any> {
	[key: string]: T;
}

export type CanPromise<T> = T | Promise<T>;
export type CanUndef<T> = T | undefined;
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
	ownerDocument: Document;
	od: this['ownerDocument'];
	ownerWindow: Window;
	ow: this['ownerWindow'];

	get<T>(chain: string, obj?: IDictionary): Nullable<T>;

	componentName: string;
	getFullElName(elementName: string): string;
	getFullElName(elementName: string, mod: string): string;
	getFullElName(
		elementName: string,
		mod?: string,
		modValue?: boolean | string
	): string;

	uid: string;
	isDestructed: boolean;
	isInDestruct: boolean;
	isReady: boolean;

	componentStatus: ComponentStatus;
	setStatus(componentStatus: ComponentStatus): void;

	hookStatus(
		status: ComponentStatus,
		callback: (component: this) => void
	): void;

	bindDestruct(jodit: T): this;
}

interface IViewComponent<T extends IViewBased = IViewBased> extends IComponent {
	jodit: T;
	j: this['jodit'];
	setParentView(jodit: T): this;
	i18n: T['i18n'];
	defaultTimeout: number;
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
	startContainer: Node | null;
	startOffset: number | null;
	endContainer: Node | null;
	endOffset: number | null;
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

export type ExecCommandCallback<T> =
	| ((
			this: T,
			command: string,
			value?: string,
			next?: boolean
	  ) => void | boolean | Promise<void | boolean>)
	| ((
			this: T,
			command: string,
			value: string,
			next: string
	  ) => void | boolean | Promise<void | boolean>);

export interface ICommandType<T> {
	exec: ExecCommandCallback<T>;
	hotkeys?: string | string[];
}

export type CustomCommand<T> = ICommandType<T> | ExecCommandCallback<T>;

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

export interface markerInfo {
	startId: string;
	endId?: string;
	collapsed: boolean;
	startMarker: string;
	endMarker?: string;
}

/**
 * @property {ImageEditorOptions} imageeditor module's options
 */

export interface ImageEditorOptions {
	min_width: number;
	min_height: number;
	closeAfterSave: boolean;
	width: string | number;
	height: string | number;
	crop: boolean;
	resize: boolean;
	resizeUseRatio: boolean;
	resizeMinWidth: number;
	resizeMinHeight: number;
	cropUseRatio: boolean;
	cropDefaultWidth: string | number;
	cropDefaultHeight: string | number;
}

export type ImageAction = 'resize' | 'crop';

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
