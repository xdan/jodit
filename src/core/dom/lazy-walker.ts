/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
	private workNodes: Nullable<Generator<Node>> = null;

	setWork(root: Node): this {
		if (this.isWorked) {
			this.break();
		}

		this.workNodes = Dom.eachGen(root, !this.options.reverse);

		this.isFinished = false;
		this.startIdleRequest();
		return this;
	}

	private hadAffect: boolean = false;
	private isWorked: boolean = false;
	private isFinished: boolean = false;

	constructor(
		private readonly async: IAsync,
		private readonly options: {
			readonly timeout?: number;
			readonly whatToShow?: number;
			readonly reverse?: boolean;
			readonly timeoutChunkSize?: number;
		} = {}
	) {
		super();
	}

	private idleId: number = 0;

	private startIdleRequest(): void {
		this.idleId = this.async.requestIdleCallback(this.workPerform, {
			timeout: this.options.timeout ?? 10
		});
	}

	break(reason?: string): void {
		if (this.isWorked) {
			this.stop();
			this.emit('break', reason);
		}
	}

	end(): void {
		if (this.isWorked) {
			this.stop();
			this.emit('end', this.hadAffect);
			this.hadAffect = false;
		}
	}

	private stop(): void {
		this.isWorked = false;
		this.isFinished = true;
		this.workNodes = null;
		this.async.cancelIdleCallback(this.idleId);
	}

	override destruct(): void {
		super.destruct();
		this.stop();
	}

	@autobind
	private workPerform(deadline: IdleDeadline): void {
		if (this.workNodes) {
			this.isWorked = true;

			let count = 0;
			const chunkSize = this.options.timeoutChunkSize ?? 50;

			while (
				!this.isFinished &&
				(deadline.timeRemaining() > 0 ||
					(deadline.didTimeout && count <= chunkSize))
			) {
				const item = this.workNodes.next();
				count += 1;
				if (this.visitNode(item.value)) {
					this.hadAffect = true;
				}

				if (item.done) {
					this.end();
					return;
				}
			}
		} else {
			this.end();
		}

		if (!this.isFinished) {
			this.startIdleRequest();
		}
	}

	private visitNode(nodeElm: CanUndef<Nullable<Element | Node>>): boolean {
		if (
			!nodeElm ||
			(this.options.whatToShow !== undefined &&
				nodeElm.nodeType !== this.options.whatToShow)
		) {
			return false;
		}

		return this.emit('visit', nodeElm) ?? false;
	}
}
