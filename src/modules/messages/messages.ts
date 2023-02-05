/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/messages/README.md]]
 * @packageDocumentation
 * @module modules/messages
 */

import './messages.less';

import type {
	IMessages,
	IUIElement,
	IViewBased,
	MessageVariant
} from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';
import { UIGroup } from 'jodit/core/ui/group/group';
import { component } from 'jodit/core/decorators/component/component';
import { watch } from 'jodit/core/decorators/watch/watch';
import { UIMessage } from 'jodit/modules/messages/message';

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

	info(text: string, timeout?: number): void {
		this.__message(text, 'info', timeout);
	}

	success(text: string, timeout?: number): void {
		this.__message(text, 'success', timeout);
	}

	error(text: string, timeout?: number): void {
		this.__message(text, 'error', timeout);
	}

	message(text: string, variant?: MessageVariant, timeout?: number): void {
		this.__message(text, variant, timeout);
	}

	/**
	 * Show popup error in the bottom of editor
	 *
	 * @param text - Text message
	 * @param variant - Additional class for status. Allow: info, error, success
	 * @param timeout - How many seconds show error
	 * options.showMessageErrorTime = 2000
	 * @example
	 * ```javascript
	 * const editor = Jodit.make('#editors');
	 * editor.e.fire('errorMessage', 'Error 123. File has not been upload');
	 * editor.e.fire('errorMessage', 'You can upload file', 'info', 4000);
	 * editor.e.fire('errorMessage', 'File was uploaded', 'success', 4000);
	 * ```
	 */
	@watch(':errorMessage')
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
