/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/ui/progress-bar/README.md]]
 * @packageDocumentation
 * @module ui/progress-bar
 */

import type { IJodit, IProgressBar, Nullable } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { getContainer } from 'jodit/core/global';
import { position } from 'jodit/core/helpers/size/position';
import { css } from 'jodit/core/helpers/utils/css';
import { UIElement } from 'jodit/core/ui/element';
import { Icon } from 'jodit/core/ui/icon';

import './progress-bar.less';

export class ProgressBar extends UIElement implements IProgressBar {
	/** @override */
	override className(): string {
		return 'ProgressBar';
	}

	/** @override */
	protected override render(): string {
		return '<div><div></div></div>';
	}

	/**
	 * Show progress bar
	 */
	show(): IProgressBar {
		const container = (this.j as IJodit).workplace || this.j.container;
		container.appendChild(this.container);
		return this;
	}

	hide(): IProgressBar {
		Dom.safeRemove(this.container);
		return this;
	}

	progress(percentage: number): IProgressBar {
		this.container.style.width = percentage.toFixed(2) + '%';
		return this;
	}

	private __animationElement: Nullable<HTMLElement> = null;

	showFileUploadAnimation(
		from?: { x: number; y: number },
		to?: { x: number; y: number }
	): void {
		this.__cleanUpAnimation();

		const box = getContainer(this.j, ProgressBar);
		const pos = position(this.j.container, this.j);

		const el = this.j.c.div(this.getFullElName('file-animation'));

		const iconSvg = Icon.get('file', '');
		if (iconSvg) {
			el.innerHTML = iconSvg;
		}

		const start = from ?? {
			x: pos.width / 2,
			y: 0
		};

		const end = to ?? {
			x: start.x + 60,
			y: start.y - 80
		};

		css(el, {
			left: pos.left + start.x,
			top: pos.top + start.y
		});

		box.appendChild(el);
		this.__animationElement = el;

		// Force reflow before starting transition
		// eslint-disable-next-line no-unused-expressions
		el.offsetWidth;

		css(el, {
			left: pos.left + end.x,
			top: pos.top + end.y,
			opacity: 0,
			transform: 'scale(0.4)'
		});

		const onEnd = (): void => {
			el.removeEventListener('transitionend', onEnd);
			this.__cleanUpAnimation();
		};

		el.addEventListener('transitionend', onEnd);
	}

	private __cleanUpAnimation(): void {
		if (this.__animationElement) {
			Dom.safeRemove(this.__animationElement);
			this.__animationElement = null;
		}
	}

	override destruct(): any {
		this.__cleanUpAnimation();
		this.hide();
		return super.destruct();
	}
}
