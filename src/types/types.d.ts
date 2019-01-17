/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewBased } from './view';

export interface IDictionary<T = any> {
    [key: string]: T;
}

interface IComponent<T extends IViewBased = IViewBased> {
    jodit: T;
    isDestructed: boolean;
    destruct(): any;
}

export type NodeCondition = (node: Node | null) => boolean | null | void | '';

/**
 * Bound interface
 */
export interface IBound {
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface IPoint {
    x: number;
    y: number;
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

export interface IStorage {
    set(key: string, value: string | number): void;
    get(key: string): string | null;
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

export interface IPlugin {
    jodit: IViewBased;
    destruct(): void;
    afterInit(jodit?: IViewBased): void;
    beforeDestruct(jodit?: IViewBased): void;
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

export interface ActionBox {
    action: string;
    box: {
        w: number;
        h: number;
        x?: number;
        y?: number;
    };
}

export interface EventHandlerBlock {
    event: string;
    originalCallback: CallbackFunction;
    syntheticCallback: CallbackFunction;
}

export type HTMLTagNames = keyof HTMLElementTagNameMap;

export type Modes = 1 | 2 | 3;

export type TagNames = keyof HTMLElementTagNameMap;
