/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {IViewBased} from './Component';
import {Ajax} from './Ajax';
import {Config} from '../Config'
import {browser, dom, extend, isIE, isPlainObject} from "./Helpers";
import {TEXT_PLAIN} from "../constants";
import {Select} from "./Selection";

export type UploaderData = {
    messages?: string[],
    files?: string[],
    isImages?: boolean[],
    path?: string,
    baseurl?: string,
    newfilename?: string;
}

export type UploaderAnswer = {
    success: boolean,
    time: string,
    data: UploaderData
};

type HandlerSuccess = (resp: UploaderData) => void;
type HandlerError = (e: Error) => void;
type BuildDataResult = FormData | {[key: string]: string} | Promise<FormData | {[key: string]: string}> | string;

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
export type UploaderOptions = {
    url: string;
    insertImageAsBase64URI: boolean;
    imagesExtensions: string[];
    headers?: {[key: string]: string} | null,
    data: null|object,
    format: string;

    prepareData: (this: Uploader, formData: FormData) => any;
    buildData?: (this: Uploader, formData: any) => BuildDataResult;
    queryBuild?: (this: Ajax, obj: string | {[key: string] : string | object} | FormData, prefix?: string) => string | object;

    isSuccess: (this: Uploader, resp: UploaderAnswer) => boolean;

    getMessage: (this: Uploader, resp: UploaderAnswer) => string;

    process: (this: Uploader, resp: UploaderAnswer) => UploaderData;

    error: (this: Uploader, e: Error) => void;

    defaultHandlerSuccess:  HandlerSuccess;
    defaultHandlerError: HandlerError;

    contentType: (this: Uploader, requestData: any) => string | false;
}


declare module "../Config" {
    interface Config {
        enableDragAndDropFileToEditor: boolean;
        uploader: UploaderOptions
    }
}

/**
 * Module for processing download documents and images by Drag and Drop
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and Drag and Drop files}
 * @module Uploader
 * @params {Object} parent Jodit main object
 */
/**
 * @property {boolean} enableDragAndDropFileToEditor=true Enable drag and drop file toWYSIWYG editor
 */
Config.prototype.enableDragAndDropFileToEditor = true;


Config.prototype.uploader = <UploaderOptions>{
    url: '',
    insertImageAsBase64URI: false,
    imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
    headers: null,
    data: null,

    format: 'json',

    prepareData: function (this: Uploader, formData: FormData) {
        return formData;
    },

    isSuccess: function (this: Uploader, resp: UploaderAnswer): boolean {
        return resp.success;
    },

    getMessage: function (this: Uploader, resp: UploaderAnswer) {
        return (resp.data.messages!== undefined && Array.isArray(resp.data.messages)) ? resp.data.messages.join(' ') : '';
    },

    process: function (this: Uploader, resp: UploaderAnswer): UploaderData {
        return resp.data;
    },

    error: function (this: Uploader, e: Error) {
        this.jodit.events.fire('errorMessage', e.message, 'error', 4000);
    },

    defaultHandlerSuccess: function (this: Uploader, resp: UploaderData) {
        if (resp.files && resp.files.length) {
            resp.files.forEach((filename, index: number) => {
                const [tagName , attr]: string[] = (resp.isImages && resp.isImages[index]) ?   ['img', 'src'] : ['a', 'href'];
                const elm: HTMLElement = this.jodit.editorDocument.createElement(tagName);

                elm.setAttribute(attr, resp.baseurl + filename);

                if (tagName === 'a') {
                    elm.innerText = resp.baseurl + filename;
                }


                if (tagName === 'img') {
                    this.selection.insertImage(<HTMLImageElement>elm);
                } else {
                    this.selection.insertNode(elm);
                }
            })
        }
    },

    defaultHandlerError: function (this: Uploader, e: Error) {
        this.jodit.events.fire('errorMessage', e.message);
    },

    contentType: function (this: Uploader, requestData: any) {
        return ((<any>this.jodit.ownerWindow).FormData !== undefined && typeof requestData !== 'string') ? false : 'application/x-www-form-urlencoded; charset=UTF-8';
    }
};

export class Uploader {
    private path: string = '';
    private source: string = 'default';

