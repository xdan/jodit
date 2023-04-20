/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { WebpackCompiler } from 'webpack-cli';

export class PostBuild {
	constructor(private fn: Function) {}

	apply(compiler: WebpackCompiler): void {
		const handler = (stats): void => {
			if (typeof this.fn === 'function') {
				try {
					this.fn(stats);
				} catch (e) {
					console.log(e);
				}
			}
		};

		compiler.hooks.done.tap('PostBuild', handler);
	}
}
