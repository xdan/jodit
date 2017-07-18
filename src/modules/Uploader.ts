import Jodit from '../jodit';
import Component from './Component';
import Ajax from './Ajax';
import config from '../config'
import {browser, extend, isPlainObject} from "./Helpers";
/**
 * Module for processing download documents and images by Drag and Drop
 *
 * @tutorial {@link http://xdsoft.net/jodit/doc/tutorial-uploader-settings.html|Uploader options and Drag and Drop files}
 * @module Uploader
 * @params {Object} parent Jodit main object
 */
/**
 * @property {boolean} enableDragAndDropFileToEditor=true Enable drag and drop file to editor
 * @memberof Jodit.defaultOptions
 */
config.enableDragAndDropFileToEditor = true;
/**
 * @property {object} uploader {@link module:Uploader|Uploader}'s settings
 * @property {string} uploader.url Point of entry for file uploader
 * @property {string} uploader.format='json' The format of the received data
 * @property {string} uploader.headers=null An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. See {@link module:Dom.defaultAjaxOptions|Dom.defaultAjaxOptions}
 * @property {function} uploader.prepareData Before send file will called this function. First argument it gets [new FormData ()](https://developer.mozilla.org/en/docs/Web/API/FormData), you can use this if you want add some POST parameter.
 * @property {plainobject|false} uploader.data=false POST parameters.
 * @example
 * new Jodit('#editor', {
 *      uploader: {
 *          prepareData: function (formdata) {
 *              formdata.append('id', 24); // $_POST['id'] on server
 *              formdata.append('name', 'Some parameter');  // $_POST['name'] on server
 *          }
 *      }
 * });
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
 * @memberof Jodit.defaultOptions
 * @tutorial uploader-settings
 * @example
 * new Jodit('#editor', {
 *     uploader: {
 *         url: 'connector/index.php?action=upload',
 *         format: 'json',
 *         headers: {
 *             'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 *         },
 *         prepareData: function (data) {
 *             data.append('id', 24); //
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
 *             this.events.fire('{@link event:errorMessage|errorMessage}', [e.getMessage(), 'error', 4000])
 *         }
 *     }
 * })
 */
type UploaderAnswer = {
    success: boolean,
    time: string,
    data: {
        messages?: string[],
        files?: string[],
        path?: string,
        baseurl?: string,
    }
};

config.uploader = {
    url: '',
    format: 'json',

    prepareData: function (this: Uploader, formData: FormData) {
        return formData;
    },

    isSuccess: function (this: Uploader, resp: UploaderAnswer) {
        return resp.success;
    },

    getMessage: function (this: Uploader, resp: UploaderAnswer) {
        return (resp.data.messages!== undefined && Array.isArray(resp.data.messages)) ? resp.data.messages.join(' ') : '';
    },

    process: function (this: Uploader, resp: UploaderAnswer) {
        return {
            files: resp.data.files || [],
            path: resp.data.path || '',
            baseurl: resp.data.baseurl || '',
        };
    },

    error: function (this: Uploader, e: Error) {
        this.parent.events.fire('errorMessage', [e.message, 'error', 4000]);
    },

    defaultHandlerSuccess:function (this: Uploader, data, resp: UploaderAnswer) {
        if (data.files && data.files.length) {
            data.files.forEach((image) => {
                this.parent.selection.insertImage(data.baseurl + image);
            })
        }
    },

    defaultHandlerError: function (this: Uploader, resp: UploaderAnswer) {
        this.parent.events.fire('errorMessage', [this.options.getMessage(resp)]);
    }
}

export default class Uploader extends Component {
    path = '';
    source = 'default';

    options;
    constructor(editor: Jodit, options) {
        super(editor);
        this.options = extend(true, {}, config.uploader, this.parent.options.uploader, options);
        if (this.parent.editor) {
            if (this.parent.options.enableDragAndDropFileToEditor && this.parent.options.uploader && this.parent.options.uploader.url) {
                this.bind(this.parent.editor);
            }
        }
    }

