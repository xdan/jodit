/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Link content modes', () => {
	const open = (editor, anchor) => {
		editor.s.setCursorIn(anchor);
		const form = editor.e.fire('generateLinkForm.link', anchor, () => {});
		document.body.appendChild(form.container);
		return form.container;
	};
	const submit = form => simulateEvent('submit', 0, form);
	it('preserves an icon-only link when changing its URL', () => {
		const editor = getJodit();
		editor.value = '<p><a href="/old"><span class="icon"></span></a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = open(editor, anchor);
		form.querySelector('[ref=url_input]').value = '/new';
		submit(form);
		expect(anchor.querySelector('.icon')).is.not.null;
		expect(anchor.getAttribute('href')).equals('/new');
	});
	it('preserves whitespace and nested markup when only the URL changes', () => {
		const editor = getJodit();
		editor.value =
			'<p><a href="/old"><strong>one</strong><br><em>two</em></a></p>';
		const anchor = editor.editor.querySelector('a');
		const html = anchor.innerHTML;
		const form = open(editor, anchor);
		form.querySelector('[ref=url_input]').value = '/new';
		submit(form);
		expect(anchor.innerHTML).equals(html);
	});
	it('edits markup in a textarea in HTML mode', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value = '<p><a href="/old"><strong>Old</strong></a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = open(editor, anchor);
		const field = form.querySelector('textarea[ref=content_input]');
		expect(field).is.not.null;
		expect(field.value).equals('<strong>Old</strong>');
		field.value = '<em>New</em><code>code</code>';
		submit(form);
		expect(anchor.innerHTML).equals('<em>New</em><code>code</code>');
	});
	it('loads existing HTML through the toolbar popup without selection markers', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value = '<p><a href="/old"><strong>Ol|d</strong></a></p>';
		setCursorToChar(editor);
		clickButton('link', editor);
		const popup = getOpenedPopup(editor);
		expect(popup.querySelector('[ref=content_input]').value).equals(
			'<strong>Old</strong>'
		);
		popup.querySelector('[ref=url_input]').value = '/new';
		simulateEvent('submit', 0, popup.querySelector('form'));
		expect(editor.editor.querySelector('a').innerHTML).equals(
			'<strong>Old</strong>'
		);
	});
	it('initializes a new HTML link from the selected markup', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value = '<p><strong>|Selected|</strong></p>';
		setCursorToChar(editor);
		clickButton('link', editor);
		const popup = getOpenedPopup(editor);
		const field = popup.querySelector('[ref=content_input]');
		expect(field.value).equals('Selected');
		field.value = '<em>Replacement</em>';
		popup.querySelector('[ref=url_input]').value = '/new';
		simulateEvent('submit', 0, popup.querySelector('form'));
		expect(editor.editor.querySelector('a').innerHTML).equals(
			'<em>Replacement</em>'
		);
	});
	it('derives a new URL from formatted text in HTML mode', () => {
		const editor = getJodit({
			link: { contentMode: 'html', deriveUrlFromText: true }
		});
		editor.value = '<p>|<strong>example.com</strong>|</p>';
		setCursorToChar(editor);
		clickButton('link', editor);
		expect(
			getOpenedPopup(editor).querySelector('[ref=url_input]').value
		).equals('https://example.com');
	});
	it('keeps an anchor-list caption as text in HTML mode', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value =
			'<p>|</p><h2><a id="target"></a>&lt;em&gt;Title&lt;/em&gt;</h2>';
		setCursorToChar(editor);
		clickButton('link', editor);
		const popup = getOpenedPopup(editor);
		simulateEvent(
			'click',
			popup.querySelector('.jodit-link-anchors__toggle')
		);
		simulateEvent(
			'click',
			document.querySelector('.jodit-link-anchors__item')
		);
		expect(popup.querySelector('[ref=content_input]').value).equals(
			'&lt;em&gt;Title&lt;/em&gt;'
		);
		simulateEvent('submit', 0, popup.querySelector('form'));
		const anchor = editor.editor.querySelector('a[href]');
		expect(anchor.textContent).equals('<em>Title</em>');
		expect(anchor.querySelector('em')).is.null;
	});
	it('runs the configured HTML sanitizer', () => {
		const editor = getJodit({
			link: { contentMode: 'html' },
			cleanHTML: { sanitizer: html => html.replace(/remove/g, 'safe') }
		});
		editor.value = '<p><a href="/old">Old</a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = open(editor, anchor);
		form.querySelector('[ref=content_input]').value = '<em>remove</em>';
		submit(form);
		expect(anchor.innerHTML).equals('<em>safe</em>');
	});
	it('treats typed markup as plain text by default', () => {
		const editor = getJodit();
		editor.value = '<p><a href="/old">Old</a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = open(editor, anchor);
		form.querySelector('[ref=content_input]').value =
			'<strong>New</strong>';
		submit(form);
		expect(anchor.textContent).equals('<strong>New</strong>');
		expect(anchor.querySelector('strong')).is.null;
	});
	it('sanitizes HTML before moving it into the live link and unwraps nested links', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value = '<p><a href="/old">Old</a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = open(editor, anchor);
		form.querySelector('[ref=content_input]').value =
			'<a href="javascript:alert(1)"><img src="/missing" onerror="window.__linkInjected=true"></a>';
		submit(form);
		expect(anchor.querySelector('[onerror]')).is.null;
		expect(anchor.querySelector('a')).is.null;
		expect(anchor.querySelector('img')).is.not.null;
	});
	it('can edit the markup of an image link in HTML mode', () => {
		const editor = getJodit({ link: { contentMode: 'html' } });
		editor.value = '<p><a href="/old"><img src="/icon.png"></a></p>';
		const anchor = editor.editor.querySelector('a');
		const form = editor.e.fire(
			'generateLinkForm.link',
			anchor.firstChild,
			() => {}
		);
		document.body.appendChild(form.container);
		const field = form.container.querySelector(
			'textarea[ref=content_input]'
		);
		expect(
			field.closest('[ref=content_input_box]').style.display
		).does.not.equal('none');
		expect(field.value).contains('<img');
		field.value = '<strong>Document</strong>';
		submit(form.container);
		expect(anchor.innerHTML).equals('<strong>Document</strong>');
	});
	it('updates the first existing link and inserts the remaining selected documents', () => {
		const editor = getJodit({ filebrowser: { ajax: { url: '/files' } } });
		editor.value = '<p><a href="/old"><strong>Document</strong></a></p>';
		const anchor = editor.editor.querySelector('a');
		editor.s.select(anchor, true);
		Object.defineProperty(editor.filebrowser, 'open', {
			value: callback =>
				callback({
					baseurl: '/docs/',
					files: ['first.pdf', 'second.pdf'],
					isImages: [false, false]
				})
		});
		clickButton('file', editor);
		clickButton('Browse', getOpenedPopup(editor), 'tab');
		const links = editor.editor.querySelectorAll('a');
		expect(links.length).equals(2);
		expect(links[0].getAttribute('href')).equals('/docs/first.pdf');
		expect(links[0].innerHTML).equals('<strong>Document</strong>');
		expect(links[1].getAttribute('href')).equals('/docs/second.pdf');
		expect(editor.editor.querySelector('a a')).is.null;
	});
	['collapsed', 'selected'].forEach(selection => {
		it(`updates an existing link from the file browser with ${selection} content`, () => {
			const editor = getJodit({
				filebrowser: { ajax: { url: '/files' } }
			});
			editor.value =
				'<p><a href="/old"><strong>Document</strong></a></p>';
			const anchor = editor.editor.querySelector('a');
			if (selection === 'collapsed') {
				editor.s.setCursorIn(anchor.querySelector('strong'));
			} else {
				editor.s.select(anchor, true);
			}
			Object.defineProperty(editor.filebrowser, 'open', {
				value: callback =>
					callback({
						baseurl: '/docs/',
						files: ['new.pdf'],
						isImages: [false]
					})
			});
			clickButton('file', editor);
			clickButton('Browse', getOpenedPopup(editor), 'tab');
			expect(editor.editor.querySelectorAll('a').length).equals(1);
			expect(anchor.getAttribute('href')).equals('/docs/new.pdf');
			expect(anchor.innerHTML).equals('<strong>Document</strong>');
		});
	});
});
