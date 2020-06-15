/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './progress-bar.less';

import { IJodit, IProgressBar } from '../../types';
import { ViewComponent } from '../../core/component';
import { Dom } from '../../core/dom';

export class ProgressBar extends ViewComponent implements IProgressBar {
	/**
	 * progress_bar Progress bar
	 */
	private progressBar = this.j.c.div('jodit-progressbar', this.j.c.div());

	/**
	 * Show progress bar
	 */
	show(): IProgressBar {
		const container = (this.j as IJodit).workplace || this.j.container;
		container.appendChild(this.progressBar);
		return this;
	}

	hide(): IProgressBar {
		Dom.safeRemove(this.progressBar);
		return this;
	}

	progress(percentage: number): IProgressBar {
		this.progressBar.style.width = percentage.toFixed(2) + '%';
		return this;
	}

	destruct(): any {
		this.hide();
		return super.destruct();
	}
}
