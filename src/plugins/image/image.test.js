/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Process Images plugins', function () {
	describe('Toolbar', function () {
		describe('uploader.showTabInFileSelector', function () {
			// https://github.com/xdan/jodit/issues/1406
			it('Should hide the Upload tab when disabled, keeping Browse and URL', function () {
				const editor = getJodit({
					uploader: {
						url: 'https://example.com/upload',
						showTabInFileSelector: false
					},
					filebrowser: {
						ajax: {
							url: 'https://example.com/filebrowser'
						}
					}
				});

				clickButton('image', editor);
				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				const labels = Array.from(
					popup.querySelectorAll('.jodit-tabs__button')
				).map(b => b.textContent.trim());

				expect(labels).to.deep.equal(['Browse', 'URL']);
			});

			it('Should show the Upload tab by default', function () {
				const editor = getJodit({
					uploader: {
						url: 'https://example.com/upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://example.com/filebrowser'
						}
					}
				});

				clickButton('image', editor);
				const popup = getOpenedPopup(editor);

				const labels = Array.from(
					popup.querySelectorAll('.jodit-tabs__button')
				).map(b => b.textContent.trim());

				expect(labels).to.deep.equal(['Upload', 'Browse', 'URL']);
			});
		});

		describe('Click on Image button with filebrowser', function () {
			it('Should size the insert-image tabs to their labels without clipping long localized captions', function () {
				// 3 tabs (Upload/Browse/URL) in Russian: 'Загрузка' is longer
				// than the equal-column width and used to be clipped.
				const editor = getJodit({
					language: 'ru',
					uploader: {
						url: 'https://example.com/upload'
					},
					filebrowser: {
						ajax: {
							url: 'https://example.com/filebrowser'
						}
					}
				});

				clickButton('image', editor);
				const popup = getOpenedPopup(editor);
				expect(popup).is.not.null;

				// The insert-image/file popup is tagged so its tabs auto-size
				// independently of other tab popups (link, video …).
				expect(popup.querySelector('.jodit-file-selector')).is.not.null;

				const tabButtons = popup.querySelectorAll(
					'.jodit-tabs__button'
				);
				expect(tabButtons.length).to.equal(3);

				// No tab label is clipped: its text fits its own box.
				tabButtons.forEach(btn => {
					const textEl = btn.querySelector('.jodit-ui-button__text');
					expect(textEl).is.not.null;
					expect(textEl.scrollWidth).to.be.at.most(
						textEl.clientWidth,
						`Tab "${textEl.textContent.trim()}" is clipped`
					);
				});

				// Tabs are content-sized, not forced to equal columns, so the
				// longest ('Загрузка') is wider than the shortest ('URL').
				const upload = Array.from(tabButtons).find(
					b => b.textContent.trim() === 'Загрузка'
				);
				const url = Array.from(tabButtons).find(
					b => b.textContent.trim() === 'URL'
				);
				expect(upload).is.not.undefined;
				expect(url).is.not.undefined;
				expect(upload.offsetWidth).to.be.above(url.offsetWidth);
			});
		});

		describe('Click on Image button', function () {
			it('Should open image dialog and insert image by url.', function () {
				const editor = getJodit();

				editor.value = Jodit.INVISIBLE_SPACE; // IE in iframe mode can loose focus and we can not check where it paste image in start or in finish. It is only in IE

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor);
				range.collapse(false);

				clickButton('image', editor);

				const list = getOpenedPopup(editor);

				expect(window.getComputedStyle(list).display).equals('block');

				list.querySelector('input[name=url]').value = ''; // try wrong url

				list.querySelector('input[name=text]').value = '123';

				simulateEvent('submit', 0, list.querySelector('form'));

				expect(
					list.querySelectorAll('.jodit-ui-input_has-error_true')
						.length
				).equals(1);

				list.querySelector('input[name=url]').value =
					'https://xdsoft.net/jodit/files/artio.jpg';

				simulateEvent('submit', 0, list.querySelector('form'));

				expect(sortAttributes(editor.value)).equals(
					'<p><img alt="123" src="https://xdsoft.net/jodit/files/artio.jpg" style="width:300px"></p>'
				);

				simulateEvent('mousedown', 0, editor.editor);

				expect(list.parentNode).is.null;
			});

			describe('Insert src without protocol', () => {
				it('Should add double slashes.', function () {
					const editor = getJodit();

					editor.value = '<p>test|</p>';
					setCursorToChar(editor);
					clickButton('image', editor);
					const list = getOpenedPopup(editor);

					list.querySelector('input[name=url]').value =
						'xdsoft.net/jodit/files/artio.jpg';

					simulateEvent('submit', list.querySelector('form'));

					expect(sortAttributes(editor.value)).equals(
						'<p>test<img alt="" src="//xdsoft.net/jodit/files/artio.jpg" style="width:300px"></p>'
					);
				});
			});

			describe('When the cursor in the middle of some text', function () {
				it('Should insert image in this position after submit', function () {
					const editor = getJodit();

					editor.value = 'hello world!';

					const range = editor.s.createRange();

					range.setEnd(editor.editor.firstChild.firstChild, 5);
					range.collapse(false);
					editor.s.selectRange(range);

					clickButton('image', editor);

					const list = getOpenedPopup(editor),
						input = list.querySelector('input[name=url]');

					input.focus();
					input.value = 'https://xdsoft.net/jodit/files/artio.jpg';

					simulateEvent('submit', 0, list.querySelector('form'));

					expect(sortAttributes(editor.value)).equals(
						'<p>hello<img alt="" src="https://xdsoft.net/jodit/files/artio.jpg" style="width:300px"> world!</p>'
					);
				});
			});
		});
	});
});
