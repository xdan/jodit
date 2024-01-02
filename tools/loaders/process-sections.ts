/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { LoaderContext } from 'webpack';

type ProcessSectionsPreloaderOptions = {
	[key in string]: boolean;
};

const SECTION_REG = (): RegExp =>
	/\/\/\s*JODIT-SECTION-START:([A-Z\-_\d]+)(.*?)JODIT-SECTION-END:\1/gs;

export function checkSections(
	content: string,
	opt: ProcessSectionsPreloaderOptions
): string {
	const reg = SECTION_REG();
	let res = reg.exec(content);

	while (res) {
		const name = res[1] as string;
		if (!opt[name]) {
			content =
				content.slice(0, res.index) +
				content.slice(res.index + res[0].length);
		}
		res = reg.exec(content);
	}
	return content;
}

export default function (
	this: LoaderContext<ProcessSectionsPreloaderOptions> & { value: string },
	content: string
): string {
	const opt = this.getOptions();

	content = checkSections(content, opt);

	return content;
}

export const seperable = true;
