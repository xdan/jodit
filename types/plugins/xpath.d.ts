/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Plugin } from "../modules/Plugin";
import { ContextMenu } from "../modules/ContextMenu";
declare module "../Config" {
    interface Config {
        showXPathInStatusbar: boolean;
    }
}
/**
 * Show path to current element in status bar
 */
export declare class xpath extends Plugin {
    container: HTMLElement;
    menu: ContextMenu;
    private onContext;
    private onSelectPath;
    private tpl;
    private appendSelectAll;
    private calcPathImd;
    private calcPath;
    afterInit(): void;
}
