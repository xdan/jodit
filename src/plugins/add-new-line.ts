/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { debounce, setTimeout } from '../modules/helpers/async';
import { offset } from '../modules/helpers/size';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { IBound, IJodit } from '../types';

declare module '../Config' {
    interface Config {
        addNewLine: boolean;
        addNewLineTagsTriggers: string[];
        addNewLineOnDBLClick: boolean;
    }
}

/**
 * Create helper
 * @type {boolean}
 */
Config.prototype.addNewLine = true;

/**
 * On dbl click on empty space of editor it add new P element
 * @type {boolean}
 */
Config.prototype.addNewLineOnDBLClick = true;

/**
 * Whar kind of tags it will be impact
 * @type {string[]}
 */
Config.prototype.addNewLineTagsTriggers = [
    'table',
    'iframe',
    'img',
    'hr',
    'jodit',
];

/**
 * Create helper for adding new paragraph(Jodit.defaultOptions.enter tag) before iframe, table or image
 *
 * @param {Jodit} editor
 */

export function addNewLine(editor: IJodit) {
    if (!editor.options.addNewLine) {
        return;
    }

    const line: HTMLDivElement = editor.create.fromHTML(
        '<div role="button" tabIndex="-1" title="' +
            editor.i18n('Break') +
            '" class="jodit-add-new-line"><span>' +
            ToolbarIcon.getIcon('enter') +
            '</span></div>'
    ) as HTMLDivElement;

    const delta = 10;
    const isMatchedTag = new RegExp(
        '^(' + editor.options.addNewLineTagsTriggers.join('|') + ')$',
        'i'
    );

    let timeout: number;
    let hidden: boolean = false;
    let preview: boolean = false;
    let current: HTMLElement | false;

    let lineInFocus: boolean = false;

    const show = () => {
        if (editor.options.readonly || editor.isLocked()) {
            return;
        }

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
        lineInFocus = false;
        line.style.display = 'none';
        hidden = true;
    };

    const canGetFocus = (elm: Node | null): boolean => {
        return (
            elm !== null &&
            Dom.isBlock(elm, editor.editorWindow) &&
            !/^(img|table|iframe|hr)$/i.test(elm.nodeName)
        );
    };

    const hide = () => {
        if (hidden || lineInFocus) {
            return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(hideForce, 500);
    };

    editor.events
        .on('beforeDestruct', () => {
            Dom.safeRemove(line);
        })
        .on('afterInit', () => {
            editor.container.appendChild(line);
            editor.events
                .on(line, 'mousemove', (e: MouseEvent) => {
                    e.stopPropagation();
                })
                .on(line, 'mousedown touchstart', (e: MouseEvent) => {
                    const p: HTMLElement = editor.editorDocument.createElement(
                        editor.options.enter
                    );

                    if (preview && current && current.parentNode) {
                        current.parentNode.insertBefore(p, current);
                    } else {
                        editor.editor.appendChild(p);
                    }

                    editor.selection.setCursorIn(p);

                    editor.events.fire('synchro');
                    hideForce();
                    e.preventDefault();
                });
        })
        .on('afterInit', () => {
            editor.events
                .on(editor.editor, 'scroll', () => {
                    hideForce();
                })
                .on(editor.container, 'mouseleave', hide)
                .on(line, 'mouseenter', () => {
                    clearTimeout(timeout);
                    lineInFocus = true;
                })
                .on(line, 'mouseleave', () => {
                    lineInFocus = false;
                })
                .on(editor.editor, 'dblclick', (e: MouseEvent) => {
                    if (
                        !editor.options.readonly &&
                        editor.options.addNewLineOnDBLClick &&
                        e.target === editor.editor &&
                        editor.selection.isCollapsed()
                    ) {
                        const editorBound: IBound = offset(
                            editor.editor,
                            editor,
                            editor.editorDocument
                        );
                        const top: number =
                            e.pageY - editor.editorWindow.pageYOffset;
                        const p: HTMLElement = editor.editorDocument.createElement(
                            editor.options.enter
                        );

                        if (
                            Math.abs(top - editorBound.top) <
                                Math.abs(
                                    top - (editorBound.height + editorBound.top)
                                ) &&
                            editor.editor.firstChild
                        ) {
                            editor.editor.insertBefore(
                                p,
                                editor.editor.firstChild
                            );
                        } else {
                            editor.editor.appendChild(p);
                        }

                        editor.selection.setCursorIn(p);
                        editor.setEditorValue();
                        hideForce();
                        e.preventDefault();
                    }
                })
                .on(
                    editor.editor,
                    'mousemove',
                    debounce((e: MouseEvent) => {
                        let currentElement: HTMLElement = editor.editorDocument.elementFromPoint(
                            e.pageX - editor.editorWindow.pageXOffset,
                            e.pageY - editor.editorWindow.pageYOffset
                        ) as HTMLElement;

                        if (
                            currentElement &&
                            Dom.isOrContains(line, currentElement)
                        ) {
                            return;
                        }

                        if (
                            !currentElement ||
                            !Dom.isOrContains(editor.editor, currentElement)
                        ) {
                            return;
                        }

                        if (
                            !currentElement ||
                            !currentElement.nodeName.match(isMatchedTag) ||
                            !Dom.isOrContains(editor.editor, currentElement)
                        ) {
                            currentElement = Dom.closest(
                                currentElement,
                                isMatchedTag,
                                editor.editor
                            ) as HTMLElement;
                            if (!currentElement) {
                                hide();
                                return;
                            }
                        }

                        if (isMatchedTag.test(currentElement.nodeName)) {
                            const parentBox: Node | false = Dom.up(
                                currentElement,
                                node => Dom.isBlock(node, editor.editorWindow),
                                editor.editor
                            );
                            if (parentBox && parentBox !== editor.editor) {
                                currentElement = parentBox as HTMLElement;
                            }
                        }

                        const editorBound: IBound = offset(
                            editor.editor,
                            editor,
                            editor.editorDocument
                        );
                        const position: IBound = offset(
                            currentElement as HTMLElement,
                            editor,
                            editor.editorDocument
                        );

                        let top: false | number = false;

                        if (Math.abs(e.pageY - position.top) < delta) {
                            top = position.top;
                            if (top - editorBound.top >= 20) {
                                top -= 15;
                            }
                            preview = true;
                        }
                        if (
                            Math.abs(
                                e.pageY - (position.top + position.height)
                            ) < delta
                        ) {
                            top = position.top + position.height;
                            if (
                                editorBound.top + editorBound.height - top >=
                                25
                            ) {
                                top += 15;
                            }
                            preview = false;
                        }

                        if (
                            top !== false &&
                            ((preview &&
                                !Dom.prev(
                                    currentElement,
                                    canGetFocus,
                                    editor.editor
                                )) ||
                                (!preview &&
                                    !Dom.next(
                                        currentElement,
                                        canGetFocus,
                                        editor.editor
                                    )))
                        ) {
                            line.style.top = top + 'px';
                            current = currentElement;
                            show();
                        } else {
                            current = false;
                            hide();
                        }
                    }, editor.defaultTimeout)
                );
        });
}
