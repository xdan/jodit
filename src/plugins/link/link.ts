/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/link/README.md]]
 * @packageDocumentation
 * @module plugins/link
 */

import type { IDictionary, IJodit, IUIForm, Nullable } from 'jodit/types';
import type { UIForm } from 'jodit/core/ui/form/form';
import type { ILinkListItem } from 'jodit/plugins/link/interface';
import {
	KEY_BACKSPACE,
	KEY_DOWN,
	KEY_ESC,
	KEY_LEFT,
	KEY_RIGHT,
	KEY_TAB,
	KEY_UP
} from 'jodit/core/constants';
import { autobind } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom';
import { pluginSystem, uniqueUid } from 'jodit/core/global';
import {
	attr,
	call,
	convertMediaUrlToVideoEmbed,
	getAnchorName,
	getAnchors,
	htmlspecialchars,
	isFunction,
	isPromise,
	isString,
	isURL,
	position,
	prepareEmbedCode,
	refs,
	safeHTML,
	stripTags
} from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { UIElement } from 'jodit/core/ui/element';
import { Icon } from 'jodit/core/ui/icon';
import { Popup } from 'jodit/core/ui/popup/popup';

import './config';

import { EMAIL, findTypedLink } from './typed-link';

import './link.less';

/**
 * Process link. Insert, dblclick or remove format
 */
