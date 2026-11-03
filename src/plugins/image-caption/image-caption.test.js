/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
// https://github.com/xdan/jodit/issues/1714
describe('Image caption plugin', () => {
	const IMAGE = '<img alt="" src="tests/artio.jpg" style="width: 300px;">';
	const FIGURE =
		'<figure style="width: 300px;"><img alt="" src="tests/artio.jpg" style="width: 100%;"><figcaption>A caption</figcaption></figure>';

	const froala = {
		imageCaption: {
			wrapper: { tag: 'span', className: 'fr-img-caption' },
			inner: { tag: 'span', className: 'fr-img-wrap' },
			caption: { tag: 'span', className: 'fr-inner' }
		}
	};

	const toggle = (editor, on) => {
		const result = editor.e.fire(
			'toggleImageCaption',
			editor.editor.querySelector('img'),
			on
		);
		editor.synchronizeValues();

		return result;
	};

	const setCaret = (editor, node, offset) => {
		const range = editor.s.createRange();
		range.setStart(node, offset);
		range.collapse(true);
		editor.s.selectRange(range);
	};

	const caption = editor => editor.editor.querySelector('figcaption');

	// A caption given is in the value only once it has text
	const markup = editor =>
		sortAttributes(
			editor.editor.innerHTML.replace(
				/ (contenteditable|data-jodit-placeholder)="[^"]*"/g,
				''
			)
		);

	describe('Caption on', () => {
		it('should put an image on a line of its own in a figure with an empty caption, which it returns', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p><p>${IMAGE}</p><p>After</p>`;

			const result = toggle(editor);

			expect(result).equals(caption(editor));
			expect(markup(editor)).equals(
				'<p>Before</p><figure style="width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption><br></figcaption></figure><p>After</p>'
			);
		});

		it('should split the paragraph round an image in a line of text', () => {
			const editor = getJodit();
			editor.value = `<p>Before ${IMAGE} after</p>`;

			toggle(editor);

			expect(markup(editor)).equals(
				'<p>Before </p><figure style="width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption><br></figcaption></figure><p> after</p>'
			);
		});

		it("should take the image's link in with it", () => {
			const editor = getJodit();
			editor.value = `<p><a href="https://xdsoft.net">${IMAGE}</a></p>`;

			toggle(editor);

			expect(markup(editor)).equals(
				'<figure style="width:300px"><a href="https://xdsoft.net"><img alt="" src="tests/artio.jpg" style="width:100%"></a><figcaption><br></figcaption></figure>'
			);
		});

		it("should move the image's alignment and margins to the figure", () => {
			const editor = getJodit();
			editor.value =
				'<p><img alt="" src="tests/artio.jpg" style="float: left; margin: 10px; width: 300px;"></p>';

			toggle(editor);

			expect(markup(editor)).equals(
				'<figure style="float:left;margin:10px;width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption><br></figcaption></figure>'
			);
		});

		it("should move the image's alignment classes to the figure", () => {
			const editor = getJodit({
				alignClasses: {
					img: { left: 'align-left', right: 'align-right' }
				}
			});
			editor.value =
				'<p><img alt="" class="align-right" src="tests/artio.jpg" style="width: 300px;"></p>';

			toggle(editor);

			expect(markup(editor)).equals(
				'<figure class="align-right" style="width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption><br></figcaption></figure>'
			);
		});

		it('should take the width of an image with a width attribute', () => {
			const editor = getJodit();
			editor.value =
				'<p><img alt="" src="tests/artio.jpg" width="200"></p>';

			toggle(editor);

			expect(markup(editor)).equals(
				'<figure style="width:200px"><img alt="" src="tests/artio.jpg" style="width:100%" width="200"><figcaption><br></figcaption></figure>'
			);
		});

		it('should write the markup it is given, leaving an inline wrapper in its line', () => {
			const editor = getJodit({
				...froala,
				alignClasses: {
					img: { center: 'fr-fic fr-dib', normal: 'fr-fic fr-dii' }
				}
			});
			editor.value =
				'<p>Before <img alt="" class="fr-fic fr-dib" src="tests/artio.jpg" style="width: 300px;"> after</p>';

			toggle(editor);

			expect(markup(editor)).equals(
				'<p>Before <span class="fr-img-caption fr-fic fr-dib" style="width:300px"><span class="fr-img-wrap"><img alt="" src="tests/artio.jpg" style="width:100%"><span class="fr-inner"><br></span></span></span> after</p>'
			);
		});
	});

	describe('Caption off', () => {
		it('should leave the image in a paragraph of its own, with the alignment, margins and width the figure had', () => {
			const editor = getJodit();
			editor.value =
				'<p>Before</p><figure style="float: right; margin: 10px; width: 250px;"><a href="https://xdsoft.net"><img alt="" src="tests/artio.jpg" style="width: 100%;"></a><figcaption>A caption</figcaption></figure><p>After</p>';

			expect(toggle(editor)).is.null;
			expect(sortAttributes(editor.value)).equals(
				'<p>Before</p><p><a href="https://xdsoft.net"><img alt="" src="tests/artio.jpg" style="float:right;margin:10px;width:250px"></a></p><p>After</p>'
			);
		});

		it('should leave the image in its line for an inline wrapper', () => {
			const editor = getJodit({
				...froala,
				alignClasses: {
					img: { center: 'fr-fic fr-dib', normal: 'fr-fic fr-dii' }
				}
			});
			editor.value =
				'<p>Before <span class="fr-img-caption fr-fic fr-dib" style="width: 251px;"><span class="fr-img-wrap"><img src="tests/artio.jpg"><span class="fr-inner">A caption</span></span></span> after</p>';

			toggle(editor);

			expect(sortAttributes(editor.value)).equals(
				'<p>Before <img class="fr-fic fr-dib" src="tests/artio.jpg" style="width:251px"> after</p>'
			);
		});

		it('should only go the way it is asked', () => {
			const editor = getJodit();
			editor.value = `<p>${IMAGE}</p>`;

			expect(toggle(editor, false)).is.undefined;
			expect(editor.editor.querySelector('figure')).is.null;

			toggle(editor, true);
			expect(toggle(editor, true)).is.undefined;
			expect(editor.editor.querySelectorAll('figure').length).equals(1);
		});
	});

	describe('Captions in the content', () => {
		it('should keep the figure from being edited apart from its caption, without that in the value', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}`;

			const figure = editor.editor.querySelector('figure');

			expect(figure.getAttribute('contenteditable')).equals('false');
			expect(caption(editor).getAttribute('contenteditable')).equals(
				'true'
			);
			expect(sortAttributes(editor.value)).equals(
				sortAttributes(`<p>Before</p>${FIGURE}`)
			);
		});

		it('should leave out of the source view the attributes it adds', () => {
			const editor = getJodit({ sourceEditor: 'area' });
			editor.value = FIGURE;

			editor.setMode(Jodit.MODE_SOURCE);

			expect(editor.getElementValue()).does.not.contain(
				'contenteditable'
			);
			expect(
				editor.container.querySelector('textarea.jodit-source__mirror')
					.value
			).does.not.contain('contenteditable');

			editor.setMode(Jodit.MODE_WYSIWYG);

			expect(
				editor.editor
					.querySelector('figure')
					.getAttribute('contenteditable')
			).equals('false');
		});

		it('should recognise the markup it is given', () => {
			const editor = getJodit(froala);
			editor.value =
				'<p><span class="fr-img-caption fr-fic fr-dib" style="width: 251px;"><span class="fr-img-wrap"><img src="tests/artio.jpg"><span class="fr-inner">A caption</span></span></span></p>';

			expect(
				editor.editor
					.querySelector('.fr-img-caption')
					.getAttribute('contenteditable')
			).equals('false');
			expect(
				editor.editor
					.querySelector('.fr-inner')
					.getAttribute('contenteditable')
			).equals('true');
		});

		it('should leave a figure holding no image, or two, as it is', () => {
			const editor = getJodit();
			const value =
				'<figure><table><tbody><tr><td>1</td></tr></tbody></table><figcaption>A table</figcaption></figure>' +
				'<figure><img alt="" src="tests/artio.jpg"><img alt="" src="tests/artio.jpg"><figcaption>Two</figcaption></figure>';
			editor.value = value;

			expect(editor.editor.querySelector('[contenteditable]')).is.null;
			expect(editor.value).equals(value);
		});
	});

	describe('Caption button in the image popup', () => {
		it('should caption the image with the caret in the caption, and show the image is captioned', async () => {
			const editor = getJodit({ defaultTimeout: 0 });
			editor.value = `<p>${IMAGE}</p>`;

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();

			const button = getButton('caption', getOpenedPopup(editor));
			expect(button.getAttribute('aria-pressed')).equals('false');

			clickButton('caption', getOpenedPopup(editor));
			editor.s.insertHTML('Arohanui');

			expect(sortAttributes(editor.value)).equals(
				'<figure style="width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption>Arohanui</figcaption></figure>'
			);

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();

			expect(
				getButton('caption', getOpenedPopup(editor)).getAttribute(
					'aria-pressed'
				)
			).equals('true');
		});

		it('should open below the caption, so the caption stays in view', async () => {
			const editor = getJodit({ defaultTimeout: 0, height: 700 });
			editor.value = FIGURE.replace('300px', '100px');

			const img = editor.editor.querySelector('img');
			await onLoadImage(img);

			simulateEvent('click', img);
			await editor.async.requestIdlePromise();

			const popup = getOpenedPopup(editor);

			expect(Math.round(popup.getBoundingClientRect().top)).is.at.least(
				Math.floor(caption(editor).getBoundingClientRect().bottom)
			);
		});

		it('should take the caption off, keeping the popup open', async () => {
			const editor = getJodit({ defaultTimeout: 0 });
			editor.value = FIGURE;

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();
			clickButton('caption', getOpenedPopup(editor));
			await editor.async.requestIdlePromise();

			expect(sortAttributes(editor.value)).equals(
				'<p><img alt="" src="tests/artio.jpg" style="width:300px"></p>'
			);
			expect(getOpenedPopup(editor)).is.not.null;
			expect(
				getButton('caption', getOpenedPopup(editor)).getAttribute(
					'aria-pressed'
				)
			).equals('false');
		});

		it('should align and delete the figure', async () => {
			const editor = getJodit({ defaultTimeout: 0 });
			editor.value = `<p>Before</p>${FIGURE}`;
			editor.s.focus();

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();
			clickTrigger('left', getOpenedPopup(editor));
			clickButton('Right', getOpenedPopup(editor));

			expect(sortAttributes(editor.value)).equals(
				'<p>Before</p><figure style="float:right;width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption>A caption</figcaption></figure>'
			);

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();

			expect(
				getButton('valign', getOpenedPopup(editor)).hasAttribute(
					'disabled'
				)
			).is.true;

			clickButton('delete', getOpenedPopup(editor));

			expect(editor.value).equals('<p>Before</p>');
		});
	});

	describe('Keys in a caption', () => {
		it('should start a line after the figure on Enter', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}<p>After</p>`;

			setCaret(editor, caption(editor).firstChild, 9);
			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
			editor.s.insertHTML('Next');

			expect(sortAttributes(editor.value)).equals(
				sortAttributes(`<p>Before</p>${FIGURE}<p>Next</p><p>After</p>`)
			);
		});

		it('should break the line in the caption on Shift+Enter', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			setCaret(editor, caption(editor).firstChild, 1);
			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor, data => {
				data.shiftKey = true;
			});

			expect(caption(editor).innerHTML).equals('A<br> caption');
		});

		it('should break the line after an inline wrapper on Enter', () => {
			const editor = getJodit(froala);
			editor.value =
				'<p>Before <span class="fr-img-caption" style="width: 251px;"><span class="fr-img-wrap"><img src="tests/artio.jpg"><span class="fr-inner">A caption</span></span></span> after</p>';

			setCaret(
				editor,
				editor.editor.querySelector('.fr-inner').firstChild,
				1
			);
			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

			expect(sortAttributes(editor.value)).equals(
				'<p>Before <span class="fr-img-caption" style="width:251px"><span class="fr-img-wrap"><img src="tests/artio.jpg"><span class="fr-inner">A caption</span></span></span></p><p> after</p>'
			);
		});

		it('should keep the image on Backspace at the start of the caption and Delete at its end', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			setCaret(editor, caption(editor).firstChild, 0);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			setCaret(editor, caption(editor).firstChild, 9);
			simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);

			expect(sortAttributes(editor.value)).equals(sortAttributes(FIGURE));
		});

		it('should delete in the caption as in any line', () => {
			const editor = getJodit();
			editor.value =
				'<figure style="width: 300px;"><img alt="" src="tests/artio.jpg" style="width: 100%;"><figcaption>A <strong>bold</strong> caption</figcaption></figure>';

			setCaret(editor, caption(editor).lastChild, 0);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(caption(editor).innerHTML).equals(
				'A <strong>bol</strong> caption'
			);
		});

		it('should take the caret out, with a line of its own, when an arrow key can go no further', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}`;

			setCaret(editor, caption(editor).firstChild, 9);
			simulateEvent(['keydown', 'keyup'], Jodit.KEY_DOWN, editor.editor);
			editor.s.insertHTML('After');

			expect(sortAttributes(editor.value)).equals(
				sortAttributes(`<p>Before</p>${FIGURE}<p>After</p>`)
			);

			setCaret(editor, caption(editor).firstChild, 0);
			simulateEvent(['keydown', 'keyup'], Jodit.KEY_UP, editor.editor);
			editor.s.insertHTML('!');

			expect(editor.editor.firstChild.textContent).equals('Before!');
		});

		it('should leave an arrow key that moved the caret alone', () => {
			const editor = getJodit();
			editor.value = `${FIGURE}<p>After</p>`;

			setCaret(editor, caption(editor).firstChild, 9);
			simulateEvent('keydown', Jodit.KEY_DOWN, editor.editor);
			setCaret(editor, editor.editor.querySelector('p').firstChild, 2);
			simulateEvent('keyup', Jodit.KEY_DOWN, editor.editor);

			expect(editor.s.range.startOffset).equals(2);
			expect(editor.editor.querySelectorAll('p').length).equals(1);
		});

		it('should select the caption on Select all', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}`;

			setCaret(editor, caption(editor).firstChild, 2);
			editor.execCommand('selectall');

			expect(editor.s.range.toString()).equals('A caption');
		});

		it('should format the caption, but not turn it into a heading or list', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			const range = editor.s.createRange();
			range.setStart(caption(editor).firstChild, 2);
			range.setEnd(caption(editor).firstChild, 9);
			editor.s.selectRange(range);

			editor.execCommand('bold');
			editor.execCommand('formatBlock', false, 'h2');
			editor.execCommand('insertUnorderedList');

			expect(caption(editor).innerHTML).equals(
				'A <strong>caption</strong>'
			);
		});
	});

	describe('Links and other content in a caption', () => {
		const selectWord = editor => {
			const range = editor.s.createRange();
			range.setStart(caption(editor).firstChild, 2);
			range.setEnd(caption(editor).firstChild, 9);
			editor.s.selectRange(range);
		};

		it('should select the link put on part of the caption, not the captioned image', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}`;

			selectWord(editor);
			clickButton('link', editor);
			const popup = getOpenedPopup(editor);
			popup.querySelector('[ref=url_input]').value = 'https://xdsoft.net';
			simulateEvent('submit', popup.querySelector('form'));

			expect(caption(editor).innerHTML).equals(
				'A <a href="https://xdsoft.net">caption</a>'
			);
			expect(editor.s.range.toString()).equals('caption');
			expect(caption(editor).contains(editor.s.range.startContainer)).is
				.true;
		});

		it('should put an image, a table or a rule inserted in a caption after the captioned image', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			setCaret(editor, caption(editor).firstChild, 9);
			editor.s.insertImage('tests/artio.jpg', null, 100);

			expect(caption(editor).innerHTML).equals('A caption');
			expect(editor.editor.querySelectorAll('img').length).equals(2);
			expect(
				editor.editor
					.querySelector('figure')
					.contains(editor.editor.querySelectorAll('img')[1])
			).is.false;

			setCaret(editor, caption(editor).firstChild, 9);
			editor.execCommand('insertHorizontalRule');

			setCaret(editor, caption(editor).firstChild, 9);
			editor.s.insertHTML(
				'<table><tbody><tr><td>1</td></tr></tbody></table>'
			);

			expect(caption(editor).innerHTML).equals('A caption');
			expect(editor.value).does.not.contain('contenteditable');
			expect(
				editor.editor.querySelector('figure').nextElementSibling
					.nodeName
			).equals('TABLE');
		});

		it('should take text and inline formatting into the caption', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			setCaret(editor, caption(editor).firstChild, 9);
			editor.s.insertHTML(' at <strong>the river</strong>');

			expect(sortAttributes(editor.value)).equals(
				'<figure style="width:300px"><img alt="" src="tests/artio.jpg" style="width:100%"><figcaption>A caption at <strong>the river</strong></figcaption></figure>'
			);
		});
	});

	describe('Selected captioned image', () => {
		it('should be selected with its caption by a click on the image', () => {
			const editor = getJodit();
			editor.value = FIGURE;
			editor.e.fire('change');

			simulateEvent('mousedown', editor.editor.querySelector('img'));

			expect(editor.s.range.startContainer).equals(editor.editor);
			expect(
				editor.s.range.startContainer.childNodes[
					editor.s.range.startOffset
				]
			).equals(editor.editor.querySelector('figure'));
		});

		it('should leave its line empty on Delete, as an image on a line of its own does', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}<p>After</p>`;

			editor.s.select(editor.editor.querySelector('figure'));
			simulateEvent('keydown', Jodit.KEY_DELETE, editor.editor);
			editor.s.insertHTML('X');

			expect(editor.value).equals('<p>Before</p><p>X</p><p>After</p>');
		});
	});

	describe('Resizing a captioned image', () => {
		it('should resize the figure, which the image fills', async () => {
			const editor = getJodit();
			editor.value = FIGURE;

			const img = editor.editor.querySelector('img');
			await onLoadImage(img);

			simulateEvent(['mousedown', 'mouseup', 'click'], img);

			const resizer = document.querySelector(
				'.jodit-resizer[data-editor_id=' + editor.id + ']'
			);
			const handle = resizer.getElementsByTagName('div')[1];
			const pos = offset(handle);

			simulateEvent('mousedown', handle, data => {
				data.clientX = pos.left;
				data.clientY = pos.top;
			});
			simulateEvent('mousemove', editor.ow, data => {
				data.clientX = pos.left + 20;
				data.clientY = pos.top;
			});
			simulateEvent('mouseup', editor.ow, data => {
				data.clientX = pos.left + 20;
				data.clientY = pos.top;
			});

			const figure = editor.editor.querySelector('figure');

			expect(figure.style.width).equals('320px');
			expect(img.style.width).equals('100%');
			expect(img.offsetWidth).equals(320);
		});
	});

	describe('Dragging a captioned image', () => {
		it('should move the figure, splitting the paragraph it is dropped in', () => {
			const editor = getJodit({ disablePlugins: ['sticky'] });
			editor.value = `${FIGURE}<p style="height: 24px;">1111</p><p style="height: 24px;">2222</p>`;

			simulateEvent('mousedown', editor.editor.querySelector('img'));
			editor.editor.scrollIntoView();

			const box = Jodit.modules.Helpers.position(
				editor.editor.querySelectorAll('p')[1],
				editor
			);

			['mousemove', 'mouseup'].forEach(type =>
				simulateEvent(type, editor.editor, options => {
					options.clientX = box.left + 15;
					options.clientY = box.top + 5;
				})
			);

			expect(sortAttributes(editor.value)).equals(
				sortAttributes(
					`<p style="height: 24px;">1111</p><p style="height: 24px;">22</p>${FIGURE}<p style="height: 24px;">22</p>`
				)
			);
		});
	});

	describe('Image properties dialog', () => {
		const open = async (editor, img) => {
			await img.decode();
			await waitForImageLoaded(img);
			simulateEvent('dblclick', img);

			const dialog = getOpenedDialog(editor);

			await new Promise(resolve => {
				editor.e.one('updateImageProperties.imageproperties', resolve);
				setTimeout(resolve, 1500);
			});
			await editor.async.requestIdlePromise();

			return {
				dialog,
				form: dialog.querySelector('.jodit-ui-image-properties-form')
					.component
			};
		};

		it("should show the figure's width, margins and alignment, and write them back to it", async () => {
			const editor = getJodit();
			editor.value =
				'<figure style="float: left; margin: 10px; width: 250px;"><img alt="" src="tests/artio.jpg" style="width: 100%;"><figcaption>A caption</figcaption></figure>';

			const { dialog, form } = await open(
				editor,
				editor.editor.querySelector('img')
			);

			expect(form.getElm('imageCaption').checked).is.true;
			expect(form.getElm('imageWidth').value).equals('250');
			expect(form.getElm('marginTop').value).equals('10');
			expect(form.getElm('align').value).equals('left');

			form.getElm('imageWidth').value = '200';
			simulateEvent('change', form.getElm('imageWidth'));
			form.getElm('align').value = 'right';
			simulateEvent('change', form.getElm('align'));
			clickButton('ok', dialog);

			expect(sortAttributes(editor.value)).equals(
				'<figure style="float:right;margin:10px;width:200px"><img src="tests/artio.jpg" style="width:100%"><figcaption>A caption</figcaption></figure>'
			);
		});

		it('should caption the image and take its caption off', async () => {
			const editor = getJodit();
			editor.value = `<p>${IMAGE}</p>`;

			let { dialog, form } = await open(
				editor,
				editor.editor.querySelector('img')
			);

			expect(form.getElm('imageCaption').checked).is.false;

			form.getElm('imageCaption').checked = true;
			simulateEvent('change', form.getElm('imageCaption'));
			clickButton('ok', dialog);

			expect(markup(editor)).equals(
				'<figure style="width:300px"><img src="tests/artio.jpg" style="width:100%"><figcaption><br></figcaption></figure>'
			);
			expect(editor.ed.activeElement).equals(
				editor.editor.querySelector('figcaption')
			);

			({ dialog, form } = await open(
				editor,
				editor.editor.querySelector('img')
			));

			form.getElm('imageCaption').checked = false;
			simulateEvent('change', form.getElm('imageCaption'));
			clickButton('ok', dialog);

			expect(markup(editor)).equals(
				'<p><img src="tests/artio.jpg" style="width:300px"></p>'
			);
		});

		it('should hide the Caption checkbox, and leave the caption as it is, with showCaptionCheckbox off', async () => {
			const editor = getJodit({ image: { showCaptionCheckbox: false } });
			editor.value = FIGURE;

			const { dialog, form } = await open(
				editor,
				editor.editor.querySelector('img')
			);

			expect(form.getElm('captionCheckbox').style.display).equals('none');

			clickButton('ok', dialog);

			expect(
				editor.editor.querySelector('figcaption').textContent
			).equals('A caption');
		});

		it('should keep a caption that is inside the link when the link is taken off', async () => {
			const editor = getJodit(froala);
			editor.value =
				'<p><span class="fr-img-caption" style="width: 250px;"><span class="fr-img-wrap"><a href="https://xdsoft.net"><img src="tests/artio.jpg" style="width: 100%;"><span class="fr-inner">A caption</span></a></span></span></p>';

			const { dialog, form } = await open(
				editor,
				editor.editor.querySelector('img')
			);

			form.getElm('imageLink').value = '';
			simulateEvent('change', form.getElm('imageLink'));
			clickButton('ok', dialog);

			expect(sortAttributes(editor.value)).equals(
				'<p><span class="fr-img-caption" style="width:250px"><span class="fr-img-wrap"><img src="tests/artio.jpg" style="width:100%"><span class="fr-inner">A caption</span></span></span></p>'
			);
		});
	});

	describe('Blank captions', () => {
		const PLACEHOLDER = 'data-jodit-placeholder';

		it('should show a placeholder until there is text', () => {
			const editor = getJodit();
			editor.value = `<p>${IMAGE}</p>`;

			toggle(editor);

			expect(caption(editor).getAttribute(PLACEHOLDER)).equals('Caption');

			setCaret(editor, caption(editor), 0);
			caption(editor).prepend(editor.createInside.text('A'));
			simulateEvent('input', editor.editor);

			expect(caption(editor).hasAttribute(PLACEHOLDER)).is.false;
		});

		it('should leave the placeholder out of the value', () => {
			const editor = getJodit();
			editor.value = FIGURE;

			setCaret(editor, caption(editor), 0);
			caption(editor).textContent = '';
			simulateEvent('input', editor.editor);

			expect(caption(editor).getAttribute(PLACEHOLDER)).equals('Caption');
			expect(sortAttributes(editor.value)).equals(
				sortAttributes(FIGURE.replace('A caption', ''))
			);
		});

		describe('Saving while a caption given is still blank', () => {
			it('should save the line as it was, and report no change, until something is typed in the caption', () => {
				const editor = getJodit();
				const value = `<p class="intro">The class went to the river ${IMAGE} and tested the water.</p>`;
				editor.value = value;
				const changes = [];
				editor.e.on('change', html => changes.push(html));

				setCaret(editor, toggle(editor), 0);

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(value)
				);
				expect(sortAttributes(editor.getElementValue())).equals(
					sortAttributes(value)
				);
				expect(changes).deep.equals([]);

				editor.s.insertHTML('Arohanui');

				expect(editor.value).contains(
					'<figcaption>Arohanui</figcaption>'
				);
				expect(changes).has.length(1);
			});

			it('should save an image alone in its line as it was', () => {
				const editor = getJodit();
				const value = `<p class="intro"><strong>${IMAGE}</strong></p><p>After</p>`;
				editor.value = value;

				toggle(editor);

				expect(sortAttributes(editor.value)).equals(
					sortAttributes(value)
				);
			});

			it('should save a linked image in a line with an inline caption as it was', () => {
				const editor = getJodit(froala);
				const value = `<p>The river <a href="https://xdsoft.net/">${IMAGE}</a> was cold.</p>`;
				editor.value = value;

				toggle(editor);

				expect(editor.editor.querySelector('.fr-img-caption')).is.not
					.null;
				expect(sortAttributes(editor.value)).equals(
					sortAttributes(value)
				);
			});
		});

		it('should take the placeholder away as text is pasted', () => {
			const editor = getJodit({ defaultTimeout: 100 });
			editor.value = `<p>${IMAGE}</p>`;

			setCaret(editor, toggle(editor), 0);
			simulatePaste(editor.editor, 'Pasted');

			expect(caption(editor).textContent).equals('Pasted');
			expect(caption(editor).hasAttribute(PLACEHOLDER)).is.false;
		});

		it("should show the placeholder in the editor's language, in iframe mode too", () => {
			const editor = getJodit({ iframe: true, language: 'de' });
			editor.value = `<p>${IMAGE}</p>`;

			toggle(editor);

			expect(
				editor.ew.getComputedStyle(caption(editor), '::before').content
			).equals('"Beschriftung"');
		});

		it('should give the focus to a caption the popup button adds', async () => {
			const editor = getJodit({ defaultTimeout: 0 });
			editor.value = `<p>${IMAGE}</p>`;

			simulateEvent('click', editor.editor.querySelector('img'));
			await editor.async.requestIdlePromise();
			clickButton('caption', getOpenedPopup(editor));

			expect(editor.ed.activeElement).equals(caption(editor));
		});

		describe('When the focus leaves', function () {
			// Headless Firefox fires no focus events while its window isn't focused
			beforeEach(function () {
				if (!document.hasFocus()) {
					this.skip();
				}
			});

			it('should put the line back as it was, with no step and the caret where it went, when a caption is left blank', async () => {
				const editor = getJodit({ history: { timeout: 0 } });
				const value = `<p class="intro">The class went to the river ${IMAGE} and tested the water.</p>`;
				editor.value = value;
				const steps = editor.history.length;

				toggle(editor).focus();

				const text = editor.editor.querySelector('p').firstChild;
				setCaret(editor, text, 3);
				editor.editor.focus();
				await delay(10);

				expect(markup(editor)).equals(sortAttributes(value));
				expect(editor.history.length).equals(steps);
				expect(editor.history.canRedo()).is.false;
				expect(editor.s.range.startContainer).equals(text);
				expect(editor.s.range.startOffset).equals(3);
			});

			it('should take a caption left blank off, and keep one with text', async () => {
				const editor = getJodit();
				editor.value = `<p>${IMAGE}</p>${FIGURE}`;

				toggle(editor).focus();
				editor.editor.focus();
				await delay(10);

				expect(markup(editor)).equals(
					sortAttributes(`<p>${IMAGE}</p>${FIGURE}`)
				);

				caption(editor).focus();
				editor.editor.focus();
				await delay(10);

				expect(markup(editor)).equals(
					sortAttributes(`<p>${IMAGE}</p>${FIGURE}`)
				);
			});

			it("should keep a blank caption while the editor's own popup has the focus, and take it off when the focus leaves the editor", async () => {
				const editor = getJodit();
				editor.value = `<p>${IMAGE}</p>`;

				toggle(editor).focus();
				clickButton('link', editor);
				getOpenedPopup(editor).querySelector('input').focus();
				await delay(10);

				expect(caption(editor)).is.not.null;

				const outside = document.createElement('input');
				document.body.appendChild(outside);

				caption(editor).focus();
				outside.focus();
				await delay(10);
				outside.remove();

				expect(markup(editor)).equals(
					sortAttributes(`<p>${IMAGE}</p>`)
				);
			});

			it('should wait for the click to end when the focus goes to the image, and then open its popup below it', async function () {
				// Headless Firefox fires no focus events while its window isn't
				// focused, and in CI it moves the focus off the caption late or not
				// at all on this synthetic press, so the blank caption stays
				if (!document.hasFocus() || /Firefox/.test(navigator.userAgent)) {
					this.skip();
				}

				const editor = getJodit({ defaultTimeout: 0, height: 700 });
				const image = IMAGE.replace('300px', '100px');
				editor.value = `<p>${image}</p>`;

				const img = editor.editor.querySelector('img');
				await onLoadImage(img);

				toggle(editor).focus();

				// The browsers move the focus as the image is selected, before the
				// press reaches the editor, and fire no click when its target moves
				// while pressed
				img.addEventListener('mousedown', () => editor.editor.focus());
				simulateEvent('mousedown', img);
				await delay(10);

				expect(caption(editor)).is.not.null;

				simulateEvent(['mouseup', 'click'], img);
				// The popup opens on the click's own timer, slow in CI Firefox
				await waitForCondition(() => getOpenedPopup(editor), 2000);

				expect(markup(editor)).equals(
					sortAttributes(`<p>${image}</p>`)
				);

				const popup = getOpenedPopup(editor);
				const bottom = img.getBoundingClientRect().bottom;

				expect(
					getButton('caption', popup).getAttribute('aria-pressed')
				).equals('false');
				expect(popup.getBoundingClientRect().top).is.within(
					bottom,
					bottom + 10
				);
			});

			it('should take a blank caption off on Enter, leaving the line after the image', async () => {
				const editor = getJodit();
				editor.value = `<p>${IMAGE}</p>`;

				toggle(editor).focus();
				setCaret(editor, caption(editor), 0);
				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				await delay(10);
				editor.s.insertHTML('Next');

				expect(markup(editor)).equals(
					sortAttributes(`<p>${IMAGE}</p><p>Next</p>`)
				);
			});
		});
	});

	describe('Focus in a caption', () => {
		it('should keep the editor focused, without saving the selection, as the focus moves into the caption', () => {
			const editor = getJodit();
			editor.value = `<p>Before</p>${FIGURE}`;

			let blurs = 0;
			editor.e.on('blur', () => (blurs += 1));

			editor.s.focus();
			caption(editor).focus();

			expect(blurs).equals(0);
			expect(editor.editorIsActive).is.true;
			expect(editor.editor.querySelector('[data-jodit-selection_marker]'))
				.is.null;
		});

		it("should outline the caption with Jodit's focus colour, not the browser's", function () {
			// Headless Firefox matches no `:focus` while its window isn't focused
			if (!document.hasFocus()) {
				this.skip();
			}

			const editor = getJodit();
			editor.value = FIGURE;

			caption(editor).focus();

			const style = editor.ew.getComputedStyle(caption(editor));
			expect(style.outlineStyle).equals('solid');
			expect(style.outlineColor).equals('rgb(30, 136, 229)');
		});
	});

	describe('Undo', () => {
		const LINE = `<p class="intro">The class went to the river ${IMAGE} and tested the water.</p>`;

		it('should take a blank caption off, as it was never a step', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value = `<p>${IMAGE}</p>`;
			const steps = editor.history.length;

			toggle(editor);
			editor.execCommand('undo');

			expect(markup(editor)).equals(sortAttributes(`<p>${IMAGE}</p>`));
			expect(editor.history.length).equals(steps);
		});

		it('should go back to before the caption, not to a blank one, from the first thing typed in it', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value = LINE;

			setCaret(editor, toggle(editor), 0);
			editor.s.insertHTML('Arohanui');
			editor.execCommand('undo');

			expect(markup(editor)).equals(sortAttributes(LINE));
		});

		it('should leave the line as it was, and no step, when a caption is given and taken off again', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value = LINE;
			const steps = editor.history.length;

			toggle(editor);
			toggle(editor);

			expect(markup(editor)).equals(sortAttributes(LINE));
			expect(editor.history.length).equals(steps);
			expect(editor.history.canRedo()).is.false;
		});
	});
});
