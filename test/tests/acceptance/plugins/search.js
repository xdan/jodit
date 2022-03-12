/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Search plugin', function () {
	const search = Jodit.plugins.get('search'),
		findSomePartOfString = search.findSomePartOfString,
		getSomePartOfStringIndex = (needle, haystack) =>
			findSomePartOfString(needle, haystack, true);

	describe('Disable option', function () {
		it('Should not init plugin', function () {
			const editor = getJodit({
				useSearch: false,
				defaultTimeout: 0
			});

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;

			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;
		});
	});

	describe('CTRL + F', function () {
		it('Should show search form and query field must have focus', function () {
			const editor = getJodit({
				defaultTimeout: 0
			});

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;

			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(editor.container.querySelector('.jodit-ui-search')).is.not
				.null;

			const search = editor.container.querySelector('.jodit-ui-search');

			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
		});
	});

	describe('CTRL + H', function () {
		it('Should show search and replace form and query field must have focus', function () {
			const editor = getJodit({
				defaultTimeout: 0
			});

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;

			simulateEvent('keydown', 'h', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			const search = editor.container.querySelector('.jodit-ui-search');

			expect(search).is.not.null;

			expect(true).equals(
				search.classList.contains('jodit-ui-search_replace_true')
			);

			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
		});

		describe('Press Replace button', function () {
			it('Should replace value form query field to value from replace field in editor', function () {
				const editor = getJodit({
					defaultTimeout: 0
				});

				editor.value = 'test test test';

				expect(editor.container.querySelector('.jodit-ui-search')).is
					.null;

				simulateEvent(
					'keydown',
					'h',
					editor.editor,
					function (options) {
						options.ctrlKey = true;
					}
				);

				const search =
					editor.container.querySelector('.jodit-ui-search');

				expect(true).equals(
					search.classList.contains('jodit-ui-search_replace_true')
				);

				expect(true).equals(
					editor.ownerDocument.activeElement ===
						search.querySelector('[data-ref="query"]')
				);

				const query = search.querySelector('[data-ref="query"]');
				const replace = search.querySelector('[data-ref="replace"]');
				const replaceButton = search.querySelector(
					'[data-ref="replace-btn"]'
				);

				query.value = 't';
				replace.value = 'w';

				simulateEvent('click', replaceButton);
				simulateEvent('click', replaceButton);
				simulateEvent('click', replaceButton);
				simulateEvent('click', replaceButton);

				expect(editor.value).equals('<p>wesw wesw test</p>');
			});
		});
	});

	describe('F3 after search', function () {
		it('Should find a next match', function () {
			const editor = getJodit({
				defaultTimeout: 0
			});

			editor.value = '<p>|test| test test</p>';
			setCursorToChar(editor);

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;

			// press ctrl(cmd) + f
			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			const search = editor.container.querySelector('.jodit-ui-search');
			expect(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			).is.true;

			editor.s.removeMarkers();
			Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

			editor.events.fire('searchNext');

			simulateEvent('keydown', 'F3', editor.editor, function (options) {
				options.shiftKey = false;
			}); //

			const sel = editor.s.sel;

			expect(1).equals(sel.rangeCount);
			range = sel.getRangeAt(0);

			expect(editor.editor.firstChild.firstChild).equals(
				range.startContainer
			);
			expect(5).equals(range.startOffset);

			expect(editor.editor.firstChild.firstChild).equals(
				range.endContainer
			);
			expect(9).equals(range.endOffset);
		});

		it('Should find the next match in a circle', function () {
			const editor = getJodit({
				disablePlugins: ['WrapNodes'],

				history: {
					timeout: 0
				}
			});

			editor.value = '<p>|t|est test test</p>';
			setCursorToChar(editor);

			// press ctrl(cmd) + f
			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			const search = editor.container.querySelector('.jodit-ui-search');
			expect(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			).is.true;

			editor.s.removeMarkers();
			Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

			const sel = editor.s.sel;

			editor.events.fire('searchNext');
			[
				[3, 4],
				[5, 6],
				[8, 9],
				[10, 11],
				[13, 14],
				[0, 1],
				[3, 4]
			].forEach(function (pars) {
				simulateEvent(
					'keydown',
					'F3',
					editor.editor,
					function (options) {
						options.shiftKey = false;
					}
				); //

				expect(1).equals(sel.rangeCount);
				range = sel.getRangeAt(0);

				expect(pars[0]).equals(range.startOffset);
				expect(pars[1]).equals(range.endOffset);
			});
		});

		describe('with SHIFT key', function () {
			it('Should find a previous match', function () {
				const editor = getJodit({
					history: {
						timeout: 0
					}
				});

				editor.value = 'test test test';

				let range = editor.s.createRange(true);
				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				// press ctrl(cmd) + f
				simulateEvent(
					'keydown',
					'f',
					editor.editor,
					function (options) {
						options.ctrlKey = true;
					}
				);

				const search =
					editor.container.querySelector('.jodit-ui-search');

				expect(true).equals(
					editor.ownerDocument.activeElement ===
						search.querySelector('[data-ref="query"]')
				);

				editor.s.removeMarkers();
				Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

				editor.events.fire('searchNext');

				simulateEvent(
					'keydown',
					'F3',
					editor.editor,
					function (options) {
						options.shiftKey = true;
					}
				); //

				const sel = editor.s.sel;

				expect(1).equals(sel.rangeCount);
				range = sel.getRangeAt(0);

				expect(editor.editor.firstChild.firstChild).equals(
					range.startContainer
				);
				expect(10).equals(range.startOffset);

				expect(editor.editor.firstChild.firstChild).equals(
					range.endContainer
				);
				expect(14).equals(range.endOffset);
			});
		});
	});

	describe('Esc in query field', function () {
		it('Should hide search form and restore selection', function () {
			const editor = getJodit();
			editor.value = '<p>t|ex|t</p>';
			setCursorToChar(editor);

			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			const search = editor.container.querySelector('.jodit-ui-search');
			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
			simulateEvent(
				'keydown',
				Jodit.KEY_ESC,
				search.querySelector('[data-ref="query"]')
			);

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;
			expect('ex').equals(editor.s.sel.toString());
		});
	});

	describe('Unit test compare string', function () {
		describe('Get index of found string', function () {
			it('Should find needle in haystack', function () {
				const str = 'Mr John Smith washed window';

				expect(11).equals(getSomePartOfStringIndex('th was', str));

				expect(11).equals(getSomePartOfStringIndex('TH WAS', str));

				expect(false).equals(getSomePartOfStringIndex('TH WASNT', str));
			});

			it('Should find needle in haystack steb by step', function () {
				expect(false).equals(getSomePartOfStringIndex('th was', 'Mr'));
				expect(false).equals(
					getSomePartOfStringIndex('th was', 'Mr John')
				);

				expect(11).equals(
					getSomePartOfStringIndex('th was', 'Mr John Smith')
				);
				expect(11).equals(
					getSomePartOfStringIndex('th was', 'Mr John Smith wa')
				);
				expect(false).equals(
					getSomePartOfStringIndex('th was', 'Mr John Smith s')
				);

				expect(11).equals(
					getSomePartOfStringIndex('th was', 'Mr John Smith washed')
				);
				expect(11).equals(
					getSomePartOfStringIndex(
						'th was',
						'Mr John Smith washed window'
					)
				);
			});

			it('Should find needle in haystack step by step in back direction', function () {
				// const str = 'Mr John Smith washed window';
				expect(false).equals(
					getSomePartOfStringIndex('th was', 'window', false)
				);
				expect(0).equals(
					getSomePartOfStringIndex('th was', 'washed window', false)
				);
				expect(0).equals(
					getSomePartOfStringIndex('th was', 'h washed window', false)
				);
				expect(3).equals(
					getSomePartOfStringIndex(
						'th was',
						'Smith washed window',
						false
					)
				);
			});
		});

		describe('Compare strings and return boolean', function () {
			it('Should find needle in haystack', function () {
				const str = 'Mr John Smith washed window';

				expect(true).equals(findSomePartOfString('th was', str));
				expect(true).equals(findSomePartOfString('TH WAS', str));
				expect(true).equals(findSomePartOfString('TH  WAS', str));
				expect(false).equals(findSomePartOfString('TH WASNT', str));
			});

			it('Should find needle in haystack steb by step', function () {
				//const str = 'Mr John Smith washed window';
				expect(false).equals(findSomePartOfString('th was', 'Mr'));
				expect(false).equals(findSomePartOfString('th was', 'Mr John'));

				expect('th').equals(
					findSomePartOfString('th was', 'Mr John Smith')
				);

				expect('th wa').equals(
					findSomePartOfString('th was', 'Mr John Smith wa')
				);

				expect('th wa').equals(
					findSomePartOfString('th  was', 'Mr John Smith wa')
				);

				expect('th  wa').equals(
					findSomePartOfString('th was', 'Mr John Smith  wa')
				);

				expect(false).equals(
					findSomePartOfString('th was', 'Mr John Smith s')
				);

				expect(true).equals(
					findSomePartOfString('th was', 'Mr John Smith washed')
				);

				expect(true).equals(
					findSomePartOfString('th  was', 'Mr John Smith washed')
				);

				expect(true).equals(
					findSomePartOfString(
						'th was',
						'Mr John Smith washed window'
					)
				);
			});
			it('Should find needle in haystack steb by step in back direction', function () {
				// const str = 'Mr John Smith washed window';
				expect(false).equals(
					findSomePartOfString('th was', 'window', false)
				);
				expect('was').equals(
					findSomePartOfString('th was', 'washed window', false)
				);
				expect('h was').equals(
					findSomePartOfString('th was', 'h washed window', false)
				);
				expect(true).equals(
					findSomePartOfString('th was', 'Smith washed window', false)
				);
			});
		});

		describe('Haystack less needle', function () {
			it('Should return false', function () {
				expect(false).equals(findSomePartOfString('th was', ' ', true));
				expect(false).equals(
					findSomePartOfString('Smith washed window', 'washed', true)
				);
			});
		});
	});

	describe('Fire search event', function () {
		it('Should select some elements which consists query string', function () {
			const editor = getJodit({
				defaultTimeout: 0
			});
			editor.value =
				'<p><span>Mr</span> <span>John</span> <span>Smith</span> <span>washed</span> <span>window</span></p>';
			const sel = editor.s.sel;
			sel.removeAllRanges();

			editor.events.fire('search', 'th was');
			expect(1).equals(sel.rangeCount);
			const range = sel.getRangeAt(0);

			expect(editor.editor.firstChild.childNodes[4].firstChild).equals(
				range.startContainer
			);
			expect(3).equals(range.startOffset);

			expect(editor.editor.firstChild.childNodes[6].firstChild).equals(
				range.endContainer
			);
			expect(3).equals(range.startOffset);
		});
	});

	describe('Find by toolbar button event', function () {
		describe('Press Search button', function () {
			it('Should open search dialog', function () {
				const editor = getJodit({
					defaultTimeout: 0
				});

				clickButton('find', editor);

				expect(
					editor.container.querySelector('.jodit-search.jodit-search')
				).is.not.null;
			});
		});

		describe('Press Replace button', function () {
			it('Should open search dialog', function () {
				const editor = getJodit({
					defaultTimeout: 0
				});

				clickTrigger('find', editor);
				clickButton('replace', getOpenedPopup(editor));

				expect(
					editor.container.querySelector(
						'.jodit-search.jodit-search.jodit-ui-search_replace'
					)
				).is.not.null;
			});
		});
	});
});
