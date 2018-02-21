/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {EventsNative} from "./EventsNative";




export interface IViewBased {
    progress_bar: HTMLElement;

    editorWindow: Window;
    editorDocument: Document;
    ownerDocument: Document;
    ownerWindow: Window;

    editor: HTMLElement;

    events: EventsNative;

    i18n: (text: string, ...params: Array<string|number>) => string;
}


export class Component {
    /**
     * @property{Jodit} jodit
     */
    jodit: Jodit;


    constructor(jodit?: IViewBased) {
        if (jodit) {
            this.jodit = <Jodit>jodit;
            if (this.jodit.components) {
                this.jodit.components.push(this);
            }
        }
    }

    destruct() {}
}