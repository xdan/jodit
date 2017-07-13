import Jodit from "../jodit"
import config from '../config'
import {each} from "./Helpers";
import Component from "./Component";

/**
 * @property {object} defaultAjaxOptions A set of key/value pairs that configure the Ajax request. All settings are optional
 * @memberof module:Dom
 * @property {object} defaultAjaxOptions.headers An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. Uses in {@link module:FileBrowser|FileBrowser} and {@link module:Uploader|Uploader}
 * @property {string} defaultAjaxOptions.dataType='json' json or text The type of data that you're expecting back from the server. if `json` the return value passes through the `JSON.parse`
 * @property {string} defaultAjaxOptions.type='GET' The HTTP method to use for the request (e.g. "POST", "GET", "PUT")
 * @property {string} defaultAjaxOptions.url='' A string containing the URL to which the request is sent.
 * @property {string} defaultAjaxOptions.async=true By default, all requests are sent asynchronously (i.e. this is set to true by default). If you need synchronous requests, set this option to false
 * @property {object|string} defaultAjaxOptions.data=null Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests.
 * @property {string} defaultAjaxOptions.contentType='application/x-www-form-urlencoded; charset=UTF-8' When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases
 * @property {function} defaultAjaxOptions.error=function () {} A function to be called if the request fails
 * @property {function} defaultAjaxOptions.success=function (resp) {} A function to be called if the request succeeds
 * @property {function} defaultAjaxOptions.xhr=function () { return new XMLHttpRequest(); } Callback for creating the XMLHttpRequest object.
 * @memberof Jodit.defaultOptions
 */
config.defaultAjaxOptions = {
    dataType: 'json',
    type: 'GET',
    url: '',
    async: true,
    data: null,
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    headers: {},

    error: false,
    success: false,
    withCredentials: true,

    xhr: () => {
        return new XMLHttpRequest();
    }
}

export default class Ajax extends Component{
    buildParams (obj, prefix?: string) {
        if (typeof obj === 'string' || obj instanceof window['FormData']) {
            return obj;
        }
        let str = [], p, k, v;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                k = prefix ? prefix + "[" + p + "]" : p;
                v = obj[p];
                str.push(typeof v === "object" ? this.buildParams(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }
    private xhr: XMLHttpRequest;
    status: number;
    response: string;
    is_done = false;
    is_error = false;

    private __done = function () {};
    private __error = function () {};
    private __fire_done() {
        if (this.is_done && this.__done) {
            this.__done.call(this.xhr, this.response, this.status);
        }
    }
    private __fire_error(){
        if (this.is_error && this.__error) {
            this.__error.call(this.xhr, this.response, this.status);
        }
    }

    done(handler){
        this.__done = handler;
        this.__fire_done();
    }
    error(handler) {
        this.__error = handler;
        this.__fire_error();
    }
    abort(){
        this.xhr.abort();
    }
    constructor(editor: Jodit, opt?: any) {
        super(editor);
        let options = {...editor.options.defaultAjaxOptions,  ...opt};

        this.xhr = options.xhr();

        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState === XMLHttpRequest.DONE) {
                let resp = this.xhr.responseText;
                if (this.xhr.status === 200) {
                    switch (options.dataType) {
                        case 'json':
                            try {
                                resp = JSON.parse(resp);
                            } catch (e) {
                                if (options.error && typeof options.error === 'function') {
                                    options.error(this.xhr,this. xhr.status);
                                }

                                return;
                            }
                            break;
                    }

                    if (options.success && typeof options.success === 'function') {
                        options.success(resp);
                    }

                    this.response = resp;
                    this.status = this.xhr.status;
                    this.is_done = true;
                    this.__fire_done();
                } else {
                    if (options.error && typeof options.error === 'function') {
                        options.error(this.xhr, this.xhr.status);
                    }
                    this.response = resp;
                    this.status = this.xhr.status;
                    this.is_error = true;
                    this.__fire_error();
                }
            }
        };

        this.xhr.withCredentials = !!options.withCredentials;

        this.xhr.open(options.type, options.url, options.async);
        this.xhr.setRequestHeader('X-REQUESTED-WITH', 'XMLHttpRequest');

        if (options.contentType) {
            this.xhr.setRequestHeader("Content-type", options.contentType);
        }

        if (options.headers) {
            each(options.headers, (key, value) => {
                this.xhr.setRequestHeader(key, value);
            });
        }

        if (options.data) {
            this.xhr.send(this.buildParams(options.data));
        }
    }
}