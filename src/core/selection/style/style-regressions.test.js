/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Style transaction regressions', () => {
	[true, false].forEach(before => {
		it(`Should preserve an unselected image link ${before ? 'before' : 'after'} extracted text`, () => {
			const editor = getJodit();
			const img = '<img src="tests/artio.jpg">';
			editor.value = `<p><a href="https://example.com/">${before ? img + '|b|c' : 'a|b|' + img}</a></p>`;
			setCursorToChar(editor);

			editor.s.commitStyle({ element: 'a' });

			const anchor = editor.editor.querySelector('img').closest('a');
			expect(anchor).is.not.null;
			expect(anchor.getAttribute('href')).equals('https://example.com/');
			expect(editor.s.sel.toString()).equals('b');
		});
	});

	it('Should pass the style before the list to beforeToggleList', () => {
		const editor = getJodit();
		editor.value = '<ul><li>|one|</li></ul>';
		setCursorToChar(editor);
		let called = false;

		editor.s.commitStyle({
			element: 'ul',
			hooks: {
				beforeToggleList(mode, style, list) {
					called = true;
					expect(mode).equals('initial');
					expect(style.element).equals('ul');
					expect(list).equals(editor.editor.firstChild);
					return 'replace';
				}
			}
		});

		expect(called).is.true;
		expect(editor.value).equals('<ul><li>one</li></ul>');
	});

	it('Should accept the replacement element returned by beforeUnwrapList', () => {
		const editor = getJodit();
		editor.value = '<ul><li>|one|</li></ul>';
		setCursorToChar(editor);
		let called = false;

		editor.s.commitStyle({
			element: 'ul',
			hooks: {
				beforeUnwrapList(mode, list, style) {
					called = true;
					expect(mode).equals('unwrap');
					expect(style.element).equals('ul');
					const replacement = Jodit.modules.Dom.replace(
						list.firstChild,
						'p',
						editor.createInside
					);
					Jodit.modules.Dom.unwrap(list);
					return replacement;
				}
			}
		});

		expect(called).is.true;
		expect(editor.value).equals('<p>one</p>');
		expect(editor.s.sel.toString()).equals('one');
	});

	[2, true].forEach(value => {
		it(`Should merge into a list with a matching attribute ${value}`, () => {
			const editor = getJodit();
			editor.value = `<ul data-kind="${value}"><li>one</li></ul><p>|two|</p>`;
			setCursorToChar(editor);

			editor.s.commitStyle({
				element: 'ul',
				attributes: { 'data-kind': value }
			});

			expect(editor.editor.querySelectorAll('ul').length).equals(1);
			expect(editor.editor.querySelectorAll('li').length).equals(2);
		});
	});

	it('Should notify hooks when removing a class while other classes remain', () => {
		const editor = getJodit();
		editor.value = '<p><span class="keep highlight">|text|</span></p>';
		setCursorToChar(editor);
		const calls = [];

		editor.s.commitStyle({
			attributes: { class: 'highlight' },
			hooks: {
				afterToggleAttribute(mode, elm, key) {
					calls.push([mode, elm.className, key]);
				}
			}
		});

		expect(calls).deep.equals([['unset', 'keep', 'class']]);
	});

	['span', 'em', 'a'].forEach(tag => {
		it(`Should override overlapping CSS properties on a nested ${tag}`, () => {
			const editor = getJodit();
			editor.value = `<p>|a<${tag} data-id="keep" style="color:red;font-size:20px">b</${tag}>c|</p>`;
			setCursorToChar(editor);

			editor.s.commitStyle({
				attributes: {
					style: { color: 'blue', backgroundColor: 'yellow' }
				}
			});

			const nested = editor.editor.querySelector('[data-id="keep"]');
			expect(nested).is.not.null;
			expect(nested.tagName.toLowerCase()).equals(tag);
			expect(nested.style.fontSize).equals('20px');
			expect(editor.ew.getComputedStyle(nested).color).equals(
				'rgb(0, 0, 255)'
			);
			expect(editor.s.sel.toString()).equals('abc');
		});
	});

	['strong', 'h2'].forEach(element => {
		it(`Should leave a non-editable block unchanged when applying ${element}`, () => {
			const editor = getJodit();
			editor.value =
				'<p>|one</p><div contenteditable="false"><p>locked</p></div><p>two|</p>';
			setCursorToChar(editor);
			const locked = editor.editor.querySelector(
				'[contenteditable="false"]'
			);
			const original = locked.outerHTML;

			editor.s.commitStyle({ element });

			expect(locked.outerHTML).equals(original);
			expect(locked.isConnected).is.true;
			expect(editor.s.range.cloneContents().textContent).equals(
				'onelockedtwo'
			);
		});
	});

	it('Should not strip styles inside a non-editable inline subtree', () => {
		const editor = getJodit();
		editor.value =
			'<p>|a<span contenteditable="false"><span style="color:red;font-size:20px">locked</span></span>b|</p>';
		setCursorToChar(editor);
		const locked = editor.editor.querySelector('[contenteditable="false"]');
		const original = locked.innerHTML;

		editor.s.commitStyle({ attributes: { style: { color: 'red' } } });

		expect(locked.innerHTML).equals(original);
		expect(locked.isConnected).is.true;
	});

	[false, true].forEach(reverse => {
		it(`Should preserve attributes applied after removing the last CSS rule (reverse: ${reverse})`, () => {
			const editor = getJodit();
			editor.value = '<p><span style="color:red">|text|</span></p>';
			setCursorToChar(editor);
			const attributes = [
				['style', { color: null }],
				['class', 'highlight']
			];

			editor.s.commitStyle({
				attributes: Object.fromEntries(
					reverse ? attributes.reverse() : attributes
				)
			});

			expect(editor.value).equals(
				'<p><span class="highlight">text</span></p>'
			);
		});
	});

	['beforeWrapList', 'afterToggleAttribute'].forEach(hook => {
		it(`Should restore selection and release temporary nodes when ${hook} throws`, () => {
			const editor = getJodit();
			editor.value = '<p>o|ne</p><p>tw|o</p>';
			setCursorToChar(editor);
			const selected = editor.s.sel.toString();
			const failure = new Error('Hook failed');
			let calls = 0;

			expect(() =>
				editor.s.commitStyle({
					element: hook === 'beforeWrapList' ? 'ul' : 'span',
					attributes: { class: 'highlight' },
					hooks: {
						[hook]() {
							calls += 1;
							throw failure;
						}
					}
				})
			).to.throw(failure);

			expect(editor.editor.querySelector('font')).is.null;
			expect(editor.editor.textContent).equals('onetwo');
			expect(editor.s.sel.toString()).equals(selected);
			expect(editor.s.isInsideArea).is.true;
			expect(() =>
				editor.s.commitStyle({ element: 'em' })
			).not.to.throw();
			expect(calls).equals(1);
		});
	});

	[false, true].forEach(reverse => {
		it(`Should apply all CSS properties before removing an empty wrapper (reverse: ${reverse})`, () => {
			const editor = getJodit();
			editor.value = '<p><span style="color:red">|text|</span></p>';
			setCursorToChar(editor);
			const rules = [
				['color', null],
				['backgroundColor', 'yellow']
			];
			editor.s.commitStyle({
				attributes: {
					style: Object.fromEntries(reverse ? rules.reverse() : rules)
				}
			});

			const span = editor.editor.querySelector('span');
			expect(span).is.not.null;
			expect(span.style.color).equals('');
			expect(span.style.backgroundColor).equals('yellow');
			expect(span.textContent).equals('text');
			expect(editor.s.sel.toString()).equals('text');
		});
	});

	[null, 'red'].forEach(color => {
		it(`Should preserve unrelated attributes when removing color ${color}`, () => {
			const editor = getJodit();
			editor.value =
				'<p><span class="keep" data-id="42" style="color:red">|text|</span></p>';
			setCursorToChar(editor);

			editor.s.commitStyle({ attributes: { style: { color } } });

			const span = editor.editor.querySelector('span');
			expect(span).is.not.null;
			expect(span.className).equals('keep');
			expect(span.getAttribute('data-id')).equals('42');
			expect(span.hasAttribute('style')).is.false;
			expect(editor.s.sel.toString()).equals('text');
		});
	});

	['red', 'blue'].forEach(color => {
		it(`Should preserve other styles and attributes in nested spans when applying ${color}`, () => {
			const editor = getJodit();
			editor.value =
				'<p>|a<span style="color:red;font-size:20px" data-id="keep">b</span>c|</p>';
			setCursorToChar(editor);

			editor.s.commitStyle({ attributes: { style: { color } } });

			const nested = editor.editor.querySelector('[data-id="keep"]');
			expect(nested).is.not.null;
			expect(nested.style.fontSize).equals('20px');
			expect(nested.textContent).equals('b');
			expect(editor.s.sel.toString()).equals('abc');
		});
	});

	['class', 'className'].forEach(key => {
		it(`Should apply and remove multiple ${key} tokens without losing other classes`, () => {
			const editor = getJodit();
			editor.value = '<p><span class="keep">|text|</span></p>';
			setCursorToChar(editor);
			const options = { attributes: { [key]: 'first second' } };

			editor.s.commitStyle(options);
			let span = editor.editor.querySelector('span');
			expect(Array.from(span.classList).sort()).deep.equals([
				'first',
				'keep',
				'second'
			]);

			editor.s.commitStyle(options);
			span = editor.editor.querySelector('span');
			expect(span.className).equals('keep');
			expect(editor.s.sel.toString()).equals('text');
		});
	});

	it('Should reuse an adjacent list with all requested class tokens', () => {
		const editor = getJodit();
		editor.value = '<ul class="first second"><li>one</li></ul><p>|two|</p>';
		setCursorToChar(editor);

		editor.s.commitStyle({
			element: 'ul',
			attributes: { class: 'first second' }
		});

		expect(editor.editor.querySelectorAll('ul').length).equals(1);
		expect(editor.editor.querySelectorAll('li').length).equals(2);
		expect(editor.s.sel.toString()).equals('two');
	});

	it('Should preserve wrappers around unselected images when extracting text', () => {
		const editor = getJodit();
		editor.value =
			'<p><strong><img src="tests/artio.jpg">a|b|c</strong></p>';
		setCursorToChar(editor);

		editor.s.commitStyle({ element: 'strong' });

		expect(editor.editor.querySelector('img').parentNode.tagName).equals(
			'STRONG'
		);
		expect(editor.editor.querySelectorAll('strong').length).equals(2);
		expect(editor.s.sel.toString()).equals('b');
	});

	['strong', 'h2', 'ul'].forEach(element => {
		it(`Should preserve nested lists and selection when applying ${element}`, () => {
			const editor = getJodit();
			editor.value =
				'<ol><li>|one<ul><li>nested</li></ul></li><li>two|</li></ol>';
			setCursorToChar(editor);
			editor.s.commitStyle({ element });

			expect(editor.editor.textContent).equals('onenestedtwo');
			expect(editor.s.range.cloneContents().textContent).equals(
				'onenestedtwo'
			);
			expect(editor.editor.querySelector('li ul li').textContent).equals(
				'nested'
			);
			expect(editor.editor.querySelector('font')).is.null;
		});
	});
});
