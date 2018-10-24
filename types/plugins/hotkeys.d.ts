/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
import { Component } from "../modules/Component";
declare module "../Config" {
    interface Config {
        commandToHotkeys: {
            [key: string]: string | string[];
        };
    }
}
/**
 * Allow set hotkey for command or button
 */
export declare class hotkeys extends Component {
    specialKeys: {
        [key: number]: string;
    };
    private onKeyPress;
    constructor(editor: Jodit);
}