    buildData(data) {
        if (window['FormData'] !== undefined) {
            if (data instanceof FormData) {
                return data;
            }
            if (typeof data === 'string') {
                return data;
            }
            let newdata = new FormData(),
                key;

            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    newdata.append(key, data[key]);
                }
            }

            return newdata;
        }
        return data;
    }

    private __ajax: Ajax;

    send(data, success) {
        this.__ajax = new Ajax(this.parent, {
            xhr: () => {
                let xhr = new XMLHttpRequest();
                if (window['FormData'] !== undefined) {
                    xhr.upload.addEventListener("progress", (evt) => {
                        if (evt.lengthComputable) {
                            let percentComplete = evt.loaded / evt.total;
                            percentComplete = percentComplete * 100;

                            this.parent.progress_bar.style.display = 'block';
                            this.parent.progress_bar.style.width = percentComplete + '%';

                            if (percentComplete === 100) {
                                this.parent.progress_bar.style.display = 'none';
                            }
                        }
                    }, false);
                } else {
                    this.parent.progress_bar.style.display = 'none';
                }
                return xhr;
            },
            type: 'POST',
            data: this.buildData(data),
            url: this.options.url,
            headers: this.options.headers,

            contentType: (window['FormData'] !== undefined && typeof data !== 'string') ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
            dataType: this.options.format  || 'json',
        });

        this.__ajax.send()
            .then(success)
            .catch(error => {
                this.options.error.call(this, error);
            });
    }

    sendFiles(files, handlerSuccess, handlerError, process?: Function) {
        let len = files.length,
            i,
            form,
            extension,
            keys,
            uploader = this;

        if (!len) {
            return false;
        }

        form = new FormData();

        form.append('path', uploader.path);
        form.append('source', uploader.source);

        for (i = 0; i < len; i += 1) {
            extension = files[i].type.match(/\/([a-z0-9]+)/i)[1].toLowerCase();
            form.append("files[" + i + "]", files[i], files[i].name || Math.random().toString().replace('.', '') + '.' + extension);
        }

        uploader.options.prepareData(form);

        if (process) {
            process(form);
        }

        if (uploader.options.data && isPlainObject(uploader.options.data)) {
            keys = Object.keys(uploader.options.data);
            for (i = 0; i < keys.length; i += 1) {
                form.append(keys[i], uploader.options.data[keys[i]]);
            }
        }

        uploader.send(form, (resp) => {
            if (this.options.isSuccess.call(uploader, resp)) {
                if (typeof (handlerSuccess || uploader.options.defaultHandlerSuccess) === 'function') {
                    (handlerSuccess || uploader.options.defaultHandlerSuccess).call(uploader, uploader.options.process.call(uploader, resp), resp);
                }
            } else {
                if (typeof (handlerError || uploader.options.defaultHandlerError)) {
                    (handlerError || uploader.options.defaultHandlerError).call(uploader, resp);
                    return;
                }
            }
        });
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

    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        let byteString = atob(dataURI.split(',')[1]),
            // separate out the mime component
            mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0],
            // write the bytes of the string to an ArrayBuffer
            ab = new ArrayBuffer(byteString.length),
            i,
            ia = new Uint8Array(ab);

        for (i = 0; i < byteString.length; i += 1) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done

        return new Blob([ia], {type: mimeString});
    }

    /**
     * Set the handlers Drag and Drop to `$form`
     * @method bind
     * @param {HTMLElement|String} $form Form or any Node on which you can drag and drop the file. In addition will be processed <code>&lt;input type="file" &gt;</code>
     * @param {function} [handlerSuccess] The function to be called when a successful uploading files to the server
     * @param {function} [handlerError] The function that will be called during a failed download files to a server
     * @example
     * var $form = jQuery('<form><input type="text" typpe="file"></form>');
     * jQuery('body').append($form);
     * Jodit.editors.someidfoeditor.uploader.bind($form, function (files) {
     *     var i;
     *     for (i = 0; i < data.files.length; i += 1) {
     *         parent.selection.insertImage(data.files[i])
     *     }
     * });
     */

    bind(form: Element, handlerSuccess?: Function, handlerError?: Function) {
        let self = this;
        self
            .__on(form, 'paste',  function (e) {
                let i, file, extension, div, process = (formdata) => {
                    formdata.append('extension', extension);
                    formdata.append("mimetype", file.type);
                };

                // send data on server
                if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length) {
                    this.sendFiles(e.clipboardData.files, handlerSuccess, handlerError);
                    return false;
                }

                if (browser('ff')) {
                    if (!e.clipboardData.types.length && e.clipboardData.types[0] !== 'text/plain') {
                        div = this.parent.node.create('div');
                        this.parent.selection.insertNode(div);
                        div.focus();
                        setTimeout(() => {
                            if (div.firstChild && div.firstChild.hasAttribute('src')) {
                                let src = div.firstChild.getAttribute('src');
                                div.parentNode.removeChild(div);
                                this.sendFiles([this.dataURItoBlob(src)], handlerSuccess, handlerError);
                            }
                        }, 200);
                    }
                    return;
                }
                if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
                    for (i = 0; i < e.clipboardData.items.length; i += 1) {
                        if (e.clipboardData.items[i].kind === "file" && e.clipboardData.items[i].type === "image/png") {
                            file = e.clipboardData.items[i].getAsFile();
                            extension = file.type.match(/\/([a-z0-9]+)/i)[1].toLowerCase();
                            this.sendFiles([file], handlerSuccess, handlerError, process);
                            e.preventDefault();
                            break;
                        }
                    }
                }
            })
            .__on(form, "dragover", (event) => {
                form.classList.add('draghover');
                event.preventDefault();
            })
            .__on(form, "dragleave dragend", (event) => {
                form.classList.remove('draghover');
                event.preventDefault();
            })
            .__on(form, "drop", (event) => {
                form.classList.remove('draghover');
                if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
                    event.preventDefault();
                    this.sendFiles(event.dataTransfer.files, handlerSuccess, handlerError);
                } else if (event.dataTransfer && event.dataTransfer.getData('text/plain') && event.dataTransfer.getData('text/plain') !== '-' && form === this.parent.editor) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!this.parent.selection.insertCursorAtPoint(event.clientX, event.clientY)) {
                        return false;
                    }
                    if (handlerSuccess || this.options.defaultHandlerSuccess) {
                        let data = {baseurl: '', files: []};
                        data.files = [event.dataTransfer.getData('text/plain')];

                        (handlerSuccess || this.options.defaultHandlerSuccess).call(this, data);
                    }
                    event.preventDefault();
                }
            });

        if (form.querySelector('input[type=file]')) {
            self.__on(form.querySelector('input[type=file]'), 'change', function () {
                self.sendFiles(this.files, handlerSuccess, handlerError);
            });
        }

    }

    /**
     * Upload images to a server by its URL, making it through the connector server.
     *
     * @param {string} url
     * @param {function} [handlerSuccess]
     * @param {function} [handlerError]
     */
    uploadRemoteImage(url, handlerSuccess?: Function, handlerError?: Function) {
        let uploader = this;
        uploader.send({
            action: 'uploadremote',
            url: url
        }, (resp) => {
            if (uploader.options.isSuccess.call(uploader, resp)) {
                if (typeof handlerSuccess === 'function') {
                    handlerSuccess.call(uploader, resp, uploader.options.getMessage(resp));
                }
            } else {
                if (typeof (handlerError || uploader.options.defaultHandlerError) === 'function') {
                    (handlerError || this.options.defaultHandlerError).call(uploader, resp, uploader.options.getMessage(resp));
                    return;
                }
            }
        });
    }
}
