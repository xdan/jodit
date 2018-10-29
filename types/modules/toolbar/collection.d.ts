/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { ToolbarElement } from "./element";
import { Buttons } from "./type";
import { IViewBased } from "../view/type";
export declare class ToolbarCollection extends ToolbarElement {
    constructor(jodit: IViewBased);
    private __buttons;
    getButtonsList(): string[];
    appendChild(button: ToolbarElement): void;
    removeChild(button: ToolbarElement): void;
    private __getControlType;
    build(buttons: Buttons, container: HTMLElement, target?: HTMLElement): void;
    clear(): void;
    immedateCheckActiveButtons: () => void;
    checkActiveButtons: (this: any) => void;
    private closeAll;
    private listenEvents;
    private initEvents;
    destruct(): void;
}
