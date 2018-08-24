/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
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
