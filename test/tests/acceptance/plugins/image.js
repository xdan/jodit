describe('Process Images plugins', function() {
	describe('Toolbar', function() {
		describe('Click on Image button', function() {
			it('Should open image dialog and insert image by url.', function() {
				const editor = new Jodit(appendTestArea());

				editor.value = Jodit.INVISIBLE_SPACE; // IE in iframe mode can loose focus and we can not check where it paste image in start or in finish. It is only in IE

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent(
					'mousedown',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image'
					)
				);

				const list = editor.container.querySelector(
					'.jodit_toolbar_popup'
				);

				expect(window.getComputedStyle(list).display).equals('block');

				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url]'
				).value = ''; // try wrong url

				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=text]'
				).value = '123';
				simulateEvent(
					'submit',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_form'
					)
				);

				expect(
					editor.container.querySelectorAll(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url].jodit_error'
					).length
				).equals(1);

				editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url]'
				).value = 'http://xdsoft.net/jodit/images/artio.jpg';

				simulateEvent(
					'submit',
					0,
					editor.container.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_form'
					)
				);

				expect(sortAttributes(editor.value)).equals(
					'<img alt="123" src="http://xdsoft.net/jodit/images/artio.jpg" style="width:300px">'
				);

				simulateEvent('mousedown', 0, editor.editor);

				expect(list.parentNode).is.null;
			});

			describe('When the cursor in the middle of some text', function() {
				it('Should insert image in this position after submit', function() {
					const editor = new Jodit(appendTestArea());

					editor.value = 'hello world!';

					const range = editor.selection.createRange();

					range.setEnd(editor.editor.firstChild, 5);
					range.collapse(false);
					editor.selection.selectRange(range);

					simulateEvent(
						'mousedown',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-image'
						)
					);

					const list = editor.container.querySelector(
						'.jodit_toolbar_popup'
					), input = list.querySelector(
						'.jodit_toolbar_btn.jodit_toolbar_btn-image input[name=url]'
					);

					input.focus();
					input.value = 'http://xdsoft.net/jodit/images/artio.jpg';

					simulateEvent(
						'submit',
						0,
						editor.container.querySelector(
							'.jodit_toolbar_btn.jodit_toolbar_btn-image .jodit_form'
						)
					);

					expect(sortAttributes(editor.value)).equals(
						'hello<img alt="" src="http://xdsoft.net/jodit/images/artio.jpg" style="width:300px"> world!'
					);
				});
			});
		});
	});
});
