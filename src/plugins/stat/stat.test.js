/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Stat plugin', () => {
	describe('After init and change', () => {
		it('Should show chars count and words count', () => {
			const editor = getJodit({
				language: 'en',
				showCharsCounter: true,
				countHTMLChars: false,
				showHTMLCharsCounter: true,
				history: {
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

		describe('Count spaces', () => {
			it('Should show chars count with spaces', () => {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: true,
					countTextSpaces: true,
					showHTMLCharsCounter: true,
					defaultTimeout: 0
				});

				editor.value =
					'<p>Simple text</p>\n\n<p>Simple&nbsp;&nbsp;text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(
					Number(/Chars: (\d+)+/.exec(statusbar.textContent)[1])
				).equals(23);
				expect(
					Number(/Words: (\d+)+/.exec(statusbar.textContent)[1])
				).equals(4);
			});
		});

		describe('Count HTML Chars', () => {
			it('Should show real HTML chars count', () => {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: true,
					countHTMLChars: true,
					showHTMLCharsCounter: true,
					history: {
						timeout: 0
					}
				});

				editor.value = '<p>Simple text</p><p>Simple text</p>';
				const statusbar =
					editor.container.querySelector('.jodit-status-bar');

				expect(
					Number(/Chars: (\d+)+/.exec(statusbar.textContent)[1])
				).equals(36);
			});
		});

		describe('Hide chars count', () => {
			it('Should show only words count', () => {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: true,
					history: {
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

		describe('Hide words count', () => {
			it('Should show only chars count', () => {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: true,
					showWordsCounter: false,
					history: {
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

		describe('Hide words and chars count', () => {
			it('Should hide status bar', () => {
				const editor = getJodit({
					language: 'en',
					showCharsCounter: false,
					showWordsCounter: false,
					showXPathInStatusbar: false,
					history: {
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
