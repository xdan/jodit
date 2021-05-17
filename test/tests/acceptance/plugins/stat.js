/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Stat plugin', function () {
	describe('After init and change', function () {
		it('Should show chars count and words count', function () {
			const editor = getJodit({
				language: 'en',
				showCharsCounter: true,
				countHTMLChars: false,
				showHTMLCharsCounter: true,
				observer: {
					timeout: 0
				}
			});

			editor.value = '<p>Simple text</p><p>Simple text</p>';
			const statusbar =
				editor.container.querySelector('.jodit-status-bar');

			expect(statusbar).is.not.null;

			expect(statusbar.textContent.match(/Chars: 20/)).is.not.null;

			expect(statusbar.textContent.match(/Words: 4/)).does.not.equal(
				null
			);
		});

		describe('Count HTML Chars', function () {
			it('Should show real HTML chars count', function () {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: true,
					countHTMLChars: true,
					showHTMLCharsCounter: true,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p><p>Simple text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(statusbar.textContent.match(/Chars: 36/)).is.not.null;
			});
		});

		describe('Hide chars count', function () {
			it('Should show only words count', function () {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: true,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(statusbar).is.not.null;

				expect(statusbar.textContent.match(/Chars: 10/)).is.null;
				expect(statusbar.textContent.match(/Words: 2/)).is.not.null;
			});
		});

		describe('Hide words count', function () {
			it('Should show only chars count', function () {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: true,
					showWordsCounter: false,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(statusbar).is.not.null;

				expect(statusbar.textContent.match(/Chars: 10/)).is.not.null;
				expect(statusbar.textContent.match(/Words: 2/)).equals(null);
			});
		});

		describe('Hide words and chars count', function () {
			it('Should hide status bar', function () {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: false,
					showXPathInStatusbar: false,
					observer: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(statusbar).is.not.null;

				expect(statusbar.textContent.match(/Chars: 10/)).is.null;
				expect(statusbar.textContent.match(/Words: 2/)).equals(null);
				expect(statusbar.offsetHeight).equals(0);
			});
		});
	});
});
