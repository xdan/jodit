/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/font
 */

import type { IJodit, IToolbarButton } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { uniqueUid } from 'jodit/core/global';
import { isArray } from 'jodit/core/helpers/checker/is-array';
import { attr } from 'jodit/core/helpers/utils/attr';
import { css } from 'jodit/core/helpers/utils/css';
import { keys } from 'jodit/core/helpers/utils/utils';
import { UIElement } from 'jodit/core/ui/element';

import type { IGoogleFont } from './google-fonts';
import { firstFamily, GoogleFonts } from './google-fonts';

import './font-picker.less';

interface IFontEntry {
	value: string;
	title: string;
	font?: IGoogleFont;
}

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const GENERIC_FAMILIES = new Set([
	'serif',
	'sans-serif',
	'monospace',
	'cursive',
	'fantasy',
	'system-ui',
	'ui-serif',
	'ui-sans-serif',
	'ui-monospace',
	'ui-rounded'
]);

/**
 * A family that names a font, not a generic family or a vendor keyword such
 * as `-apple-system`
 */
function isFontName(family: string): boolean {
	return (
		Boolean(family) &&
		!family.startsWith('-') &&
		!GENERIC_FAMILIES.has(family)
	);
}

/**
 * The font family dropdown with Google Fonts. Under their own headings it
 * lists the fonts the editor's styles give text and headings, the fonts the
 * content uses, the control's list and the Google Fonts library
 */
@component
export class UIFontPicker extends UIElement<IJodit> {
	override className(): string {
		return 'UIFontPicker';
	}

	private readonly __googleFonts: GoogleFonts;
	private readonly __fonts: Map<Element, IGoogleFont> = new Map();
	private __observer: IntersectionObserver | null = null;

	constructor(
		jodit: IJodit,
		private readonly __button: IToolbarButton,
		private readonly __close: () => void
	) {
		super(jodit);

		this.__googleFonts = jodit.getInstance<GoogleFonts>(GoogleFonts);
		this.__render();

		if (!this.__googleFonts.fonts.size) {
			this.__googleFonts.ready.then(
				() => !this.isDestructed && this.__render()
			);
		}
	}

