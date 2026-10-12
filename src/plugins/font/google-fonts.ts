/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/font
 */

import type { IJodit } from 'jodit/types';
import { ViewComponent } from 'jodit/core/component/view-component';
import { Dom } from 'jodit/core/dom/dom';
import { Ajax } from 'jodit/core/request/ajax';

/**
 * A font as the Google Fonts Developer API describes it
 */
export interface IGoogleFont {
	family: string;
	category: string;
	variants: string[];
}

const CSS_URL = 'https://fonts.googleapis.com/css2';

// `cursive` and `fantasy` stand in badly for a handwriting or display font
const GENERIC_FAMILIES: Record<string, string> = {
	serif: 'serif',
	monospace: 'monospace'
};

const libraries = new Map<string, Promise<IGoogleFont[]>>();

/**
 * The fonts of the library at `url`, fetched once for every editor on the page
 */
function library(jodit: IJodit, url: string): Promise<IGoogleFont[]> {
	let fonts = libraries.get(url);

	if (!fonts) {
		const ajax = new Ajax<{ items: IGoogleFont[] }>(
			{ url, method: 'GET' },
			jodit.o.defaultAjaxOptions
		);

		fonts = ajax
			.send()
			.then(response => response.json())
			// A font without a regular style can't be asked for by its name alone
			.then(({ items }) =>
				items.filter(font => font.variants.includes('regular'))
			)
			.catch((): IGoogleFont[] => {
				libraries.delete(url);
				return [];
			})
			.finally(() => ajax.destruct());

		libraries.set(url, fonts);
	}

	return fonts;
}

/**
 * The first family of a `font-family` value, unquoted and in lower case for
 * comparing
 */
export function firstFamily(fontFamily: string): string {
	return fontFamily.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
}

/**
 * Loads fonts from Google Fonts: the whole of each font the content uses into
 * the editor's document, and just the letters of its name for the font list
 */
export class GoogleFonts extends ViewComponent<IJodit> {
	override className(): string {
		return 'GoogleFonts';
	}

	/**
	 * The library by lower-case family, empty until it arrives
	 */
	readonly fonts: Map<string, IGoogleFont> = new Map();

	readonly ready: Promise<void>;

	private readonly __links: HTMLLinkElement[] = [];
	private readonly __loaded: WeakMap<Document, Set<string>> = new WeakMap();
	private readonly __previewed: Set<string> = new Set();

	constructor(jodit: IJodit) {
		super(jodit);

		this.ready = library(jodit, jodit.o.font.googleFonts.url).then(
			fonts => {
				fonts.forEach(font =>
					this.fonts.set(font.family.toLowerCase(), font)
				);
			}
		);
	}

	/**
	 * The library's font named first in a `font-family` value
	 */
	find(fontFamily: string): IGoogleFont | undefined {
		return this.fonts.get(firstFamily(fontFamily));
	}

	/**
	 * The `font-family` value that applies a font
	 */
	value(font: IGoogleFont): string {
		return `'${font.family}', ${GENERIC_FAMILIES[font.category] ?? 'sans-serif'}`;
	}

	/**
	 * Loads the regular, italic, bold and bold italic styles that a font has
	 * into the editor's document
	 */
	load(font: IGoogleFont): void {
		const loaded = this.__loadedInto(this.j.ed);

		if (loaded.has(font.family)) {
			return;
		}

		loaded.add(font.family);

		const styles = [
			['regular', '0,400'],
			['700', '0,700'],
			['italic', '1,400'],
			['700italic', '1,700']
		]
			.filter(([variant]) => font.variants.includes(variant))
			.map(([, style]) => style);

		this.__append(
			this.j.ed,
			`family=${this.__family(font)}:ital,wght@${styles.join(';')}`
		);
	}

	/**
	 * Loads every font of the library that the content uses
	 */
	loadUsed(): void {
		this.j.editor
			.querySelectorAll<HTMLElement>('[style*="font-family"]')
			.forEach(element => {
				const font = this.find(element.style.fontFamily);
				font && this.load(font);
			});
	}

	/**
	 * Loads into the page just the letters of each font's name, so the font
	 * list can show the name in its font
	 */
	preview(fonts: IGoogleFont[]): void {
		const loaded = this.__loadedInto(this.j.od);

		fonts = fonts.filter(
			font =>
				!this.__previewed.has(font.family) && !loaded.has(font.family)
		);

		if (!fonts.length) {
			return;
		}

		fonts.forEach(font => this.__previewed.add(font.family));

		const families = fonts.map(font => `family=${this.__family(font)}`),
			letters = new Set(fonts.map(font => font.family).join(''));

		this.__append(
			this.j.od,
			`${families.join('&')}&text=${encodeURIComponent([...letters].join(''))}`
		);
	}

	private __loadedInto(doc: Document): Set<string> {
		const loaded = this.__loaded.get(doc) ?? new Set<string>();
		this.__loaded.set(doc, loaded);
		return loaded;
	}

	private __family(font: IGoogleFont): string {
		return encodeURIComponent(font.family).replace(/%20/g, '+');
	}

	private __append(doc: Document, query: string): void {
		const link = doc.createElement('link');

		link.rel = 'stylesheet';
		link.href = `${CSS_URL}?${query}&display=swap`;

		doc.head.appendChild(link);
		this.__links.push(link);
	}

	override destruct(): void {
		this.__links.forEach(link => Dom.safeRemove(link));
		super.destruct();
	}
}
