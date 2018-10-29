/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { ToolbarElement } from "./element";
import { IViewBased } from "../view/type";
export declare class ToolbarPopup extends ToolbarElement {
    readonly target: HTMLElement;
    readonly current?: HTMLElement | undefined;
    readonly className: string;
    constructor(jodit: IViewBased, target: HTMLElement, current?: HTMLElement | undefined, className?: string);
    destruct(): void;
    isOpened: boolean;
    protected doOpen(content: any): void;
    /**
     * @param {HTMLElement} content
     * @param {boolean} [rightAlign=false] Open popup on right side
     * @param {boolean} [noStandartActions=false] No call standarts action
     */
    open(content: any, rightAlign?: boolean, noStandartActions?: boolean): void;
    protected getContainer: () => HTMLElement;
    private calcPosition;
    protected doClose(): void;
    close: (current?: HTMLElement | ToolbarPopup | undefined) => void;
}
