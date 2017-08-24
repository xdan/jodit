import Jodit from '../Jodit';
import {Config} from '../Config';
import {css, dom} from "../modules/Helpers";

declare module "../Config" {
    interface Config {
        iframe: boolean;
        iframeBaseUrl: false|string;
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
Config.prototype.iframeBaseUrl = false;

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
    '}' +
    'body{' +
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
    'body:after{' +
        'content:"";' +
        'clear:both;' +
        'display:block' +
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
 * Iframe plugin
 */
Jodit.plugins.iframe = function (editor: Jodit) {
    editor.events.on('createEditor', () => {
        if (!editor.options.iframe) {
            return;
        }
        editor.iframe = <HTMLIFrameElement>document.createElement("iframe");
        editor.iframe.style.display = 'block';
        editor.iframe.src = 'about:blank';
        editor.iframe.className = 'jodit_wysiwyg_iframe';
        editor.iframe.frameBorder = '0';

        editor.workplace.appendChild(editor.iframe);

        const doc = editor.iframe.contentWindow.document;
        editor.doc = doc;
        editor.win = editor.iframe.contentWindow;

        doc.open();
        doc.write(`<!DOCTYPE html>
                <html class="jodit">
                    <head>
                        ${editor.options.iframeBaseUrl ? `<base href="${editor.options.iframeBaseUrl}"/>` : ''}
                    </head>
                    <body class="jodit_wysiwyg" style="outline:none" contenteditable="true"></body>
                </html>`);

        doc.close();
        editor.editor = <HTMLBodyElement>doc.body;

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

        // css(editor.iframe, {
        //     width: editor.options.width === 'auto' ? '100%' : editor.options.width,
        //     height: editor.options.height,
        //     minHeight: editor.options.minHeight
        // });

        if (editor.options.height === 'auto') {
            doc.documentElement.style.overflowY = 'hidden';
            const resizeIframe = (e) => {
                css(editor.iframe, 'height', editor.editor.offsetHeight);
            };
            editor.events.on('change afterInit afterSetMode resize', resizeIframe);
            editor.__on([editor.iframe, editor.win, doc.documentElement], 'load', resizeIframe);
            editor.__on(doc, 'readystatechange DOMContentLoaded', resizeIframe);
        }

        css(editor.editor, 'minHeight', editor.options.minHeight);


        (function(e){
            e.matches || (e.matches = Element.prototype.matches); // fix inside iframe polifill
        })(editor.win['Element'].prototype);

        //proxy events
        editor.__on(editor.win, 'mousedown click mouseup mousemove scroll', (e: Event) => {
            editor.__fire && editor.__fire(window, e, document);
        });

        return false;
    });
}