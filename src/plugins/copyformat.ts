/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { css } from '../modules/helpers/';
import { IDictionary, IJodit } from '../types';
import { IControlType } from '../types/toolbar';

const pluginKey: string = 'copyformat';

/**
 * Plug-in copy and paste formatting from elements
 *
 * @module copyformat
 */

const copyStyles: string[] = [
    'fontWeight',
    'fontStyle',
    'fontSize',
    'color',
    'margin',
    'padding',
    'borderWidth',
    'borderStyle',
    'borderColor',
    'borderRadius',
    'backgroundColor',
    'textDecorationLine',
    'fontFamily',
];

const getStyle = (
    editor: IJodit,
    key: string,
    box: HTMLElement,
    defaultStyles: IDictionary<string | number>
): string | number | undefined => {
    let result: string | number | undefined = css(box, key);

    // TODO need check 0 == "0" and another cases
    if (result === defaultStyles[key]) {
        if (
            box.parentNode &&
            box !== editor.editor &&
            box.parentNode !== editor.editor
        ) {
            result = getStyle(
                editor,
                key,
                box.parentNode as HTMLElement,
                defaultStyles
            );
        } else {
            result = void 0;
        }
    }

    return result;
};

const getStyles = (
    editor: IJodit,
    box: HTMLElement,
    defaultStyles: IDictionary<string | number>
): IDictionary<string | number | undefined> => {
    const result: IDictionary<string | number | undefined> = {};

    if (box) {
        copyStyles.forEach((key: string) => {
            result[key] = getStyle(editor, key, box, defaultStyles);
            if (key.match(/border(Style|Color)/) && !result.borderWidth) {
                result[key] = void 0;
            }
        });
    }

    return result;
};

Config.prototype.controls.copyformat = {
    exec: (editor: IJodit, current: Node | false) => {
        if (current) {
            if (editor.buffer[pluginKey]) {
                editor.buffer[pluginKey] = false;
                editor.events.off(editor.editor, 'mouseup.' + pluginKey);
            } else {
                const defaultStyles: IDictionary<string | number> = {},
                    box: HTMLElement =
                        (Dom.up(
                            current,
                            (elm: Node | null) =>
                                elm && elm.nodeType !== Node.TEXT_NODE,
                            editor.editor
                        ) as HTMLElement) || editor.editor;

                const ideal: HTMLElement = editor.create.inside.span();
                editor.editor.appendChild(ideal);

                copyStyles.forEach((key: string) => {
                    defaultStyles[key] = css(ideal, key);
                });

                if (ideal !== editor.editor) {
                    Dom.safeRemove(ideal);
                }

                const format: IDictionary<
                    string | number | undefined
                > = getStyles(editor, box, defaultStyles);

                const onMouseDown = () => {
                    editor.buffer[pluginKey] = false;
                    const currentNode:
                        | Node
                        | false = editor.selection.current();

                    if (currentNode) {
                        if (currentNode.nodeName === 'IMG') {
                            css(currentNode as HTMLElement, format);
                        } else {
                            editor.selection.applyCSS(format);
                        }
                    }

                    editor.events.off(editor.editor, 'mouseup.' + pluginKey);
                };

                editor.events.on(
                    editor.editor,
                    'mouseup.' + pluginKey,
                    onMouseDown
                );

                editor.buffer[pluginKey] = true;
            }
        }
    },

    isActive: (editor: IJodit): boolean => {
        return !!editor.buffer[pluginKey];
    },

    tooltip: 'Paint format',
} as IControlType;
