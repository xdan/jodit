/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Ajax } from './Ajax';
import { Select } from "./Selection";
import { IViewBased } from "./view/type";
export declare type UploaderData = {
    messages?: string[];
    files?: string[];
    isImages?: boolean[];
    path?: string;
    baseurl?: string;
    newfilename?: string;
};
export declare type UploaderAnswer = {
    success: boolean;
    time: string;
    data: UploaderData;
};
type HandlerSuccess = (resp: UploaderData) => void;
type HandlerError = (e: Error) => void;
type BuildDataResult = FormData | {
    [key: string]: string;
} | Promise<FormData | {
    [key: string]: string;
}> | string;
/**
 * @property {object} uploader {@link Uploader|Uploader}'s settings
 * @property {string} uploader.url Point of entry for file uploader
 * @property {string} uploader.format='json' The format of the received data
 * @property {string} uploader.headers=null An object of additional header key/value pairs toWYSIWYG send along with requests using the XMLHttpRequest transport. See {@link Ajax.defaultAjaxOptions|Ajax.defaultAjaxOptions}
 * @property {function} uploader.prepareData Before send file will called this function. First argument it gets [new FormData ()](https://developer.mozilla.org/en/docs/Web/API/FormData), you can use this if you want add some POST parameter.
 * @property {object|boolean} uploader.data=false POST parameters.
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *      uploader: {
 *          prepareData: function (formdata) {
 *              formdata.append('id', 24); // $_POST['id'] on server
 *              formdata.append('name', 'Some parameter');  // $_POST['name'] on server
 *          }
 *      }
 * });
 * ```
 * @property {function} uploader.isSuccess Check if received data was positive
 * @property {function} uploader.getMessage If you need display a message use this
 * @property {function(data)} uploader.process The method of processing data received from the server. Must return this PlainObject format `{
 * {
 *     files: resp.files || [], // {array} The names of uploaded files.
 *     path: resp.path, // {string} Real relative path
 *     baseurl: resp.baseurl, // {string} Base url for filebrowser
 *     error: resp.error, // {int}
 *     msg: resp.msg // {string}
 * };`
 * @property {function} uploader.error Process negative situation. For example file wasn't uploaded because of file permoission
 * @property {function} uploader.defaultHandlerSuccess Default success result processor. In first param it get `uploader.process` result
 * @property {function} uploader.defaultHandlerError Default error result processor
 *
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     uploader: {
 *         url: 'connector/index.php?action=upload',
 *         format: 'json',
 *         headers: {
 *             'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 *         },
 *         prepareData: function (data) {
 *             data.append('id', 24); //
 *         },
 *         buildData: function (data) {
 *             return {some: 'data'}
 *         },
 *         data: {
 *              csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 *         }
 *         isSuccess: function (resp) {
 *             return !resp.error;
 *         },
 *         getMessage: function (resp) {
 *             return resp.msg;
 *         },
 *         process: function (resp) {
 *              return {
 *                  files: resp.files || [],
 *                  path: resp.path,
 *                  baseurl: resp.baseurl,
 *                  error: resp.error,
 *                  msg: resp.msg
 *              };
 *         },
 *        defaultHandlerSuccess: function (data, resp) {
 *            var i, field = 'files';
 *            if (data[field] && data[field].length) {
 *                for (i = 0; i < data[field].length; i += 1) {
 *                    this.selection.insertImage(data.baseurl + data[field][i]);
 *                }
 *            }
 *         },
 *         error: function (e) {
 *             this.events.fire('errorMessage', [e.getMessage(), 'error', 4000])
 *         }
 *     }
 * })
 * ```
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *     uploader: {
 *          url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
 *          queryBuild: function (data) {
 *              return JSON.stringify(data);
 *          },
 *          contentType: function () {
 *              return 'application/json';
 *          },
 *          buildData: function (data) {
 *              return {hello: 'Hello world'}
 *          }
 *      },
 * });
 * ```
 * @example
 * // buildData can return Promise
 * // this example demonstrate how send file like as base64 text. Work only in Firefox and Chrome
 * var editor = new Jodit('#editor',  {
 *      uploader: {
 *          url: 'index.php?action=fileUpload',
 *          queryBuild: function (data) {
 *              return JSON.stringify(data);
 *          },
 *          contentType: function () {
 *              return 'application/json';
 *          },
 *          buildData: function (data) {
 *              return new Promise(function (resolve, reject) {
 *                  var reader = new FileReader();
 *                  reader.readAsDataURL(data.getAll('files[0]')[0]);
 *                  reader.onload = function  () {
 *                      return resolve({
 *                          image: reader.result
 *                      });
 *                  };
 *                  reader.onerror =  function  (error) {
 *                      reject(error);
 *                  }
 *              });
 *          }
 *      },
 *  });
 */
