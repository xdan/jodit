/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

export interface Dictionary<T = any> {[key: string]: T}

export type Bound = {top: number, left: number,  width: number, height: number};

export type Point = {x: number, y: number};

export type SelectionRange = {
    startContainer: Node|null,
    startOffset: number|null,
    endContainer: Node|null,
    endOffset: number|null,
};

export type RGB = {r: number, g: number, b: number};

export type Permissions = {
    allowFiles: boolean,
    allowFileMove: boolean,
    allowFileUpload: boolean,
    allowFileUploadRemote: boolean,
    allowFileRemove: boolean,
    allowFileRename: boolean,
    allowFolders: boolean,
    allowFolderCreate: boolean,
    allowFolderMove: boolean,
    allowFolderRemove: boolean,
    allowFolderRename: boolean,
    allowImageResize: boolean,
    allowImageCrop: boolean,
    [key: string]: boolean;
};

export type CommandType = {
    exec: Function,
    hotkeys?: string | string[]
}

export interface  IHasScroll {
    clientTop: number;
    clientLeft: number;
    scrollTop: number;
    scrollLeft: number;
}