    private options: UploaderOptions;
    jodit: IViewBased;
    selection: Select;

    constructor(editor: IViewBased, options?: UploaderOptions) {
        this.jodit = editor;
        this.selection = editor instanceof Jodit ? editor.selection : new Select(editor);

        this.options = <UploaderOptions>extend(
            true,
            {},
            Config.prototype.uploader,
            editor instanceof Jodit ? editor.options.uploader : null,
            options
        );

        if (editor instanceof Jodit && editor.options.enableDragAndDropFileToEditor && editor.options.uploader && (
            editor.options.uploader.url || editor.options.uploader.insertImageAsBase64URI
        )) {
            editor.events.on('afterInit', () => {
                this.bind(editor.editor);
            });
        }
    }

    buildData(data: FormData | {[key: string]: string} | string): BuildDataResult {
        if (this.options.buildData && typeof this.options.buildData === 'function') {
            return this.options.buildData.call(this, data);
        }

        if ((<any>this.jodit.ownerWindow).FormData !== undefined) {
            if (data instanceof FormData) {
                return data;
            }
            if (typeof data === 'string') {
                return data;
            }

            let newdata: FormData = new FormData();

            Object.keys(data).forEach((key) => {
                newdata.append(key, data[key]);
            });

            return newdata;
        }

        return data;
    }


    send(data: FormData | {[key: string]: string}, success: (resp: UploaderAnswer) => void): Promise<any> {
        const requestData: BuildDataResult = this.buildData(data),
            sendData = (request: FormData | {[key: string]: string} | string): Promise<any> => {
                const ajax: Ajax = new Ajax(this.jodit || this, {
                    xhr: () => {
                        const xhr: XMLHttpRequest = new XMLHttpRequest();

                        if ((<any>this.jodit.ownerWindow).FormData !== undefined && xhr.upload) {
                            xhr.upload.addEventListener("progress", (evt) => {
                                if (evt.lengthComputable) {
                                    let percentComplete = evt.loaded / evt.total;
                                    percentComplete = percentComplete * 100;

                                    this.jodit.progress_bar.style.display = 'block';
                                    this.jodit.progress_bar.style.width = percentComplete + '%';

                                    if (percentComplete === 100) {
                                        this.jodit.progress_bar.style.display = 'none';
                                    }
                                }
                            }, false);
                        } else {
                            this.jodit.progress_bar.style.display = 'none';
                        }

                        return xhr;
                    },
                    method: 'POST',
                    data: request,
                    url: this.options.url,
                    headers: this.options.headers,
                    queryBuild: this.options.queryBuild,
                    contentType: this.options.contentType.call(this, request),
                    dataType: this.options.format  || 'json',
                });

                return ajax.send()
                    .then(success)
                    .catch(error => {
                        this.options.error.call(this, error);
                    });
            };

        if (requestData instanceof Promise) {
            return requestData
                .then(sendData)
                .catch(error => {
                    this.options.error.call(this, error);
                });
        } else {
            return sendData(requestData);
        }
    }

