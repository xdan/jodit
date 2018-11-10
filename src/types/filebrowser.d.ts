/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from "../Jodit";
import { Permissions } from "./types";
import { Buttons } from "./toolbar";
import { UploaderOptions } from "./uploader";

/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */

export interface ISourceFile {
    file: string
    thumb: string
    changed: string
    size: string
    isImage: boolean
}

export interface ISource {
    path: string
    baseurl: string
    files: ISourceFile[]
    folders: string[]
}

export interface ISourcesFiles {
    [key: string]: ISource;
}

export type FileBrowserAnswer = {
    success: boolean,
    time: string,
    data: {
        messages?: string[];
        sources: ISourcesFiles;
        code: number;
        path: string;
        name: string;
        source: string;
        permissions?: Permissions | null;
    }
};

export type FileBrowserAjaxOptions = {
    url?: string;
    async?: boolean;

    data: { [key: string]: string };
    cache?: boolean;
    contentType?: string;

    method?: string;
    processData?: boolean;
    dataType?: string;

    headers?: { [key: string]: string };

    prepareData?: (data: { [key: string]: string }) => { [key: string]: string };

    process?: (resp: FileBrowserAnswer) => FileBrowserAnswer;
}

export interface FileBrowserOptions  {
    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean,
    showTooltip?: boolean,
    useNativeTooltip?: boolean,
    filter: (item: any, search: any) => boolean;

    sortBy: string;

    sort: (a: any, b: any, sortBy?: string, editor?: Jodit) => number;

    editImage: boolean;
    preview: boolean;
    showPreviewNavigation: boolean;
    showSelectButtonInPreview: boolean;
    contextMenu: boolean;

    howLongShowMsg: number;

    createNewFolder: boolean;
    deleteFolder: boolean;
    moveFolder: boolean;
    moveFile: boolean;
    showFoldersPanel: boolean;

    width: number;
    height: number;


    view: string | null;

    isSuccess: (resp: FileBrowserAnswer) => boolean;
    getMessage: (resp: FileBrowserAnswer) => string;
    showFileName: boolean;
    showFileSize: boolean;
    showFileChangeTime: boolean;

    getThumbTemplate: (item: ISourceFile, source: ISource, source_name: string) => string;

    ajax: FileBrowserAjaxOptions;
    create: FileBrowserAjaxOptions;
    getLocalFileByUrl: FileBrowserAjaxOptions;
    resize: FileBrowserAjaxOptions;
    crop: FileBrowserAjaxOptions;
    move: FileBrowserAjaxOptions;
    fileRemove: FileBrowserAjaxOptions;
    folderRemove: FileBrowserAjaxOptions;
    items: FileBrowserAjaxOptions;
    folder: FileBrowserAjaxOptions;
    permissions: FileBrowserAjaxOptions;

    uploader: null | UploaderOptions // use default Uploader's settings
    [key: string]: any
}

export type FileBrowserCallBackData = {
    baseurl: string,
    files: string[]
};