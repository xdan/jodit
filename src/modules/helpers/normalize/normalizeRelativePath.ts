/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright 2013-2020 Valeriy Chupurnov https://xdsoft.net
 */

export const normalizeRelativePath = (path: string) => {
	const
		sections = path.split('/'),
		builder = sections.reduce((builder, section) => {
			switch (section) {
				case '': {
					break;
				}
				case '.': {
					break;
				}
				case '..': {
					builder.pop();
					break;
				}
				default: {
					builder.push(section);
					break;
				}
			}
			return builder;
		}, [] as string[]);

	return builder.join('/') + (path.endsWith('/') ? '/' : '');
};
