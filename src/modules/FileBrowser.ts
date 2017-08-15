import Jodit from '../Jodit';
import Component from './Component';
import Dialog, {Confirm, Promt} from '../modules/Dialog';
import {Config} from '../Config';
import {
    $$, css, ctrlKey, debounce, dom, each, extend, humanSizeToBytes, isPlainObject, offset,
    pathNormalize, urlNormalize
} from "./Helpers";
import Toolbar from "./Toolbar";
import ContextMenu from "./ContextMenu";
import Uploader from "./Uploader";
import Ajax from "./Ajax";
import {TEXT_PLAIN} from "../constants";
import ImageEditor from "./ImageEditor";
import Cookie from "./Cookie";

/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-filebrowser-options.html|FileBrowser options}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-integrate-filebrowser-in-joomla.html|Integrate filebrowser in Joomla CMS}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-elfinder-integration.html|Integration with ElFinder}
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and Drag and Drop files}
 * @module FileBrowser
 * @see {@link module:Dialog|Dialog}
 * @params {Object} parent Jodit main object
 */

/**
 * @prop {object} filebrowser module settings {@link module:FileBrowser|FileBrowser}
 * @prop {int} filebrowser.howLongShowMsg=3000 How long toWYSIWYG show an error message in the status bar (ms)
 * @prop {boolean} filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;} Items sort functions
 * @prop {boolean} filebrowser.sortBy='changed' Sort by field
 * @prop {boolean} filebrowser.filter=function (item, searchWord) { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
 * @prop {boolean} filebrowser.showFileName=true Show filename in thumbs
 * @prop {boolean} filebrowser.showFileSize=true Show filesize in thumbs
 * @prop {boolean} filebrowser.showFileChangeTime=true Show the last modification time in thumbs

 * @prop {boolean} filebrowser.editImage=true use {@link module:ImageEditor|Image editor module} - crop and resize image
 * @prop {boolean} filebrowser.preview=true Show preview button in context menu
 * @prop {boolean} filebrowser.showPreviewNavigation=true Show navigation buttons in preview
 * @prop {boolean} filebrowser.showSelectButtonInPreview=true Show select button in preview
 * @prop {boolean} filebrowser.contextMenu=true use context menu
 * @prop {boolean} filebrowser.createNewFolder=true The ability toWYSIWYG create a directory of the web browser
 * @prop {boolean} filebrowser.deleteFolder=true The ability toWYSIWYG delete directories from the web browser
 * @prop {boolean} filebrowser.moveFolder=true The ability toWYSIWYG move directories from the web browser
 * @prop {boolean} filebrowser.moveFile=true The ability toWYSIWYG move file from the web browser
 * @prop {boolean} filebrowser.showFoldersPanel=true Show folders panel
 * @prop {px} filebrowser.width=763px The width of the web browser
 * @prop {px} filebrowser.height=400px The height of the file browser
 * @prop {array} filebrowser.buttons="['upload', 'remove', 'update', 'select', 'edit', 'tiles', 'list']" Toolbar browser
 * @example
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
 * @prop {function} filebrowser.isSuccess method toWYSIWYG check - whether the response positive
 * @prop {function} filebrowser.getMessage method for receiving a message from the response
 * @example
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
 * @prop {string} filebrowser.view='tiles' Filelist view - `tiles` or `list`
 * @prop {object} filebrowser.ajax The default settings for AJAX connections toWYSIWYG the server. Most of the settings like here {@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax} but is not jQuery.ajax
 * @prop {function(data)} filebrowser.ajax.prepareData Method of preparation of data toWYSIWYG be sent toWYSIWYG the server
 * @prop {function(data)} filebrowser.ajax.process The method of processing the data obtained after administration of the server. Must return this PlainObject format `{
 * {
 *     files: resp.files || [], // {array} The names of files or folders, files can be ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'}, {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
 *     path: resp.path, // {string} Real relative path
 *     baseurl: resp.baseurl, // {string} Base url for filebrowser
 *     error: resp.error, // {int}
 *     msg: resp.msg // {string}
 * };`
 * @prop {string} filebrowser.ajax.url='' Address entry point on the server for AJAX connection
 * @prop {object} filebrowser.ajax.data={} Default data toWYSIWYG send toWYSIWYG the server
 * @prop {(json|text)} filebrowser.ajax.dataType='json' The format of the returned data
 * @prop {PlainObject} filebrowser.ajax.headers={} An object of additional header key/value pairs toWYSIWYG send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest` is always added, but its default `XMLHttpRequest` value can be changed here.
 * @prop {object} filebrowser.resize Settings for AJAX connections toWYSIWYG the server toWYSIWYG resize image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.crop Settings for AJAX connections toWYSIWYG the server toWYSIWYG crop image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.create Settings for AJAX connections toWYSIWYG the server toWYSIWYG create the category . By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=create
 * @prop {object} filebrowser.move Settings for AJAX connections toWYSIWYG the server for the moving image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=move
 * @prop {object} filebrowser.remove Settings for AJAX connections toWYSIWYG the server toWYSIWYG delete the image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=remove
 * @prop {object} filebrowser.folder Settings for AJAX connections toWYSIWYG the server toWYSIWYG download the list of categories . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=folder
 * @prop {object} filebrowser.items Settings for AJAX connections toWYSIWYG the server toWYSIWYG download the image list in the specified category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=items
 * @prop {object} filebrowser.uploader=null Settings Module {@link module:Uploader|Uploader} for fast uploading images in category via Drag&Drop file in the file browser. The default settings of the module {@link module:Uploader|Uploader}
 * @example
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
 *
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
 *         data: {action: 'resize'},
 *     },
 *     crop: {
 *         data: {action: 'crop'},
 *     },
 *     create: {
 *         data: {action: 'create'},
 *     },
 *     move: {
 *         data: {action: 'move'},
 *     },
 *     remove: {
 *         data: {action: 'remove'},
 *     },
 *     items: {
 *         data: {action: 'items'},
 *     },
 *     folder: {
 *         data: {action: 'folder'},
 *     },
 *     uploader: null // use default Uploader's settings
 * }
 * @example
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
                   method: 'GET',
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
 * @example
 * new Jodit('#jodit', {
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
 * @memberof Jodit.defaultOptions
 */

