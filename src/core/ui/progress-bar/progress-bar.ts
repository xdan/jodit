/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './progress-bar.less';

import type { IJodit, IProgressBar } from '../../../types';
import { Dom } from '../../dom';
import { UIElement } from '../element';

export class ProgressBar extends UIElement implements IProgressBar {
	/** @override */
	className(): string {
		return 'ProgressBar';
	}

	/** @override */
	protected render(): string {
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

	destruct(): any {
		this.hide();
		return super.destruct();
	}
}
