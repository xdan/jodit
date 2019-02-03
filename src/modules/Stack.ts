/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Command } from './observer/command';

export class Stack {
    private commands: Command[] = [];
    private stackPosition: number = -1;

    private clearRedo() {
        this.commands.length = this.stackPosition + 1;
    }

    public clear() {
        this.commands.length = 0;
        this.stackPosition = -1;
    }

    public push(command: Command) {
        this.clearRedo();
        this.commands.push(command);
        this.stackPosition += 1;
    }

    public undo(): boolean {
        if (this.canUndo()) {
            if (this.commands[this.stackPosition]) {
                this.commands[this.stackPosition].undo();
            }

            this.stackPosition -= 1;

            return true;
        }

        return false;
    }

    public redo(): boolean {
        if (this.canRedo()) {
            this.stackPosition += 1;

            if (this.commands[this.stackPosition]) {
                this.commands[this.stackPosition].redo();
            }

            return true;
        }

        return false;
    }

    public canUndo(): boolean {
        return this.stackPosition >= 0;
    }

    public canRedo(): boolean {
        return this.stackPosition < this.commands.length - 1;
    }
}
