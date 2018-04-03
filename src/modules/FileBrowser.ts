/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Component, IViewBased} from './Component';
import {Dialog, Alert, Confirm, Promt} from './Dialog';
import {Config, OptionsDefault} from '../Config';
import {
    $$, ctrlKey, debounce, dom, each, extend, humanSizeToBytes,
    pathNormalize, urlNormalize
} from "./Helpers";
import {ControlType, ToolbarCollection, ToolbarIcon} from "./ToolbarCollection";
import {ContextMenu} from "./ContextMenu";
import {Uploader, UploaderOptions} from "./Uploader";
import {Ajax} from "./Ajax";
import * as consts from "../constants";
import {ImageEditor, ActionBox} from "./ImageEditor";
import {EventsNative} from "./EventsNative";
import {localStorageProvider, Storage} from "./Storage";


/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */

interface ISourceFile {
    file: string
    thumb: string
    changed: string
    size: string
    isImage: boolean
}

interface ISource {
    path: string
    baseurl: string
    files: ISourceFile[]
    folders: string[]
}


interface ISourcesFiles {
    [key:string] : ISource;
}

type FileBrowserAnswer = {
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

type FileBrowserAjaxOptions = {
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

type FileBrowserOptions = {
    buttons: Array<string | ControlType>;

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

    getThumbTemplate: (this: FileBrowser, item: ISourceFile, source: ISource, source_name: string) => string;

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

declare module "../Config" {
    interface Config {
        /**
         * Filebrowser module settings
         *
         * @property{int} filebrowser.howLongShowMsg=3000 How long toWYSIWYG show an error message in the status bar (ms)
         * @property{boolean} filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;} Items sort functions
         * @property{boolean} filebrowser.sortBy='changed' Sort by field
         * @property{boolean} filebrowser.filter=function (item, searchWord) { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
         * @property{boolean} filebrowser.showFileName=true Show filename in thumbs
         * @property{boolean} filebrowser.showFileSize=true Show filesize in thumbs
         * @property{boolean} filebrowser.showFileChangeTime=true Show the last modification time in thumbs

         * @property {boolean} filebrowser.editImage=true use {@link ImageEditor|Image editor module} - crop and resize image
         * @property {boolean} filebrowser.preview=true Show preview button in context menu
         * @property {boolean} filebrowser.showPreviewNavigation=true Show navigation buttons in preview
         * @property {boolean} filebrowser.showSelectButtonInPreview=true Show select button in preview
         * @property {boolean} filebrowser.contextMenu=true use context menu
         * @property {boolean} filebrowser.createNewFolder=true The ability toWYSIWYG create a directory of the web browser
         * @property {boolean} filebrowser.deleteFolder=true The ability toWYSIWYG delete directories from the web browser
         * @property {boolean} filebrowser.moveFolder=true The ability toWYSIWYG move directories from the web browser
         * @property {boolean} filebrowser.moveFile=true The ability toWYSIWYG move file from the web browser
         * @property {boolean} filebrowser.showFoldersPanel=true Show folders panel
         * @property {int|string} filebrowser.width=763px The width of the web browser
         * @property {int|string} filebrowser.height=400px The height of the file browser
         * @property {Array<string>} filebrowser.buttons="[
         *   'filebrowser.upload',
         *   'filebrowser.remove',
         *   'filebrowser.update',
         *   'filebrowser.select',
         *   'filebrowser.edit',
         *   '|',
         *   'filebrowser.tiles',
         *   'filebrowser.list',
         *   '|',
         *   'filebrowser.filter',
         *   '|',
         *   'filebrowser.sort',
         *]" Toolbar browser
         * @example
         * ```javascript
         * var editor = new Jodit('#editor', {
         *     filebrowser: {
         *         buttons: ['filebrowser.upload', 'filebrowser.remove', 'filebrowser.update',
         *         {
         *             name: 'deleteall',
         *             icon: 'remove',
         *             exec: function (editor) {
         *                 $files.find('a').each(function () {
         *                     editor.filebrowserюremove(editor.filebrowser.currentPath, $(this).data('name'));
         *                 });
         *                 editor.filebrowser.loadTree();
         *             },
         *        }],
         *    }
         * })
         * ```
         * @property{function} filebrowser.isSuccess method toWYSIWYG check - whether the response positive
         * @property{function} filebrowser.getMessage method for receiving a message from the response
         * @example
         * ```javascript
         * new Jodit('#editor', {
         *     filebrowser: {
         *          isSuccess: function (resp) {
         *              return resp.status == 1;
         *          },
         *          getMessage: function (resp) {
         *              return resp.message;
         *          },
         *     }
         * })
         * ```
         * @property{string} filebrowser.view='tiles' Filelist view - `tiles` or `list`
         * @property{object} filebrowser.ajax The default settings for AJAX connections toWYSIWYG the server. Most of the settings like here {@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax} but is not jQuery.ajax
         * @property{function(data)} filebrowser.ajax.prepareData Method of preparation of data toWYSIWYG be sent toWYSIWYG the server
         * @property{function(data)} filebrowser.ajax.process The method of processing the data obtained after administration of the server. Must return this PlainObject format
         * ```json
         *  {
         *     files: resp.files || [], // {array} The names of files or folders, files can be ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'}, {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
         *     path: resp.path, // {string} Real relative path
         *     baseurl: resp.baseurl, // {string} Base url for filebrowser
         *     error: resp.error, // {int}
         *     msg: resp.msg // {string}
         * };
         * ```
         * @property {string} filebrowser.ajax.url='' Address entry point on the server for AJAX connection
         * @property {object} filebrowser.ajax.data={} Default data toWYSIWYG send toWYSIWYG the server
         * @property {(json|text)} filebrowser.ajax.dataType='json' The format of the returned data
         * @property {object} filebrowser.ajax.headers={} An object of additional header key/value pairs toWYSIWYG send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest` is always added, but its default `XMLHttpRequest` value can be changed here.
         * @property {object} filebrowser.resize Settings for AJAX connections toWYSIWYG the server toWYSIWYG resize image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
         * @property {object} filebrowser.crop Settings for AJAX connections toWYSIWYG the server toWYSIWYG crop image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
         * @property {object} filebrowser.create Settings for AJAX connections toWYSIWYG the server toWYSIWYG create the category . By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
         * @property {object} filebrowser.move Settings for AJAX connections toWYSIWYG the server for the moving image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=move
         * @property {object} filebrowser.remove Settings for AJAX connections toWYSIWYG the server toWYSIWYG delete the image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=remove
         * @property {object} filebrowser.folder Settings for AJAX connections toWYSIWYG the server toWYSIWYG download the list of categories . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=folder
         * @property {object} filebrowser.items Settings for AJAX connections toWYSIWYG the server toWYSIWYG download the image list in the specified category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=items
         * @property {object} filebrowser.uploader=null Settings Module {@link module:Uploader|Uploader} for fast uploading images in category via Drag&Drop file in the file browser. The default settings of the module {@link module:Uploader|Uploader}
         * @example
         * ```javascript
         * // default values
         * {
         *     isSuccess: function (resp) {
         *         return !resp.error;
         *     },
         *     getMessage: function (resp) {
         *         return resp.msg;
         *     },
         *     ajax: {
         *         url: '',
         *         async: true,
         *         data: {},
         *         contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
         *         headers : {},
         *         method : 'POST',
         *         processData  : true,
         *         dataType: 'json',
         *         headers: {},
         *         prepareData: function (data) {
         *             return data;
         *         },
         *         process: function (resp) {
         *             return {
         *                 files: resp.files || [],
         *                 path: resp.path,
         *                 baseurl: resp.baseurl,
         *                 error: resp.error,
         *                 msg: resp.msg
         *             };
         *         }
         *     },
         *     resize: {
         *         data: {action: 'imageResize'},
         *     },
         *     crop: {
         *         data: {action: 'imageCrop'},
         *     },
         *     create: {
         *         data: {action: 'folderCreate'},
         *     },
         *     move: {
         *         data: {action: 'fileMove'},
         *     },
         *     remove: {
         *         data: {action: 'fileRemove'},
         *     },
         *     items: {
         *         data: {action: 'files'},
         *     },
         *     folders: {
         *         data: {action: 'folders'},
         *     },
         *     uploader: null // use default Uploader's settings
         * }
         * ```
         * @example
         * ```javascript
         * new Jodit('#editor2', {
             *         filebrowser: {
         *             isSuccess: function (resp) {
         *                 return resp.length !== 0;
         *             },
         *             getMessage: function (resp) {
         *                 return resp;
         *             },
         *             ajax: {
         *                 url: 'ajax.php',
         *                 method: 'GET',
         *                 dataType: 'text',
         *                 headers: {
         *                     'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
         *                 },
         *                 data: {
         *                     someparameter: 1
         *                 },
         *                 prepareData: function (data) {
         *                     data.someparameter++;
         *                     return data;
         *                 },
         *                 process: function (resp) {
         *                     return resp.split('|'); // return items list
         *                 },
         *             }
         *         }
         *     })
         * ```
         * @example
         * ```javascript
         * var editor = new Jodit('#jodit', {
         *        uploader: {
         *            url: 'connector/upload.php',
         *            baseurl: 'images/'
         *        },
         *        filebrowser: {
         *            create: {
         *                url: 'connector/create.php',
         *            },
         *            move: {
         *                url: 'connector/move.php',
         *            },
         *            remove: {
         *                url: 'connector/remove.php',
         *            },
         *            items: {
         *                url: 'connector/items.php',
         *            },
         *            folder: {
         *                url: 'connector/tree.php',
         *            }
         *        }
         *    });
         * ```
         * */
        filebrowser: FileBrowserOptions
    }
}

Config.prototype.filebrowser = <FileBrowserOptions>{
    filter: function (item, search) {
        search = search.toLowerCase();
        if (typeof item === 'string') {
            return item.toLowerCase().indexOf(search) !== -1;
        }
        if (typeof item.name === 'string') {
            return item.name.toLowerCase().indexOf(search) !== -1;
        }
        if (typeof item.file === 'string') {
            return item.file.toLowerCase().indexOf(search) !== -1;
        }
        return true;
    },

    sortBy: 'changed',

    sort: function (this: FileBrowser, a: any, b: any, sortBy: string): number {
        let compareStr = (f: string, s: string): number => {
                if (f < s) {
                    return -1;
                }

                if (f > s) {
                    return 1;
                }

                return 0;
            },
            first: Date,
            second: Date;

        if (typeof a === 'string') {
            return compareStr(a.toLowerCase(), b.toLowerCase());
        }

        if (a[sortBy] === undefined || sortBy === 'name') {
            if (typeof a.name === 'string') {
                return compareStr(a.name.toLowerCase(), b.name.toLowerCase());
            }
            if (typeof a.file === 'string') {
                return compareStr(a.file.toLowerCase(), b.file.toLowerCase());
            }
            return 0;
        }

        switch (sortBy) {
            case 'changed':
                first = new Date(a.changed);
                second = new Date(b.changed);

                return second.getTime() - first.getTime();
            case 'size':
                return humanSizeToBytes(a.size) - humanSizeToBytes(b.size);
        }

        return 0;
    },

    editImage: true,
    preview: true,
    showPreviewNavigation: true,
    showSelectButtonInPreview: true,
    contextMenu: true,

    howLongShowMsg: 3000,

    createNewFolder: true,
    deleteFolder: true,
    moveFolder: true,
    moveFile: true,
    showFoldersPanel: true,

    width: 763,
    height: 400,
    buttons: [
        'filebrowser.upload',
        'filebrowser.remove',
        'filebrowser.update',
        'filebrowser.select',
        'filebrowser.edit',
        '|',
        'filebrowser.tiles',
        'filebrowser.list',
        '|',
        'filebrowser.filter',
        '|',
        'filebrowser.sort',
    ],

    view: null,

    isSuccess: function (this: FileBrowser, resp: FileBrowserAnswer): boolean {
        return resp.success;
    },

    getMessage: function (this: FileBrowser, resp: FileBrowserAnswer) {
        return (resp.data.messages!== undefined && Array.isArray(resp.data.messages)) ? resp.data.messages.join(' ') : '';
    },

    showFileName: true,
    showFileSize: true,
    showFileChangeTime: true,

    getThumbTemplate: function (this: FileBrowser, item: ISourceFile, source: ISource, source_name: string): string {
        let name: string = '',
            thumb: string = '',
            info: string,
            timestamp: string = (new Date()).getTime().toString();


        if (item.file !== undefined) {
            name = item.file;
            thumb = item.file;
        }
        if (item.thumb) {
            thumb = item.thumb;
        }


        info = `<div class="${ITEM_CLASS}-info">
            ${this.options.showFileName ? `<span class="${ITEM_CLASS}-info-filename">${name}</span>` : ''}
            ${(this.options.showFileSize && item.size) ? `<span class="${ITEM_CLASS}-info-filesize">${item.size}</span>` : ''}
            ${(this.options.showFileChangeTime && item.changed) ? `<span class="${ITEM_CLASS}-info-filechanged">${item.changed}</span>` : ''}
        </div>`;

        let imageURL: string = urlNormalize(source.baseurl + source.path + name);

        return `<a data-is-file="${item.isImage ? 0 : 1}" draggable="true" class="${ITEM_CLASS}" href="${imageURL}" data-source="${source_name}" data-path="${pathNormalize(source.path ? source.path + '/' : '/')}" data-name="${name}" title="${name}" data-url="${imageURL}">
            <img data-is-file="${item.isImage ? 0 : 1}" data-src="${imageURL}" src="${urlNormalize(source.baseurl + source.path + thumb)}?_tmst=${timestamp}" alt="${name}"/>
            ${(this.options.showFileName || (this.options.showFileSize && item.size) || (this.options.showFileChangeTime && item.changed)) ? info : ''}
        </a>`;
    },

    ajax: {
        url: '',
        async: true,

        data: {},
        cache : true,
        contentType : 'application/x-www-form-urlencoded; charset=UTF-8',

        method : 'POST',
        processData  : true,
        dataType: 'json',

        headers: {},

        prepareData: function (this: Uploader, data: any) {
            return data;
        },

        process: function (this: Uploader, resp: FileBrowserAnswer): FileBrowserAnswer {
            return resp;
        }
    },
    create: {
        data: {action: 'folderCreate'},
    },
    getLocalFileByUrl: {
        data: {action: 'getLocalFileByUrl'},
    },
    resize: {
        data: {action: 'imageResize'},
    },
    crop: {
        data: {action: 'imageCrop'},
    },
    move: {
        data: {action: 'fileMove'},
    },
    fileRemove: {
        data: {action: 'fileRemove'},
    },
    folderRemove: {
        data: {action: 'folderRemove'},
    },
    items: {
        data: {action: 'files'},
    },
    folder: {
        data: {action: 'folders'},
    },
    permissions: {
        data: {action: 'permissions'},
    },

    uploader: null // use default Uploader's settings
};

Config.prototype.controls.filebrowser = <{[key: string]: ControlType}> {
    upload: <ControlType>{
        icon: 'plus',
        exec: () => {},
        isDisable: (browser: any): boolean => !browser.canI('FileUpload'),
        getContent: (editor: IViewBased, control: ControlType): HTMLElement => {
            const btn: HTMLElement = dom('<span class="jodit_upload_button">' +
                    ToolbarIcon.getIcon('plus') +
                    '<input type="file" accept="' + (editor.buffer.fileBrowserOnlyImages ? 'image/*' : '*') + '" tabindex="-1" dir="auto" multiple=""/>' +
                '</span>', editor.ownerDocument),
                input: HTMLInputElement = <HTMLInputElement>btn.querySelector('input');

            editor.events
                .on('updateToolbar', () => {
                    if (control && control.isDisable) {
                        control.isDisable(editor, control) ? input.setAttribute('disabled', 'disabled') : input.removeAttribute('disabled');
                    }
                })
                .fire('bindUploader.filebrowser', btn);

            return btn;
        }
    },
    remove: <ControlType>{
        icon: 'bin',
        isDisable: (browser: any): boolean => {
            return (<FileBrowser>browser).getActiveElements().length === 0 || !(<FileBrowser>browser).canI('FileRemove');
        },
        exec: (editor: IViewBased) => {
            editor.events.fire('fileRemove.filebrowser');
        },
    },
    update: <ControlType>{
        exec: (editor: IViewBased) => {
            editor.events.fire('update.filebrowser');
        },
    },
    select: <ControlType>{
        icon: 'check',
        isDisable: (browser: any): boolean => {
            return (<FileBrowser>browser).getActiveElements().length === 0;
        },
        exec: (editor: IViewBased) => {
            editor.events.fire('select.filebrowser');
        },
    },
    edit: <ControlType>{
        icon: 'pencil',
        isDisable: (browser: any): boolean => {
            const selected: HTMLElement[] = (<FileBrowser>browser).getActiveElements();
            return selected.length !== 1 || selected[0].getAttribute('data-is-file') === "1" || !(
                (<FileBrowser>browser).canI('ImageCrop') || (<FileBrowser>browser).canI('ImageResize')
            );
        },
        exec: (editor: Jodit) => {
            editor.events.fire('edit.filebrowser');
        },
    },
    tiles: <ControlType>{
        icon: 'th',
        isActive: (editor: Jodit): boolean => editor.buffer.fileBrowserView === 'tiles',
        exec: (editor: Jodit) => {
            editor.events.fire('view.filebrowser', 'tiles');
        },
    },
    list: <ControlType>{
        icon: 'th-list',
        isActive: (editor: Jodit): boolean => editor.buffer.fileBrowserView === 'list',
        exec: (editor: Jodit) => {
            editor.events.fire('view.filebrowser', 'list');
        },
    },
    filter: <ControlType>{
        isInput: true,
        getContent: (editor: Jodit): HTMLElement => {
            const input: HTMLInputElement = <HTMLInputElement>dom('<input class="jodit_input" placeholder="' + editor.i18n('Filter') + '"/>', editor.ownerDocument);

            editor.events.on(input, 'keydown mousedown', debounce(() => {
                editor.events.fire('filter.filebrowser', input.value);
            }, editor.defaultTimeout));

            return input;
        }
    },
    sort: <ControlType>{
        isInput: true,
        getContent: (editor: Jodit): HTMLElement => {
            const select: HTMLSelectElement = <HTMLSelectElement>dom('<select class="jodit_input">' +
                '<option value="changed">' + editor.i18n('Sort by changed') + '</option>' +
                '<option value="name">' + editor.i18n('Sort by name') + '</option>' +
                '<option value="size">' + editor.i18n('Sort by size') + '</option>' +
            '</select>', editor.ownerDocument);

            editor.events
                .on('sort.filebrowser', (value: string) => {
                    if (select.value !== value) {
                        select.value = value;
                    }
                })
                .on(select, 'change', () => {
                    editor.events.fire('sort.filebrowser', select.value);
                });

            return select
        }
    },
};

const DEFAULT_SOURCE_NAME = 'default';
const ITEM_CLASS = 'jodit_filebrowser_files_item';

export class FileBrowser extends Component implements IViewBased {
    public buffer: {[key: string]: any};

    options: FileBrowserOptions;
    currentPath: string = '';
    currentSource: string = DEFAULT_SOURCE_NAME;
    currentBaseUrl: string = '';

    private dialog: Dialog;

    /**
     * Container for set/get value
     * @type {Storage}
     */
    storage: Storage = new Storage(new localStorageProvider());

    private loader: HTMLElement;
    private browser: HTMLElement;
    private status_line: HTMLElement;
    private tree: HTMLElement;
    private files: HTMLElement;


    public toolbar: ToolbarCollection;

    uploader: Uploader;

    private __currentPermissions: Permissions | null = null;

    public canI(action: string): boolean {
        return this.__currentPermissions !== null && (this.__currentPermissions['allow' + action] === undefined || this.__currentPermissions['allow' + action]);
    }

    i18n(text: string) {
        return this.jodit ? this.jodit.i18n(text) : Jodit.prototype.i18n(text);
    }

    editorDocument: Document = document;
    editorWindow: Window = window;

    ownerDocument: Document;
    ownerWindow: Window;

    progress_bar: HTMLElement;
    editor: HTMLElement;
    events: EventsNative;

    getRealMode(): number {
        return consts.MODE_WYSIWYG;
    }

    private view: string = 'tiles';
    private sortBy: string = 'changed';

    constructor(editor?: IViewBased, options = {}) {
        super(editor);

        const
            self: FileBrowser = this,
            doc: HTMLDocument = editor ? editor.ownerDocument : document,
            editorDoc: HTMLDocument = editor ? editor.editorDocument : doc;

        if (editor) {
            this.id = editor.id;
        }

        this.ownerDocument = doc;
        this.ownerWindow = editor ? editor.ownerWindow : window;

        this.progress_bar = editor ? editor.progress_bar : document.createElement('div');
        this.editor = editor ? editor.editor : document.createElement('div');

        this.events = editor ? editor.events : new EventsNative(doc);
        this.buffer = editor ? editor.buffer : {};

        self.options = <FileBrowserOptions>(new OptionsDefault(extend(true, {}, Jodit.defaultOptions.filebrowser, options, self.jodit ? self.jodit.options.filebrowser : void(0))));

        self.dialog = new Dialog(editor || self, {
            fullsizeButton: true
        });

        self.toolbar  = new ToolbarCollection(self);

        self.loader = dom('<div class="jodit_filebrowser_loader"><i class="jodit_icon-loader"></i></div>', doc);

        self.browser = dom('<div class="jodit_filebrowser non-selected">' +
            (self.options.showFoldersPanel ? '<div class="jodit_filebrowser_tree"></div>' : '') +
            '<div class="jodit_filebrowser_files"></div>' +
            '<div class="jodit_filebrowser_status"></div>' +
         '</div>', doc);

        self.status_line = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_status');

        self.tree = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_tree');
        self.files = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_files');

        self.events
            .on('view.filebrowser', (view: string) => {
                if (view !== self.view) {
                    self.view = view;
                    self.buffer.fileBrowserView = view;
                    self.files.classList.remove('jodit_filebrowser_files_view-tiles');
                    self.files.classList.remove('jodit_filebrowser_files_view-list');
                    self.files.classList.add('jodit_filebrowser_files_view-' + self.view);

                    self.storage.set('jodit_filebrowser_view', self.view);
                }
            })
            .on( 'sort.filebrowser', (value: string) => {
                if (value !== self.sortBy) {
                    self.sortBy = value;
                    this.storage.set('jodit_filebrowser_sortby', self.sortBy);
                    self.loadItems(self.currentPath, self.currentSource);
                }
            })
            .on('filter.filebrowser', (value: string) => {
                if (value !== self.filterWord) {
                    self.filterWord = value;
                    self.loadItems(self.currentPath, self.currentSource);
                }
            })
            .on('fileRemove.filebrowser', () => {
                if (this.getActiveElements().length) {
                    Confirm(self.i18n('Are you shure?'), '', (yes: boolean) => {
                        if (yes) {
                            const promises: Promise<any>[] = [];
                            self.getActiveElements().forEach((a: HTMLElement) => {
                                promises.push(self.fileRemove(self.currentPath, a.getAttribute('data-name') || '', a.getAttribute('data-source') || ''));
                            });

                            Promise.all(promises)
                                .then(() => {
                                    self.someSelectedWasChanged();
                                    self.loadTree(self.currentPath, self.currentSource);
                                });
                        }
                    });
                }
            })
            .on('edit.filebrowser', () => {
                const files: HTMLElement[] = this.getActiveElements();
                if (files.length === 1) {
                    self.openImageEditor(files[0].getAttribute('href') || '', files[0].getAttribute('data-name') || '', files[0].getAttribute('data-path') || '', files[0].getAttribute('data-source') || '');
                }
            })
            .on('update.filebrowser', () => {
                self.loadTree(this.currentPath, this.currentSource);
            })
            .on(self.tree, 'click',  function (this: HTMLElement, e: MouseEvent)  {
                const a: HTMLAnchorElement = <HTMLAnchorElement>this.parentNode,
                    path: string = a.getAttribute('data-path') || '';

                Confirm(self.i18n('Are you shure?'), '', (yes: boolean) => {
                    if (yes) {
                        self
                            .folderRemove(path, a.getAttribute('data-name') || '', a.getAttribute('data-source') || '')
                            .then(() => {
                                self.loadTree(self.currentPath, self.currentSource);
                            })
                    }
                });

                e.stopImmediatePropagation();
                return false;
            }, 'a>i.remove')
            .on(self.tree, 'click',  function (this: HTMLAnchorElement) {
                if (this.classList.contains('addfolder')) {
                    Promt(self.i18n('Enter Directory name'), self.i18n('Create directory'), (name: string) => {
                        self.create(name, this.getAttribute('data-path') || '', this.getAttribute('data-source') || '');
                    }, self.i18n('type name'));
                } else {
                    self.currentPath = this.getAttribute('data-path') || '';
                    self.currentSource = this.getAttribute('data-source') || '';
                    self.loadTree(self.currentPath, self.currentSource);
                }
            }, 'a')
            .on(this.tree, 'dragstart', function (this: HTMLAnchorElement) {
                self.dragger = this;
            }, 'a')
            .on(this.tree, 'drop',   function (this: HTMLAnchorElement) : boolean | void {
                if (self.options.moveFolder && self.dragger) {
                    let path: string = self.dragger.getAttribute('data-path') || '';

                    //move folder
                    if (!self.options.moveFolder && self.dragger.classList.contains('jodit_filebrowser_tree_item')) {
                        return false;
                    }

                    //move file
                    if (self.dragger.classList.contains(ITEM_CLASS)) {
                        path += self.dragger.getAttribute('data-name');
                        if (!self.options.moveFile) {
                            return false;
                        }
                    }

                    self.move(path, this.getAttribute('data-path') || '', this.getAttribute('data-source') || '');
                }
            }, 'a');

        const contextmenu: ContextMenu = new ContextMenu(this.jodit || this);

        self.events
            .on(self.files, 'contextmenu', function (this: HTMLElement, e: DragEvent): boolean | void {
                if (self.options.contextMenu) {
                    let item: HTMLElement = this;

                    contextmenu.show(e.pageX, e.pageY, [
                        (item.getAttribute('data-is-file') !== "1" && self.options.editImage && (self.canI('ImageResize') || self.canI('ImageCrop'))) ? {
                            icon: 'pencil',
                            title: 'Edit',
                            exec: () => {
                                self.openImageEditor(item.getAttribute('href') || '', item.getAttribute('data-name') || '', item.getAttribute('data-path') || '', item.getAttribute('data-source') || '');
                            }
                        } : false,
                        self.canI('FileRemove') ? {
                            icon: 'bin',
                            title: 'Delete',
                            exec: () => {
                                self
                                    .fileRemove(self.currentPath, item.getAttribute('data-name') || '', item.getAttribute('data-source') || '');
                                self.someSelectedWasChanged();
                                self.loadTree(self.currentPath, self.currentSource);
                            }
                        } : false,
                        self.options.preview ? {
                            icon: 'eye',
                            title: 'Preview',
                            exec: () => {
                                let src: string = item.getAttribute('href') || '';
                                const preview: Dialog = new Dialog(self),
                                    temp_content: HTMLElement = dom('<div class="jodit_filebrowser_preview"><i class="jodit_icon-loader"></i></div>', doc),
                                    image: HTMLImageElement = doc.createElement('img'),
                                    addLoadHandler = () => {
                                        const onload = () => {
                                            this.removeEventListener('load', <EventListenerOrEventListenerObject>onload);
                                            temp_content.innerHTML = '';
                                            if (self.options.showPreviewNavigation) {
                                                const next = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-next">' + ToolbarIcon.getIcon('angle-right') + '</a>', doc),
                                                    prev = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-prev">' + ToolbarIcon.getIcon('angle-left') + '</a>', doc);

                                                if (item.previousSibling && (<HTMLElement>item.previousSibling).classList && (<HTMLElement>item.previousSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(prev);
                                                }
                                                if (item.nextSibling && (<HTMLElement>item.nextSibling).classList && (<HTMLElement>item.nextSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(next);
                                                }

                                                self.events.on([next, prev], 'click', function (this: HTMLElement) {
                                                    if (this.classList.contains('jodit_filebrowser_preview_navigation-next')) {
                                                        item = <HTMLElement>item.nextSibling;
                                                    } else {
                                                        item = <HTMLElement>item.previousSibling;
                                                    }
                                                    temp_content.innerHTML = '<i class="jodit_icon-loader"></i>';
                                                    src = item.getAttribute('href') || '';
                                                    image.setAttribute('src', src);
                                                    addLoadHandler();
                                                });
                                            }

                                            temp_content.appendChild(image);
                                            preview.setPosition();
                                        };

                                        image.addEventListener("load", onload);
                                        if (image.complete) {
                                            onload();
                                        }
                                    };

                                addLoadHandler();
                                image.setAttribute('src', src);
                                preview.setContent(temp_content);

                                preview.open();
                            }
                        } : false,
                        {
                            icon: 'upload',
                            title: 'Download',
                            exec: () => {
                                const url : string | null = item.getAttribute('href');

                                if (url) {
                                    self.ownerWindow.open(url);
                                }
                            }
                        }
                    ], self.dialog.getZIndex() + 1);

                    e.stopPropagation();
                    e.preventDefault();

                    return false;
                }
            }, 'a')
            .on(self.files, 'click', (e: MouseEvent) => {
                if (!ctrlKey(e)) {
                    this.getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    });
                    self.someSelectedWasChanged();
                }
            })
            .on(self.files, 'click', function (this: HTMLElement, e: MouseEvent) {
                if (!ctrlKey(e)) {
                    self.getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    })
                }

                this.classList.toggle('active');

                self.someSelectedWasChanged();
                e.stopPropagation();
                return false;
            }, 'a')
            .on(self.dialog.dialogbox, 'drop', (e: DragEvent) => e.preventDefault());

        this.dialog.setSize(this.options.width, this.options.height);

        this.options.getLocalFileByUrl =    extend(true, {}, this.options.ajax, this.options.getLocalFileByUrl);
        this.options.crop =                 extend(true, {}, this.options.ajax, this.options.crop);
        this.options.resize =               extend(true, {}, this.options.ajax, this.options.resize);
        this.options.create =               extend(true, {}, this.options.ajax, this.options.create);
        this.options.move =                 extend(true, {}, this.options.ajax, this.options.move);
        this.options.fileRemove =           extend(true, {}, this.options.ajax, this.options.fileRemove);
        this.options.folderRemove =         extend(true, {}, this.options.ajax, this.options.folderRemove);
        this.options.folder =               extend(true, {}, this.options.ajax, this.options.folder);
        this.options.items =                extend(true, {}, this.options.ajax, this.options.items);
        this.options.permissions =          extend(true, {}, this.options.ajax, this.options.permissions);


        if (this.storage.get('jodit_filebrowser_view') && this.options.view === null) {
            this.view =  this.storage.get('jodit_filebrowser_view') === 'list' ? 'list' : 'tiles';
        } else {
            this.view = this.options.view === 'list' ? 'list' : 'tiles';
        }


        this.files.classList.add('jodit_filebrowser_files_view-' + this.view);
        self.buffer.fileBrowserView = this.view;

        this.sortBy = (['changed', 'name', 'size']).indexOf(this.options.sortBy) !== -1 ? this.options.sortBy : 'changed';

        if ( this.storage.get('jodit_filebrowser_sortby')) {
            this.sortBy = (['changed', 'name', 'size']).indexOf( this.storage.get('jodit_filebrowser_sortby') || '') !== -1 ?  this.storage.get('jodit_filebrowser_sortby') || '' : 'changed';
        }


        this.currentBaseUrl = $$('base', editorDoc).length ? $$('base', editorDoc)[0].getAttribute('href') || '' : location.protocol + '//' + location.host;

        if (Jodit.modules.Uploader !== undefined) {
            const uploaderOptions: UploaderOptions = <UploaderOptions>extend(
                true,
                {},
                Jodit.defaultOptions.uploader,
                self.options.uploader,
                (this.jodit && this.jodit.options && this.jodit.options.uploader !== null) ? {...<UploaderOptions>this.jodit.options.uploader} : {},
            );

            this.uploader = new Uploader(this.jodit || this, uploaderOptions);
            this.uploader.setPath(this.currentPath);
            this.uploader.setSource(this.currentSource);
            this.uploader.bind(this.browser, this.uploadHandler, this.errorHandler);
            this.events.on('bindUploader.filebrowser', (button: HTMLElement) => {
                this.uploader.bind(button, this.uploadHandler, this.errorHandler);
            });
        }
    }



    private dragger: false | HTMLElement = false;


    /**
     *
     * @return {boolean}
     */
    isOpened (): boolean {
        return this.dialog.isOpened() && this.browser.style.display !== 'none';
    }

    private statustimer: number;

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
    status (message: string, success?: boolean) {
        clearTimeout(this.statustimer);
        this.status_line
            .classList.remove('success');

        this.status_line
            .classList.add('active');

        this.status_line.innerHTML = message;

        if (success) {
            this.status_line
                .classList.add('success');
        }

        this.statustimer = window.setTimeout(() => {
            this.status_line
                .classList.remove('active');
        }, this.options.howLongShowMsg);
    }

    private generateFolderTree(sources: ISourcesFiles) {
        const folders: string[] = [];

        each(sources, (source_name : string, source: ISource) => {
            if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
                folders.push('<div class="jodit_filebrowser_source_title">' + source_name + '</div>');
            }

            source.folders.forEach((name: string) => {
                let folder: string = '<a draggable="draggable" class="jodit_filebrowser_tree_item" href="javascript:void(0)" data-path="' + pathNormalize(source.path + name) + '/" data-source="' + source_name + '">' +
                    '<span>' + name + '</span>';

                if (this.options.deleteFolder && name !== '..' && name !== '.') {
                    folder += '<i class="remove" data-path="' + pathNormalize(source.path + name + '/') + '">&times;</i>';
                }

                folder += '</a>';

                folders.push(folder);
            });

            if (this.options.createNewFolder && this.canI('FolderCreate')) {
                folders.push('<a class="jodit_button addfolder" href="javascript:void(0)" data-path="' + pathNormalize(source.path + name) + '/" data-source="' + source_name + '">' + ToolbarIcon.getIcon('plus') + ' ' + this.i18n('Add folder') + '</a>');
            }
        });

        this.tree.innerHTML = folders.join('');
    }

    private filterWord: string = '';

    private generateItemsBox(sources: ISourcesFiles) {
        const files: string[] = [];

        each(sources, (source_name: string, source: ISource) => {
            if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
                files.push(`<div class="jodit_filebrowser_source_title">${source_name + (source.path ? ' - ' + source.path : '')}</div>`);
            }

            if (source.files && source.files.length) {
                if (typeof this.options.sort === 'function') {
                    source.files.sort((a, b) => {
                        return this.options.sort(a, b, this.sortBy, this.jodit);
                    });
                }

                source.files.forEach((item: ISourceFile) => {
                    if (this.options.filter === undefined ||this.options.filter(item, this.filterWord)) {
                        if (!this.onlyImages || item.isImage === undefined || item.isImage) {
                            files.push(this.options.getThumbTemplate.call(this, item, source, source_name));
                        }
                    }
                });
            } else {
                files.push(`<div>${this.i18n('There are no files')}</div>`);
            }
        });

        this.files.innerHTML = files.join('');
    }


    getActiveElements(): HTMLElement[] {
        return $$(':scope>a.active', this.files)
    }

    private someSelectedWasChanged() {
        this.events.fire('changeSelection');
    }

    /**
     *
     * @param {string} name
     * @param {Function} success
     * @param {Function} error
     * @return {Promise}
     */
    private send(name: string, success: (resp: FileBrowserAnswer) => void, error: (error: Error) => void): Promise<void> {
        const opts: FileBrowserAjaxOptions = extend(
            true,
            {},
            this.options.ajax,
            this.options[name] !== undefined ? this.options[name] : this.options.ajax
        );

        if (opts.prepareData) {
            opts.data = opts.prepareData.call(this, opts.data);
        }

        const ajax: Ajax = new Ajax(this.jodit || this, opts);

        return ajax.send()
                .then(success)
                .catch(error);

    }

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
    getPathByUrl = (url: string, success: (path: string, name: string, source: string) => void, onFailed: (error: Error) => void) => {
        const action: string = 'getLocalFileByUrl',
            self: FileBrowser = this;

        this.options[action].data.url = url;
        this.send(action, (resp: FileBrowserAnswer) => {
            if (self.options.isSuccess(resp)) {
                success(resp.data.path, resp.data.name, resp.data.source);
            } else {
                onFailed(new Error(this.options.getMessage(resp)));
            }
        }, (resp: Error)  => {
            onFailed(resp);
        });
    };

    private loadItems = (path: string, source: string): Promise<void> => {
        const self: FileBrowser = this;

        self.options.items.data.path = path;
        self.options.items.data.source = source;

        self.files.classList.add('active');
        self.files.appendChild(self.loader.cloneNode(true));

        return self.send('items', (resp) => {
            let process: ((resp: FileBrowserAnswer) => FileBrowserAnswer)|undefined = self.options.items.process;
            if (!process) {
                process = this.options.ajax.process;
            }

            if (process) {
                let respData: FileBrowserAnswer = <FileBrowserAnswer>process.call(self, resp);
                self.generateItemsBox(respData.data.sources);
                self.someSelectedWasChanged();
            }
        }, (error: Error) => {
            Alert(error.message);
            self.errorHandler(error);
        });
    };

    private loadPermissions(path: string, source: string): Promise<void> {
        const self: FileBrowser = this;

        self.options.permissions.data.path = path;
        self.options.permissions.data.source = source;

        if (self.options.permissions.url) {
            return self
                .send('permissions', (resp: FileBrowserAnswer) => {
                    let process: ((resp: FileBrowserAnswer) => FileBrowserAnswer)|undefined = self.options.permissions.process;
                    if (!process) {
                        process = this.options.ajax.process;
                    }

                    if (process) {
                        const respData: FileBrowserAnswer = <FileBrowserAnswer>process.call(self, resp);
                        if (respData.data.permissions) {
                            this.__currentPermissions = respData.data.permissions;
                        }
                    }
                }, (error: Error) => {
                    Alert(error.message);
                    self.errorHandler(error);
                });
        } else {
            return Promise.resolve();
        }
    }
    private loadTree(path: string, source: string): Promise<any> {
        return this.loadPermissions(path, source)
            .then(() => {
                const self: FileBrowser = this;

                self.options.folder.data.path = path;
                self.options.folder.data.source = source;

                if (self.uploader) {
                    self.uploader.setPath(path);
                    self.uploader.setSource(source);
                }

                let tree: Promise<void>[] = [];

                if (self.options.showFoldersPanel) {
                    if (self.options.folder.url) {
                        self.tree.classList.add('active');
                        self.tree.innerHTML = '';
                        self.tree.appendChild(self.loader.cloneNode(true));

                        tree.push(this.send('folder', (resp) => {
                            let process: ((resp: FileBrowserAnswer) => FileBrowserAnswer)|undefined = self.options.folder.process;
                            if (!process) {
                                process = this.options.ajax.process;
                            }
                            if (process) {
                                let respData = <FileBrowserAnswer>process.call(self, resp);
                                self.generateFolderTree(respData.data.sources);
                            }
                        }, () => {
                            self.errorHandler(new Error(self.jodit.i18n('Error on load folders')));
                        }));
                    } else {
                        self.tree.classList.remove('active');
                    }
                }

                tree.push(this.loadItems(path, source));

                return Promise.all(tree);
            });
    }

    /**
     * Create a directory on the server
     *
     * @method create
     * @param {string} name Name the new folder
     * @param {string} path Relative toWYSIWYG the directory in which you want toWYSIWYG create a folder
     * @param {string} source Server source key
     */
    create = (name: string, path: string, source: string): Promise<void> => {
        this.options.create.data.source = source;
        this.options.create.data.path = path;
        this.options.create.data.name = name;

        return this.send('create', (resp) => {
            if (this.options.isSuccess(resp)) {
                this.currentPath = path;
                this.currentSource = source;
                this.loadTree(path, source);
            } else {
                this.status(this.options.getMessage(resp));
            }
        }, (error: Error) => {
            this.status(error.message);
        });
    };

    /**
     * Move a file / directory on the server
     *
     * @method move
     * @param {string} filepath The relative path toWYSIWYG the file / folder source
     * @param {string} path Relative toWYSIWYG the directory where you want toWYSIWYG move the file / folder
     * @param {string} source Source
     */
    move = (filepath: string, path: string, source: string): Promise<void> => {
        this.options.move.data.from = filepath;
        this.options.move.data.path = path;
        this.options.move.data.source = source;

        return this.send('move', (resp) => {
            if (this.options.isSuccess(resp)) {
                this.loadTree(path, source);
            } else {
                this.status(this.options.getMessage(resp));
            }
        }, (error: Error) => {
            this.status(error.message);
        });
    };

    /**
     * Deleting a file
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    fileRemove(path: string, file: string, source: string): Promise<void> {
        this.options.fileRemove.data.path = path;
        this.options.fileRemove.data.name = file;
        this.options.fileRemove.data.source = source;

        return this
            .send('fileRemove', (resp: FileBrowserAnswer) => {
                if (this.options.remove.process) {
                    resp = this.options.remove.process.call(this, resp);
                }
                if (!this.options.isSuccess(resp)) {
                    this.status(this.options.getMessage(resp));
                } else {
                    this.someSelectedWasChanged();
                    this.status(this.options.getMessage(resp), true);
                }
            }, (error: Error) => {
                this.status(error.message);
            })
    }

    /**
     * Deleting a folder
     *
     * @param path Relative path
     * @param file The filename
     * @param source Source
     */
    folderRemove(path: string, file: string, source: string): Promise<void> {
        this.options.folderRemove.data.path = path;
        this.options.folderRemove.data.name = file;
        this.options.folderRemove.data.source = source;

        return this
            .send('folderRemove', (resp: FileBrowserAnswer) => {
                if (this.options.remove.process) {
                    resp = this.options.remove.process.call(this, resp);
                }
                if (!this.options.isSuccess(resp)) {
                    this.status(this.options.getMessage(resp));
                } else {
                    this.someSelectedWasChanged();
                    this.status(this.options.getMessage(resp), true);
                }
            }, (error: Error) => {
                this.status(error.message);
            })
    }

    /**
     * Close dialog
     * @method close
     */
    close = () => {
        this.dialog.close();
    };

    private onSelect(callback: (data: FileBrowserCallBackData) => void) {
        return () => {
            const actives = this.getActiveElements();

            if (actives.length) {
                const urls: string[] = [];
                actives.forEach((elm: HTMLElement) => {
                    let url: string|null = elm.getAttribute('data-url');
                    url && urls.push(url);
                });

                this.close();

                if (typeof callback === 'function') {
                    callback(<FileBrowserCallBackData>{
                        baseurl: '',
                        files: urls
                    });
                }
            }
            return false;
        };
    }

    private onlyImages: boolean = false;

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
    open = (callback: (data: FileBrowserCallBackData) => void, onlyImages: boolean = false): Promise<void> => {
        this.onlyImages = onlyImages;
        this.buffer.fileBrowserOnlyImages = onlyImages;

        return new Promise((resolve) => {
            if (this.options.items.url) {

                let localTimeout: number = 0;
                this.events
                    .off(this.files, 'dblclick')
                    .on(this.files, 'dblclick', this.onSelect(callback), 'a')
                    .on(this.files, 'touchstart', () => {
                        let now: number = (new Date()).getTime();
                        if (now - localTimeout < consts.EMULATE_DBLCLICK_TIMEOUT) {
                            this.onSelect(callback)();
                        }
                        localTimeout = now;
                    }, 'a')
                    .off('select.filebrowser')
                    .on( 'select.filebrowser', this.onSelect(callback));


                const header: HTMLElement = this.ownerDocument.createElement('div');
                this.toolbar.build(this.options.buttons, header);


                this.dialog.dialogbox_header.classList.add('jodit_filebrowser_title_box');
                this.dialog.open(this.browser, header);

                this.events
                    .fire('sort.filebrowser', this.sortBy);

                this.loadTree(this.currentPath, this.currentSource)
                    .then(resolve);
            } else {
                throw new Error('Need set options.filebrowser.ajax.url');
            }
        });
    };

    private errorHandler = (resp: Error|FileBrowserAnswer) => {
        if (resp instanceof Error) {
            this.status(this.i18n(resp.message));
        } else {
            this.status(this.options.getMessage(resp));
        }
    };

    private uploadHandler = () => {
        this.loadItems(this.currentPath, this.currentSource);
    };


    /**
     * Open Image Editor
     *
     * @method openImageEditor
     */
    openImageEditor = (href: string, name: string, path: string, source: string, onSuccess?: Function, onFailed?: (error: Error) => void): Promise<Dialog> => {
        return (<ImageEditor>this.getInstance('ImageEditor'))
            .open(href, (newname: string | void, box: ActionBox, success: Function, failed: (error: Error) => void) => {
                if (this.options[box.action] === undefined) {
                    this.options[box.action] = {};
                }
                if (this.options[box.action].data === undefined) {
                    this.options[box.action].data = {
                        action: box.action
                    };
                }

                this.options[box.action].data.newname = newname || name;
                this.options[box.action].data.box = box.box;
                this.options[box.action].data.path = path;
                this.options[box.action].data.name = name;
                this.options[box.action].data.source = source;

                this.send(box.action, (resp) => {
                    if (this.options.isSuccess(resp)) {
                        this.loadTree(this.currentPath, this.currentSource);
                        success();
                        if (onSuccess) {
                            onSuccess();
                        }
                    } else {
                        failed(new Error(this.options.getMessage(resp)));
                        if (onFailed) {
                            onFailed(new Error(this.options.getMessage(resp)));
                        }
                    }
                }, (error: Error) => {
                    failed(error);
                    if (onFailed) {
                        onFailed(error);
                    }
                });
            });
    };

    /**
     * Return default timeout period in milliseconds for some debounce or throttle functions. By default return {observer.timeout} options
     *
     * @return {number}
     */
    get defaultTimeout(): number {
        return (this.jodit) ? this.jodit.defaultTimeout : Jodit.defaultOptions.observer.timeout;
    }
}
