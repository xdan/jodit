/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
/// <reference types="ace" />
import { Jodit } from '../Jodit';
import { Component } from "../modules/Component";
declare module "../Config" {
    interface Config {
        /**
         * Use ACE editor instead of usual textarea
         */
        useAceEditor: boolean;
        /**
         * Options for [ace](https://ace.c9.io/#config) editor
         */
        sourceEditorNativeOptions: {
            showGutter: boolean;
            theme: string;
            mode: string;
            wrap: string | boolean | number;
            highlightActiveLine: boolean;
        };
        /**
         * Beautify HTML then it possible
         */
        beautifyHTML: boolean;
        /**
         * CDN URLs for HTML Beautifier
         */
        beautifyHTMLCDNUrlsJS: string[];
        /**
         * CDN URLs for ACE editor
         */
        sourceEditorCDNUrlsJS: string[];
    }
}
/**
 * Plug-in change simple textarea on CodeMirror editor in Source code mode
 *
 * @module source
 */
export declare class source extends Component {
    private className;
    private loadNext;
    private mirrorContainer;
    mirror: HTMLTextAreaElement;
    private insertHTML;
    private __lock;
    private __oldMirrorValue;
    private fromWYSIWYG;
    private toWYSIWYG;
    private autosize;
    private getNormalPosition;
    aceEditor: AceAjax.Editor;
    constructor(editor: Jodit);
    private tempMarkerStart;
    private tempMarkerStartReg;
    private tempMarkerEnd;
    private tempMarkerEndReg;
    private __clear;
    private selInfo;
    private selectAll;
    private onSelectAll;
    private getSelectionStart;
    private getSelectionEnd;
    private getMirrorValue;
    private setMirrorValue;
    private setFocusToMirror;
    setMirrorSelectionRange: (start: number, end: number) => void;
    private saveSelection;
    private restoreSelection;
    private replaceMirrorToACE;
}