    sendFiles(files: FileList | Array<File> | null, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError, process?: Function): Promise<any> {
        if (!files) {
            return Promise.reject(new Error('Need files'));
        }

        const uploader: Uploader = this;


        let fileList: File[] = [].slice.call(files);

        if (!fileList.length) {
            return Promise.reject(new Error('Need files'));
        }

        const promises: Promise<any>[] = [];

        if (this.options.insertImageAsBase64URI) {
            let file: File, i: number;
            for (i = 0; i < fileList.length; i += 1) {
                file = fileList[i];
                if (file && file.type) {
                    const mime: string[] = <string[]>file.type.match(/\/([a-z0-9]+)/i);
                    const extension: string = mime[1] ? mime[1].toLowerCase() : '';
                    if (this.options.imagesExtensions.indexOf(extension) !== - 1) {
                        const reader: FileReader  = new FileReader();
                        promises.push(new Promise<any>((resolve, reject) => {
                            reader.onerror = reject;
                            reader.onloadend = function () {
                                const resp: UploaderData = <UploaderData>{
                                    baseurl: '',
                                    files: [reader.result],
                                    isImages: [true],
                                };

                                if (typeof (handlerSuccess || uploader.options.defaultHandlerSuccess) === 'function') {
                                    (<HandlerSuccess>(handlerSuccess || uploader.options.defaultHandlerSuccess)).call(uploader, resp);
                                }

                                resolve(resp);
                            };
                            reader.readAsDataURL(file);
                        }));
                        (<any>fileList[i]) = null;
                    }
                }
            }
        }

        fileList = fileList.filter(a => a);

        if (fileList.length) {
            const form: FormData = new FormData();

            form.append('path', uploader.path);
            form.append('source', uploader.source);

            let file: File;
            for (let i = 0; i < fileList.length; i += 1) {
                file = fileList[i];
                if (file && file.type) {
                    const mime: string[] = <string[]>file.type.match(/\/([a-z0-9]+)/i);
                    const extension: string = mime[1] ? mime[1].toLowerCase() : '';
                    form.append("files[" + i + "]", fileList[i], fileList[i].name || Math.random().toString().replace('.', '') + '.' + extension);
                }
            }


            if (process) {
                process(form);
            }

            if (uploader.options.data && isPlainObject(uploader.options.data)) {
                Object.keys(uploader.options.data).forEach((key: string) => {
                    form.append(key, (<any>uploader.options.data)[key]);
                });
            }

            uploader.options.prepareData.call(this, form);

            promises.push(uploader
                .send(form, (resp: UploaderAnswer) => {
                    if (this.options.isSuccess.call(uploader, resp)) {
                        if (typeof (handlerSuccess || uploader.options.defaultHandlerSuccess) === 'function') {
                            (<HandlerSuccess>(handlerSuccess || uploader.options.defaultHandlerSuccess)).call(uploader, <UploaderData>uploader.options.process.call(uploader, resp));
                        }
                    } else {
                        if (typeof (handlerError || uploader.options.defaultHandlerError)) {
                            (<HandlerError>(handlerError || uploader.options.defaultHandlerError)).call(uploader, new Error(uploader.options.getMessage.call(uploader, resp)));
                            return;
                        }
                    }
                })
                .then(() => {
                    this.jodit.events && this.jodit.events.fire('filesWereUploaded');
                })
            );
        }

        return Promise.all(promises);
    }
    /**
     * It sets the path for uploading files
     * @method setPath
     * @param {string} path
     */
    setPath(path: string) {
        this.path = path;
    }

    /**
     * It sets the source for connector
     *
     * @method setSource
     * @param {string} source
     */
    setSource(source: string) {
        this.source = source;
    }

    /**
     * Convert dataURI to Blob
     *
     * @param {string} dataURI
     * @return {Blob}
     */
    static dataURItoBlob(dataURI: string): Blob {
        // convert base64 toWYSIWYG raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString: string = atob(dataURI.split(',')[1]),
            // separate out the mime component
            mimeString: string = dataURI.split(',')[0].split(':')[1].split(';')[0],
            // write the bytes of the string toWYSIWYG an ArrayBuffer
            ab: ArrayBuffer = new ArrayBuffer(byteString.length),
            i: number,
            ia: Uint8Array = new Uint8Array(ab);

        for (i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer toWYSIWYG a blob, and you're done

        return new Blob([ia], {type: mimeString});
    }



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

    bind(form: HTMLElement, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError) {
        const self: Uploader = this,
            onPaste = (e: ClipboardEvent): false | void => {
                let i: number,
                    file: File | null,
                    extension: string,
                    process = (formdata: FormData) => {
                        if (file) {
                            formdata.append('extension', extension);
                            formdata.append("mimetype", file.type);
                        }
                    };

                // send data on server
                if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length) {
                    this.sendFiles(e.clipboardData.files, handlerSuccess, handlerError);
                    return false;
                }

                if (browser('ff') || isIE()) {
                    if (e.clipboardData && (!e.clipboardData.types.length && e.clipboardData.types[0] !== TEXT_PLAIN)) {
                        const div: HTMLDivElement = <HTMLDivElement>dom('<div tabindex="-1" style="left: -9999px; top: 0; width: 0; height: 100%; line-height: 140%; overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;" contenteditable="true"></div>', this.jodit.ownerDocument);
                        this.jodit.ownerDocument.body.appendChild(div);

                        const selection = (this.jodit && this.jodit instanceof Jodit) ? this.jodit.selection.save() : null,
                            restore = () => selection && (this.jodit && this.jodit instanceof Jodit) && this.jodit.selection.restore(selection);

                        div.focus();

                        setTimeout(() => {
                            let child: HTMLDivElement|null = <HTMLDivElement>div.firstChild;
                            if (div.parentNode) {
                                div.parentNode.removeChild(div);
                            }

                            if (child && child.hasAttribute('src')) {
                                const src: string = child.getAttribute('src') || '';
                                restore();
                                self
                                    .sendFiles([<File>Uploader.dataURItoBlob(src)], handlerSuccess, handlerError);
                            }
                        }, 200);
                    }
                    return;
                }

                if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
                    for (i = 0; i < e.clipboardData.items.length; i += 1) {
                        if (e.clipboardData.items[i].kind === "file" && e.clipboardData.items[i].type === "image/png") {
                            file = e.clipboardData.items[i].getAsFile();
                            if (file) {
                                let mime: string[] = <string[]>file.type.match(/\/([a-z0-9]+)/i);
                                extension = mime[1] ? mime[1].toLowerCase() : '';
                                this.sendFiles([file], handlerSuccess, handlerError, process);
                            }
                            e.preventDefault();
                            break;
                        }
                    }
                }
            };

