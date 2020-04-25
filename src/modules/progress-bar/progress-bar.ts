/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './progress-bar.less';

import { IJodit, IProgressBar, IViewBased } from '../../types';
import { Component } from '../../core/component';
import { Dom } from '../../core/dom';

export class ProgressBar extends Component implements IProgressBar {
	jodit!: IViewBased;

	/**
	 * progress_bar Progress bar
	 */
	private progressBar = this.c.div('jodit-progressbar', this.c.div());

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

	constructor(jodit: IViewBased) {
		super();
		this.setParentView(jodit)
	}

	destruct(): any {
		this.hide();
		return super.destruct();
	}
}
