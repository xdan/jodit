/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from './Component';
import { IViewBased } from "./view/type";
declare type Action = {
    icon?: string;
    title?: string;
    exec?: (this: ContextMenu, e: MouseEvent) => false | void;
};
/**
 * Module to generate context menu
 *
 * @module ContextMenu
 * @param {Object} parent Jodit main object
 */
export declare class ContextMenu extends Component {
    private context;
    constructor(editor: IViewBased);
    destruct(): void;
    /**
     * Hide context menu
     *
     * @method hide
     */
    hide: () => void;
    /**
     * Generate and show context menu
     *
     * @method show
     * @param {number} x Global coordinate by X
     * @param {number} y Global coordinate by Y
     * @param {Action[]} actions Array with plainobjects {icon: 'bin', title: 'Delete', exec: function () { do smth}}
     * @example
     * ```javascript
     * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
     * ```
     */
    show(x: number, y: number, actions: Array<false | Action>, zIndex?: number): void;
}
export {};
