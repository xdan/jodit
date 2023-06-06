/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/plugin/README.md]]
 * @packageDocumentation
 * @module plugin
 */

import type { CanUndef, IJodit, IPlugin, IViewBased } from 'jodit/types';
import { ViewComponent, STATUSES } from 'jodit/core/component';
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
		return '';
	}

	protected abstract afterInit(jodit: T): void;
	protected abstract beforeDestruct(jodit: T): void;

	constructor(jodit: T) {
		super(jodit);

		jodit.e
			.on('afterPluginSystemInit', () => {
				if (isJoditObject(jodit)) {
					this.buttons?.forEach(btn => {
						jodit.registerButton(btn);
					});
				}
			})
			.on('afterInit', () => {
				this.setStatus(STATUSES.ready);
				this.afterInit(jodit);
			})
			.on('beforeDestruct', this.destruct);
	}

	init(jodit: T): void {
		// empty
	}

	@autobind
	override destruct(): void {
		if (this.isReady) {
			this.setStatus(STATUSES.beforeDestruct);

			const { j } = this;

			if (isJoditObject(j)) {
				this.buttons?.forEach(btn => {
					j?.unregisterButton(btn);
				});
			}

			this.j?.events?.off('beforeDestruct', this.destruct);
			this.beforeDestruct(this.j);
			super.destruct();
		}
	}
}
