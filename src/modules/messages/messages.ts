/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/messages/README.md]]
 * @packageDocumentation
 * @module modules/messages
 */

import type {
	IMessages,
	IUIElement,
	IViewBased,
	MessageVariant
} from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { css } from 'jodit/core/helpers/utils/css';
import { UIGroup } from 'jodit/core/ui/group/group';
import { UIMessage } from 'jodit/modules/messages/message';

import './messages.less';

/**
 * Plugin display pop-up messages in the lower right corner of the editor
 */
@component
export class UIMessages extends UIGroup implements IMessages {
	override className(): string {
		return 'UIMessages';
	}

	constructor(
		jodit: IViewBased,
		private readonly __box: HTMLElement,
		override readonly options: {
			defaultTimeout: number;
			defaultOffset: number;
		} = {
			defaultTimeout: 3000,
			defaultOffset: 5
		}
	) {
		super(jodit);
	}

	/**
	 * Show popup info message in the lower right corner of the container
	 * ```js
	 * const jodit = Jodit.make('#editor');
	 * jodit.info('Hello world', 3000);
	 * ```
	 */
	info(text: string, timeout?: number): void {
		this.__message(text, 'info', timeout);
	}

	/**
	 * Show popup success message in the lower right corner of the container
	 * ```js
	 * const jodit = Jodit.make('#editor');
	 * jodit.success('Hello world', 3000);
	 * ```
	 */
	success(text: string, timeout?: number): void {
		this.__message(text, 'success', timeout);
	}

	/**
	 * Show popup error message in the lower right corner of the container
	 * ```js
	 * const jodit = Jodit.make('#editor');
	 * jodit.error('Hello world', 3000);
	 * ```
	 */
	error(text: string, timeout?: number): void {
		this.__message(text, 'error', timeout);
	}

	/**
	 * Show popup message in the lower right corner of the container
	 * ```js
	 * const jodit = Jodit.make('#editor');
	 * jodit.message('Hello world', 'info', 3000);
	 * ```
	 */
	message(text: string, variant?: MessageVariant, timeout?: number): void {
		this.__message(text, variant, timeout);
	}

	private __message(
		text: string,
		variant: MessageVariant = 'info',
		timeout?: number
	): void {
		const key = text + ':' + variant;

		if (this.__messages.has(key)) {
			this.async.updateTimeout(
				key,
				timeout || this.options.defaultTimeout
			);
			return;
		}

		if (!this.__box) {
			throw new Error('Container is not defined: ' + key);
		}

		this.__box.appendChild(this.container);

		const msg = new UIMessage(this.j, { text, variant });
		this.append(msg);

		this.__calcOffsets();

		this.__messages.add(key);
		const remove = this.__getRemoveCallback(msg, key);
		this.j.e.on(msg.container, 'pointerdown', remove);

		this.async.setTimeout(remove, {
			label: key,
			timeout: timeout || this.options.defaultTimeout
		});
	}

	private __getRemoveCallback(
		msg: IUIElement,
		key: string
	): (e?: MouseEvent) => void {
		const remove = (e?: MouseEvent): void => {
			e && e.preventDefault();

			if (msg.isInDestruct) {
				return;
			}

			this.async.clearTimeout(key);
			this.j.e.off(msg.container, 'pointerdown', remove);
			this.__messages.delete(key);

			msg.setMod('active', false);

			this.async.setTimeout(() => {
				this.remove(msg);
				msg.destruct();
				this.__calcOffsets();
			}, 300);
		};

		return remove;
	}

	private __messages: Set<string> = new Set();

	private __calcOffsets(): void {
		let height = 5;

		this.elements.forEach(elm => {
			css(elm.container, 'bottom', height + 'px');
			height += elm.container.offsetHeight + this.options.defaultOffset;
		});
	}
}
