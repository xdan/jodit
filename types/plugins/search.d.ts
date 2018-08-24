/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
import { Component } from "../modules/index";
declare module "../Config" {
    interface Config {
        /**
         * Enable custom search plugin ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
         */
        useSearch: boolean;
    }
}
/**
 * Search plugin. it is used for custom search in text
 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
 *
 * @example
 * ```typescript
 * var jodit = new Jodit('#editor', {
 *  useSearch: false
 * });
 * // or
 * var jodit = new Jodit('#editor', {
 *  disablePlugins: 'search'
 * });
 * ```
 */
export declare class search extends Component {
    private template;
    searchBox: HTMLDivElement;
    queryInput: HTMLInputElement;
    replaceInput: HTMLInputElement;
    closeButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    prevButton: HTMLButtonElement;
    replaceButton: HTMLButtonElement;
    counterBox: HTMLSpanElement;
    private eachMap;
    static getSomePartOfStringIndex(needle: string, haystack: string, start?: boolean): number | false;
    static findSomePartOfString(needle: string, haystack: string, start?: boolean, getIndex?: boolean): boolean | string | number;
    private updateCounters;
    private boundAlreadyWas;
    calcCounts: (query: string, current?: false | SelectionRange) => [number, number];
    private tryScrollToElement;
    findAndReplace: (start: Node | null, query: string) => boolean;
    findAndSelect: (start: Node | null, query: string, next: boolean) => boolean;
    find: (start: Node | null, query: string, next: boolean, deep: number, range: Range) => false | SelectionRange;
    private isOpened;
    open: (searchAndReplace?: boolean) => void;
    private selInfo;
    private current;
    close: () => void;
    constructor(editor: Jodit);
}
