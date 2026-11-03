/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/format-block
 */

import type { IJodit } from 'jodit/types';

interface ContentFont {
	family: string;
	source: string;
	descriptors: FontFaceDescriptors;
}

interface Carried {
	prefix: string;
	faces: Map<string, FontFace>;
	pending: boolean;
}

const carried = new WeakMap<IJodit, Carried>();
const fetched = new Map<string, Promise<ContentFont[]>>();
let editors = 0;

/**
 * In iframe mode the content's web fonts load only in the iframe, but the
 * Paragraph list is in the page, so its previews would fall back to the
 * page's fonts. This adds the content's web fonts to the page under names
 * only this editor uses, so nothing else on the page can pick them up, and
 * puts those names first in a preview's `font-family`
 */
export function withContentFonts(editor: IJodit, fontFamily: string): string {
	const { ed, od } = editor;

	if (ed === od) {
		return fontFamily;
	}

	const state = carriedFor(editor);
	carry(editor, state);

	const webFonts = new Set<string>();
	ed.fonts.forEach(face => webFonts.add(familyName(face.family)));

	return fontFamily
		.split(',')
		.map(family => {
			const name = familyName(family);

			return webFonts.has(name)
				? `"${state.prefix}${name}", ${family.trim()}`
				: family.trim();
		})
		.join(', ');
}

function carriedFor(editor: IJodit): Carried {
	let state = carried.get(editor);

	if (!state) {
		const { od } = editor;
		const created: Carried = {
			prefix: `jodit-preview-${++editors}-`,
			faces: new Map(),
			pending: false
		};

		carried.set(editor, created);
		editor.e.on('beforeDestruct', () =>
			created.faces.forEach(face => od.fonts.delete(face))
		);

		state = created;
	}

	return state;
}

/**
 * It looks each time the list opens, since the content's stylesheets may
 * still have been loading the time before
 */
function carry(editor: IJodit, state: Carried): void {
	// Every preview in the list asks, but one look is enough
	if (state.pending) {
		return;
	}

	state.pending = true;

	const { ed, od } = editor;

	Promise.all(
		Array.from(ed.styleSheets, sheet => fontsOf(sheet, ed.baseURI))
	).then(lists => {
		state.pending = false;

		if (editor.isInDestruct) {
			return;
		}

		lists.flat().forEach(font => {
			const key = JSON.stringify(font);

			if (!state.faces.has(key)) {
				const face = new FontFace(
					state.prefix + font.family,
					font.source,
					font.descriptors
				);

				od.fonts.add(face);
				state.faces.set(key, face);
			}
		});
	});
}

/**
 * The web fonts a stylesheet and those it imports declare
 */
function fontsOf(sheet: CSSStyleSheet, base: string): Promise<ContentFont[]> {
	let rules: CSSRuleList;

	try {
		rules = sheet.cssRules;
	} catch {
		// Another site's stylesheet can't be read, but it can be fetched if
		// the site allows it, as Google Fonts does
		const { href } = sheet;

		if (!href) {
			return Promise.resolve([]);
		}

		let fonts = fetched.get(href);

		if (!fonts) {
			fonts = fetchFonts(href);
			fetched.set(href, fonts);
		}

		return fonts;
	}

	return fontsIn(rules, sheet.href ?? base);
}

function fontsIn(rules: CSSRuleList, base: string): Promise<ContentFont[]> {
	return Promise.all(
		Array.from(rules, (rule): ContentFont[] | Promise<ContentFont[]> => {
			if ('styleSheet' in rule) {
				const { styleSheet } = rule as CSSImportRule;
				return styleSheet ? fontsOf(styleSheet, base) : [];
			}

			if ('cssRules' in rule) {
				return fontsIn((rule as CSSGroupingRule).cssRules, base);
			}

			return rule.cssText.startsWith('@font-face')
				? [fontOf(rule as CSSFontFaceRule, base)]
				: [];
		})
	).then(lists => lists.flat());
}

function fontOf(rule: CSSFontFaceRule, base: string): ContentFont {
	const value = (prop: string): string | undefined =>
		rule.style.getPropertyValue(prop) || undefined;

	return {
		family: familyName(rule.style.getPropertyValue('font-family')),
		source: withAbsoluteUrls(rule.style.getPropertyValue('src'), base),
		descriptors: {
			style: value('font-style'),
			weight: value('font-weight'),
			stretch: value('font-stretch'),
			unicodeRange: value('unicode-range')
		}
	};
}

function fetchFonts(href: string): Promise<ContentFont[]> {
	return fetch(href)
		.then(response => response.text())
		.then(text => {
			const doc = document.implementation.createHTMLDocument('');
			const style = doc.createElement('style');
			style.textContent = text;
			doc.head.appendChild(style);

			return style.sheet ? fontsIn(style.sheet.cssRules, href) : [];
		})
		.catch((): ContentFont[] => []);
}

function familyName(family: string): string {
	return family.replace(/["']/g, '').trim().toLowerCase();
}

/**
 * The fonts are added to the page, so a relative URL would point somewhere
 * else
 */
function withAbsoluteUrls(css: string, base: string): string {
	return css.replace(
		/url\(\s*(["']?)(.*?)\1\s*\)/g,
		(match, quote: string, url: string) => {
			try {
				return `url("${new URL(url, base).href}")`;
			} catch {
				return match;
			}
		}
	);
}
