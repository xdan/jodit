/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/plugin/README.md]]
 * @packageDocumentation
 * @module plugin
 */

import type { CanUndef, IJodit, IPlugin, IViewBased } from 'jodit/types';
import { STATUSES, ViewComponent } from 'jodit/core/component';
import { autobind } from 'jodit/core/decorators';
import { isJoditObject } from 'jodit/core/helpers/checker/is-jodit-object';

export abstract class Plugin<T extends IViewBased = IJodit>
	extends ViewComponent<T>
	implements IPlugin<T>
{
	static requires: string[] = [];

	/** @override */
	buttons: IPlugin['buttons'] = [];

	/**
	 * Plugin have CSS style and it should be loaded
	 */
	hasStyle: boolean = false;

	/**
	 * Additional plugin styles can be written simply as inline styles
	 * ```js
	 * class A extends Jodit.modules.Plugin {
	 *   styles = 'h1{color: red}';
	 * }
	 * ```
	 * Will only be applied if the plugin is activated
	 */
	styles: CanUndef<string>;

	/** @override */
	className(): string {
		return 'Plugin';
	}

	private __inited: boolean = false;
	protected abstract afterInit(jodit: T): void;
	protected abstract beforeDestruct(jodit: T): void;

	constructor(jodit: T) {
		super(jodit);

		jodit.e
			.on('afterPluginSystemInit', this.__afterPluginSystemInit)
			.on('afterInit', this.__afterInit)
			.on('beforeDestruct', this.__beforeDestruct);
	}

	@autobind
	private __afterPluginSystemInit(): void {
		const { j, buttons } = this;

		if (buttons && isJoditObject(j)) {
			buttons.forEach(btn => {
				j.registerButton(btn);
			});
		}
	}

	@autobind
	private __afterInit(): void {
		this.__inited = true;
		this.setStatus(STATUSES.ready);
		this.afterInit(this.jodit);
	}

	init(jodit: T): void {
		if (this.jodit.isReady) {
			this.afterInit(this.jodit);
			this.__afterPluginSystemInit();
			this.jodit.e.fire('rebuildToolbar');
		}
	}

	@autobind
	private __beforeDestruct(): void {
		if (this.isInDestruct) {
			return;
		}

		const { j } = this;

		j.e
			.off('afterPluginSystemInit', this.__afterPluginSystemInit)
			.off('afterInit', this.__afterInit)
			.off('beforeDestruct', this.destruct);

		this.setStatus(STATUSES.beforeDestruct);

		if (!this.__inited) {
			return super.destruct();
		}

		if (isJoditObject(j)) {
			this.buttons?.forEach(btn => {
				j?.unregisterButton(btn);
			});
		}

		this.beforeDestruct(this.j);
		super.destruct();
	}
}