interface ISourceFile {
    file: string
    thumb: string
    changed: string
    size: string
}

interface ISource {
    path?: string
    baseurl?: string
    files?: ISourceFile[]
    folders?: string[]
}


interface ISourcesFiles {
    [key:string] : ISource;
}

type FileBrowserAnswer = {
    success: boolean,
    time: string,
    data: {
        messages?: string[],
        sources: ISourcesFiles,
        code: number
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

    prepareData?: (this: Uploader, data: { [key: string]: string }) => { [key: string]: string };

    process?: (this: Uploader, resp: FileBrowserAnswer) => FileBrowserAnswer;
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
    getlocalfilebyurl: FileBrowserAjaxOptions;
    resize: FileBrowserAjaxOptions;
    crop: FileBrowserAjaxOptions;
    move: FileBrowserAjaxOptions;
    remove: FileBrowserAjaxOptions;
    items: FileBrowserAjaxOptions;
    folder: FileBrowserAjaxOptions;

    uploader: null // use default Uploader's settings
}

export type FileBrowserCallBcackData = {
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

    sort: function (this: FileBrowser, a, b, sortBy) {
        let compareStr = function (f, s) {
                if (f < s) {
                    return -1;
                }
                if (f > s) {
                    return 1;
                }
                return 0;
            },
            first,
            second;

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

                return second - first;
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
        let name: string,
            thumb: string,
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
            ${(this.options.showFileSize && item.size) ? `<span class="' + ITEM_CLASS + '-info-filesize">${item.size}</span>` : ''}
            ${(this.options.showFileChangeTime && item.changed) ? `<span class="${ITEM_CLASS}-info-filesize">${item.changed}</span>` : ''}
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

        process: function (this: Uploader, resp: FileBrowserAnswer) {
            return resp;
        }
    },
    create: {
        data: {action: 'create'},
    },
    getlocalfilebyurl: {
        data: {action: 'getlocalfilebyurl'},
    },
    resize: {
        data: {action: 'resize'},
    },
    crop: {
        data: {action: 'crop'},
    },
    move: {
        data: {action: 'move'},
    },
    remove: {
        data: {action: 'remove'},
    },
    items: {
        data: {action: 'files'},
    },
    folder: {
        data: {action: 'folders'},
    },

    uploader: null // use default Uploader's settings
};


const DEFAULT_SOURCE_NAME = 'default';
const ITEM_CLASS = 'jodit_filebrowser_files_item';

export default class FileBrowser extends Component {
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

    constructor(editor: Jodit) {
        super(editor);
        const self = this;

        self.options = extend(true, {}, Config.prototype.filebrowser, self.jodit.options.filebrowser);

        self.dialog = new Dialog(editor, {
            fullsizeButton: true
        });

        self.loader = dom('<div class="jodit_filebrowser_loader"><i class="jodit_icon-loader"></i></div>');

        self.browser = dom('<div class="jodit_filebrowser non-selected">' +
            (self.options.showFoldersPanel ? '<div class="jodit_filebrowser_tree"></div>' : '') +
            '<div class="jodit_filebrowser_files"></div>' +
            '<div class="jodit_filebrowser_status"></div>' +
         '</div>');

        self.status_line = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_status');



        self.buttons = {
            upload : dom('<div class="jodit_uploadfile_button jodit_button">' + Toolbar.getIcon('plus') + '<input type="file" accept="image/*" tabindex="-1" dir="auto" multiple=""/></div>'),
            remove : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('bin') + '</div>'),
            update : dom('<div class="jodit_button">' + Toolbar.getIcon('update') + '</div>'),
            select : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('check') + '</div>'),
            edit : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('pencil') + '</div>'),
            tiles : dom('<div class="jodit_button jodit_button_tiles disabled">' + Toolbar.getIcon('th') + '</div>'),
            list : dom('<div class="jodit_button disabled">' + Toolbar.getIcon('th-list') + '</div>'),
            filter: dom('<input class="jodit_input" placeholder="' + editor.i18n('Filter') + '"/>'),

            sort: dom('<select class="jodit_input">' +
                '<option value="changed">' + editor.i18n('Sort by changed') + '</option>' +
                '<option value="name">' + editor.i18n('Sort by name') + '</option>' +
                '<option value="size">' + editor.i18n('Sort by size') + '</option>' +
                '</select>'),
        };


        self.tree = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_tree');
        self.files = <HTMLElement>self.browser.querySelector('.jodit_filebrowser_files');

        self.__on([self.buttons.tiles, self.buttons.list], 'click', (event: Event) => {
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
        });

        self.__on(self.buttons.sort, 'change', () => {
            self.sortBy = (<HTMLInputElement>self.buttons.sort).value;
            Cookie.set('jodit_filebrowser_sortby', self.sortBy, 31);
            self.loadItems(self.currentPath, self.currentSource);
        });

        self.__on(self.buttons.sort, 'click mousedown', (e) => {
            e.stopPropagation();
        });


        self
            .__on(self.buttons.filter, 'click mousedown', (e) => {
                e.stopPropagation();
            })
            .__on(self.buttons.filter, 'keydown', debounce(() => {
                self.filterWord = (<HTMLInputElement>self.buttons.filter).value;
                self.loadItems(self.currentPath, self.currentSource);
            }, 300));

        self.__on(self.buttons.remove, 'click', () => {
            if (this.__getActiveElements().length) {
                Confirm(editor.i18n('Are you shure?'), '', (yes) => {
                    if (yes) {
                        this.__getActiveElements().forEach((a) => {
                            self.remove(self.currentPath, a.getAttribute('data-name'), a.getAttribute('data-source'));
                        });
                        self.someSelectedWasChanged();
                        self.loadTree(self.currentPath, self.currentSource);
                    }
                });
            }
        });

        self.__on(self.buttons.edit, 'click', () => {
            let files = this.__getActiveElements();
            if (files.length === 1) {
                self.openImageEditor(files[0].getAttribute('href'), files[0].getAttribute('data-name'), files[0].getAttribute('data-path'), files[0].getAttribute('data-source'));
            }
        });

        self.__on(self.buttons.update, 'click', () => {
            self.loadTree(this.currentPath, this.currentSource);
        });

        self
            .__on(self.tree, 'click', 'a>i.remove', function (e)  {
                let a = this.parentNode, path = a.getAttribute('data-path');
                Confirm(editor.i18n('Are you shure?'), '', (yes) => {
                    if (yes) {
                        self.remove(path, a.getAttribute('data-name'), a.getAttribute('data-source'));
                        self.loadTree(self.currentPath, self.currentSource);
                    }
                });
                e.stopImmediatePropagation();
                return false;
            })
            .__on(self.tree, 'click', 'a', function () {
                if (this.classList.contains('addfolder')) {
                    Promt(self.jodit.i18n('Enter Directory name'), self.jodit.i18n('Create directory'), (name) => {
                        self.create(name, this.getAttribute('data-path'), this.getAttribute('data-source'));
                    }, self.jodit.i18n('type name'));
                } else {
                    self.currentPath = this.getAttribute('data-path');
                    self.currentSource = this.getAttribute('data-source');
                    self.loadTree(this.getAttribute('data-path'), this.getAttribute('data-source'));
                }
            })
            .__on(this.tree, 'dragstart', 'a', function () {
                self.dragger = this;
            })
            .__on(this.tree, 'drop',  'a', function () {
                if (self.options.moveFolder && self.dragger) {
                    let path = self.dragger.getAttribute('data-path');

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

                    self.move(path, this.getAttribute('data-path'), this.getAttribute('data-source'));
                }
            });

        const contextmenu = new ContextMenu(this.jodit);

        self
            .__on(self.files, 'mousedown', 'a>img', function (this: HTMLElement, e: DragEvent) {
                self.client.x = e.clientX;
                self.client.y = e.clientY;

                self.start = offset(this, self.jodit);

                self.draggable = <Element>this.cloneNode(true);

                css(<HTMLElement>self.draggable, {
                    'z-index': 100000000000000,
                    position: 'fixed',
                    display: 'none',
                    left: self.start.left,
                    top: self.start.top,
                    width: this.offsetWidth,
                    height: this.offsetHeight
                });

                document.body.appendChild(self.draggable)
            })
            .__on(self.files, 'dragstart', 'a', function (this: HTMLElement, e: DragEvent) {
                self.dragger = this;
                e.dataTransfer.setData(TEXT_PLAIN, this.getAttribute('href'));
                e.stopPropagation();
            })
            .__on(self.files, 'contextmenu', 'a', function (this: HTMLElement, e: DragEvent) {
                if (self.options.contextMenu) {
                    let item = this;
                    contextmenu.show(e.pageX, e.pageY, [
                        self.options.editImage ? {
                            icon: 'pencil',
                            title: 'Edit',
                            exec: () => {
                                self.openImageEditor(item.getAttribute('href'), item.getAttribute('data-name'), item.getAttribute('data-path'), item.getAttribute('data-source'));
                            }
                        } : false,
                        {
                            icon: 'bin',
                            title: 'Delete',
                            exec: () => {
                                self.remove(self.currentPath, item.getAttribute('data-name'), item.getAttribute('data-source'));
                                self.someSelectedWasChanged();
                                self.loadTree(self.currentPath, self.currentSource);
                            }
                        },
                        self.options.preview ? {
                            icon: 'eye',
                            title: 'Preview',
                            exec: () => {
                                let preview = new Dialog(self.jodit),
                                    temp_content: HTMLElement = dom('<div class="jodit_filebrowser_preview"><i class="jodit_icon-loader"></i></div>'),
                                    src = item.getAttribute('href'),
                                    selectBtn = <HTMLElement>self.buttons.select.cloneNode(true),
                                    image = document.createElement('img'),
                                    addLoadHandler = () => {
                                        let onload = () => {
                                            this.removeEventListener('load', <EventListenerOrEventListenerObject>onload);
                                            temp_content.innerHTML = '';
                                            if (self.options.showPreviewNavigation) {
                                                let next = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-next">' + Toolbar.getIcon('angle-right') + '</a>'),
                                                    prev = dom('<a href="javascript:void(0)" class="jodit_filebrowser_preview_navigation jodit_filebrowser_preview_navigation-prev">' + Toolbar.getIcon('angle-left') + '</a>');

                                                if (item.previousSibling && (<HTMLElement>item.previousSibling).classList && (<HTMLElement>item.previousSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(prev);
                                                }
                                                if (item.nextSibling && (<HTMLElement>item.nextSibling).classList && (<HTMLElement>item.nextSibling).classList.contains(ITEM_CLASS)) {
                                                    temp_content.appendChild(next);
                                                }

                                                self.__on([next, prev], 'click', function (this: HTMLElement) {
                                                    if (this.classList.contains('jodit_filebrowser_preview_navigation-next')) {
                                                        item = <HTMLElement>item.nextSibling;
                                                    } else {
                                                        item = <HTMLElement>item.previousSibling;
                                                    }
                                                    temp_content.innerHTML = '<i class="jodit_icon-loader"></i>';
                                                    src = item.getAttribute('href');
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
                                        self.files.querySelector('a.active').classList.add('active');
                                        item.classList.add('active');
                                        self.__fire(self.buttons.select, 'click', document);
                                        preview.close();
                                    });
                                }

                                preview.open();
                            }
                        } : false,
                        {
                            icon: 'upload',
                            title: 'Download',
                            exec: function () {
                                window.open(item.getAttribute('href'));
                            }
                        }
                    ]);
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            })
            .__on(self.files, 'click', (e: MouseEvent) => {
                if (!ctrlKey(e)) {
                    this.__getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    });
                    self.someSelectedWasChanged();
                }
            })
            .__on(self.files, 'click', 'a', function (this: HTMLElement, e: MouseEvent) {
                if (!ctrlKey(e)) {
                    self.__getActiveElements().forEach((elm: HTMLElement) => {
                        elm.classList.remove('active');
                    })
                }
                this.classList.toggle('active');
                self.someSelectedWasChanged();
                e.stopPropagation();
                return false;
            })
            .__on(document, 'dragover', function (e: MouseEvent) {
                if (self.isOpened() && self.draggable && e.clientX !== undefined) {
                    css(<HTMLElement>self.draggable, {
                        left: e.clientX + 20,
                        top: e.clientY + 20,
                        display: 'block'
                    });
                }
            })
            .__on(window, 'keydown', (e: KeyboardEvent) => {
                if (self.isOpened() && e.which === 46) {
                    self.__fire(self.buttons.remove, 'click', document);
                }
            })
            .__on(window, 'mouseup dragend',() => {
                if (self.draggable) {
                    self.draggable.parentNode.removeChild(self.draggable);
                    self.draggable = false;
                }
            });

        this.dialog.setSize(this.options.width, this.options.height);

        this.options.getlocalfilebyurl = extend(true, {}, this.options.ajax, this.options.getlocalfilebyurl);
        this.options.crop = extend(true, {}, this.options.ajax, this.options.crop);
        this.options.resize = extend(true, {}, this.options.ajax, this.options.resize);
        this.options.create = extend(true, {}, this.options.ajax, this.options.create);
        this.options.move = extend(true, {}, this.options.ajax, this.options.move);
        this.options.remove = extend(true, {}, this.options.ajax, this.options.remove);
        this.options.folder = extend(true, {}, this.options.ajax, this.options.folder);
        this.options.items = extend(true, {}, this.options.ajax, this.options.items);


        this.view = this.options.view === 'list' ? 'list' : 'tiles';
        if (Cookie.get('jodit_filebrowser_view')) {
            this.view = Cookie.get('jodit_filebrowser_view') === 'list' ? 'list' : 'tiles';
        }
        this.buttons[this.view].classList.remove('disabled');
        this.files.classList.add('jodit_filebrowser_files_view-' + this.view);

        this.sortBy = (['changed', 'name', 'size']).indexOf(this.options.sortBy) !== -1 ? this.options.sortBy : 'changed';
        if (Cookie.get('jodit_filebrowser_sortby')) {
            this.sortBy = (['changed', 'name', 'size']).indexOf(Cookie.get('jodit_filebrowser_sortby')) !== -1 ? Cookie.get('jodit_filebrowser_sortby') : 'changed';
        }
        (<HTMLInputElement>this.buttons.sort).value = this.sortBy;

        this.currentBaseUrl = $$('base', this.jodit.doc).length ? $$('base', this.jodit.doc)[0].getAttribute('href') : location.protocol + '//' + location.host;

        if (Jodit.modules.Uploader !== undefined) {
            this.uploader = new Uploader(this.jodit, {...this.jodit.options.uploader, ...this.options.uploader});
            this.uploader.setPath(this.currentPath);
            this.uploader.setSource(this.currentSource);
            this.uploader.bind(this.browser, this.uploadHandler, this.errorHandler);
            this.uploader.bind(this.buttons.upload, this.uploadHandler, this.errorHandler);
        }
    }

    private view = 'tiles';
    private sortBy = 'changed';

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
     * parent.filebrowser.status('There was an error uploading file', false);
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
        let folders = [];

        each(sources, (source_name : string, source: ISource) => {
            if (source_name && source_name !== DEFAULT_SOURCE_NAME) {
                folders.push('<div class="jodit_filebrowser_source_title">' + source_name + '</div>');
            }

            source.folders.forEach((name: string) => {
                let folder = '<a draggable="draggable" class="jodit_filebrowser_tree_item" href="javascript:void(0)" data-path="' + pathNormalize(source.path + name) + '/" data-source="' + source_name + '">' +
                    '<span>' + name + '</span>';

                if (this.options.deleteFolder && name !== '..' && name !== '.') {
                    folder += '<i class="remove" data-path="' + pathNormalize(source.path + name + '/') + '">&times;</i>';
                }

                folder += '</a>';

                folders.push(folder);
            });
            if (this.options.createNewFolder) {
                folders.push('<a class="jodit_button addfolder" href="javascript:void(0)" data-path="' + pathNormalize(source.path + name) + '/" data-source="' + source_name + '">' + Toolbar.getIcon('plus') + ' ' + this.jodit.i18n('Add folder') + '</a>');
            }
        });

        this.tree.innerHTML = folders.join('');
    }

    private filterWord = '';

    private generateItemsBox(sources: ISourcesFiles) {
        let files = [];

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

    private send(name, success, error) {
        let xhr, opts = extend(true, {}, this.options.ajax, this.options[name] !== undefined ? this.options[name] : this.options.ajax);
        opts.data = opts.prepareData.call(this, opts.data);
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
     * @param {function} failed filename
     * @param {string} failed.message
     */
    getPathByUrl = (url: string, success: (path: string, name: string, source: string) => void, failed) => {
        let action = 'getlocalfilebyurl', self = this;
        this.options[action].data.url = url;
        this.send(action, (resp) => {
            if (self.options.isSuccess(resp)) {
                success(resp.data.path, resp.data.name, resp.data.source);
            } else {
                failed(self.options.getMessage(resp));
            }
        }, (resp)  => {
            failed(self.options.getMessage(resp));
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
                let respData = <FileBrowserAnswer>self.options.items.process.call(self, resp);
                self.generateItemsBox(respData.data.sources);
                self.someSelectedWasChanged();
            }, () => {
                self.status(self.jodit.i18n('Error on load list'));
            });
        }
    };

    private __ajax: Ajax;
    private loadTree(path: string, source: string) {
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
                    let respData = <FileBrowserAnswer>self.options.folder.process.call(self, resp);
                    // this.currentPath = data.path;
                    self.generateFolderTree(respData.data.sources);
                }, () => {
                    self.status(self.jodit.i18n('Error on load folders'));
                });
            } else {
                self.tree.classList.remove('active');
            }
        }

        this.loadItems(path, source);
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
        }, (error) => {
            this.status(error);
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
        }, (error) => {
            this.status(error);
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

        this.send('remove', (resp) => {
            resp = this.options.remove.process.call(this, resp);
            if (!this.options.isSuccess(resp)) {
                this.status(this.options.getMessage(resp));
            } else {
                this.someSelectedWasChanged();
                this.status(this.options.getMessage(resp), true);
            }
        }, (error) => {
            this.status(error);
        });
    }

    /**
     * Close dialog
     * @method close
     */
    close = () => {
        this.dialog.close();
    };

    private onSelect(callback: (data: FileBrowserCallBcackData) => void) {
        return () => {
            let actives = this.__getActiveElements();
            if (actives.length) {
                let urls = [];
                actives.forEach((elm) => {
                    urls.push(elm.getAttribute('data-url'));
                });

                this.close();

                if (typeof callback === 'function') {
                    callback(<FileBrowserCallBcackData>{
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
     * var fb = new Jodit.modules.FileBrowser(parent);
     * fb.open(function (data) {
     *     var i;
     *     for (i = 0;i < data.files.length; i += 1) {
     *         parent.selection.insertImage(data.baseurl + data.files[i]);
     *     }
     * });
     */
    open = (callback: (data: FileBrowserCallBcackData) => void) => {
        if (this.options.items.url) {

            this
                .__off(this.files, 'dblclick')
                .__on(this.files, 'dblclick', 'a', this.onSelect(callback));

            this
                .__off(this.buttons.select, 'click')
                .__on(this.buttons.select, 'click', this.onSelect(callback));

            this.loadTree(this.currentPath, this.currentSource);


            let header: Element[] = [
                    dom(`<span class="jodit_dialog_header_title">${this.jodit.i18n('File Browser')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`)
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
                        button = dom('<div class="jodit_button">' + Toolbar.getIcon((<ExecButton>btn).icon || (<ExecButton>btn).name) + '</div>');
                        header.push(button);
                        button.addEventListener('click', <EventListenerOrEventListenerObject>(<ExecButton>btn).exec);
                    }
                }
            }

            this.dialog.open(this.browser, header);
        }
    };

    private errorHandler = (resp) => {
        this.status(this.options.getMessage(resp));
    };

    private uploadHandler = () => {
        this.loadItems(this.currentPath, this.currentSource);
    };


    /**
     * Open Image Editor
     *
     * @method openImageEditor
     */
    openImageEditor = (href: string, name: string, path: string, source: string, onSuccess?: Function, onFailed?: Function) => {
        (<ImageEditor>this.jodit.getInstance('ImageEditor')).open(href, (newname, box, success, failed) => {
            if (this.options[box.action] === undefined) {
                this.options[box.action] = {};
            }
            if (this.options[box.action].data === undefined) {
                this.options[box.action].data = {
                    action: box.action
                };
            }

            this.options[box.action].data.newname = newname;
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
                    failed(this.options.getMessage(resp));
                    if (onFailed) {
                        onFailed(this.options.getMessage(resp));
                    }
                }
            }, (resp) => {
                failed(this.options.getMessage(resp));
                if (onFailed) {
                    onFailed(this.options.getMessage(resp));
                }
            });
        });
    };

    private draggable: Element|false = false;
    private start = {top: 0, left: 0};
    private client = {x: 0, y: 0};
}
