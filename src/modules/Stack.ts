/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Command} from "./Observer";

export class Stack {
    private commands: Command[] = [];
    private stackPosition: number = -1;
    private savePosition: number = -1;

    execute(command: Command) {
        this.__clearRedo();
        command.execute();
        this.commands.push(command);
        this.stackPosition += 1;
        this.changed();
    }

    undo() {
        if (this.commands[this.stackPosition]) {
            this.commands[this.stackPosition].undo();
        }
        this.stackPosition -= 1;
        this.changed();
    }

    canUndo (): boolean {
        return this.stackPosition >= 0;
    }

    redo () {
        this.stackPosition += 1;
        if (this.commands[this.stackPosition]) {
            this.commands[this.stackPosition].redo();
        }
        this.changed();
    }

    canRedo (): boolean {
        return this.stackPosition < this.commands.length - 1;
    }

    save () {
        this.savePosition = this.stackPosition;
        this.changed();
    }

    private __clearRedo() {
        this.commands.length = this.stackPosition + 1;
    }
    changed() {
        // do nothing, override
    }
}
