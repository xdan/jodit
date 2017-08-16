import Jodit from '../Jodit';
import {Config} from '../Config'
import {css, dom} from "../modules/Helpers";
import Toolbar from "../modules/Toolbar";

/**
 * Fullsize plugin
 *
 * @module Fullsize
 */

/**
* @prop {boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
* @prop {boolean} globalFullsize=true if true, after `fullsize` -  all editors element get jodit_fullsize_box class (z-index: 100000 !important;)
* @memberof Jodit.defaultOptions
* @example
* var editor = new jodit({
*     fullsize: true // fullsize editor
* });
* @example
* var editor = new Jodit();
* editor.events.fire('toggleFullsize');
* editor.events.fire('toggleFullsize', [true]); // fullsize
* editor.events.fire('toggleFullsize', [false]); // usual mode
*/

declare module "../Config" {
    interface Config {
        fullsize: boolean;
        globalFullsize: boolean;
    }
}

Config.prototype.fullsize = false;
Config.prototype.globalFullsize = true;


Jodit.plugins.fullsize = function (editor: Jodit) {
    let shown = false,
        resize  = () => {
            if (shown) {
                css(editor.container, {
                    height: window.innerHeight,
                    width: window.innerWidth
                });
            } else {
                css(editor.container, {
                    height: null,
                    width: null
                });
            }
        },
        toggle = (condition) => {
            if (condition === undefined) {
                condition = !editor.container.classList.contains('jodit_fullsize');
            }

            shown = condition;

            editor.container.classList.toggle('jodit_fullsize', condition);

            if (editor.toolbar) {
                css(editor.toolbar.container, 'width', 'auto');
                let icon = dom(Toolbar.getIcon(condition ? 'shrink' : 'fullsize')),
                    a = editor.toolbar.container.querySelector('.jodit_toolbar_btn-fullsize a');
                if (a) {
                    icon.classList.add('jodit_icon');
                    a.innerHTML = '';
                    a.appendChild(icon);
                }
            }

            if (editor.options.globalFullsize) {
                let node = <HTMLElement>editor.container.parentNode;
                while (node && !(node instanceof Document)) {
                    node.classList.toggle('jodit_fullsize_box', condition);
                    node = <HTMLElement>node.parentNode;
                }
                resize();
            }

            editor.events.fire('afterResize');
        };

    if (editor.options.fullsize) {
        editor.events.on('afterInit', () => {
            toggle(true);
        });
    }

    if (editor.options.globalFullsize) {
        editor.__on(window, 'resize', resize);
    }

    editor.events.on('toggleFullsize', toggle);
    editor.events.on('beforeDestruct', () => {
        toggle(false);
    });
};
