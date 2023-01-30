/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/history
 */

import type { CanUndef, IStack } from 'jodit/types';
import type { Command } from './command';

export class Stack implements IStack {
	private readonly __commands: Command[] = [];
	private __stackPosition: number = -1;

	constructor(private readonly __size: number) {}

	get length(): number {
		return this.__commands.length;
	}

	private __clearRedo(): void {
		this.__commands.length = this.__stackPosition + 1;
	}

	clear(): void {
		this.__commands.length = 0;
		this.__stackPosition = -1;
	}

	push(command: Command): void {
		this.__clearRedo();
		this.__commands.push(command);
		this.__stackPosition += 1;

		if (this.__commands.length > this.__size) {
			this.__commands.shift();
			this.__stackPosition -= 1;
		}
	}

	replace(command: Command): void {
		this.__commands[this.__stackPosition] = command;
	}

	current(): CanUndef<Command> {
		return this.__commands[this.__stackPosition];
	}

	undo(): boolean {
		if (this.canUndo()) {
			if (this.__commands[this.__stackPosition]) {
				this.__commands[this.__stackPosition].undo();
			}

			this.__stackPosition -= 1;

			return true;
		}

		return false;
	}

	redo(): boolean {
		if (this.canRedo()) {
			this.__stackPosition += 1;

			if (this.__commands[this.__stackPosition]) {
				this.__commands[this.__stackPosition].redo();
			}

			return true;
		}

		return false;
	}

	canUndo(): boolean {
		return this.__stackPosition >= 0;
	}

	canRedo(): boolean {
		return this.__stackPosition < this.__commands.length - 1;
	}
}
