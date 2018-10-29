/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { ToolbarButton } from "./button";
/**
 * Class create tooltip for buttons in toolbar
 */
export declare class Tooltip {
    readonly button: ToolbarButton;
    container: HTMLElement;
    private timeout;
    private show;
    private hide;
    constructor(button: ToolbarButton);
}
