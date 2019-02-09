/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { IDictionary } from '../types';
import { IViewBased } from '../types/view';
import { each, extend } from './helpers/';

/**
 * @property {object} defaultAjaxOptions A set of key/value pairs that configure the Ajax request. All settings
 * are optional
 * @property {object} defaultAjaxOptions.headers An object of additional header key/value pairs toWYSIWYG send along
 * with requests using the XMLHttpRequest transport. Uses in {@link module:FileBrowser|FileBrowser}
 * and {@link module:Uploader|Uploader}
 * @property {string} defaultAjaxOptions.dataType='json' json or text The type of data that you're expecting back
 * from the server. if `json` the return value passes through the `JSON.parse`
 * @property {string} defaultAjaxOptions.method='GET' The HTTP method toWYSIWYG use for the request
 * (e.g. "POST", "GET", "PUT")
 * @property {string} defaultAjaxOptions.url='' A string containing the URL toWYSIWYG which the request is sent.
 * @property {string} defaultAjaxOptions.async=true By default, all requests are sent asynchronously (i.e. this is
 * set toWYSIWYG true by default). If you need synchronous requests, set this option toWYSIWYG false
 * @property {object|string} defaultAjaxOptions.data=null Data toWYSIWYG be sent toWYSIWYG the server.
 * It is converted toWYSIWYG a query string, if not already a string. It's appended toWYSIWYG the url for GET-requests.
 * @property {string} defaultAjaxOptions.contentType='application/x-www-form-urlencoded; charset=UTF-8'
 * When sending data toWYSIWYG the server, use this content type. Default is "application/x-www-form-urlencoded;
 * charset=UTF-8", which is fine for most cases
 * @property {function} defaultAjaxOptions.error=function () {} A function toWYSIWYG be called if the request fails
 * @property {function} defaultAjaxOptions.success=function (resp) {} A function toWYSIWYG be called if the
 * request succeeds
 * @property {function} defaultAjaxOptions.xhr=function () { return new XMLHttpRequest(); } Callback for creating
 * the XMLHttpRequest object.
 */

declare const XDomainRequest: any;

export interface AjaxOptions {
    dataType?: string;
    method?: string;

    url?: string;

    data: IDictionary<string> | null | FormData | string;

    contentType?: string | false;

    headers?: IDictionary<string> | null;

    withCredentials?: boolean;

    queryBuild?: (
        this: Ajax,
        obj: string | IDictionary<string | object> | FormData,
        prefix?: string
    ) => string | FormData;

    xhr?: () => XMLHttpRequest;
}

declare module '../Config' {
    interface Config {
        defaultAjaxOptions: AjaxOptions;
    }
}

Config.prototype.defaultAjaxOptions = {
    dataType: 'json',
    method: 'GET',

    url: '',

    data: null,

    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

    headers: {
        'X-REQUESTED-WITH': 'XMLHttpRequest', // compatible with jQuery
    },

    withCredentials: true,

    xhr(): XMLHttpRequest {
        const XHR =
            typeof XDomainRequest === 'undefined'
                ? XMLHttpRequest
                : XDomainRequest;
        return new XHR();
    },
} as AjaxOptions;

export class Ajax {
    private readonly xhr: XMLHttpRequest;

    private success_response_codes = [200, 201, 202];
    private __buildParams(
        obj: string | IDictionary<string | object> | FormData,
        prefix?: string
    ): string | FormData {
        if (
            this.options.queryBuild &&
            typeof this.options.queryBuild === 'function'
        ) {
            return this.options.queryBuild.call(this, obj, prefix);
        }

        if (
            typeof obj === 'string' ||
            ((this.jodit.ownerWindow as any).FormData &&
                obj instanceof (this.jodit.ownerWindow as any).FormData)
        ) {
            return obj as string | FormData;
        }

        const str: string[] = [];
        let p: string, k: string, v: any;

        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                k = prefix ? prefix + '[' + p + ']' : p;
                v = (obj as IDictionary<string>)[p];
                str.push(
                    typeof v === 'object'
                        ? (this.__buildParams(v, k) as string)
                        : encodeURIComponent(k) +
                              '=' +
                              encodeURIComponent(v as string)
                );
            }
        }

        return str.join('&');
    }
    public status: number;
    public response: string;

    public options: AjaxOptions;
    public jodit: IViewBased;

    public abort(): Ajax {
        try {
            this.xhr.abort();
        } catch {}

        return this;
    }

    send(): Promise<any> {
        return new Promise(
            (
                resolve: (this: XMLHttpRequest, resp: object) => any,
                reject: (error: Error) => any
            ) => {
                const __parse = (resp: string): object => {
                    let result: object | null = null;

                    switch (this.options.dataType) {
                        case 'json':
                            result = JSON.parse(resp);
                            break;
                    }

                    if (!result) {
                        throw new Error('No JSON format');
                    }

                    return result;
                };

                this.xhr.onabort = () => {
                    reject(new Error(this.xhr.statusText));
                };
                this.xhr.onerror = () => {
                    reject(new Error(this.xhr.statusText));
                };
                this.xhr.ontimeout = () => {
                    reject(new Error(this.xhr.statusText));
                };
                this.xhr.onload = () => {
                    this.response = this.xhr.responseText;
                    this.status = this.xhr.status;
                    resolve.call(this.xhr, __parse(this.response) || {});
                };

                this.xhr.onreadystatechange = () => {
                    if (this.xhr.readyState === XMLHttpRequest.DONE) {
                        const resp = this.xhr.responseText;

                        this.response = resp;
                        this.status = this.xhr.status;

                        if (
                            this.success_response_codes.indexOf(
                                this.xhr.status
                            ) > -1
                        ) {
                            resolve.call(this.xhr, __parse(resp));
                        } else {
                            reject.call(
                                this.xhr,
                                new Error(
                                    this.xhr.statusText ||
                                        this.jodit.i18n('Connection error!')
                                )
                            );
                        }
                    }
                };

                this.xhr.withCredentials =
                    this.options.withCredentials || false;

                if (this.options.url) {
                    this.xhr.open(
                        this.options.method || 'get',
                        this.options.url,
                        true
                    );
                } else {
                    throw new Error('Need URL for AJAX request');
                }

                if (this.options.contentType && this.xhr.setRequestHeader) {
                    this.xhr.setRequestHeader(
                        'Content-type',
                        this.options.contentType
                    );
                }

                if (this.options.headers && this.xhr.setRequestHeader) {
                    each(this.options.headers, (key: string, value: string) => {
                        this.xhr.setRequestHeader(key, value);
                    });
                }

                // IE
                setTimeout(() => {
                    this.xhr.send(
                        this.options.data
                            ? this.__buildParams(this.options.data)
                            : undefined
                    );
                }, 0);
            }
        );
    }

    constructor(editor: IViewBased, options: AjaxOptions) {
        this.jodit = editor;
        this.options = extend(
            true,
            {},
            Config.prototype.defaultAjaxOptions,
            options
        ) as AjaxOptions;

        if (this.options.xhr) {
            this.xhr = this.options.xhr();
        }

        editor &&
            editor.events &&
            editor.events.on('beforeDestruct', () => {
                this.abort();
            });
    }
}