        if (this.jodit && this.jodit.editor !== form) {
            self.jodit.events
                .on(form, 'paste',  onPaste)
        } else {
            self.jodit.events
                .on('beforePaste',  onPaste)
        }

        const hasFiles = (event: DragEvent) : boolean => event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length !== 0;

        self.jodit.events
            .on(form,'dragend dragover dragenter dragleave drop', (e: DragEvent) => {
                e.preventDefault();
            })
            .on(form, "dragover", (event: DragEvent) => {
                if (hasFiles(event)) {
                    form.classList.contains('jodit_draghover') ||
                    form.classList.add('jodit_draghover');
                    event.preventDefault();
                }
            })
            .on(form, "dragend", (event: DragEvent) => {
                if (hasFiles(event)) {
                    form.classList.contains('jodit_draghover') && form.classList.remove('jodit_draghover');
                    event.preventDefault();
                }
            })
            .on(form, "drop", (event: DragEvent): false | void => {
                form.classList.remove('jodit_draghover');
                if (hasFiles(event)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.sendFiles(event.dataTransfer.files, handlerSuccess, handlerError);
                }
            });

        const inputFile: HTMLInputElement | null = form.querySelector('input[type=file]');

        if (inputFile) {
            self.jodit.events.on(inputFile, 'change', function (this: HTMLInputElement) {
                self.sendFiles(this.files, handlerSuccess, handlerError).then(() => {
                    inputFile.value = '';

                    if(!/safari/i.test(navigator.userAgent)){
                        inputFile.type = '';
                        inputFile.type = 'file'
                    }
                });
            });
        }

    }

    /**
     * Upload images toWYSIWYG a server by its URL, making it through the connector server.
     *
     * @param {string} url
     * @param {HandlerSuccess} [handlerSuccess]
     * @param {HandlerError} [handlerError]
     */
    uploadRemoteImage(url: string, handlerSuccess?: HandlerSuccess, handlerError?: HandlerError) {
        let uploader = this;
        uploader.send({
            action: 'fileUploadRemote',
            url: url
        }, (resp: UploaderAnswer) => {
            if (uploader.options.isSuccess.call(uploader, resp)) {
                if (typeof handlerSuccess === 'function') {
                    handlerSuccess.call(uploader, this.options.process.call(this, resp));
                } else {
                    this.options.defaultHandlerSuccess.call(uploader, this.options.process.call(this, resp));
                }
            } else {
                if (typeof (handlerError || uploader.options.defaultHandlerError) === 'function') {
                    (handlerError || this.options.defaultHandlerError).call(uploader, new Error(uploader.options.getMessage.call(this, resp)));
                    return;
                }
            }
        });
    }
}
