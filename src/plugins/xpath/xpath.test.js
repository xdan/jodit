/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Path plugin', function () {
	describe('After init', function () {
		describe('With showXPathInStatusbar=true', function () {
			it('Should show status bar', function () {
				const editor = getJodit({
					language: 'en',
					showXPathInStatusbar: true,
					showCharsCounter: false,
					showWordsCounter: false,
					history: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';

				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(
					editor.ownerWindow.getComputedStyle(statusbar).display
				).equals('flex');
			});

			it('Should show path to selection element', function () {
				const editor = getJodit({
					language: 'en',
					showXPathInStatusbar: true,
					history: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text <a href="#">sss</a></p>';
				editor.s.setCursorIn(editor.editor.querySelector('a'));

				const statusbar = editor.container.querySelector(
					'.jodit-status-bar .jodit-xpath'
				);

				expect(statusbar).is.not.null;
				expect(statusbar.firstChild.textContent.trim()).equals('');
				expect(statusbar.childNodes[1].textContent).equals('p');
				expect(statusbar.childNodes[2].textContent).equals('a');
			});

			describe('After change selection', function () {
				it('Should change path to selection element', function () {
					const editor = getJodit({
						language: 'en',
						showXPathInStatusbar: true,
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>Simple text <a href="#">sss</a><span>s</span></p>';
					editor.s.setCursorIn(editor.editor.querySelector('a'));

					const statusbar = editor.container.querySelector(
						'.jodit-status-bar .jodit-xpath'
					);

					expect(statusbar).is.not.null;
					expect(statusbar.firstChild.innerText).equals('');
					expect(statusbar.childNodes[1].textContent).equals('p');
					expect(statusbar.childNodes[2].textContent).equals('a');

					editor.s.setCursorIn(editor.editor.querySelector('span'));

					expect(statusbar.firstChild.innerText).equals('');
					expect(statusbar.childNodes[1].textContent).equals('p');
					expect(statusbar.childNodes[2].textContent).equals('span');
				});
			});

			describe('After click on element of path', function () {
				it('Should select this element', function () {
					const editor = getJodit({
						language: 'en',
						showXPathInStatusbar: true,
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>Simple text <a href="#">sss</a><span>s</span></p>';
					editor.s.setCursorIn(editor.editor.querySelector('a'));

					const statusbar = editor.container.querySelector(
						'.jodit-status-bar .jodit-xpath'
					);

					expect(statusbar).is.not.null;
					expect(statusbar.firstChild.innerText).equals('');
					expect(statusbar.childNodes[1].textContent).equals('p');
					expect(statusbar.childNodes[2].textContent).equals('a');

					simulateEvent(
						'click',
						0,
						statusbar.childNodes[2].firstChild
					); // click on A

					expect(
						Jodit.modules.Helpers.trim(editor.s.sel.toString())
					).equals('sss');
					expect(statusbar.childNodes[2].textContent).equals('a');

					simulateEvent(
						'click',
						0,
						statusbar.childNodes[1].firstChild
					); // click on P

					expect(
						Jodit.modules.Helpers.trim(editor.s.sel.toString())
					).equals('Simple text ssss');
					expect(statusbar.childNodes.length).equals(3);
				});
			});

			describe('Context menu on element of path', function () {
				it('Should open context menu', function () {
					const editor = getJodit({
						language: 'en',
						showXPathInStatusbar: true,
						history: {
							timeout: 0
						}
					});

					editor.value =
						'<p>Simple text <a href="#">sss</a><span>s</span></p>';

					editor.s.setCursorIn(editor.editor.querySelector('a'));

					const statusbar = editor.container.querySelector(
						'.jodit-status-bar .jodit-xpath'
					);

					expect(statusbar).is.not.null;
					expect(statusbar.firstChild.innerText).equals('');
					expect(statusbar.childNodes[1].textContent).equals('p');
					expect(statusbar.childNodes[2].textContent).equals('a');

					const elm = statusbar.childNodes[2].querySelector('a'),
						pos = Jodit.modules.Helpers.position(elm);

					simulateEvent('contextmenu', 0, elm, function (o) {
						Object.assign(o, {
							clientX: pos.left + 10,
							clientY: pos.top + 10
						});
					});

					const context = getOpenedPopup(editor);

					expect(context).is.not.null;
					expect(
						editor.ownerWindow.getComputedStyle(context).display
					).equals('block');

					simulateEvent('click', 0, context.querySelector('button'));
					expect(editor.value).equals(
						'<p>Simple text <span>s</span></p>'
					);

					expect(context.parentNode).is.null;
				});
			});
		});
	});
});