export declare type UploaderOptions = {
    url: string;
    insertImageAsBase64URI: boolean;
    imagesExtensions: string[];
    headers?: {
        [key: string]: string;
    } | null;
    data: null | object;
    format: string;
    prepareData: (this: Uploader, formData: FormData) => any;
    buildData?: (this: Uploader, formData: any) => BuildDataResult;
    queryBuild?: (this: Ajax, obj: string | {
        [key: string]: string | object;
    } | FormData, prefix?: string) => string | object;
    isSuccess: (this: Uploader, resp: UploaderAnswer) => boolean;
    getMessage: (this: Uploader, resp: UploaderAnswer) => string;
    process: (this: Uploader, resp: UploaderAnswer) => UploaderData;
    error: (this: Uploader, e: Error) => void;
    defaultHandlerSuccess: HandlerSuccess;
    defaultHandlerError: HandlerError;
    contentType: (this: Uploader, requestData: any) => string | false;
};
declare module "../Config" {
    interface Config {
        enableDragAndDropFileToEditor: boolean;
        uploader: UploaderOptions;
    }
}
export declare class Uploader {
    private path;
    private source;
    private options;
    jodit: IViewBased;
    selection: Select;
    constructor(editor: IViewBased, options?: UploaderOptions);
    buildData(data: FormData | {
        [key: string]: string;
    } | string): BuildDataResult;
    send(data: FormData | {
        [key: string]: string;
    }, success: (resp: UploaderAnswer) => void): Promise<any>;
    sendFiles(files: FileList | Array<File> | null, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError, process?: Function): Promise<any>;
    /**
     * It sets the path for uploading files
     * @method setPath
     * @param {string} path
     */
    setPath(path: string): void;
    /**
     * It sets the source for connector
     *
     * @method setSource
     * @param {string} source
     */
    setSource(source: string): void;
    /**
     * Convert dataURI to Blob
     *
     * @param {string} dataURI
     * @return {Blob}
     */
    static dataURItoBlob(dataURI: string): Blob;
    /**
     * Set the handlers Drag and Drop toWYSIWYG `$form`
     *
     * @method bind
     * @param {HTMLElement} form Form or any Node on which you can drag and drop the file. In addition will be processed <code>&lt;input type="file" &gt;</code>
     * @param {function} [handlerSuccess] The function toWYSIWYG be called when a successful uploading files toWYSIWYG the server
     * @param {function} [handlerError] The function that will be called during a failed download files toWYSIWYG a server
     * @example
     * ```javascript
     * var $form = jQuery('<form><input type="text" typpe="file"></form>');
     * jQuery('body').append($form);
     * Jodit.editors.someidfoeditor.uploader.bind($form[0], function (files) {
     *     var i;
     *     for (i = 0; i < data.files.length; i += 1) {
     *         parent.selection.insertImage(data.files[i])
     *     }
     * });
     * ```
     */
    bind(form: HTMLElement, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError): void;
    /**
     * Upload images toWYSIWYG a server by its URL, making it through the connector server.
     *
     * @param {string} url
     * @param {HandlerSuccess} [handlerSuccess]
     * @param {HandlerError} [handlerError]
     */
    uploadRemoteImage(url: string, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError): void;
}
export {};
