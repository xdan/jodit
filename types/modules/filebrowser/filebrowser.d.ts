/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Storage } from "../Storage";
import { IViewBased } from "../view/type";
import { Dialog } from "../Dialog";
import { Uploader } from "../Uploader";
import { View } from "../view/view";
import { FileBrowserCallBackData, FileBrowserOptions } from "./type";
export declare class FileBrowser extends View {
    options: FileBrowserOptions;
    currentPath: string;
    currentSource: string;
    currentBaseUrl: string;
    private dialog;
    /**
     * Container for set/get value
     * @type {Storage}
     */
    storage: Storage;
    private loader;
    private browser;
    private status_line;
    private tree;
    private files;
    uploader: Uploader;
    private __currentPermissions;
    canI(action: string): boolean;
    private view;
    private sortBy;
    constructor(editor?: IViewBased, options?: {});
    private dragger;
    /**
     *
     * @return {boolean}
     */
    isOpened(): boolean;
    private statustimer;
    /**
     * It displays a message in the status bar of filebrowser
     *
     * @method status
     * @param {string} message Message
     * @param {boolean} [success] true It will be shown a message light . If no option is specified , an error will be shown the red
     * @example
     * ```javascript
     * parent.filebrowser.status('There was an error uploading file', false);
     * ```
     */
    status(message: string, success?: boolean): void;
    private generateFolderTree;
    private filterWord;
    private generateItemsBox;
    getActiveElements(): HTMLElement[];
    private someSelectedWasChanged;
    /**
     *
     * @param {string} name
     * @param {Function} success
     * @param {Function} error
     * @return {Promise}
     */
    private send;
    /**
     * Get path by url. You can use this method in another modules
     *
     * @method getPathByUrl
     * @param {string} url Full url
     * @param {function} success
     * @param {string} success.path path toWYSIWYG file from connector's root (without filename)
     * @param {string} success.name filename
     * @param {function} onFailed filename
     * @param {string} onFailed.message
     */
    getPathByUrl: (url: string, success: (path: string, name: string, source: string) => void, onFailed: (error: Error) => void) => void;
    private loadItems;
    private loadPermissions;
    private loadTree;
    /**
     * Create a directory on the server
     *
     * @method create
     * @param {string} name Name the new folder
     * @param {string} path Relative toWYSIWYG the directory in which you want toWYSIWYG create a folder
     * @param {string} source Server source key
     */
    create: (name: string, path: string, source: string) => Promise<void>;
    /**
     * Move a file / directory on the server
     *
     * @method move
     * @param {string} filepath The relative path toWYSIWYG the file / folder source
     * @param {string} path Relative toWYSIWYG the directory where you want toWYSIWYG move the file / folder
     * @param {string} source Source
     */
    move: (filepath: string, path: string, source: string) => Promise<void>;
    /**
     * Deleting a file
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    fileRemove(path: string, file: string, source: string): Promise<void>;
    /**
     * Deleting a folder
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    folderRemove(path: string, file: string, source: string): Promise<void>;
    /**
     * Close dialog
     * @method close
     */
    close: () => void;
    private onSelect;
    private onlyImages;
    /**
     * It opens a web browser window
     *
     * @param {Function} callback The function that will be called after the file selection in the browser
     * @param {boolean} [onlyImages=false] Show only images
     * @example
     * ```javascript
     * var fb = new Jodit.modules.FileBrowser(parent);
     * fb.open(function (data) {
     *     var i;
     *     for (i = 0;i < data.files.length; i += 1) {
     *         parent.selection.insertImage(data.baseurl + data.files[i]);
     *     }
     * });
     * ```
     * @return Promise
     */
    open: (callback: (data: FileBrowserCallBackData) => void, onlyImages?: boolean) => Promise<void>;
    private errorHandler;
    private uploadHandler;
    /**
     * Open Image Editor
     *
     * @method openImageEditor
     */
    openImageEditor: (href: string, name: string, path: string, source: string, onSuccess?: Function | undefined, onFailed?: ((error: Error) => void) | undefined) => Promise<Dialog>;
    /**
     * Return default timeout period in milliseconds for some debounce or throttle functions. By default return {observer.timeout} options
     *
     * @return {number}
     */
    readonly defaultTimeout: number;
}
