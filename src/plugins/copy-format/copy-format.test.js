/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Copy format plugin', function () {
	it('Should copy fontWeight from element and paste it in new selection', function () {
		getBox().style.width = 'auto';
		const editor = getJodit();

		editor.value = '<div>text <strong>test</strong> post</div>';
		editor.s.focus();
		editor.s.setCursorIn(editor.editor.querySelector('strong'));

		expect(getButton('copyformat', editor)).is.not.null;

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('false');

		simulateEvent('click', 0, getButton('copyformat', editor));

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('true');

		const range = editor.s.createRange();

		range.selectNode(editor.editor.firstChild.lastChild);
		editor.s.selectRange(range);

		simulateEvent('mouseup', 0, editor.editor);

		expect(editor.value.replace('700', 'bold')).equals(
			'<div>text <strong>test</strong><span style="font-weight: bold;"> post</span></div>'
		);
	});

	it('Should copy fontSize from element and paste it in new selection', function () {
		getBox().style.width = 'auto';
		const editor = getJodit();

		editor.value =
			'<div>text <span style="font-size: 11px;">test</span> post</div>';
		editor.s.focus();
		editor.s.setCursorIn(editor.editor.querySelector('span'));

		expect(getButton('copyformat', editor)).is.not.null;
		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('false');

		clickButton('copyformat', editor);

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('true');

		const range = editor.s.createRange(true);
		range.selectNode(editor.editor.firstChild.lastChild);

		simulateEvent('mouseup', 0, editor.editor);

		expect(editor.value).equals(
			'<div>text <span style="font-size: 11px;">test</span><span style="font-size: 11px;"> post</span></div>'
		);
	});

	describe('Test', function () {
		it('Should copy fontSize and color from element and paste it in new selection', function () {
			getBox().style.width = 'auto';
			const editor = getJodit();

			editor.value =
				'<div>text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post</div>';
			editor.s.focus();

			editor.s.setCursorIn(editor.editor.querySelector('span'));

			expect(
				getButton('copyformat', editor).getAttribute('aria-pressed')
			).equals('false');

			clickButton('copyformat', editor);

			expect(
				getButton('copyformat', editor).getAttribute('aria-pressed')
			).equals('true');

			const range = editor.s.createRange(true);

			range.selectNode(editor.editor.firstChild.lastChild);

			simulateEvent('mouseup', 0, editor.editor);

			expect(sortAttributes(editor.value)).equals(
				'<div>text <span style="color:#FF0000;font-size:11px">test</span><span style="color:#FF0000;font-size:11px"> post</span></div>'
			);
		});
	});

	it('Should toggle active state after double click', function () {
		getBox().style.width = 'auto';

		const editor = getJodit();

		editor.value =
			'text <span style="font-size: 11px;color: rgb(255, 0, 0);">test</span> post';
		editor.s.focus();

		editor.s.setCursorIn(editor.editor.querySelector('span'));

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('false');

		clickButton('copyformat', editor);

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('true');

		clickButton('copyformat', editor);

		expect(
			getButton('copyformat', editor).getAttribute('aria-pressed')
		).equals('false');

		const sel = editor.s.sel,
			range = editor.s.createRange();

		range.selectNode(editor.editor.firstChild.lastChild);
		sel.removeAllRanges();
		sel.addRange(range);

		simulateEvent('mouseup', 0, editor.editor);

		expect(sortAttributes(editor.value)).equals(
			'<p>text <span style="color:#FF0000;font-size:11px">test</span> post</p>'
		);
	});

	describe('For image', function () {
		it('Should copy format from one image to another', function () {
			getBox().style.width = 'auto';

			const editor = getJodit(),
				html =
					'<p><img src="tests/artio.jpg" ' +
					'style="height: 100px;width: 100px; margin: 20px; border-image: none; border:1px solid #CCCCCC; border-radius: 50%;"> test ' +
					'<img style="height: 100px;width: 100px;" src="tests/artio.jpg"></p>';

			editor.value = html;
			editor.s.focus();

			expect(sortAttributes(editor.value)).equals(sortAttributes(html));

			simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

			clickButton('copyformat', editor);

			simulateEvent(
				'mousedown',
				0,
				editor.editor.querySelectorAll('img')[1]
			);
			simulateEvent(
				'mouseup',
				0,
				editor.editor.querySelectorAll('img')[1]
			);

			expect(sortAttributes(editor.value)).equals(
				sortAttributes(
					'<p><img src="tests/artio.jpg" ' +
						'style="border-image:none;border-radius:50%;border:1px solid #CCCCCC;height:100px;margin:20px;width:100px"> test ' +
						'<img src="tests/artio.jpg" ' +
						'style="border-image:none;border-color:#CCCCCC;border-radius:50%;border-style:solid;border-width:1px;height:100px;margin:20px;width:100px"></p>'
				)
			);
		});
	});

	describe('Set cursor inside em[style=background] > strong elements', function () {
		it('Should copy fontWeight from strong element, copy italic and background  style from em  and paste it in new selection', function () {
			getBox().style.width = 'auto';
			const editor = getJodit();

			editor.value =
				'<div>text <em style="background-color: #ff0000"><strong>test</strong></em> post</div>';
			editor.s.focus();

			editor.s.setCursorIn(editor.editor.querySelector('strong'));
			expect(
				getButton('copyformat', editor).getAttribute('aria-pressed')
			).equals('false');

			clickButton('copyformat', editor);

			expect(
				getButton('copyformat', editor).getAttribute('aria-pressed')
			).equals('true');

			const range = editor.s.createRange(true);

			range.selectNode(editor.editor.firstChild.lastChild);

			simulateEvent('mouseup', 0, editor.editor);

			expect(
				sortAttributes(
					editor
						.getEditorValue()
						.replace(/700/g, 'bold')
						.replace(/rgb\(255, 0, 0\)/g, '#ff0000')
				)
			).equals(
				'<div>text <em style="background-color:#ff0000"><strong>test</strong></em><span style="background-color:#ff0000;font-style:italic;font-weight:bold"> post</span></div>'
			);
		});
	});
});
