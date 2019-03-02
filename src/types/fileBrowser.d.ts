/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Buttons } from './toolbar';
import { IDictionary, IPermissions } from './types';
import { IUploader, IUploaderOptions } from './uploader';
import { IViewOptions, IViewWithToolbar } from './view';
import { Dialog } from '../modules/dialog';
import { Storage } from '../modules';

/**
 * The module creates a web browser dialog box. In a Web browser ,you can select an image, remove, drag it. Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */

export interface ISourceFile {
    file?: string;
    fileIsAbsolute?: boolean;
    name?: string;
    thumb: string;
    thumbIsAbsolute?: boolean;
    changed: string | number;
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

export interface IFileBrowserOptions extends IViewOptions {
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
    fileMove: IFileBrowserAjaxOptions | null;
    folderMove: IFileBrowserAjaxOptions | null;
    fileRemove: IFileBrowserAjaxOptions | null;
    folderRemove: IFileBrowserAjaxOptions | null;
    items: IFileBrowserAjaxOptions;
    folder: IFileBrowserAjaxOptions | null;
    permissions: IFileBrowserAjaxOptions | null;

    uploader: null | IUploaderOptions<IUploader>; // use default Uploader's settings
    [key: string]: any;
}

export interface IFileBrowserCallBackData {
    baseurl: string;
    files: string[];
}

interface IFileBrowser extends IViewWithToolbar<IFileBrowserOptions> {
    uploader: IUploader;
    storage: Storage;
    dialog: Dialog;
    currentPath: string;
    currentSource: string;
    currentBaseUrl: string;

    isOpened(): boolean;

    getPathByUrl(
        url: string,
        success: (path: string, name: string, source: string) => void,
        onFailed: (error: Error) => void
    ): Promise<any>;

    createFolder(name: string, path: string, source: string): Promise<void>;

    move(filepath: string, path: string, source: string, isFile: boolean): Promise<void>;

    fileRemove(path: string, file: string, source: string): Promise<void>;

    folderRemove(path: string, file: string, source: string): Promise<void>;

    close: () => void;

    openImageEditor(
        href: string,
        name: string,
        path: string,
        source: string,
        onSuccess?: () => void,
        onFailed?: (error: Error) => void
    ): Promise<Dialog>;

    getActiveElements(): HTMLElement[];
    canI(action: string): boolean;

    open(
        callback: (data: IFileBrowserCallBackData) => void,
        onlyImages: boolean
    ): Promise<void>;
}