export class link extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'link',
			group: 'insert'
		}
	];

	/** @override */
	protected override afterInit(jodit: IJodit): void {
		if (jodit.o.link.followOnDblClick) {
			jodit.e.on('dblclick.link', this.__onDblClickOnLink);
		}

		jodit.e.on(jodit.editor, 'click.link', this.__onClickReadOnlyLink);

		if (jodit.o.link.processPastedLink) {
			jodit.e.on('processPaste.link', this.onProcessPasteLink);
		}

		if (jodit.o.link.processTypedLink) {
			this.__linkAfterEnter = jodit.async.microDebounce(this.__linkTyped);

			jodit.e
				.on('input.link', this.__onTypedSpace)
				.on('beforeEnter.link', this.__onBeforeEnter)
				.on('afterEnter.link', this.__onAfterEnter)
				.on(
					'mousedown.link blur.link beforeCommand.link',
					this.__forgetLink
				)
				// Without a namespace it runs ahead of table navigation,
				// which moves the caret on Tab, and of the backspace plugin
				.on('keydown', this.__onKeyDown, { top: true });
		}

		jodit.e.on('generateLinkForm.link', this.__generateForm);

		jodit.registerCommand('openLinkDialog', {
			exec: () => {
				const dialog = jodit.dlg({
					resizable: false
				});

				const htmlForm = this.__generateForm(jodit.s.current(), () => {
					dialog.close();
				}) as UIForm;

				htmlForm.container.classList.add('jodit-dialog_alert');
				dialog.setContent(htmlForm);
				dialog.open();

				jodit.async.requestIdleCallback(() => {
					const { url_input } = refs(htmlForm.container);
					url_input?.focus();
				});
			},
			hotkeys: jodit.o.link.hotkeys
		});
	}

	@autobind
	private __onDblClickOnLink(e: MouseEvent): void {
		if (!Dom.isTag(e.target, 'a')) {
			return;
		}

		const href = attr(e.target, 'href');

		if (href) {
			location.href = href;
			e.preventDefault();
		}
	}

	@autobind
	private onProcessPasteLink(
		ignore: ClipboardEvent,
		html: string
	): HTMLElement | void | true {
		const { jodit } = this;

		if (!isURL(html) || !jodit.o.link.processPastedLink) {
			return;
		}

		jodit.e.stopPropagation('processPaste');

		if (jodit.o.link.processVideoLink) {
			const embed = call(
				jodit.o.video?.parseUrlToVideoEmbed ??
					convertMediaUrlToVideoEmbed,
				html,
				{
					width: jodit.o.video?.defaultWidth,
					height: jodit.o.video?.defaultHeight
				}
			);

			if (embed !== html) {
				const media = prepareEmbedCode(jodit, embed);
				return isString(media)
					? jodit.createInside.fromHTML(media)
					: media;
			}
		}

		if (jodit.s.isCollapsed()) {
			const a = jodit.createInside.element('a');

			attr(a, 'href', html);
			a.textContent = html;

			jodit.e.fire('applyLink', jodit, a, null);
			return a;
		}

		jodit.s.commitStyle({
			element: 'a',
			attributes: {
				href: html
			}
		});

		return true;
	}

	@autobind
	private __generateForm(
		current: Nullable<Node>,
		close: Function
	): HTMLElement | IUIForm {
		const { jodit } = this;

		const i18n = jodit.i18n.bind(jodit);
		const {
			openInNewTabCheckbox,
			openInNewTabCheckboxDefaultChecked,
			noFollowCheckbox,
			formTemplate,
			formClassName,
			modeClassName,
			contentMode,
			selectKeepOtherClassNames
		} = jodit.o.link;

		const html = formTemplate(jodit);
		const form = isString(html)
			? (jodit.c.fromHTML(html, {
					target_checkbox_box: openInNewTabCheckbox,
					nofollow_checkbox_box: noFollowCheckbox
				}) as HTMLFormElement)
			: html;
		const htmlForm = Dom.isElement(form) ? form : form.container;

		const elements = refs(htmlForm);
		const { insert, unlink, content_input_box } = elements;
		const { target_checkbox, nofollow_checkbox, url_input } =
			elements as IDictionary<HTMLInputElement>;
		const currentElement = current;
		const isImageContent =
			contentMode !== 'html' && Dom.isImage(currentElement);

		let { content_input } = elements as IDictionary<
			HTMLInputElement | HTMLTextAreaElement
		>;

		const { className_input } = elements as IDictionary<HTMLInputElement>,
			{ className_select } = elements as IDictionary<HTMLSelectElement>,
			{ aria_label_input } = elements as IDictionary<HTMLInputElement>;

		if (!content_input) {
			content_input = jodit.c.element('input', {
				type: 'hidden',
				ref: 'content_input'
			});
		}

		if (formClassName) {
			htmlForm.classList.add(formClassName);
		}

		if (isImageContent) {
			Dom.hide(content_input_box);
		}

		let link: false | HTMLAnchorElement;

		const getSelectionContent = (): string => {
			if (contentMode === 'html') {
				return link ? link.innerHTML : jodit.s.html;
			}
			return link
				? link.innerText
				: stripTags(jodit.s.range.cloneContents(), jodit.ed);
		};

		if (current && Dom.closest(current, 'a', jodit.editor)) {
			link = Dom.closest(current, 'a', jodit.editor) as HTMLAnchorElement;
		} else {
			link = false;
		}

		if (!isImageContent && current) {
			content_input.value = getSelectionContent();
		}

		const initialContent = content_input.value;

		if (aria_label_input) {
			aria_label_input.value = link ? attr(link, 'aria-label') || '' : '';
		}

		if (link) {
			url_input.value = attr(link, 'href') || '';

			if (modeClassName) {
				readClassnames(
					modeClassName,
					className_input,
					link,
					className_select
				);
			}

			if (openInNewTabCheckbox && target_checkbox) {
				target_checkbox.checked = attr(link, 'target') === '_blank';
			}

			if (noFollowCheckbox && nofollow_checkbox) {
				nofollow_checkbox.checked = (attr(link, 'rel') || '')
					.split(/\s+/)
					.includes('nofollow');
			}

			insert.textContent = i18n('Update');
		} else {
			Dom.hide(unlink);

			if (
				jodit.o.link.deriveUrlFromText &&
				url_input &&
				!isImageContent &&
				!url_input.value.trim()
			) {
				url_input.value = guessUrlFromText(
					contentMode === 'html'
						? stripTags(content_input.value, jodit.ed)
						: content_input.value
				);
			}

			if (openInNewTabCheckbox && target_checkbox) {
				target_checkbox.checked = openInNewTabCheckboxDefaultChecked;
			}
		}

		addLinkList(jodit, url_input, content_input, isImageContent);

		jodit.editor.normalize();
		const snapshot = jodit.history.snapshot.make();

		if (unlink) {
			jodit.e.on(unlink, 'click', (e: MouseEvent) => {
				jodit.s.restore();
				jodit.history.snapshot.restore(snapshot);

				if (link) {
					Dom.unwrap(link);
				}

				jodit.synchronizeValues();

				close();
				e.preventDefault();
			});
		}

		const onSubmit = (): false => {
			if (!url_input.value.trim().length) {
				url_input.focus();
				url_input.classList.add('jodit_error');
				return false;
			}

			let links: HTMLAnchorElement[];

			jodit.s.restore();
			jodit.s.removeMarkers();
			jodit.editor.normalize();
			jodit.history.snapshot.restore(snapshot);

			const contentWasChanged = initialContent !== content_input.value;

			const ci = jodit.createInside;
			let caretAfter: HTMLAnchorElement | null = null;

			if (!link || !Dom.isOrContains(jodit.editor, link)) {
				if (!jodit.s.isCollapsed()) {
					const node = jodit.s.current();

					if (Dom.isTag(node, 'img')) {
						links = [Dom.wrap(node, 'a', ci) as HTMLAnchorElement];
					} else {
						links = jodit.s.wrapInTag('a') as HTMLAnchorElement[];
					}
				} else {
					const a = ci.element('a');
					jodit.s.insertNode(a, false, false);
					links = [a];
					caretAfter = a;
				}

				links.forEach(link => jodit.s.select(link));
			} else {
				links = [link];
			}

			links.forEach(a => {
				attr(a, 'href', url_input.value);

				writeClasses(
					modeClassName,
					className_input,
					className_select,
					a,
					selectKeepOtherClassNames
				);

				if (!isImageContent) {
					writeContent(
						jodit,
						a,
						content_input.value,
						contentWasChanged,
						url_input.value,
						contentMode
					);
				}

				if (openInNewTabCheckbox && target_checkbox) {
					attr(
						a,
						'target',
						target_checkbox.checked ? '_blank' : null
					);
				}

				if (noFollowCheckbox && nofollow_checkbox) {
					const relParts = (attr(a, 'rel') || '')
						.split(/\s+/)
						.filter(Boolean);
					const hasNofollow = relParts.includes('nofollow');

					if (nofollow_checkbox.checked && !hasNofollow) {
						relParts.push('nofollow');
					} else if (!nofollow_checkbox.checked && hasNofollow) {
						relParts.splice(relParts.indexOf('nofollow'), 1);
					}

					attr(a, 'rel', relParts.length ? relParts.join(' ') : null);
				}

				if (aria_label_input) {
					const ariaLabel = aria_label_input.value.trim();
					attr(a, 'aria-label', ariaLabel || null);
				}

				jodit.e.fire('applyLink', jodit, a, form);
			});

			// A brand-new link inserted at a collapsed caret used to stay
			// *selected*. Safari does not paint that selection, so the next
			// Enter silently replaced the link instead of starting a new line.
			// Put the caret right after the link instead.
			if (caretAfter) {
				jodit.s.setCursorAfter(caretAfter);
			}

			jodit.synchronizeValues();

			close();

			return false;
		};

		if (Dom.isElement(form)) {
			jodit.e.on(form, 'submit', (event: SubmitEvent) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				onSubmit();
				return false;
			});
		} else {
			form.onSubmit(onSubmit);
		}

		return form;
	}

	/** @override */
	protected override beforeDestruct(jodit: IJodit): void {
		jodit.e
			.off('generateLinkForm.link', this.__generateForm)
			.off('dblclick.link', this.__onDblClickOnLink)
			.off(jodit.editor, 'click.link', this.__onClickReadOnlyLink)
			.off('processPaste.link', this.onProcessPasteLink)
			.off('input.link', this.__onTypedSpace)
			.off('beforeEnter.link', this.__onBeforeEnter)
			.off('afterEnter.link', this.__onAfterEnter)
			.off(
				'mousedown.link blur.link beforeCommand.link',
				this.__forgetLink
			)
			.off('keydown', this.__onKeyDown);
	}

	@autobind
	private __onTypedSpace(event: InputEvent): void {
		if (
			event.inputType !== 'insertText' ||
			!event.data ||
			/\S/.test(event.data)
		) {
			return;
		}

		const { range } = this.j.s;

		if (range.collapsed) {
			this.__linkTyped(
				range.startContainer,
				range.startOffset - event.data.length
			);
		}
	}

	/**
	 * Where the caret was when Enter was pressed. Enter splits the line in a
	 * history transaction, so the link waits until it's over
	 */
	private __enteredAt: Nullable<[Node, number]> = null;

	private __linkAfterEnter: (node: Node, end: number) => void = () => {};

	@autobind
	private __onBeforeEnter(): void {
		const { range } = this.j.s;

		this.__enteredAt = range.collapsed
			? [range.startContainer, range.startOffset]
			: null;
	}

	@autobind
	private __onAfterEnter(): void {
		if (this.__enteredAt) {
			this.__linkAfterEnter(...this.__enteredAt);
			this.__enteredAt = null;
		}
	}

	/**
	 * The link just made, which Backspace straight after takes off again, as
	 * in CKEditor 5. Any other key but a modifier, a click or a command
	 * forgets it
	 */
	private __justLinked: Nullable<HTMLAnchorElement> = null;

	@autobind
	private __forgetLink(): void {
		this.__justLinked = null;
	}

	@autobind
	private __onKeyDown(event: KeyboardEvent): false | void {
		const { jodit } = this;

		if (jodit.o.readonly) {
			return;
		}

		const link = this.__justLinked;
		const modified = event.ctrlKey || event.metaKey || event.altKey;

		if (!MODIFIER_KEYS.has(event.key)) {
			this.__justLinked = null;
		}

		if (event.key === KEY_BACKSPACE && !modified && link?.isConnected) {
			this.__recordStep();
			jodit.s.save();
			Dom.unwrap(link);
			jodit.s.restore();
			this.__recordStep();

			// Or the backspace plugin takes a character too
			jodit.e.stopPropagation('keydown');
			return false;
		}

		const { range } = jodit.s;

		if (event.key === KEY_TAB && !modified && range.collapsed) {
			this.__linkTyped(range.startContainer, range.startOffset);
		}
	}

	/**
	 * Links the address that ends at `end` in a text node, as a step of its
	 * own in the history, so Undo straight after takes the link off and
	 * leaves the text
	 */
	@autobind
	private __linkTyped(node: Node, end: number): void {
		const { jodit } = this;

		if (
			!Dom.isText(node) ||
			!node.isConnected ||
			end < 0 ||
			end > node.length ||
			Dom.closest(node, NO_TYPED_LINKS, jodit.editor)
		) {
			return;
		}

		const found = findTypedLink(
			node.data,
			end,
			jodit.o.link.typedLinkTlds,
			jodit.o.link.typedLinkFileEndings
		);

		if (!found) {
			return;
		}

		const [start, stop, href] = found;

		this.__recordStep();

		// The text round the caret splits, and WebKit doesn't keep the caret
		// where it was
		jodit.s.save();

		const range = jodit.ed.createRange();
		range.setStart(node, start);
		range.setEnd(node, stop);

		const a = jodit.createInside.element('a');
		attr(a, 'href', href);
		range.surroundContents(a);

		jodit.s.restore();
		jodit.e.fire('applyLink', jodit, a, null);

		this.__recordStep();
		this.__justLinked = a;
	}

	/**
	 * Reports what's changed and makes it a history step of its own
	 */
	private __recordStep(): void {
		this.j.setEditorValue();
		this.j.e.fire('internalChange');
	}

	@autobind
	private __onClickReadOnlyLink(e: MouseEvent): void {
		const { jodit } = this;

		if (
			jodit.o.readonly &&
			jodit.o.link.preventReadOnlyNavigation &&
			Dom.isTag(e.target, 'a')
		) {
			e.preventDefault();
		}
	}
}

