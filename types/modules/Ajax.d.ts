/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { IViewBased } from "./view/type";
type AjaxOptions = {
    dataType?: string;
    method?: string;
    url?: string;
    data: {
        [key: string]: string;
    } | null | FormData | string;
    contentType?: string | false;
    headers?: {
        [key: string]: string;
    } | null;
    withCredentials?: boolean;
    queryBuild?: (this: Ajax, obj: string | {
        [key: string]: string | object;
    } | FormData, prefix?: string) => string | object;
    xhr?: () => XMLHttpRequest;
};
declare module "../Config" {
    interface Config {
        defaultAjaxOptions: AjaxOptions;
    }
}
export declare class Ajax {
    private __buildParams;
    private xhr;
    private success_response_codes;
    status: number;
    response: string;
    abort(): Ajax;
    options: AjaxOptions;
    jodit: IViewBased;
    constructor(editor: IViewBased, options: AjaxOptions);
    send(): Promise<any>;
}
export {};