	private __render(): void {
		const { control } = this.__button,
			{ list = {} } = control,
			listed = isArray(list)
				? list.map((key): IFontEntry => ({
						value: key.toString(),
						title: key.toString()
					}))
				: keys(list, false).map((key): IFontEntry => ({
						value: key,
						title: list[key].toString()
					})),
			google = Array.from(
				this.__googleFonts.fonts.values(),
				(font): IFontEntry => ({
					value: this.__googleFonts.value(font),
					title: font.family,
					font
				})
			),
			byFamily = new Map<string, IFontEntry>();

		[...google, ...listed].forEach(entry =>
			byFamily.set(firstFamily(entry.value), entry)
		);

		const theme = new Map<string, IFontEntry>(),
			used = new Map<string, IFontEntry>();

		// The theme's own fonts are listed too, so its body font can be chosen
		// to take a font off
		this.__themeFonts().forEach(fontFamily => {
			const family = firstFamily(fontFamily),
				title = fontFamily.split(',')[0].replace(/["']/g, '').trim(),
				entry =
					byFamily.get(family) ??
					(isFontName(family)
						? { value: fontFamily, title }
						: undefined);

			entry && !theme.has(family) && theme.set(family, entry);
		});

		this.__usedFonts().forEach(fontFamily => {
			const family = firstFamily(fontFamily),
				entry = byFamily.get(family);

			entry && !theme.has(family) && used.set(family, entry);
		});

		const defaultEntry = listed.find(entry => entry.value === ''),
			current = firstFamily(control.value?.(this.j, this.__button) ?? '');

		Dom.detach(this.container);
		this.__fonts.clear();

		defaultEntry && this.__append(current, [defaultEntry]);
		this.__append(current, [...theme.values()], 'Theme fonts');
		this.__append(current, [...used.values()], 'Used fonts');
		this.__append(
			current,
			listed.filter(entry => entry !== defaultEntry),
			'System fonts'
		);
		this.__append(current, google, 'Google Fonts');

		this.__observeGoogleFonts();
	}

	/**
	 * The fonts the editor's styles give text and each heading
	 */
	private __themeFonts(): string[] {
		const { editor } = this.j,
			fonts = [css(editor, 'font-family').toString()];

		HEADINGS.forEach(tag => {
			const heading = this.j.createInside.element(tag, {
				style: 'display: none'
			});

			Dom.append(editor, heading);
			fonts.push(css(heading, 'font-family').toString());
			Dom.safeRemove(heading);
		});

		return fonts;
	}

	/**
	 * The fonts the content sets
	 */
	private __usedFonts(): string[] {
		return Array.from(
			this.j.editor.querySelectorAll<HTMLElement>(
				'[style*="font-family"]'
			),
			element => element.style.fontFamily
		);
	}

	private __append(
		current: string,
		entries: IFontEntry[],
		heading?: string
	): void {
		if (!entries.length) {
			return;
		}

		const { control } = this.__button,
			group = this.j.c.div(this.getFullElName('group'));

		if (heading) {
			const title = this.j.c.div(this.getFullElName('heading'), {
				id: `${this.getFullElName('heading')}-${uniqueUid()}`
			});
			title.textContent = this.i18n(heading);

			attr(group, { role: 'group', 'aria-labelledby': title.id });
			Dom.append(group, title);
		}

		entries.forEach(entry => {
			const item = this.j.c.element('button', {
				type: 'button',
				class: this.getFullElName('item'),
				'data-value': entry.value,
				'aria-pressed': firstFamily(entry.value) === current
			});

			if (entry.font) {
				item.textContent = entry.title;
				this.__fonts.set(item, entry.font);
			} else {
				item.innerHTML =
					control.childTemplate?.(
						this.j,
						entry.value,
						entry.title,
						this.__button
					) ?? entry.title;
			}

			Dom.append(group, item);
		});

		Dom.append(this.container, group);
	}

	/**
	 * Shows the names of the Google Fonts in view, and those just below it,
	 * in their own fonts. Setting every item's font up front would have the
	 * browser look for each of the library's families among the installed
	 * fonts the first time the list opens
	 */
	private __observeGoogleFonts(): void {
		this.j.async.requestAnimationFrame(() => {
			this.__observer?.disconnect();

			if (this.isDestructed || !this.__fonts.size) {
				return;
			}

			const observer = new IntersectionObserver(
				entries => {
					const fonts: IGoogleFont[] = [];

					entries.forEach(({ isIntersecting, target }) => {
						const font = this.__fonts.get(target);

						if (isIntersecting && font) {
							fonts.push(font);
							css(target as HTMLElement, {
								fontFamily: this.__googleFonts.value(font)
							});
							observer.unobserve(target);
						}
					});

					this.__googleFonts.preview(fonts);
				},
				{
					root: this.container.parentElement,
					rootMargin: '0px 0px 400px 0px'
				}
			);

			this.__fonts.forEach((_, item) => observer.observe(item));
			this.__observer = observer;
		});
	}

	/**
	 * Keeps the editor's selection, as the toolbar buttons do
	 */
	@watch('container:mousedown')
	protected onMouseDown(e: MouseEvent): void {
		e.preventDefault();
	}

	@watch('container:click')
	protected onClick(e: MouseEvent): void {
		const item = Dom.up<HTMLElement>(
			e.target as Node,
			node => Dom.isHTMLElement(node) && node.hasAttribute('data-value'),
			this.container
		);

		if (!item) {
			return;
		}

		const value = attr(item, 'data-value') ?? '',
			font = this.__googleFonts.find(value),
			// The font the text has anyway is taken off rather than written
			inherited = firstFamily(value) === firstFamily(this.__blockFont());

		font && !inherited && this.__googleFonts.load(font);

		this.j.execCommand('fontname', false, inherited ? '' : value);
		this.__close();
	}

	/**
	 * The font the selected text has without a font of its own: its block's
	 */
	private __blockFont(): string {
		const block = Dom.up(this.j.s.current(), Dom.isBlock, this.j.editor);
		return css(block ?? this.j.editor, 'font-family').toString();
	}

	override destruct(): void {
		this.__observer?.disconnect();
		super.destruct();
	}
}
