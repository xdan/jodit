/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
import { Component } from "../modules/Component";
declare module "../Config" {
    interface Config {
        /**
         * @type {boolean}
         * @example
         * ```javascript
         * var editor = new Jodit('#someid', {
         *  toolbarSticky: false
         * })
         * ```
         */
        toolbarSticky: boolean;
        toolbarDisableStickyForMobile: boolean;
        /**
         * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
         *
         * @example
         * ```javascript
         * var editor = new Jodit('#someid', {
         *  toolbarStickyOffset: 100
         * })
         * ```
         */
        toolbarStickyOffset: number;
    }
}
export declare class sticky extends Component {
    private isToolbarSticked;
    private dummyBox;
    private createDummy;
    addSticky: (toolbar: HTMLElement) => void;
    removeSticky: (toolbar: HTMLElement) => void;
    private isMobile;
    constructor(jodit: Jodit);
}