const NO_TYPED_LINKS = new Set(['a', 'pre', 'code'] as const);
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);

pluginSystem.add('link', link);

/**
 * A dropdown arrow in the URL field that lists the document's anchors, by the
 * words after them, and the links in `link.list`, in a tab each when there are
 * both, and fills in the one picked. The list opens in a popup of its own: from
 * the arrow or the down arrow key with everything in it, or as an address is
 * typed with the places whose text or address holds it. With
 * `link.suggestFromText`, the places whose names share words with the link's
 * text are suggested above them, and the first under the URL field while it's
 * empty
 */
function addLinkList(
	jodit: IJodit,
	url: HTMLInputElement,
	content: HTMLInputElement | HTMLTextAreaElement,
	isImage: boolean
): void {
	const field = url?.closest<HTMLElement>('.jodit-ui-input__wrapper');
	const input = field && UIElement.closestElement(field, UIElement);

	if (!field || !input) {
		return;
	}

	interface Place {
		item: HTMLElement;
		url: string;
		text: string;
		detail?: string;
		iconName: string;
	}

	interface Group {
		box: HTMLElement;
		heading: HTMLElement;
		places: Place[];
	}

	interface Tab extends Group {
		tab: HTMLElement;
		count: HTMLElement;
		matches: number;
	}

	const { c } = jodit;
	const { suggestFromText, suggestIgnoredWords } = jodit.o.link;
	const toggle = c.element('button', {
		type: 'button',
		class: 'jodit-link-anchors__toggle'
	});
	const list = c.div('jodit-link-anchors');
	const tablist = c.div('jodit-link-anchors__tabs', { role: 'tablist' });
	const hint = c.element('button', {
		type: 'button',
		class: 'jodit-link-anchors__hint'
	});
	const icon = (name: string): Node =>
		Icon.makeIcon(jodit, {
			name,
			iconURL: '',
			fill: '',
			scale: undefined
		}) ?? c.span();

	const dropdown = new Popup(jodit).setMod('padding', false);
	let filled = '';
	let destructed = false;
	let query = '';
	let hinted: Place | undefined;

	const pick = (place: Place): void => {
		dropdown.close();
		url.value = place.url;

		if (!isImage && (!content.value.trim() || content.value === filled)) {
			content.value = filled =
				jodit.o.link.contentMode === 'html'
					? htmlspecialchars(place.text)
					: place.text;
		}

		url.focus();
		showHint();
	};

	const makeGroup = (title: string): Group => {
		const heading = c.div('jodit-link-anchors__heading', {
			id: 'jodit-link-anchors-' + uniqueUid()
		});
		heading.textContent = jodit.i18n(title);

		const box = c.div('jodit-link-anchors__group', {
			id: 'jodit-link-anchors-' + uniqueUid(),
			role: 'group',
			'aria-labelledby': heading.id
		});
		box.appendChild(heading);

		return { box, heading, places: [] };
	};

	const makeTab = (title: string): Tab => {
		const group = makeGroup(title);
		const count = c.span('jodit-link-anchors__count');
		const tab = c.element('button', {
			type: 'button',
			tabindex: -1,
			id: 'jodit-link-anchors-' + uniqueUid(),
			role: 'tab',
			'aria-controls': group.box.id,
			class: 'jodit-link-anchors__tab'
		});
		tab.append(jodit.i18n(title), count);
		tablist.appendChild(tab);

		return { ...group, tab, count, matches: 0 };
	};

	const fill = (
		group: Group,
		iconName: string,
		entries: Array<{ url: string; text: string; detail?: string }>
	): void => {
		if (entries.length && !group.box.parentNode) {
			list.appendChild(group.box);
		}

		entries.forEach(entry => {
			const item = c.element('button', {
				type: 'button',
				tabindex: -1,
				class: 'jodit-link-anchors__item'
			});
			const place = { ...entry, item, iconName };
			group.places.push(place);

			const textBox = c.span('jodit-link-anchors__text');
			textBox.textContent = entry.text;
			item.append(icon(iconName), textBox);

			if (entry.detail) {
				const detailBox = c.span('jodit-link-anchors__name');
				detailBox.textContent = entry.detail;
				item.appendChild(detailBox);
			}

			group.box.appendChild(item);
			jodit.e.on(item, 'click', () => pick(place));
		});
	};

	const suggested = makeGroup('Suggested');

	if (suggestFromText) {
		list.appendChild(suggested.box);
	}

	list.appendChild(tablist);
	const links = makeTab('Links');
	const anchors = makeTab('On this page');
	const tabs = [links, anchors];
	let selected = links;

	const places = (): Place[] => [...links.places, ...anchors.places];

	const visible = (): HTMLElement[] =>
		Array.from(
			list.querySelectorAll<HTMLElement>('.jodit-link-anchors__item')
		).filter(item => !item.closest('[hidden]'));

	// The places whose text or address holds the query, or all of them
	const show = (q: string): boolean => {
		query = q.trim().toLowerCase();

		tabs.forEach(group => {
			group.places.forEach(place => {
				place.item.hidden = Boolean(
					query &&
					!place.text.toLowerCase().includes(query) &&
					!place.url.toLowerCase().includes(query)
				);
			});

			group.matches = group.places.filter(
				place => !place.item.hidden
			).length;
			group.count.textContent = String(group.matches);
		});

		const tabbed = tabs.every(group => group.places.length);

		// A tab with nothing found gives way to one with something
		if (tabbed && !selected.matches) {
			selected = tabs.find(group => group.matches) ?? selected;
		}

		tabs.forEach(group => {
			group.box.hidden = !group.matches || (tabbed && group !== selected);
			group.heading.hidden = tabbed;
			attr(group.box, {
				role: tabbed ? 'tabpanel' : 'group',
				'aria-labelledby': (tabbed ? group.tab : group.heading).id
			});
			attr(group.tab, {
				'aria-selected': group === selected,
				'aria-disabled': !group.matches
			});
		});

		tablist.hidden = !tabbed;
		suggested.box.hidden = Boolean(query) || !suggested.places.length;

		return tabs.some(group => group.matches);
	};

	const open = (): void => {
		// Clicks in the list then count as the form's, which stays open
		dropdown.parentElement ||= input;
		list.style.minWidth = field.offsetWidth + 'px';

		[...suggested.places, ...places()].forEach(place =>
			attr(place.item, 'aria-current', url.value === place.url)
		);

		// The tab of the one in the URL
		const marked = tabs.find(group =>
			group.places.some(place => place.url === url.value)
		);

		if (marked && !query) {
			selected = marked;
			show('');
		}

		if (dropdown.isOpened) {
			dropdown.updatePosition();
		} else {
			dropdown.open(() => position(field));
		}

		attr(toggle, 'aria-expanded', true);
		visible()
			.find(item => attr(item, 'aria-current') === 'true')
			?.scrollIntoView({
				block: 'nearest'
			});
	};

	// Words of three letters or more, without their accents
	const words = (text: string): string[] =>
		text
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u0300-\u036f]/g, '')
			.split(/[\s!-/:-@[-`{-~\u00a0-\u00bf\u2000-\u206f\u3000-\u303f]+/)
			.filter(
				word => word.length > 2 && !suggestIgnoredWords.includes(word)
			);

	// The same word, or one that starts the other, as "enrol" and "enrolment"
	const near = (a: string, b: string): boolean =>
		a === b ||
		(Math.min(a.length, b.length) > 3 &&
			(a.startsWith(b) || b.startsWith(a)));

	// The places with the most of the text's words, a word that few places
	// have counting for more, and then the most of their own words matched
	const suggest = (): void => {
		suggested.places.forEach(place => {
			jodit.e.off(place.item);
			Dom.safeRemove(place.item);
		});
		suggested.places = [];

		const text =
			jodit.o.link.contentMode === 'html'
				? stripTags(content.value, jodit.ed)
				: content.value;
		const wanted = isImage ? [] : Array.from(new Set(words(text)));
		const all = places().map(place => ({ place, own: words(place.text) }));
		const has = (own: string[], word: string): boolean =>
			own.some(other => near(word, other));
		const weight = (word: string): number =>
			1 / all.filter(({ own }) => has(own, word)).length;

		all.map(({ place, own }) => {
			const hits = wanted.filter(word => has(own, word));

			return {
				place,
				hits: hits.length,
				score:
					hits.reduce((sum, word) => sum + weight(word), 0) +
					hits.length / own.length / 2
			};
		})
			.filter(result => result.hits)
			.sort((a, b) => b.score - a.score)
			.slice(0, 3)
			.forEach(({ place }) => fill(suggested, place.iconName, [place]));

		showHint();
	};

	const showHint = (): void => {
		hinted = url.value.trim() ? undefined : suggested.places[0];
		hint.hidden = !hinted;
		Dom.detach(hint);

		if (hinted) {
			const [before, after = ''] = jodit.i18n('Link to %s').split('%s');
			const name = c.element('strong');
			name.textContent = hinted.text;

			const textBox = c.span('jodit-link-anchors__text');
			textBox.append(before, name, after);

			const detailBox = c.span('jodit-link-anchors__name');
			detailBox.textContent = hinted.detail ?? '';
			hint.append(icon(hinted.iconName), textBox, detailBox);
		}
	};

	const update = (): void => {
		if (!places().length) {
			return;
		}

		if (suggestFromText) {
			suggest();
		}

		show(query);

		const label = jodit.i18n(
			links.places.length ? 'Choose a link' : 'Link to an anchor'
		);
		attr(toggle, { title: label, 'aria-label': label });
		url.placeholder = jodit.i18n('Search or paste a link');

		if (!toggle.isConnected) {
			Dom.after(url, toggle);

			if (suggestFromText) {
				Dom.after(field, hint);
			}
		}

		if (dropdown.isOpened) {
			dropdown.updatePosition();
		}
	};

	tabs.forEach(group =>
		jodit.e.on(group.tab, 'click', () => {
			selected = group;
			show(query);
			dropdown.updatePosition();
		})
	);

	toggle.append(icon('chevron'));
	attr(toggle, 'aria-expanded', false);
	hint.hidden = true;
	dropdown.setContent(list);

	fill(
		anchors,
		'anchor',
		getAnchors(jodit.editor).map(anchor => {
			const name = getAnchorName(anchor);

			return {
				url: '#' + name,
				text: textAfter(jodit, anchor) || name,
				detail: '#' + name
			};
		})
	);
	update();

	const addLinks = (items: unknown): void => {
		if (destructed || !Array.isArray(items)) {
			return;
		}

		fill(
			links,
			'link',
			(items as ILinkListItem[])
				.filter(link => link && isString(link.url) && link.url)
				.map(link => ({
					url: link.url,
					text:
						isString(link.text) && link.text ? link.text : link.url,
					detail: link.description
				}))
		);
		update();
	};

	const { list: given } = jodit.o.link;
	const result = isFunction(given) ? given(jodit) : given;

	if (isPromise(result)) {
		result.then(addLinks, () => null);
	} else {
		addLinks(result);
	}

	// A press on the arrow closes the open list before the click
	let wasOpen = false;

	jodit.e
		.on(dropdown, 'beforeClose', () => attr(toggle, 'aria-expanded', false))
		.on(toggle, 'mousedown', () => (wasOpen = dropdown.isOpened))
		.on(toggle, 'click', () => {
			if (wasOpen || dropdown.isOpened) {
				dropdown.close();
			} else {
				show('');
				open();
			}

			wasOpen = false;
		})
		.on(hint, 'click', () => hinted && pick(hinted))
		.on(content, 'input.anchors', () => {
			if (suggestFromText && content.value !== filled) {
				suggest();
				show(query);
			}
		})
		.on(url, 'input.anchors', (e: InputEvent) => {
			// A pasted or dropped address is finished, not a search
			const typed = !/^insertFrom(Paste|Drop)/.test(e.inputType ?? '');

			showHint();

			if (typed && url.value.trim() && show(url.value)) {
				open();
			} else {
				dropdown.close();
			}
		})
		.on(url, 'keydown.anchors', (e: KeyboardEvent) => {
			if (!places().length) {
				return;
			}

			if (e.key === KEY_DOWN) {
				e.preventDefault();

				if (!dropdown.isOpened) {
					show('');
					open();
				}

				visible()[0]?.focus();
			}

			if (e.key === KEY_ESC && dropdown.isOpened) {
				e.stopPropagation();
				dropdown.close();
			}

			// On to the fields it covers
			if (e.key === KEY_TAB) {
				dropdown.close();
			}
		})
		.on(list, 'keydown', (e: KeyboardEvent) => {
			const items = visible();
			const index = items.indexOf(e.target as HTMLElement);

			if (e.key === KEY_DOWN || e.key === KEY_UP) {
				e.preventDefault();
				items[index + (e.key === KEY_DOWN ? 1 : -1)]?.focus();
			}

			// Left and right go to the other tab
			const other = tabs.find(
				group => group !== selected && group.matches
			);

			if (
				(e.key === KEY_LEFT || e.key === KEY_RIGHT) &&
				!tablist.hidden &&
				other
			) {
				e.preventDefault();
				selected = other;
				show(query);
				visible()
					.find(item => other.box.contains(item))
					?.focus();
				dropdown.updatePosition();
			}

			if (e.key === KEY_ESC) {
				e.stopPropagation();
				dropdown.close();
				url.focus();
			}
		});

	// The URL input is destructed when the form closes
	input.hookStatus('destructed', () => {
		destructed = true;
		dropdown.destruct();
		jodit.e
			.off([
				toggle,
				list,
				hint,
				...tabs.map(group => group.tab),
				...[...suggested.places, ...places()].map(place => place.item)
			])
			.off(url, '.anchors')
			.off(content, '.anchors');
	});
}

/**
 * The words after an anchor in its block, which say where it is
 */
function textAfter(jodit: IJodit, anchor: HTMLAnchorElement): string {
	const range = jodit.ed.createRange();

	range.selectNodeContents(
		Dom.up(anchor, Dom.isBlock, jodit.editor) ?? jodit.editor
	);
	range.setStartAfter(anchor);

	const text = range.toString().replace(/\s+/g, ' ').trim();

	return text.length > 50
		? text.slice(0, 50).replace(/\s+\S*$/, '') + '…'
		: text;
}

/**
 * Guess a usable `href` from the selected text for the link dialog.
 * Returns an empty string when the text is not a plausible URL/email,
 * so plain text (e.g. "click here") is left untouched.
 */
function guessUrlFromText(text: string): string {
	const value = text.trim();

	if (!value || /\s/.test(value)) {
		return '';
	}

	// already an explicit scheme, an anchor or a relative path
	if (/^(https?:|mailto:|tel:|ftp:|#|\/|\.{1,2}\/)/i.test(value)) {
		return value;
	}

	// email address -> mailto:
	if (EMAIL.test(value)) {
		return `mailto:${value}`;
	}

	// bare domain like example.com or www.example.com/path -> https://
	if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(value)) {
		return `https://${value}`;
	}

	return '';
}

function writeClasses(
	modeClassName: 'input' | 'select',
	className_input: HTMLInputElement,
	className_select: HTMLSelectElement,
	a: HTMLAnchorElement,
	keepOtherClassNames: boolean
): void {
	if (modeClassName && (className_input ?? className_select)) {
		if (modeClassName === 'input') {
			if (className_input.value === '' && a.hasAttribute('class')) {
				attr(a, 'class', null);
			}

			if (className_input.value !== '') {
				attr(a, 'class', className_input.value);
			}
		} else if (modeClassName === 'select') {
			const classes = (option: HTMLOptionElement): string[] =>
				option.value.split(/\s+/).filter(cn => cn.trim().length > 0);

			if (keepOtherClassNames) {
				Array.from(className_select.options).forEach(option =>
					classes(option).forEach(cn => a.classList.remove(cn))
				);
			} else {
				attr(a, 'class', null);
			}

			Array.from(className_select.selectedOptions).forEach(option =>
				classes(option).forEach(cn => a.classList.add(cn))
			);

			if (!a.classList.length) {
				attr(a, 'class', null);
			}
		}
	}
}

function readClassnames(
	modeClassName: 'input' | 'select',
	className_input: HTMLInputElement,
	link: HTMLAnchorElement,
	className_select: HTMLSelectElement
): void {
	switch (modeClassName) {
		case 'input':
			if (className_input) {
				className_input.value = attr(link, 'class') || '';
			}
			break;

		case 'select':
			if (className_select) {
				for (
					let i = 0;
					i < className_select.selectedOptions.length;
					i++
				) {
					const option = className_select.options.item(i);

					if (option) {
						option.selected = false;
					}
				}

				const classNames = attr(link, 'class') || '';

				classNames
					.split(/\s+/)
					.filter(cn => cn.trim().length > 0)
					.forEach(className => {
						if (className) {
							for (
								let i = 0;
								i < className_select.options.length;
								i++
							) {
								const option = className_select.options.item(i);

								if (
									option?.value &&
									option.value
										.split(/\s+/)
										.map(cn => cn.trim())
										.includes(className)
								) {
									option.selected = true;
								}
							}
						}
					});
			}
			break;
	}
}

function writeContent(
	editor: IJodit,
	anchor: HTMLAnchorElement,
	value: string,
	changed: boolean,
	url: string,
	mode: 'text' | 'html'
): void {
	if (!changed && anchor.hasChildNodes()) {
		return;
	}
	if (mode === 'text' || !value.trim()) {
		anchor.textContent = value.trim() ? value : url;
		return;
	}
	const sandboxDocument = editor.od.implementation.createHTMLDocument('');
	const sandbox = sandboxDocument.createElement('div');
	sandbox.innerHTML = value;
	editor.e.fire('safeHTML', sandbox);
	sanitizeLinkHTML(sandbox);
	sandboxDocument.body.appendChild(sandbox);
	editor.e.fire('cleanHTML', sandbox);
	sanitizeLinkHTML(sandbox);
	sandbox.querySelectorAll('a').forEach(link => Dom.unwrap(link));
	Dom.detach(anchor);
	Dom.moveContent(sandbox, anchor);
}

function sanitizeLinkHTML(sandbox: HTMLElement): void {
	sandbox
		.querySelectorAll(
			'script,style,iframe,frame,frameset,object,embed,base,link,meta,template'
		)
		.forEach(node => Dom.safeRemove(node));
	safeHTML(sandbox, {
		removeEventAttributes: true,
		removeOnError: true,
		safeJavaScriptLink: true
	});
}
