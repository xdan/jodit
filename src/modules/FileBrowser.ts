/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Component} from './Component';
import {Dialog, Alert, Confirm, Promt} from '../modules/Dialog';
import {Config} from '../Config';
import {
    $$, css, ctrlKey, debounce, dom, each, extend, humanSizeToBytes, isPlainObject, offset,
    pathNormalize, urlNormalize
} from "./Helpers";
import {Toolbar} from "./Toolbar";
import {ContextMenu} from "./ContextMenu";
import {Uploader, UploaderOptions} from "./Uploader";
import {Ajax} from "./Ajax";
import * as consts from "../constants";
import {ImageEditor, ActionBox} from "./ImageEditor";
import {Cookie} from "./Cookie";

/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-filebrowser-options.html|FileBrowser options}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-integrate-filebrowser-in-joomla.html|Integrate filebrowser in Joomla CMS}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-elfinder-integration.html|Integration with ElFinder}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and Drag and Drop files}
 * @module FileBrowser
 * @see {@link Dialog|Dialog}
 * @params {Object} parent Jodit main object
 */

/**
 * @property{object} filebrowser module settings {@link module:FileBrowser|FileBrowser}
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
 * @property {Array<string>} filebrowser.buttons="['upload', 'remove', 'update', 'select', 'edit', 'tiles', 'list']" Toolbar browser
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     filebrowser: {
 *         buttons: ['upload', 'remove', 'update', {
 *             name: 'deleteall',
 *             icon: 'remove',
 *             exec: function () {
 *                 $files.find('a').each(function () {
 *                     remove(editor.filebrowser.currentPath, $(this).data('name'));
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
 */

interface ISourceFile {
    file: string
    thumb: string
    changed: string
    size: string
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
        permissions?: Permissions|null;
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

type ExecButton = {
    exec: Function;
    name?: string;
    icon?: string;
}

type FileBrowserOptions = {
    filter: (item, search) => boolean;

    sortBy: string;

    sort: (a, b, sortBy, editor?: Jodit) => number;

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
    buttons: Array<string|Function|ExecButton>;

    view: string;

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
    remove: FileBrowserAjaxOptions;
    items: FileBrowserAjaxOptions;
    folder: FileBrowserAjaxOptions;
    permissions: FileBrowserAjaxOptions;

    uploader: null // use default Uploader's settings
}

export type FileBrowserCallBackData = {
    baseurl: string,
    files: string[]
};

declare module "../Config" {
    interface Config {
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

