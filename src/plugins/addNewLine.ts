import Jodit from '../Jodit';
import {Config} from '../Config';
import {debounce, dom, offset} from "../modules/Helpers";
import Toolbar from "../modules/Toolbar";
import * as consts from '../constants';
import Dom from "../modules/Dom";

declare module "../Config" {
    interface Config {
        addNewLine: boolean;
        addNewLineTagsTriggers: string[];
    }
}

/**
 * Create helper
 * @type {boolean}
 */
Config.prototype.addNewLine = true;

/**
 * Whar kind of tags it will be impact
 * @type {string[]}
 */
Config.prototype.addNewLineTagsTriggers = ['table','iframe', 'img', 'hr', 'jodit'];

/**
 * Create helper for adding new paragraph(Jodit.defaultOptions.enter tag) before iframe, table or image
 *
 * @param {Jodit} editor
 */

Jodit.plugins.addNewLine = function (editor: Jodit) {
    if (!editor.options.addNewLine) {
        return;
    }

    const line: HTMLDivElement = <HTMLDivElement>dom('<div role="button" tabIndex="-1" title="' + editor.i18n("Break") + '" class="jodit-add-new-line"><span>' + Toolbar.getIcon('enter') + '</span></div>');
    const delta = 10;
    const isMatchedTag = new RegExp('^(' + editor.options.addNewLineTagsTriggers.join('|') + ')$', 'i');

    let timeout;
    let hidden: boolean = false;
    let preview: boolean = false;
    let current: HTMLElement|false;

    const show = () => {
        if (editor.container.classList.contains('jodit_popup_active')) {
            return;
        }
        clearTimeout(timeout);
        line.classList.toggle('jodit-add-new-line_after', !preview);
        line.style.display = 'block';
        line.style.width = editor.editor.clientWidth + 'px';
        hidden = false;
    };

    const hideForce = () => {
        clearTimeout(timeout);
        line.style.display = 'none';
        hidden = true;
    };
    const canGetFocus = (elm: HTMLElement): boolean => {
        return Dom.isBlock(elm) && !!elm.childNodes.length;
    };
    const hide = () => {
        if (hidden) {
            return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(hideForce, 500)
    };

    editor.events
        .on('afterInit', () => {
            editor.container.appendChild(line);
            editor
                .__on(line, 'mousemove', (e: MouseEvent) => {
                    e.stopPropagation();
                })
                .__on(line.querySelector('span'), 'mousedown touchstart', (e: MouseEvent) => {
                    const p: HTMLElement = editor.doc.createElement(editor.options.enter),
                        helper_node: Node = editor.doc.createTextNode(consts.INVISIBLE_SPACE);

                    p.appendChild(helper_node);

                    if (preview && current) {
                        editor.editor.insertBefore(p, current);
                    } else {
                        editor.editor.appendChild(p)
                    }

                    editor.selection.setCursorIn(p);

                    editor.setEditorValue();
                    hideForce();
                    e.preventDefault();
                })
        })
        .on('change afterInit afterSetMode', debounce(() => {
            editor
                .__on(editor.editor, 'scroll', () => {
                    hideForce();
                })
                .__on(editor.container, 'mouseleave', function (this: HTMLElement, e: MouseEvent) {
                    hide();
                })
                .__on(editor.editor, 'mousemove', debounce(function (this: HTMLElement, e: MouseEvent) {
                    let currentElement: HTMLElement = <HTMLElement>editor.doc.elementFromPoint(e.pageX - editor.win.pageXOffset, e.pageY - editor.win.pageYOffset);

                    if (!currentElement || currentElement === line || !Dom.isOrContains(editor.editor, currentElement)) {
                        return;
                    }

                    current = currentElement;

                    if (!current || !current.nodeName.match(isMatchedTag) || !Dom.isOrContains(editor.editor, current)) {
                        current = <HTMLElement>Dom.closest(current, isMatchedTag, editor.editor);
                        if (!current) {
                            hide();
                            return;
                        }
                    }


                    // const parentPosition = offset(<HTMLElement>editor.workplace, editor);
                    const position = offset(<HTMLElement>current, editor);
                    let top: false|number = false;

                    if (Math.abs(e.pageY - position.top) < delta) {
                        top = position.top;
                        preview = true;
                    }
                    if (Math.abs(e.pageY - (position.top + position.height)) < delta) {
                        top = position.top + position.height;
                        preview = false;
                    }

                    if (top !== false && ((preview && !Dom.prev(current, canGetFocus, editor.editor)) || (!preview && !Dom.next(current, canGetFocus, editor.editor)))) {
                        line.style.top = top + 'px';
                        show();
                    } else {
                        current = false;
                        hide();
                    }
                }, editor.options.observer.timeout));
        }, editor.options.observer.timeout));
};