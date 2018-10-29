/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { UploaderOptions } from "../Uploader";
import { FileBrowser } from "./filebrowser";
import { Jodit } from "../../Jodit";
import { Buttons } from "../toolbar/type";
/**
 * The module creates a web browser dialog box . In a Web browser , you can select an image , remove , drag it . Upload new
 *
 * @module FileBrowser
 * @params {Object} parent Jodit main object
 */
export interface ISourceFile {
    file: string;
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
export declare type FileBrowserAnswer = {
    success: boolean;
    time: string;
    data: {
        messages?: string[];
        sources: ISourcesFiles;
        code: number;
        path: string;
        name: string;
        source: string;
        permissions?: Permissions | null;
    };
};
export declare type FileBrowserAjaxOptions = {
    url?: string;
    async?: boolean;
    data: {
        [key: string]: string;
    };
    cache?: boolean;
    contentType?: string;
    method?: string;
    processData?: boolean;
    dataType?: string;
    headers?: {
        [key: string]: string;
    };
    prepareData?: (data: {
        [key: string]: string;
    }) => {
        [key: string]: string;
    };
    process?: (resp: FileBrowserAnswer) => FileBrowserAnswer;
};
export interface FileBrowserOptions {
    removeButtons: string[];
    buttons: Buttons;
    zIndex?: number;
    fullsize?: boolean;
    showTooltip?: boolean;
    useNativeTooltip?: boolean;
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
    uploader: null | UploaderOptions;
    [key: string]: any;
}
export declare type FileBrowserCallBackData = {
    baseurl: string;
    files: string[];
};
export declare const DEFAULT_SOURCE_NAME = "default";
export declare const ITEM_CLASS = "jodit_filebrowser_files_item";
declare module "../../Config" {
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
        filebrowser: FileBrowserOptions;
    }
}
