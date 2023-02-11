/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import type { IExtraPlugin, IJodit, PluginType } from 'jodit/types';
import {
	appendScriptAsync,
	appendStyleAsync
} from 'jodit/core/helpers/utils/append-script';
import { kebabCase } from 'jodit/core/helpers/string/kebab-case';
import { normalizeName } from 'jodit/core/plugin/helpers/utils';

const styles: Set<string> = new Set();

/**
 * @private
 */
export async function loadStyle(
	jodit: IJodit,
	pluginName: string
): Promise<void> {
	const url = getFullUrl(jodit, pluginName, false);

	if (styles.has(url)) {
		return;
	}

	styles.add(url);

	return appendStyleAsync(jodit, url);
}

/**
 * Call full url to the script or style file
 * @private
 */
function getFullUrl(jodit: IJodit, name: string, js: boolean): string {
	name = kebabCase(name);

	return (
		jodit.basePath +
		'plugins/' +
		name +
		'/' +
		name +
		'.' +
		(js ? 'js' : 'css')
	);
}

/**
 * @private
 */
export function loadExtras(
	items: Map<string, PluginType>,
	jodit: IJodit,
	extrasList: IExtraPlugin[],
	callback: () => void
): void {
	try {
		const needLoadExtras = extrasList.filter(
			extra => !items.has(normalizeName(extra.name))
		);

		if (needLoadExtras.length) {
			load(jodit, needLoadExtras, callback);
		}
	} catch (e) {
		// @ts-ignore
		if (!isProd) {
			throw e;
		}
	}
}

/**
 * Download plugins
 * @private
 */
function load(
	jodit: IJodit,
	pluginList: IExtraPlugin[],
	callback: () => void
): void {
	pluginList.map(extra => {
		const url = extra.url || getFullUrl(jodit, extra.name, true);

		return appendScriptAsync(jodit, url)
			.then(callback)
			.catch(() => null);
	});
}
