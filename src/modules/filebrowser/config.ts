/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../../Config';
import { ToolbarIcon } from '../toolbar/icon';

import {
    IFileBrowser,
    IFileBrowserAnswer,
    IFileBrowserOptions,
    ISource,
    ISourceFile,
} from '../../types/fileBrowser';

import { IControlType } from '../../types/toolbar';
import { IDictionary } from '../../types/types';
import { IUploader } from '../../types/uploader';
import { IViewBased } from '../../types/view';
import { normalizePath } from '../helpers/normalize/';
import { normalizeURL } from '../helpers/normalize/normalizeURL';
import { debounce } from '../helpers/async/debounce';
import { humanSizeToBytes } from '../helpers';
import { ITEM_CLASS } from './fileBrowser';

declare module '../../Config' {
    interface Config {
        /**
         * Filebrowser module settings
         *
         * @property{int} filebrowser.howLongShowMsg=3000 How long toWYSIWYG show an error message
         * in the status bar (ms)
         * @property{boolean} filebrowser.sort=function (a, b, sortBy, parent) { return b.changed - a.changed;}
         * Items sort functions
         * @property{boolean} filebrowser.sortBy='changed' Sort by field
         * @property{boolean} filebrowser.filter=function (item, searchWord)
         * { return item.name.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1} Filter items
         * @property{boolean} filebrowser.showFileName=true Show filename in thumbs
         * @property{boolean} filebrowser.showFileSize=true Show filesize in thumbs
         * @property{boolean} filebrowser.showFileChangeTime=true Show the last modification time in thumbs
         *
         * @property {boolean} filebrowser.editImage=true use
         * {@link ImageEditor|Image editor module} - crop and resize image
         * @property {boolean} filebrowser.preview=true Show preview button in context menu
         * @property {boolean} filebrowser.showPreviewNavigation=true Show navigation buttons in preview
         * @property {boolean} filebrowser.showSelectButtonInPreview=true Show select button in preview
         * @property {boolean} filebrowser.contextMenu=true use context menu
         * @property {boolean} filebrowser.createNewFolder=true
         * The ability toWYSIWYG create a directory of the web browser
         * @property {boolean} filebrowser.deleteFolder=true
         * The ability toWYSIWYG delete directories from the web browser
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
         * ]" Toolbar browser
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
         * @property{object} filebrowser.ajax The default settings for AJAX connections toWYSIWYG the server.
         * Most of the settings like here {@link http://api.jquery.com/jQuery.ajax/|jQuery.ajax} but is not jQuery.ajax
         * @property{function(data)} filebrowser.ajax.prepareData Method of preparation
         * of data toWYSIWYG be sent toWYSIWYG the server
         * @property{function(data)} filebrowser.ajax.process The method of processing the
         * data obtained after administration of the server. Must return this PlainObject format
         * ```json
         *  {
         *     files: resp.files || [], // {array} The names of files or folders, files can
         *     be ['image.jpg', 'image.jpg2', 'image3.jpg' ...] and [{file: 'image.jpg', thumb: '_thumbs/image.jpg'},
         *     {file: 'image2.jpg', thumb: '_thumbs/image2.jpg'} ...]
         *     path: resp.path, // {string} Real relative path
         *     baseurl: resp.baseurl, // {string} Base url for filebrowser
         *     error: resp.error, // {int}
         *     msg: resp.msg // {string}
         * };
         * ```
         * @property {string} filebrowser.ajax.url='' Address entry point on the server for AJAX connection
         * @property {object} filebrowser.ajax.data={} Default data toWYSIWYG send toWYSIWYG the server
         * @property {(json|text)} filebrowser.ajax.dataType='json' The format of the returned data
         * @property {object} filebrowser.ajax.headers={} An object of additional header key/value pairs toWYSIWYG
         * send along with requests using the `XMLHttpRequest` transport. The header `X-Requested-With: XMLHttpRequest`
         * is always added, but its default `XMLHttpRequest` value can be changed here.
         * @property {object} filebrowser.resize Settings for AJAX connections toWYSIWYG the server toWYSIWYG resize
         * image. By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром
         * action=create
         * @property {object} filebrowser.crop Settings for AJAX connections toWYSIWYG the server toWYSIWYG crop image.
         * By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром
         * action=create
         * @property {object} filebrowser.create Settings for AJAX connections toWYSIWYG the server toWYSIWYG create
         * the category . By default, the uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
         * c параметром action=create
         * @property {object} filebrowser.move Settings for AJAX connections toWYSIWYG the server for the moving
         * image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
         * c параметром action=move
         * @property {object} filebrowser.remove Settings for AJAX connections toWYSIWYG the server toWYSIWYG
         * delete the image or category . By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
         * c параметром action=remove
         * @property {object} filebrowser.folder Settings for AJAX connections toWYSIWYG the server toWYSIWYG
         * download the list of categories .
         * By default uses {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax}
         * c параметром action=folder
         * @property {object} filebrowser.items Settings for AJAX connections toWYSIWYG the server toWYSIWYG download
         * the image list in the specified category . By default uses
         * {@link Jodit.defaultOptions.filebrowser.ajax|filebrowser.ajax} c параметром action=items
         * @property {object} filebrowser.uploader=null Settings Module {@link module:Uploader|Uploader}
         * for fast uploading images in category via Drag&Drop file in the file browser. The default settings of
         * the module {@link module:Uploader|Uploader}
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
         *
         */
        filebrowser: IFileBrowserOptions;
    }
}

