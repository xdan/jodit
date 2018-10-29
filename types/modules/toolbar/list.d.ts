/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { ToolbarPopup } from "./popup";
import { ToolbarCollection } from "./collection";
import { ControlTypeStrong } from "./type";
import { IViewBased } from "../view/type";
export declare class ToolbarList extends ToolbarPopup {
    readonly target: HTMLElement;
    readonly current?: HTMLElement | undefined;
    readonly className: string;
    private defaultControl;
    constructor(jodit: IViewBased, target: HTMLElement, current?: HTMLElement | undefined, className?: string);
    protected doClose(): void;
    toolbar: ToolbarCollection;
    protected getContainer: () => HTMLElement;
    protected doOpen(control: ControlTypeStrong): void;
}
