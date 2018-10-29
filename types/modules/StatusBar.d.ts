/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Component } from "./Component";
import { Jodit } from "../Jodit";
export declare class StatusBar extends Component {
    readonly target: HTMLElement;
    container: HTMLElement;
    hide(): void;
    show(): void;
    constructor(jodit: Jodit, target: HTMLElement);
    append(child: HTMLElement, inTheRight?: boolean): void;
    destruct(): void;
}