Config.prototype.filebrowser = {
    filter(item: string | ISourceFile, search: string) {
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

    sort(this: IFileBrowser, a: any, b: any, sortBy: string): number {
        const compareStr = (f: string, s: string): number => {
            if (f < s) {
                return -1;
            }

            if (f > s) {
                return 1;
            }

            return 0;
        };

        let first: Date, second: Date;

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
    removeButtons: [],
    fullsize: false,
    showTooltip: true,

    view: null,

    isSuccess(this: IFileBrowser, resp: IFileBrowserAnswer): boolean {
        return resp.success;
    },

    getMessage(this: IFileBrowser, resp: IFileBrowserAnswer) {
        return resp.data.messages !== undefined &&
        Array.isArray(resp.data.messages)
            ? resp.data.messages.join(' ')
            : '';
    },

    showFileName: true,
    showFileSize: true,
    showFileChangeTime: true,

    getThumbTemplate(
        this: IFileBrowser,
        item: ISourceFile,
        source: ISource,
        source_name: string
    ): string {
        let name: string = '',
            thumb: string = '',
            info: string,
            thumbIsAbsolute: boolean = !!item.thumbIsAbsolute,
            fileIsAbsolute: boolean = !!item.fileIsAbsolute;

        const timestamp: string = new Date().getTime().toString();

        if (item.file !== undefined) {
            name = item.file;
            thumb = item.file;
        }
        if (item.thumb) {
            thumb = item.thumb;
        }

        info =
            '<div class="' +
            ITEM_CLASS +
            '-info">' +
            (this.options.showFileName
                ? `<span class="${ITEM_CLASS}-info-filename">${name}</span>`
                : '') +
            (this.options.showFileSize && item.size
                ? '<span class="' +
                ITEM_CLASS +
                '-info-filesize">' +
                item.size +
                '</span>'
                : '') +
            (this.options.showFileChangeTime && item.changed
                ? '<span class="' +
                ITEM_CLASS +
                '-info-filechanged">' +
                (typeof item.changed === 'number' ? new Date(item.changed).toLocaleString() : item.changed) +
                '</span>'
                : '') +
            '</div>';

        const imageURL: string = fileIsAbsolute
            ? name
            : normalizeURL(source.baseurl + source.path + name);

        return (
            '<a ' +
            'data-is-file="' +
            (item.isImage ? 0 : 1) +
            '" ' +
            'draggable="true" ' +
            'class="' +
            ITEM_CLASS +
            '" ' +
            'href="' +
            imageURL +
            '" ' +
            'data-source="' +
            source_name +
            '" ' +
            'data-path="' +
            normalizePath(source.path ? source.path + '/' : '/') +
            '" ' +
            'data-name="' +
            name +
            '" ' +
            'title="' +
            name +
            '" ' +
            'data-url="' +
            imageURL +
            '">' +
            '<img ' +
            'data-is-file="' +
            (item.isImage ? 0 : 1) +
            '" ' +
            'data-src="' +
            imageURL +
            '" ' +
            'src="' +
            (thumbIsAbsolute
                ? thumb
                :
                (normalizeURL(source.baseurl + source.path + thumb) +
                    '?_tmst=' +
                    timestamp)) +
            '" ' +
            'alt="' +
            name +
            '"' +
            '/>' +
            (this.options.showFileName ||
            (this.options.showFileSize && item.size) ||
            (this.options.showFileChangeTime && item.changed)
                ? info
                : '') +
            '</a>'
        );
    },

    ajax: {
        url: '',
        async: true,

        data: {},
        cache: true,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        method: 'POST',
        processData: true,
        dataType: 'json',

        headers: {},

        prepareData(this: IUploader, data: any) {
            return data;
        },

        process(this: IUploader, resp: IFileBrowserAnswer): IFileBrowserAnswer {
            return resp;
        },
    },
    create: {
        data: { action: 'folderCreate' },
    },
    getLocalFileByUrl: {
        data: { action: 'getLocalFileByUrl' },
    },
    resize: {
        data: { action: 'imageResize' },
    },
    crop: {
        data: { action: 'imageCrop' },
    },
    fileMove: {
        data: { action: 'fileMove' },
    },
    folderMove: {
        data: { action: 'folderMove' },
    },
    fileRemove: {
        data: { action: 'fileRemove' },
    },
    folderRemove: {
        data: { action: 'folderRemove' },
    },
    items: {
        data: { action: 'files' },
    },
    folder: {
        data: { action: 'folders' },
    },
    permissions: {
        data: { action: 'permissions' },
    },

    uploader: null, // use default Uploader's settings
} as IFileBrowserOptions;

Config.prototype.controls.filebrowser = {
    upload: {
        icon: 'plus',
        isInput: true,
        exec: () => {
            // do nothing
        },
        isDisable: (browser: IFileBrowser): boolean =>
            !browser.canI('FileUpload'),
        getContent: (
            filebrowser: IViewBased,
            control: IControlType
        ): HTMLElement => {
            const btn: HTMLElement = filebrowser.create.fromHTML(
                '<span class="jodit_upload_button">' +
                ToolbarIcon.getIcon('plus') +
                '<input type="file" accept="' +
                (filebrowser.buffer.fileBrowserOnlyImages
                    ? 'image/*'
                    : '*') +
                '" tabindex="-1" dir="auto" multiple=""/>' +
                '</span>'
                ),
                input: HTMLInputElement = btn.querySelector(
                    'input'
                ) as HTMLInputElement;

            filebrowser.events
                .on('updateToolbar', () => {
                    if (control && control.isDisable) {
                        control.isDisable(filebrowser, control)
                            ? input.setAttribute('disabled', 'disabled')
                            : input.removeAttribute('disabled');
                    }
                })
                .fire('bindUploader.filebrowser', btn);

            return btn;
        },
    } as IControlType,
    remove: {
        icon: 'bin',
        isDisable: (browser: IFileBrowser): boolean => {
            return (
                browser.getActiveElements().length === 0 ||
                !browser.canI('FileRemove')
            );
        },
        exec: (editor: IViewBased) => {
            editor.events.fire('fileRemove.filebrowser');
        },
    } as IControlType,
    update: {
        exec: (editor: IViewBased) => {
            editor.events.fire('update.filebrowser');
        },
    } as IControlType,
    select: {
        icon: 'check',
        isDisable: (browser: IFileBrowser): boolean =>
            browser.getActiveElements().length === 0,
        exec: (editor: IViewBased) => {
            editor.events.fire('select.filebrowser');
        },
    } as IControlType,
    edit: {
        icon: 'pencil',
        isDisable: (browser: IFileBrowser): boolean => {
            const selected: HTMLElement[] = browser.getActiveElements();
            return (
                selected.length !== 1 ||
                selected[0].getAttribute('data-is-file') === '1' ||
                !(
                    (browser as IFileBrowser).canI('ImageCrop') ||
                    (browser as IFileBrowser).canI('ImageResize')
                )
            );
        },
        exec: editor => {
            editor.events.fire('edit.filebrowser');
        },
    } as IControlType,
    tiles: {
        icon: 'th',
        isActive: (filebrowser: IFileBrowser): boolean =>
            filebrowser.buffer.fileBrowserView === 'tiles',
        exec: (filebrowser: IFileBrowser) => {
            filebrowser.events.fire('view.filebrowser', 'tiles');
        },
    } as IControlType,
    list: {
        icon: 'th-list',
        isActive: (filebrowser: IFileBrowser): boolean =>
            filebrowser.buffer.fileBrowserView === 'list',
        exec: (filebrowser: IFileBrowser) => {
            filebrowser.events.fire('view.filebrowser', 'list');
        },
    } as IControlType,
    filter: {
        isInput: true,
        getContent: (filebrowser: IFileBrowser): HTMLElement => {
            const input: HTMLInputElement = filebrowser.create.element(
                'input',
                {
                    class: 'jodit_input',
                    placeholder: filebrowser.i18n('Filter'),
                }
            );

            filebrowser.events.on(
                input,
                'keydown mousedown',
                debounce(() => {
                    filebrowser.events.fire('filter.filebrowser', input.value);
                }, filebrowser.defaultTimeout)
            );

            return input;
        },
    } as IControlType,
    sort: {
        isInput: true,
        getContent: (filebrowser: IFileBrowser): HTMLElement => {
            const select: HTMLSelectElement = filebrowser.create.fromHTML(
                '<select class="jodit_input">' +
                '<option value="changed">' +
                filebrowser.i18n('Sort by changed') +
                '</option>' +
                '<option value="name">' +
                filebrowser.i18n('Sort by name') +
                '</option>' +
                '<option value="size">' +
                filebrowser.i18n('Sort by size') +
                '</option>' +
                '</select>'
            ) as HTMLSelectElement;

            filebrowser.events
                .on('sort.filebrowser', (value: string) => {
                    if (select.value !== value) {
                        select.value = value;
                    }
                })
                .on(select, 'change', () => {
                    filebrowser.events.fire('sort.filebrowser', select.value);
                });

            return select;
        },
    } as IControlType,
} as IDictionary<IControlType>;
