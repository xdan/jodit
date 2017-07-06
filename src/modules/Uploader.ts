import Jodit from '../jodit';
import Component from './Component';
import config from '../config'
import {ajax, browser, isPlainObject} from "./Helpers";
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
 * @property {string} uploader.filesVariableName='files' Name for request variable. This name very important for server side. if filesVariableName='images' you need expect $_FILES['images']
 * @property {string} uploader.pathVariableName='path' Name for request variable. This variable will content relative path for uploading image
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
 * @property {function} uploader.getMsg If you need display a message use this
 * @property {function(data)} uploader.process The method of processing data received from the server. Must return this PlainObject format `{
 * {
 *     files: resp.files || [], // {array} The names of uploaded files. Field name uploader.filesVariableName
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
 *         pathVariableName: 'path',
 *         filesVariableName: 'files',
 *         prepareData: function (data) {
 *             data.append('id', 24); //
 *         },
 *         data: {
 *              csrf: document.querySelector('meta[name="csrf-token"]').getAttribute('content')
 *         }
 *         isSuccess: function (resp) {
 *             return !resp.error;
 *         },
 *         getMsg: function (resp) {
 *             return resp.msg;
 *         },
 *         process: function (resp) {
 *              return {
 *                  files: resp[this.options.uploader.filesVariableName] || [],
 *                  path: resp.path,
 *                  baseurl: resp.baseurl,
 *                  error: resp.error,
 *                  msg: resp.msg
 *              };
 *         },
 *        defaultHandlerSuccess: function (data, resp) {
 *            var i, field = this.options.uploader.filesVariableName;
 *            if (data[field] && data[field].length) {
 *                for (i = 0; i < data[field].length; i += 1) {
 *                    this.selection.insertImage(data.baseurl + data[field][i]);
 *                }
 *            }
 *         },
 *         error: function (e) {
 *             this.events.fire('{@link event:errorPopap|errorPopap}', [e.getMessage(), 'error', 4000])
 *         }
 *     }
 * })
 */
config.uploader = {
    url: '',
    format: 'json',
    pathVariableName: 'path',
    filesVariableName: 'files',
    data: false,

    prepareData: function (formdata) {
        return formdata;
    },
    isSuccess: function (resp) {
        return !resp.error;
    },
    getMsg: function (resp) {
        return resp.msg.join !== undefined ? resp.msg.join(' ') : resp.msg;
    },
    process: function (resp) {
        return {
            files: resp[this.options.uploader.filesVariableName] || [],
            path: resp.path,
            baseurl: resp.baseurl,
            error: resp.error,
            msg: resp.msg
        };
    },
    error: function (e) {
        this.events.fire('errorPopap', [e.getMessage(), 'error', 4000]);
    },
    defaultHandlerSuccess: function (data, resp) {
        var i, field = this.options.uploader.filesVariableName;
        if (data[field] && data[field].length) {
            for (i = 0; i < data[field].length; i += 1) {
                this.selection.insertImage(data.baseurl + data[field][i]);
            }
        }
    },
    defaultHandlerError: function (resp) {
        this.events.fire('errorPopap', [this.options.uploader.getMsg(resp)]);
    }
}

export default class Uploader extends Component {
    path = ''
    options;
    constructor(editor, options) {
        super(editor);
        this.options = options || this.parent.options.uploader
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

    send(data, success) {
        ajax({
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
            enctype: (window['FormData'] !== undefined && typeof data !== 'string') ? 'multipart/form-data' : 'application/x-www-form-urlencoded',
            data: this.buildData(data),
            url: this.options.url,
            headers: this.options.headers,
            cache: false,
            contentType: (window['FormData'] !== undefined && typeof data !== 'string') ? false : 'application/x-www-form-urlencoded; charset=UTF-8',
            processData: window['FormData'] === undefined || typeof data === 'string',
            dataType: this.options.format  || 'json',
            error: this.options.error.bind(this.parent),
            success: success
        });
    }

    sendFiles(files, handlerSuccess, handlerError, process?: Function) {
        let len = files.length, i, form, extension, keys;
        if (!len) {
            return false;
        }
        form = new FormData();

        form.append(this.options.pathVariableName, this.path);

        for (i = 0; i < len; i += 1) {
            extension = files[i].type.match(/\/([a-z0-9]+)/i)[1].toLowerCase();
            form.append(this.options.filesVariableName  + "[" + i + "]", files[i], files[i].name || Math.random().toString().replace('.', '') + '.' + extension);
        }

        this.options.prepareData(form);

        if (process) {
            process(form);
        }

        if (this.options.data && isPlainObject(this.options.data)) {
            keys = Object.keys(this.options.data);
            for (i = 0; i < keys.length; i += 1) {
                form.append(keys[i], this.options.data[keys[i]]);
            }
        }

        this.send(form, function (resp) {
            if (this.options.isSuccess.call(parent, resp)) {
                if (typeof (handlerSuccess || this.options.defaultHandlerSuccess) === 'function') {
                    (handlerSuccess || this.options.defaultHandlerSuccess).call(parent, this.options.process.call(parent, resp), resp);
                }
            } else {
                if (typeof (handlerError || this.options.defaultHandlerError)) {
                    (handlerError || this.options.defaultHandlerError).call(parent, resp);
                    return;
                }
            }
        });
    }
    /**
     * It sets the path for uploading files
     * @method setPath
     * @param {string} newpath
     */
    setPath(newpath) {
        this.path = newpath;
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
                if (event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.files && event.originalEvent.dataTransfer.files.length) {
                    event.preventDefault();
                    this.sendFiles(event.originalEvent.dataTransfer.files, handlerSuccess, handlerError);
                } else if (event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.getData('text/plain') && event.originalEvent.dataTransfer.getData('text/plain') !== '-' && form === this.parent.editor) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!this.parent.selection.insertCursorAtPoint(event.originalEvent.clientX, event.originalEvent.clientY)) {
                        return false;
                    }
                    if (handlerSuccess || this.options.defaultHandlerSuccess) {
                        let data = {baseurl: ''};
                        data[this.parent.options.uploader.filesVariableName] = [event.originalEvent.dataTransfer.getData('text/plain')];

                        (handlerSuccess || this.options.defaultHandlerSuccess).call(parent, data);
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
        this.send({
            action: 'uploadremote',
            url: url
        }, (resp) => {
            if (this.options.isSuccess.call(parent, resp)) {
                if (typeof handlerSuccess === 'function') {
                    handlerSuccess.call(parent, resp, this.options.getMsg(resp));
                }
            } else {
                if (typeof (handlerError || this.options.defaultHandlerError) === 'function') {
                    (handlerError || this.options.defaultHandlerError).call(this.parent, resp, this.options.getMsg(resp));
                    return;
                }
            }
        });
    }
    init() {
        if (this.parent.editor) {
            if (this.parent.options.enableDragAndDropFileToEditor && this.parent.options.uploader && this.parent.options.uploader.url) {
                this.bind(this.parent.editor);
            }
        }
    };
}