    sort: function (this: FileBrowser, a, b, sortBy: string) {
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
    buttons: ['upload', 'remove', 'update', 'select', 'edit', 'tiles', 'list', 'filter', 'sort'],

    view: 'tiles',

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

        if (typeof item === 'string') {
            name = item;
            thumb = item;
        } else {
            if (item.file !== undefined) {
                name = item.file;
                thumb = item.file;
            }
            if (item.thumb) {
                thumb = item.thumb;
            }
        }

        info = `<div class="${ITEM_CLASS}-info">
            ${this.options.showFileName ? `<span class="${ITEM_CLASS}-info-filename">${name}</span>` : ''}
            ${(this.options.showFileSize && item.size) ? `<span class="${ITEM_CLASS}-info-filesize">${item.size}</span>` : ''}
            ${(this.options.showFileChangeTime && item.changed) ? `<span class="${ITEM_CLASS}-info-filechanged">${item.changed}</span>` : ''}
        </div>`;

        return `<a draggable="true" class="${ITEM_CLASS}" href="${urlNormalize(source.baseurl + source.path +  name)}" data-source="${source_name}" data-path="${pathNormalize(source.path ? source.path + '/' : '/')}" data-name="${name}" title="${name}" data-url="${urlNormalize(source.baseurl + source.path + name)}">
            <img src="${urlNormalize(source.baseurl + source.path + thumb)}?_tmst=${timestamp}" alt="${name}"/>
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
    remove: {
        data: {action: 'fileRemove'},
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


const DEFAULT_SOURCE_NAME = 'default';
const ITEM_CLASS = 'jodit_filebrowser_files_item';

export class FileBrowser extends Component {
    options: FileBrowserOptions;
    currentPath: string = '';
    currentSource: string = DEFAULT_SOURCE_NAME;
    currentBaseUrl: string = '';

    private dialog: Dialog;


    private loader: HTMLElement;
    private browser: HTMLElement;
    private status_line: HTMLElement;
    private tree: HTMLElement;
    private files: HTMLElement;

    private buttons: {[key:string]: HTMLElement};

    uploader: Uploader;

    private __currentPerpissions: Permissions|null = null;

    public canI(action: string): boolean {
        return this.__currentPerpissions && (this.__currentPerpissions['allow' + action] === undefined || this.__currentPerpissions['allow' + action]);
    }

    toggleButtonsByPermissions() {
        this.buttons.upload.classList.toggle('jodit_hidden', !this.canI('FileUpload'));
        this.buttons.remove.classList.toggle('jodit_hidden', !this.canI('FileRemove'));
        this.buttons.edit.classList.toggle('jodit_hidden', !this.canI('ImageResize') && !this.canI('ImageCrop'));
    }

    constructor(editor: Jodit) {
        super(editor);
        const
            self: FileBrowser = this,
            doc: HTMLDocument = editor.ownerDocument;

        self.options = extend(true, {}, Config.prototype.filebrowser, self.jodit.options.filebrowser);

        self.dialog = new Dialog(editor, {
            fullsizeButton: true
        });

        self.loader = dom('<div class="jodit_filebrowser_loader"><i class="jodit_icon-loader"></i></div>', doc);

        self.browser = dom('<div class="jodit_filebrowser non-selected">' +
            (self.options.showFoldersPanel ? '<div class="jodit_filebrowser_tree"></div>' : '') +
            '<div class="jodit_filebrowser_files"></div>' +
            '<div class="jodit_filebrowser_status"></div>' +
         '</div>', doc);

        self.status_line = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_status');

        self.buttons = {
            upload : dom('<div class="jodit_uploadfile_button jodit_button">' + Toolbar.getIcon('plus') + '<input type="file" accept="image/*" tabindex="-1" dir="auto" multiple=""/></div>', doc),
            remove : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('bin') + '</div>', doc),
            update : dom('<div class="jodit_button">' + Toolbar.getIcon('update') + '</div>', doc),
            select : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('check') + '</div>', doc),
            edit   : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('pencil') + '</div>', doc),
            tiles  : dom('<div class="jodit_button jodit_button_tiles disabled">' + Toolbar.getIcon('th') + '</div>', doc),
            list   : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('th-list') + '</div>', doc),
            filter : dom('<input class="jodit_input" placeholder="' + editor.i18n('Filter') + '"/>', doc),

            sort: dom('<select class="jodit_input">' +
                '<option value="changed">' + editor.i18n('Sort by changed') + '</option>' +
                '<option value="name">' + editor.i18n('Sort by name') + '</option>' +
                '<option value="size">' + editor.i18n('Sort by size') + '</option>' +
            '</select>', doc),
        };


        self.tree = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_tree');
        self.files = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_files');

        self.jodit.events
            .on([self.buttons.tiles, self.buttons.list], 'click', (event: Event) => {
                let target = <HTMLElement>event.currentTarget;
                if (target.classList.contains('jodit_button_tiles')) {
                    self.view = 'tiles';
                    self.buttons.list.classList.add('disabled');
                } else {
                    self.view = 'list';
                    self.buttons.tiles.classList.add('disabled');
                }

                target.classList.remove('disabled');
                self.files.classList.remove('jodit_filebrowser_files_view-tiles');
                self.files.classList.remove('jodit_filebrowser_files_view-list');
                self.files.classList.add('jodit_filebrowser_files_view-' + self.view);

                Cookie.set('jodit_filebrowser_view', self.view, 31);
            })

            .on(self.buttons.sort, 'change', () => {
                self.sortBy = (<HTMLInputElement>self.buttons.sort).value;
                Cookie.set('jodit_filebrowser_sortby', self.sortBy, 31);
                self.loadItems(self.currentPath, self.currentSource);
            })

            .on(self.buttons.sort, 'click mousedown', (e: MouseEvent) => {
                e.stopPropagation();
            })

            .on(self.buttons.filter, 'click mousedown', (e: MouseEvent) => {
                e.stopPropagation();
            })
            .on(self.buttons.filter, 'keydown', debounce(() => {
                self.filterWord = (<HTMLInputElement>self.buttons.filter).value;
                self.loadItems(self.currentPath, self.currentSource);
            }, 300))
            .on(self.buttons.remove, 'click', () => {
                if (this.__getActiveElements().length) {
                    Confirm(editor.i18n('Are you shure?'), '', (yes: boolean) => {
                        if (yes) {
                            this.__getActiveElements().forEach((a: HTMLAnchorElement) => {
                                self.remove(self.currentPath, a.getAttribute('data-name') || '', a.getAttribute('data-source') || '');
                            });
                            self.someSelectedWasChanged();
                            self.loadTree(self.currentPath, self.currentSource);
                        }
                    });
                }
            })
            .on(self.buttons.edit, 'click', () => {
                const files: HTMLElement[] = this.__getActiveElements();
                if (files.length === 1) {
                    self.openImageEditor(files[0].getAttribute('href') || '', files[0].getAttribute('data-name') || '', files[0].getAttribute('data-path') || '', files[0].getAttribute('data-source') || '');
                }
            })
            .on(self.buttons.update, 'click', () => {
                self.loadTree(this.currentPath, this.currentSource);
            })
            .on(self.tree, 'click',  function (this: HTMLElement, e: MouseEvent)  {
                const a: HTMLAnchorElement = <HTMLAnchorElement>this.parentNode,
                    path: string = a.getAttribute('data-path') || '';

                Confirm(editor.i18n('Are you shure?'), '', (yes: boolean) => {
                    if (yes) {
                        self.remove(path, a.getAttribute('data-name') || '', a.getAttribute('data-source') || '');
                        self.loadTree(self.currentPath, self.currentSource);
                    }
                });

                e.stopImmediatePropagation();
                return false;
            }, 'a>i.remove')
            .on(self.tree, 'click',  function (this: HTMLAnchorElement) {
                if (this.classList.contains('addfolder')) {
                    Promt(self.jodit.i18n('Enter Directory name'), self.jodit.i18n('Create directory'), (name: string) => {
                        self.create(name, this.getAttribute('data-path'), this.getAttribute('data-source'));
                    }, self.jodit.i18n('type name'));
                } else {
                    self.currentPath = this.getAttribute('data-path') || '';
                    self.currentSource = this.getAttribute('data-source') || '';
                    self.loadTree(self.currentPath, self.currentSource);
                }
            }, 'a')
            .on(this.tree, 'dragstart', function (this: HTMLAnchorElement) {
                self.dragger = this;
            }, 'a')
            .on(this.tree, 'drop',   function (this: HTMLAnchorElement) {
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

        const contextmenu: ContextMenu = new ContextMenu(this.jodit);

        self.jodit.events
            .on(self.files, 'mousedown', function (this: HTMLElement, e: DragEvent) {
                self.client.x = e.clientX;
                self.client.y = e.clientY;

                self.start = offset(this, self.jodit);

                self.draggable = <HTMLElement>this.cloneNode(true);

                css(<HTMLElement>self.draggable, {
                    'z-index': 100000000000000,
                    position: 'fixed',
                    display: 'none',
                    left: self.start.left,
                    top: self.start.top,
                    width: this.offsetWidth,
                    height: this.offsetHeight
                });

                doc.body.appendChild(self.draggable)
            },  'a>img')
            .on(self.files, 'dragstart', function (this: HTMLElement, e: DragEvent) {
                self.dragger = this;
                e.dataTransfer.setData(consts.TEXT_PLAIN, this.getAttribute('href') || '');
                e.stopPropagation();
            }, 'a')
            .on(self.files, 'contextmenu', function (this: HTMLElement, e: DragEvent) {
                if (self.options.contextMenu) {
                    let item: HTMLElement = this;
                    contextmenu.show(e.pageX, e.pageY, [
                        (self.options.editImage && (self.canI('ImageResize') || self.canI('ImageCrop'))) ? {
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
                                self.remove(self.currentPath, item.getAttribute('data-name') || '', item.getAttribute('data-source') || '');
                                self.someSelectedWasChanged();
                                self.loadTree(self.currentPath, self.currentSource);
                            }
                        } : false,
                        self.options.preview ? {
                            icon: 'eye',
                            title: 'Preview',
                            exec: () => {
                                let src: string = item.getAttribute('href') || '';
                                const preview: Dialog = new Dialog(self.jodit),
                                    temp_content: HTMLElement = dom('<div class="jodit_filebrowser_preview"><i class="jodit_icon-loader"></i></div>', doc),
                                    selectBtn: HTMLElement = <HTMLElement>self.buttons.select.cloneNode(true),
                                    image: HTMLImageElement = doc.createElement('img'),
                                    addLoadHandler = () => {
                                        let onload = () => {
                                            this.removeEventListener('load', <EventListenerOrEventListenerObject>onload);
                                            temp_content.innerHTML = '';
                                            if (self.options.showPreviewNavigation) {
                                                let next = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-next">' + Toolbar.getIcon('angle-right') + '</a>', doc),
                                                    prev = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-prev">' + Toolbar.getIcon('angle-left') + '</a>', doc);

                                                if (item.previousSibling && (<HTMLElement>item.previousSibling).classList && (<HTMLElement>item.previousSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(prev);
                                                }
                                                if (item.nextSibling && (<HTMLElement>item.nextSibling).classList && (<HTMLElement>item.nextSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(next);
                                                }

                                                self.jodit.events.on([next, prev], 'click', function (this: HTMLElement) {
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
                                            onload.call(image);
                                        }
                                    };

                                addLoadHandler();
                                image.setAttribute('src', src);
                                preview.setContent(temp_content);

                                if (self.options.showSelectButtonInPreview) {
                                    selectBtn.removeAttribute('disabled');
                                    preview.setTitle(selectBtn);
                                    selectBtn.addEventListener('click', () => {
                                        $$('a.active', self.files).forEach((a: HTMLAnchorElement) => a.classList.add('active'));
                                        item.classList.add('active');
                                        self.jodit.events.fire(self.buttons.select, 'click');
                                        preview.close();
                                    });
                                }

                                preview.open();
                            }
                        } : false,
                        {
                            icon: 'upload',
                            title: 'Download',
                            exec: () => {
                                let url : string|null = item.getAttribute('href');

                                if (url) {
                                    self.jodit.ownerWindow.open();
                                }
                            }
                        }
                    ]);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            }, 'a')
            .on(self.files, 'click', (e: MouseEvent) => {
                if (!ctrlKey(e)) {
                    this.__getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    });
                    self.someSelectedWasChanged();
                }
            })
            .on(self.files, 'click', function (this: HTMLElement, e: MouseEvent) {
                if (!ctrlKey(e)) {
                    self.__getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    })
                }
                this.classList.toggle('active');
                self.someSelectedWasChanged();
                e.stopPropagation();
                return false;
            }, 'a')
            .on(self.jodit.ownerDocument, 'dragover', function (e: MouseEvent) {
                if (self.isOpened() && self.draggable && e.clientX !== undefined) {
                    css(self.draggable, {
                        left: e.clientX + 20,
                        top: e.clientY + 20,
                        display: 'block'
                    });
                }
            })
            .on(self.jodit.ownerWindow, 'keydown', (e: KeyboardEvent) => {
                if (self.isOpened() && e.which === consts.KEY_DELETE) {
                    self.jodit.events.fire(self.buttons.remove, 'click');
                }
            })
            .on(self.jodit.ownerWindow, 'mouseup dragend',() => {
                if (self.draggable) {
                    self.draggable.parentNode && self.draggable.parentNode.removeChild(self.draggable);
                    self.draggable = false;
                }
            });

        this.dialog.setSize(this.options.width, this.options.height);

        this.options.getLocalFileByUrl =    extend(true, {}, this.options.ajax, this.options.getLocalFileByUrl);
        this.options.crop =                 extend(true, {}, this.options.ajax, this.options.crop);
        this.options.resize =               extend(true, {}, this.options.ajax, this.options.resize);
        this.options.create =               extend(true, {}, this.options.ajax, this.options.create);
        this.options.move =                 extend(true, {}, this.options.ajax, this.options.move);
        this.options.remove =               extend(true, {}, this.options.ajax, this.options.remove);
        this.options.folder =               extend(true, {}, this.options.ajax, this.options.folder);
        this.options.items =                extend(true, {}, this.options.ajax, this.options.items);
        this.options.permissions =          extend(true, {}, this.options.ajax, this.options.permissions);


        this.view = this.options.view === 'list' ? 'list' : 'tiles';

        if (Cookie.get('jodit_filebrowser_view')) {
            this.view = Cookie.get('jodit_filebrowser_view') === 'list' ? 'list' : 'tiles';
        }

        this.buttons[this.view].classList.remove('disabled');
        this.files.classList.add('jodit_filebrowser_files_view-' + this.view);

        this.sortBy = (['changed', 'name', 'size']).indexOf(this.options.sortBy) !== -1 ? this.options.sortBy : 'changed';

        if (Cookie.get('jodit_filebrowser_sortby')) {
            this.sortBy = (['changed', 'name', 'size']).indexOf(Cookie.get('jodit_filebrowser_sortby') || '') !== -1 ? Cookie.get('jodit_filebrowser_sortby') || '' : 'changed';
        }

        (<HTMLInputElement>this.buttons.sort).value = this.sortBy;

        this.currentBaseUrl = $$('base', this.jodit.editorDocument).length ? $$('base', this.jodit.editorDocument)[0].getAttribute('href') || '' : location.protocol + '//' + location.host;

        if (Jodit.modules.Uploader !== undefined) {
            this.uploader = new Uploader(this.jodit, <UploaderOptions>{...<UploaderOptions>this.jodit.options.uploader, ...<UploaderOptions>(this.options.uploader ? this.options.uploader : {})});
            this.uploader.setPath(this.currentPath);
            this.uploader.setSource(this.currentSource);
            this.uploader.bind(this.browser, this.uploadHandler, this.errorHandler);
            this.uploader.bind(this.buttons.upload, this.uploadHandler, this.errorHandler);
        }
    }

    private view: string = 'tiles';
    private sortBy: string = 'changed';

    // /**
    //  * Get base url. You can use this method in another modules
    //  *
    //  * @method getBaseUrl
    //  */
    // getBaseUrl () {
    //     return this.currentBaseUrl;
    // }

    private dragger:false|HTMLElement = false;


    /**
     *
     * @return {boolean}
     */
    isOpened (): boolean {
        return this.dialog.isOpened() && this.browser.style.display !== 'none';
    }

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
        this.statustimer = setTimeout(() => {
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
                folders.push('<a class="jodit_button addfolder" href="javascript:void(0)" data-path="' + pathNormalize(source.path + name) + '/" data-source="' + source_name + '">' + Toolbar.getIcon('plus') + ' ' + this.jodit.i18n('Add folder') + '</a>');
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
                        files.push(this.options.getThumbTemplate.call(this, item, source, source_name));
                    }
                });
            } else {
                files.push(`<div>${this.jodit.i18n('There are no files')}</div>`);
            }
        });

        this.files.innerHTML = files.join('');
    }


    private __getActiveElements(): HTMLElement[] {
        return $$(':scope>a.active', this.files)
    }

    private someSelectedWasChanged() {
        let actives = this.__getActiveElements();
        this.buttons.remove.classList.toggle('disabled', !actives.length);
        this.buttons.select.classList.toggle('disabled', !actives.length);
        this.buttons.edit.classList.toggle('disabled', actives.length !== 1);
    }

    private __ajax2: Ajax;

    private send(name: string, success: (resp: FileBrowserAnswer) => void, error: (error: Error) => void) {
        let xhr: Ajax,
            opts: FileBrowserAjaxOptions = extend(true, {}, this.options.ajax, this.options[name] !== undefined ? this.options[name] : this.options.ajax);

        if (opts.prepareData) {
            opts.data = opts.prepareData.call(this, opts.data);
        }

        xhr = new Ajax(this.jodit, opts);

        xhr
            .send()
                .then(success)
                .catch(error);

        return xhr;
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

    private loadItems = (path: string, source: string) => {
        const self: FileBrowser = this;

        self.options.items.data.path = path;
        self.options.items.data.source = source;

        if (self.options.items.url) {
            self.files.classList.add('active');
            self.files.appendChild(self.loader.cloneNode(true));

            if (self.__ajax2 && self.__ajax2.abort) {
                self.__ajax2.abort();
            }
            self.__ajax2 = self.send('items', (resp) => {
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
        }
    };

    private __ajax: Ajax;
    private __permissions: Ajax;

    private loadPermissions(path: string, source: string, callback: Function) {
        const self: FileBrowser = this;

        self.options.permissions.data.path = path;
        self.options.permissions.data.source = source;

        if (self.options.permissions.url) {
            if (self.__permissions && self.__permissions.abort) {
                self.__permissions.abort();
            }
            self.__permissions = self.send('permissions', (resp: FileBrowserAnswer) => {
                let process: ((resp: FileBrowserAnswer) => FileBrowserAnswer)|undefined = self.options.permissions.process;
                if (!process) {
                    process = this.options.ajax.process;
                }

                if (process) {
                    const respData: FileBrowserAnswer = <FileBrowserAnswer>process.call(self, resp);
                    if (respData.data.permissions) {
                        this.__currentPerpissions = respData.data.permissions;
                        this.toggleButtonsByPermissions();
                        callback();
                    }
                }
            }, (error: Error) => {
                Alert(error.message);
                self.errorHandler(error);
                callback();
            });
        } else {
            callback();
        }
    }
    private loadTree(path: string, source: string) {
        this.loadPermissions(path, source, () => {
            const self: FileBrowser = this;

            self.options.folder.data.path = path;
            self.options.folder.data.source = source;

            if (self.uploader) {
                self.uploader.setPath(path);
                self.uploader.setSource(source);
            }

            if (self.options.showFoldersPanel) {
                if (self.options.folder.url) {
                    self.tree.classList.add('active');
                    self.tree.innerHTML = '';
                    self.tree.appendChild(self.loader.cloneNode(true));
                    if (self.__ajax && self.__ajax.abort) {
                        self.__ajax.abort();
                    }
                    self.__ajax = this.send('folder', (resp) => {
                        let process: ((resp: FileBrowserAnswer) => FileBrowserAnswer)|undefined = self.options.folder.process;
                        if (!process) {
                            process = this.options.ajax.process;
                        }
                        if (process) {
                            let respData = <FileBrowserAnswer>process.call(self, resp);
                            // this.currentPath = data.path;
                            self.generateFolderTree(respData.data.sources);
                        }
                    }, () => {
                        self.errorHandler(new Error(self.jodit.i18n('Error on load folders')));
                    });
                } else {
                    self.tree.classList.remove('active');
                }
            }

            this.loadItems(path, source);
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
    create = (name, path, source) => {
        this.options.create.data.source = source;
        this.options.create.data.path = path;
        this.options.create.data.name = name;

        this.send('create', (resp) => {
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
    move = (filepath: string, path: string, source: string) => {
        this.options.move.data.from = filepath;
        this.options.move.data.path = path;
        this.options.move.data.source = source;

        this.send('move', (resp) => {
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
     * Deleting a file / directory on the server
     *
     * @method remove
     * @param {string} path Relative toWYSIWYG the directory
     * @param {string} file The filename
     * @param {string} source Source
     */
    remove(path: string, file: string, source: string) {
        this.options.remove.data.path = path;
        this.options.remove.data.name = file;
        this.options.remove.data.source = source;

        this.send('remove', (resp: FileBrowserAnswer) => {
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
        });
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
            const actives = this.__getActiveElements();
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

    /**
     * It opens a web browser window
     *
     * @method open
     * @param {Function} callback The function that will be called after the file selection in the browser
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
     */
    open = (callback: (data: FileBrowserCallBackData) => void) => {
        if (this.options.items.url) {

            let localTimeot: number = 0;
            this.jodit.events
                .off(this.files, 'dblclick')
                .on(this.files, 'dblclick', this.onSelect(callback), 'a')
                .on(this.files, 'touchstart', () => {
                    let now: number = (new Date()).getTime();
                    if (now - localTimeot < consts.EMULATE_DBLCLICK_TIMEOUT) {
                        this.onSelect(callback)();
                    }
                    localTimeot = now;
                }, 'a')
                .off(this.buttons.select, 'click')
                .on(this.buttons.select, 'click', this.onSelect(callback));


            this.loadTree(this.currentPath, this.currentSource);


            let header: Element[] = [
                    dom(`<span class="jodit_dialog_header_title">${this.jodit.i18n('File Browser')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`, this.jodit.ownerDocument)
                ],
                i: number,
                button: Element;

            for (i = 0; i < this.options.buttons.length; i += 1) {
                let btn = this.options.buttons[i];
                if (typeof btn === 'string' && this.buttons[<string>btn] !== undefined && ((this.options.editImage && Jodit.modules.ImageEditor !== undefined) || btn !== 'edit')) {
                    header.push(this.buttons[<string>btn]);
                } else {
                    if (typeof btn === 'function') {
                        header.push((<Function>btn).call(this));
                    } else if (isPlainObject(btn) && (<ExecButton>btn).exec && (<ExecButton>btn).name) {
                        button = dom('<div class="jodit_button">' + Toolbar.getIcon((<ExecButton>btn).icon || (<ExecButton>btn).name || '') + '</div>', this.jodit.ownerDocument);
                        header.push(button);
                        button.addEventListener('click', <EventListenerOrEventListenerObject>(<ExecButton>btn).exec);
                    }
                }
            }

            this.dialog.open(this.browser, header);
        }
    };

    private errorHandler = (resp: Error|FileBrowserAnswer) => {
        if (resp instanceof Error) {
            this.status(this.jodit.i18n(resp.message));
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
    openImageEditor = (href: string, name: string, path: string, source: string, onSuccess?: Function, onFailed?: (error: Error) => void) => {
        (<ImageEditor>this.jodit.getInstance('ImageEditor')).open(href, (newname: string, box: ActionBox, success: Function, failed: (error: Error) => void) => {
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

    private draggable: HTMLElement|false = false;
    private start = {top: 0, left: 0};
    private client = {x: 0, y: 0};
}
