/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
module.exports = class PostBuild {
	constructor(fn) {
		this.fn = fn
	}

	apply(compiler) {
		const handler = stats => {
			if (typeof this.fn === 'function') {
				this.fn(stats)
			}
		}

		if (compiler.hooks) {
			compiler.hooks.done.tap('PostBuild', handler)
		} else {
			compiler.plugin('done', handler)
		}
	}
}
