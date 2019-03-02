/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { defaultLanguage } from '../modules/helpers/defaultLanguage';
import { throttle } from '../modules/helpers/async';
import { css } from '../modules/helpers/css';
import { IJodit } from '../types';

declare module '../Config' {
    interface Config {
        iframeDefaultSrc: string;
        iframeBaseUrl: string;
        iframeStyle: string;
        iframeCSSLinks: string[];
    }
}

/**
 * Base URL where the root directory for {@link Jodit.defaultOptions.iframe|iframe} mode
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
 * });
 * ```
 */
Config.prototype.iframeBaseUrl = '';

/**
 * You can redefine default page
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeDefaultSrc: 'http://xdsoft.net/jodit/docs/',
 * });
 * ```
 */
Config.prototype.iframeDefaultSrc = 'about:blank';

/**
 * Custom style toWYSIWYG be used inside the iframe toWYSIWYG display content.
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeStyle: 'html{margin: 0px;}',
 * })
 * ```
 */

Config.prototype.iframeStyle =
    'html{' +
    'margin: 0px;' +
    'min-height: 100%;' +
    '}' +
    'body{' +
    'box-sizing: border-box;' +
    'font-size: 13px;' +
    '    line-height: 1.6;' +
    'padding:10px;' +
    'background:transparent;' +
    'color:#000;' +
    'position:' +
    'relative;' +
    'z-index: 2;' +
    'user-select:auto;' +
    'margin:0px;' +
    'overflow:auto;' +
    '}' +
    'table{' +
    'width:100%;' +
    'border: none;' +
    'border-collapse:collapse;' +
    'empty-cells: show;' +
    'max-width: 100%;' +
    '}' +
    'th,td{' +
    'padding: 2px 5px;' +
    'border:1px solid #ccc;' +
    '-webkit-user-select:text;' +
    '-moz-user-select:text;' +
    '-ms-user-select:text;' +
    'user-select:text' +
    '}' +
    'td[data-jodit-selected-cell],' +
    'th[data-jodit-selected-cell]{' +
    'border: 1px double #1e88e5' +
    '}' +
    'p{' +
    'margin-top:0;' +
    '}' +
    '.jodit_editor .jodit_iframe_wrapper{' +
    'display: block;' +
    'clear: both;' +
    'user-select: none;' +
    'position: relative;' +
    '}' +
    '.jodit_editor .jodit_iframe_wrapper:after {' +
    'position:absolute;' +
    'content:"";' +
    'z-index:1;' +
    'top:0;' +
    'left:0;' +
    'right: 0;' +
    'bottom: 0;' +
    'cursor: pointer;' +
    'display: block;' +
    'background: rgba(0, 0, 0, 0);' +
    '} ' +
    '.jodit_disabled{' +
    'user-select: none;' +
    '-o-user-select: none;' +
    '-moz-user-select: none;' +
    '-khtml-user-select: none;' +
    '-webkit-user-select: none;' +
    '-ms-user-select: none' +
    '}';

/**
 * Custom stylesheet files toWYSIWYG be used inside the iframe toWYSIWYG display content.
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeCSSLinks: ['styles/default.css'],
 * })
 * ```
 */

Config.prototype.iframeCSSLinks = [];

/**
 * Iframe plugin - use `iframe` instead of DIV in editor. It can be need when you want attach custom styles in editor
 * in backend of you system
 */
export function iframe(editor: IJodit) {
    editor.events
        .on('afterSetMode', () => {
            if (editor.isEditorMode()) {
                editor.selection.focus();
            }
        })
        .on(
            'generateDocumentStructure.iframe',
            (__doc: Document | undefined, jodit: IJodit) => {
                const doc: Document =
                    __doc ||
                    ((jodit.iframe as HTMLIFrameElement)
                        .contentWindow as Window).document;

                doc.open();
                doc.write(
                    '<!DOCTYPE html>' +
                        '<html dir="' +
                        jodit.options.direction +
                        '" class="jodit" ' +
                        'lang="' +
                        defaultLanguage(jodit.options.language) +
                        '">' +
                        '<head>' +
                        '<title>Jodit Editor</title>' +
                        (jodit.options.iframeBaseUrl
                            ? '<base href="' +
                              jodit.options.iframeBaseUrl +
                              '"/>'
                            : '') +
                        '</head>' +
                        '<body class="jodit_wysiwyg" style="outline:none" contenteditable="true"></body>' +
                        '</html>'
                );

                doc.close();

                if (jodit.options.iframeCSSLinks) {
                    jodit.options.iframeCSSLinks.forEach(href => {
                        const link: HTMLLinkElement = doc.createElement('link');
                        link.setAttribute('rel', 'stylesheet');
                        link.setAttribute('href', href);

                        doc.head && doc.head.appendChild(link);
                    });
                }

                if (jodit.options.iframeStyle) {
                    const style: HTMLStyleElement = doc.createElement('style');
                    style.innerHTML = jodit.options.iframeStyle;
                    doc.head && doc.head.appendChild(style);
                }
            }
        )
        .on('createEditor', async () => {
            if (!editor.options.iframe) {
                return;
            }

            delete editor.editor;

            editor.iframe = editor.ownerDocument.createElement(
                'iframe'
            ) as HTMLIFrameElement;

            editor.iframe.style.display = 'block';
            editor.iframe.src = 'about:blank';
            editor.iframe.className = 'jodit_wysiwyg_iframe';
            editor.iframe.setAttribute('allowtransparency', 'true');
            editor.iframe.setAttribute('tabindex', '0');
            editor.iframe.setAttribute('frameborder', '0');

            editor.workplace.appendChild(editor.iframe);

            await editor.events.fire(
                'generateDocumentStructure.iframe',
                null,
                editor
            );

            const doc: Document = (editor.iframe.contentWindow as Window)
                .document;
            editor.editorDocument = doc;
            editor.editorWindow = editor.iframe.contentWindow as Window;

            editor.create.inside.setDocument(doc);

            editor.editor = doc.body as HTMLBodyElement;

            if (editor.options.height === 'auto') {
                doc.documentElement &&
                    (doc.documentElement.style.overflowY = 'hidden');
                const resizeIframe = throttle(() => {
                    if (
                        editor.editor &&
                        editor.iframe &&
                        editor.options.height === 'auto'
                    ) {
                        css(
                            editor.iframe,
                            'height',
                            editor.editor.offsetHeight
                        );
                    }
                }, editor.defaultTimeout / 2);
                editor.events
                    .on('change afterInit afterSetMode resize', resizeIframe)
                    .on(
                        [
                            editor.iframe,
                            editor.editorWindow,
                            doc.documentElement,
                        ],
                        'load',
                        resizeIframe
                    )
                    .on(doc, 'readystatechange DOMContentLoaded', resizeIframe);
            }

            (e => {
                e.matches || (e.matches = Element.prototype.matches); // fix inside iframe polifill
            })((editor.editorWindow as any).Element.prototype);

            // throw events in our world
            if (editor.editorDocument.documentElement) {
                editor.events
                    .on(
                        editor.editorDocument.documentElement,
                        'mousedown touchend',
                        () => {
                            if (!editor.selection.isFocused()) {
                                editor.selection.focus();
                                editor.selection.setCursorIn(editor.editor);
                            }
                        }
                    )
                    .on(
                        editor.editorWindow,
                        'mousedown touchstart keydown keyup touchend click mouseup mousemove scroll',
                        (e: Event) => {
                            editor.events &&
                                editor.events.fire &&
                                editor.events.fire(editor.ownerWindow, e);
                        }
                    );
            }

            return false;
        });
}
