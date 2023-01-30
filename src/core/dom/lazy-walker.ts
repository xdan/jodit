/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module dom
 */

import type { IAsync, IDestructible } from 'jodit/types';
import type { Nullable, CanUndef } from 'jodit/types';
import { Eventify } from 'jodit/core/event-emitter/eventify';
import { autobind } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';

export class LazyWalker
	extends Eventify<{
		visit: (node: Node) => boolean;
		break: (reason?: string) => void;
		end: (affect: boolean) => void;
	}>
	implements IDestructible
{
	private __workNodes: Nullable<Generator<Node>> = null;

	setWork(root: Node): this {
		if (this.__isWorked) {
			this.break();
		}

		this.__workNodes = Dom.eachGen(root, !this.__options.reverse);

		this.__isFinished = false;
		this.__startIdleRequest();
		return this;
	}

	private __hadAffect: boolean = false;
	private __isWorked: boolean = false;
	private __isFinished: boolean = false;

	constructor(
		private readonly __async: IAsync,
		private readonly __options: {
			readonly timeout?: number;
			readonly whatToShow?: number;
			readonly reverse?: boolean;
			readonly timeoutChunkSize?: number;
		} = {}
	) {
		super();
	}

	private __idleId: number = 0;

	private __startIdleRequest(): void {
		this.__idleId = this.__async.requestIdleCallback(this.__workPerform, {
			timeout: this.__options.timeout ?? 10
		});
	}

	break(reason?: string): void {
		if (this.__isWorked) {
			this.__stop();
			this.emit('break', reason);
		}
	}

	end(): void {
		if (this.__isWorked) {
			this.__stop();
			this.emit('end', this.__hadAffect);
			this.__hadAffect = false;
		}
	}

	private __stop(): void {
		this.__isWorked = false;
		this.__isFinished = true;
		this.__workNodes = null;
		this.__async.cancelIdleCallback(this.__idleId);
	}

	override destruct(): void {
		super.destruct();
		this.__stop();
	}

	@autobind
	private __workPerform(deadline: IdleDeadline): void {
		if (this.__workNodes) {
			this.__isWorked = true;

			let count = 0;
			const chunkSize = this.__options.timeoutChunkSize ?? 50;

			while (
				!this.__isFinished &&
				(deadline.timeRemaining() > 0 ||
					(deadline.didTimeout && count <= chunkSize))
			) {
				const item = this.__workNodes.next();
				count += 1;
				if (this.__visitNode(item.value)) {
					this.__hadAffect = true;
				}

				if (item.done) {
					this.end();
					return;
				}
			}
		} else {
			this.end();
		}

		if (!this.__isFinished) {
			this.__startIdleRequest();
		}
	}

	private __visitNode(nodeElm: CanUndef<Nullable<Element | Node>>): boolean {
		if (
			!nodeElm ||
			(this.__options.whatToShow !== undefined &&
				nodeElm.nodeType !== this.__options.whatToShow)
		) {
			return false;
		}

		return this.emit('visit', nodeElm) ?? false;
	}
}
