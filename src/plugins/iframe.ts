/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config';
import {css, defaultLanguage, dom, throttle} from "../modules/Helpers";

declare module "../Config" {
    interface Config {
        iframe: boolean;
        iframeBaseUrl: string;
        iframeStyle: string;
        iframeCSSLinks: string[];
    }
}

/**
 * When this option is enabled, the editor's content will be placed in an iframe and isolated from the rest of the page.
 *
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe = true;
 *    iframeStyle = 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}';
 * });
 * ```
 */
Config.prototype.iframe = false;

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
 * Custom style toWYSIWYG be used inside the iframe toWYSIWYG display content.
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *    iframe: true,
 *    iframeStyle: 'html{margin: 0px;}',
 * })
 * ```
 */

Config.prototype.iframeStyle = 'html{' +
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

Config.prototype.iframeCSSLinks  = [];

/**
 * Iframe plugin - use `iframe` instead of DIV in editor. It can be need when you want attach custom styles in editor in backend of you system
 */
export function iframe(editor: Jodit) {
    editor.events
        .on('afterSetMode', () => {
            if (editor.isEditorMode()) {
                editor.selection.focus();
            }
        })
        .on('generateDocumentStructure.iframe', (doc: Document) => {
            doc.open();
            doc.write(`<!DOCTYPE html>
                    <html dir="${editor.options.direction}" class="jodit" lang="${defaultLanguage(editor.options.language)}">
                        <head>
                            ${editor.options.iframeBaseUrl ? `<base href="${editor.options.iframeBaseUrl}"/>` : ''}
                        </head>
                        <body class="jodit_wysiwyg" style="outline:none" contenteditable="true"></body>
                    </html>`);

            doc.close();

            if (editor.options.iframeCSSLinks) {
                editor.options.iframeCSSLinks.forEach((href) => {
                    const link: HTMLLinkElement = <HTMLLinkElement>dom('<link rel="stylesheet" href="' + href + '">', doc);
                    doc.head.appendChild(link);
                });
            }

            if (editor.options.iframeStyle) {
                const style: HTMLStyleElement = doc.createElement('style');
                style.innerHTML = editor.options.iframeStyle;
                doc.head.appendChild(style);
            }

        })
        .on('createEditor', () => {
            if (!editor.options.iframe) {
                return;
            }

            editor.iframe = <HTMLIFrameElement>editor.ownerDocument.createElement("iframe");
            editor.iframe.style.display = 'block';
            editor.iframe.src = 'about:blank';
            editor.iframe.className = 'jodit_wysiwyg_iframe';
            editor.iframe.frameBorder = '0';
            editor.iframe.setAttribute('allowtransparency', 'true');
            editor.iframe.setAttribute('tabindex', '0');
            editor.iframe.setAttribute('frameborder', '0');

            editor.workplace.appendChild(editor.iframe);

            const doc: Document = (<Window>editor.iframe.contentWindow).document;

            editor.events.fire('generateDocumentStructure.iframe', doc);

            editor.editorDocument = doc;
            editor.editorWindow = <Window>editor.iframe.contentWindow;

            editor.editor = <HTMLBodyElement>doc.body;


            if (editor.options.height === 'auto') {
                doc.documentElement.style.overflowY = 'hidden';
                const resizeIframe = throttle(() => {
                    if (editor.editor && editor.iframe && editor.options.height === 'auto') {
                        css(editor.iframe, 'height', editor.editor.offsetHeight);
                    }
                }, editor.defaultTimeout / 2);
                editor.events
                    .on('change afterInit afterSetMode resize', resizeIframe)
                    .on([editor.iframe, editor.editorWindow, doc.documentElement], 'load', resizeIframe)
                    .on(doc, 'readystatechange DOMContentLoaded', resizeIframe);
            }


            (function(e){
                e.matches || (e.matches = Element.prototype.matches); // fix inside iframe polifill
            })((<any>editor.editorWindow).Element.prototype);

            //throw events in our word
            editor.events
                .on(editor.editorDocument.documentElement, 'mousedown touchend', () => {
                    if (!editor.selection.isFocused()) {
                        editor.selection.focus();
                        editor.selection.setCursorIn(editor.editor);
                    }
                })
                .on(editor.editorWindow, 'mousedown touchstart keydown keyup touchend click mouseup mousemove scroll', (e: Event) => {
                    editor.events && editor.events.fire && editor.events.fire(window, e);
                });

            return false;
        });
}