/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

export interface Dictionary<T = any> {[key: string]: T;}

export interface Bound {top: number; left: number;  width: number; height: number;}

export interface Point {x: number; y: number;}

export interface SelectionRange {
    startContainer: Node|null;
    startOffset: number|null;
    endContainer: Node|null;
    endOffset: number|null;
}

export interface RGB {r: number; g: number; b: number;}

export interface Permissions {
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

export interface CommandType {
    exec: Function;
    hotkeys?: string | string[];
}

export interface  IHasScroll {
    clientTop: number;
    clientLeft: number;
    scrollTop: number;
    scrollLeft: number;
}
