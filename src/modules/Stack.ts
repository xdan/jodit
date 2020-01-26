/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Command } from './observer/command';

export class Stack {
	private commands: Command[] = [];
	private stackPosition: number = -1;

	private clearRedo() {
		this.commands.length = this.stackPosition + 1;
	}

	clear() {
		this.commands.length = 0;
		this.stackPosition = -1;
	}

	push(command: Command) {
		this.clearRedo();
		this.commands.push(command);
		this.stackPosition += 1;
	}

	undo(): boolean {
		if (this.canUndo()) {
			if (this.commands[this.stackPosition]) {
				this.commands[this.stackPosition].undo();
			}

			this.stackPosition -= 1;

			return true;
		}

		return false;
	}

	redo(): boolean {
		if (this.canRedo()) {
			this.stackPosition += 1;

			if (this.commands[this.stackPosition]) {
				this.commands[this.stackPosition].redo();
			}

			return true;
		}

		return false;
	}

	canUndo(): boolean {
		return this.stackPosition >= 0;
	}

	canRedo(): boolean {
		return this.stackPosition < this.commands.length - 1;
	}
}
