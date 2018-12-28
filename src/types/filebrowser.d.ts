/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Buttons } from './toolbar';
import { IDictionary, IPermissions } from './types';
import { IUploaderOptions } from './uploader';
import { Uploader } from '../modules';
import { IViewOptions } from './view';

/**
 * The module creates a web browser dialog box. In a Web browser ,you can select an image, remove, drag it. Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */

export interface ISourceFile {
    file: string;
    name?: string;
    thumb: string;
    changed: string;
    size: string;
    isImage: boolean;
}

export interface ISource {
    path: string;
    baseurl: string;
    files: ISourceFile[];
    folders: string[];
}

export interface ISourcesFiles {
    [key: string]: ISource;
}

export interface IFileBrowserAnswer {
    success: boolean;
    time: string;
    data: {
        messages?: string[];
        sources: ISourcesFiles;
        code: number;
        path: string;
        name: string;
        source: string;
        permissions?: IPermissions | null;
    };
}

export interface IFileBrowserAjaxOptions {
    url?: string;
    async?: boolean;

    data: IDictionary<string>;
    cache?: boolean;
    contentType?: string;

    method?: string;
    processData?: boolean;
    dataType?: string;

    headers?: IDictionary<string>;

    prepareData?: (data: IDictionary<string>) => IDictionary<string>;

    process?: (resp: IFileBrowserAnswer) => IFileBrowserAnswer;
}

export interface IFileBrowserOptions extends IViewOptions{
    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean;
    showTooltip?: boolean;
    useNativeTooltip?: boolean;
    filter: (item: any, search: any) => boolean;

    sortBy: string;

    sort: (a: any, b: any, sortBy?: string) => number;

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

    isSuccess: (resp: IFileBrowserAnswer) => boolean;
    getMessage: (resp: IFileBrowserAnswer) => string;
    showFileName: boolean;
    showFileSize: boolean;
    showFileChangeTime: boolean;

    getThumbTemplate: (
        item: ISourceFile,
        source: ISource,
        source_name: string
    ) => string;

    ajax: IFileBrowserAjaxOptions;
    create: IFileBrowserAjaxOptions | null;
    getLocalFileByUrl: IFileBrowserAjaxOptions | null;
    resize: IFileBrowserAjaxOptions | null;
    crop: IFileBrowserAjaxOptions | null;
    move: IFileBrowserAjaxOptions | null;
    fileRemove: IFileBrowserAjaxOptions | null;
    folderRemove: IFileBrowserAjaxOptions | null;
    items: IFileBrowserAjaxOptions;
    folder: IFileBrowserAjaxOptions | null;
    permissions: IFileBrowserAjaxOptions | null;

    uploader: null | IUploaderOptions<Uploader>; // use default Uploader's settings
    [key: string]: any;
}

export interface IFileBrowserCallBackData {
    baseurl: string;
    files: string[];
}
