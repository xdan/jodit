/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module core/vdom
 */

import type { IFiber, IVDom } from '../interface';
import type { CanUndef, IDictionary } from 'jodit/types';
import { domToVDom } from '../helpers';
import { Async } from 'jodit/core/async';
import autobind from 'autobind-decorator';

const isProperty = (key: string): boolean => key !== 'children';

const isNew =
	(prev: IDictionary, next: IDictionary) =>
	(key: string): boolean =>
		prev[key] !== next[key];

const isGone =
	(prev: IDictionary, next: IDictionary) =>
	(key: string): boolean =>
		!(key in next);

const updateDom = (
	dom: Node,
	prevProps: IDictionary,
	nextProps: IDictionary
): void => {
	// Remove old properties
	Object.keys(prevProps)
		.filter(isProperty)
		.filter(isGone(prevProps, nextProps))
		.forEach(name => {
			(dom as any)[name] = '';
		});

	// Set new or changed properties
	Object.keys(nextProps)
		.filter(isProperty)
		.filter(isNew(prevProps, nextProps))
		.forEach(name => {
			(dom as any)[name] = nextProps[name];
		});
};

const createDom = (fiber: IFiber): Node => {
	const dom =
		fiber.type === 'TEXT_ELEMENT'
			? document.createTextNode('')
			: document.createElement(fiber.type);

	updateDom(dom, {}, fiber.props);

	return dom;
};

@autobind
export class VDomRender {
	private __async: Async = new Async();

	private __commitRoot(): void {
		this.__deletions.forEach(this.__commitWork);
		this.__deletions.length = 0;
		this.__commitWork(this.__wipRoot?.child);
		this.__currentRoot = this.__wipRoot;
		this.__wipRoot = undefined;
	}

	private __commitWork(fiber: CanUndef<IFiber>): void {
		if (!fiber) {
			return;
		}

		let domParentFiber = fiber.parent;

		while (!domParentFiber?.dom) {
			domParentFiber = domParentFiber?.parent;
		}

		const domParent = domParentFiber.dom;

		if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
			domParent.appendChild(fiber.dom);
		} else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
			updateDom(fiber.dom, fiber.alternate?.props ?? {}, fiber.props);
		} else if (fiber.effectTag === 'DELETION') {
			this.__commitDeletion(fiber, domParent);
		}

		this.__commitWork(fiber?.child);
		this.__commitWork(fiber?.sibling);
	}

	private __commitDeletion(fiber: CanUndef<IFiber>, domParent: Node): void {
		if (fiber?.dom) {
			fiber.dom.isConnected && domParent.removeChild(fiber.dom);
		} else {
			this.__commitDeletion(fiber?.child, domParent);
		}
	}

	render(element: IVDom, container: Node): void {
		this.__wipRoot = {
			type: 'div',
			dom: container,
			props: {
				children: [element]
			},
			alternate: this.__currentRoot ?? undefined
		};

		this.__deletions = [];
		this.__nextUnitOfWork = this.__wipRoot;
	}

	private __nextUnitOfWork: CanUndef<IFiber> = undefined;

	private __currentRoot: CanUndef<IFiber> = undefined;
	private __wipRoot: CanUndef<IFiber> = undefined;

	private __deletions: IFiber[] = [];

	private __workLoop(deadline: IdleDeadline): void {
		let shouldYield = false;

		while (this.__nextUnitOfWork && !shouldYield) {
			this.__nextUnitOfWork = this.__performUnitOfWork(
				this.__nextUnitOfWork
			);
			shouldYield = deadline.timeRemaining() < 1;
		}

		if (!this.__nextUnitOfWork && this.__wipRoot) {
			this.__commitRoot();
		}

		this.__async.requestIdleCallback(this.__workLoop);
	}

	constructor() {
		this.__async.requestIdleCallback(this.__workLoop);
	}

	private __performUnitOfWork(fiber: IFiber): CanUndef<IFiber> {
		this.__updateHostComponent(fiber);

		if (fiber.child) {
			return fiber.child;
		}

		let nextFiber: CanUndef<IFiber> = fiber;

		while (nextFiber) {
			if (nextFiber.sibling) {
				return nextFiber.sibling;
			}
			nextFiber = nextFiber.parent;
		}

		return;
	}

	private __updateHostComponent(fiber: IFiber): void {
		if (!fiber.dom) {
			fiber.dom = createDom(fiber);
		}

		this.__reconcileChildren(fiber, fiber.props.children);
	}

	private __reconcileChildren(
		wipFiber: IFiber,
		elements: IVDom['props']['children']
	): void {
		let index = 0;
		let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
		let prevSibling: CanUndef<IFiber> = undefined;

		while (index < elements.length || oldFiber) {
			const element = elements[index];
			let newFiber: CanUndef<IFiber> = undefined;

			const sameType =
				oldFiber && element && element.type === oldFiber.type;

			if (sameType && oldFiber) {
				newFiber = {
					type: oldFiber.type,
					props: element.props,
					dom: oldFiber.dom,
					parent: wipFiber,
					alternate: oldFiber,
					effectTag: 'UPDATE'
				};
			}

			if (element && !sameType) {
				newFiber = {
					type: element.type,
					props: element.props,
					dom: null,
					parent: wipFiber,
					alternate: undefined,
					effectTag: 'PLACEMENT'
				};
			}

			if (oldFiber && !sameType) {
				oldFiber.effectTag = 'DELETION';
				this.__deletions.push(oldFiber);
			}

			if (oldFiber) {
				oldFiber = oldFiber.sibling;
			}

			if (index === 0 && wipFiber) {
				wipFiber.child = newFiber;
			} else if (element && prevSibling) {
				prevSibling.sibling = newFiber;
			}

			prevSibling = newFiber;
			index++;
		}
	}

	htmlToVDom(html: string): IVDom {
		const box = document.createElement('div');
		box.innerHTML = html;

		return domToVDom(box);
	}
}
