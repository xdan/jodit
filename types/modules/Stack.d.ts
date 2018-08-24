/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Command } from "./Observer";
export declare class Stack {
    private commands;
    private stackPosition;
    private clearRedo;
    clear(): void;
    push(command: Command): void;
    undo(): boolean;
    redo(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
}
