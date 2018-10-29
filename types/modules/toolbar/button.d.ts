/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { ToolbarElement } from "./element";
import { ControlTypeStrong } from "./type";
import { IViewBased } from "../view/type";
export declare class ToolbarButton extends ToolbarElement {
    readonly control: ControlTypeStrong;
    readonly target: HTMLElement | undefined;
    private __disabled;
    disable: boolean;
    private __actived;
    active: boolean;
    private checkActiveStatus;
    isDisable(): boolean;
    isActive(): boolean;
    destruct(): void;
    textBox: HTMLSpanElement;
    anchor: HTMLAnchorElement;
    private tooltip;
    onMouseDown: (originalEvent: MouseEvent) => false | void;
    constructor(jodit: IViewBased, control: ControlTypeStrong, target?: HTMLElement);
}
