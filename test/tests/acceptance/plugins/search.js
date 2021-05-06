/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Search plugin', function () {
	const search = Jodit.plugins.get('search');

	describe('Disable option', function () {
		it('Should not init plugin', function () {
			const editor = getJodit({
				useSearch: false,
				observer: {
					timeout: 0
				}
			});

			expect(editor.container.querySelector('.jodit-search')).is.null;

			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(editor.container.querySelector('.jodit-search')).is.null;
		});
	});

	describe('CTRL + F', function () {
		it('Should show search form and query field must have focus', function () {
			const editor = getJodit({
				observer: {
					timeout: 0
				}
			});

			const search = editor.container.querySelector('.jodit-search');

			expect(false).equals(
				search.classList.contains('jodit-search_active')
			);

			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit-search_active')
			);

			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
		});
	});

	describe('CTRL + H', function () {
		it('Should show search and replace form and query field must have focus', function () {
			const editor = getJodit({
				observer: {
					timeout: 0
				}
			});

			const search = editor.container.querySelector('.jodit-search');
			expect(false).equals(
				search.classList.contains('jodit-search_active')
			);

			simulateEvent('keydown', 'h', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit-search_active')
			);

			expect(true).equals(
				search.classList.contains('jodit-search_replace')
			);

			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
		});

		describe('Press Replace button', function () {
			it('Should replace value form query field to value from replace field in editor', function () {
				const editor = getJodit({
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test test';

				const search = editor.container.querySelector('.jodit-search');
				expect(false).equals(
					search.classList.contains('jodit-search_active')
				);
				simulateEvent(
					'keydown',
					'h',
					editor.editor,
					function (options) {
						options.ctrlKey = true;
					}
				);

				expect(true).equals(
					search.classList.contains('jodit-search_active')
				);

				expect(true).equals(
					search.classList.contains('jodit-search_replace')
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

				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);

				expect(editor.value).equals('<p>wesw wesw test</p>');
			});
		});
	});

	describe('F3 after search', function () {
		it('Should find a next match', function () {
			const editor = getJodit({
				observer: {
					timeout: 0
				}
			});

			editor.value = '<p>|test| test test</p>';
			setCursorToChar(editor);

			const search = editor.container.querySelector('.jodit-search');
			expect(search.classList.contains('jodit-search_active')).is.false;

			// press ctrl(cmd) + f
			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(search.classList.contains('jodit-search_active')).is.true;

			console.log(editor.ownerDocument.activeElement);
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
				disablePlugins: ['WrapTextNodes'],

				observer: {
					timeout: 0
				}
			});

			editor.value = 'test test test';

			let range = editor.s.createRange(true);
			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.firstChild, 1);

			const search = editor.container.querySelector('.jodit-search');

			expect(search.classList.contains('jodit-search_active')).is.false;

			// press ctrl(cmd) + f
			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(search.classList.contains('jodit-search_active')).is.true;
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
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test test';

				let range = editor.s.createRange(true);
				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 4);

				const search = editor.container.querySelector('.jodit-search');

				expect(false).equals(
					search.classList.contains('jodit-search_active')
				);

				// press ctrl(cmd) + f
				simulateEvent(
					'keydown',
					'f',
					editor.editor,
					function (options) {
						options.ctrlKey = true;
					}
				);

				expect(true).equals(
					search.classList.contains('jodit-search_active')
				);
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
			editor.value = '<p>text</p>';

			const range = editor.s.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 1);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			const sel = editor.s.sel;
			sel.removeAllRanges();
			sel.addRange(range);

			const search = editor.container.querySelector('.jodit-search');
			expect(false).equals(
				search.classList.contains('jodit-search_active')
			);
			simulateEvent('keydown', 'f', editor.editor, function (options) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit-search_active')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
					search.querySelector('[data-ref="query"]')
			);
			simulateEvent(
				'keydown',
				Jodit.KEY_ESC,
				search.querySelector('[data-ref="query"]')
			);

			expect(false).equals(
				search.classList.contains('jodit-search_active')
			);
			expect('ex').equals(sel.toString());
		});
	});

	describe('Unit test compare string', function () {
		describe('Get index of found string', function () {
			it('Should find needle in haystack', function () {
				const str = 'Mr John Smith washed window';

				expect(11).equals(
					search.getSomePartOfStringIndex('th was', str)
				);

				expect(11).equals(
					search.getSomePartOfStringIndex('TH WAS', str)
				);

				expect(false).equals(
					search.getSomePartOfStringIndex('TH WASNT', str)
				);
			});

			it('Should find needle in haystack steb by step', function () {
				expect(false).equals(
					search.getSomePartOfStringIndex('th was', 'Mr')
				);
				expect(false).equals(
					search.getSomePartOfStringIndex('th was', 'Mr John')
				);

				expect(11).equals(
					search.getSomePartOfStringIndex('th was', 'Mr John Smith')
				);
				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith wa'
					)
				);
				expect(false).equals(
					search.getSomePartOfStringIndex('th was', 'Mr John Smith s')
				);

				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith washed'
					)
				);
				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith washed window'
					)
				);
			});

			it('Should find needle in haystack steb by step in back direction', function () {
				// const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.getSomePartOfStringIndex('th was', 'window', false)
				);
				expect(0).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'washed window',
						false
					)
				);
				expect(0).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'h washed window',
						false
					)
				);
				expect(3).equals(
					search.getSomePartOfStringIndex(
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
				expect(true).equals(search.findSomePartOfString('th was', str));
				expect(true).equals(search.findSomePartOfString('TH WAS', str));
				expect(true).equals(
					search.findSomePartOfString('TH  WAS', str)
				);
				expect(false).equals(
					search.findSomePartOfString('TH WASNT', str)
				);
			});

			it('Should find needle in haystack steb by step', function () {
				//const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.findSomePartOfString('th was', 'Mr')
				);
				expect(false).equals(
					search.findSomePartOfString('th was', 'Mr John')
				);

				expect('th').equals(
					search.findSomePartOfString('th was', 'Mr John Smith')
				);

				expect('th wa').equals(
					search.findSomePartOfString('th was', 'Mr John Smith wa')
				);

				expect('th wa').equals(
					search.findSomePartOfString('th  was', 'Mr John Smith wa')
				);

				expect('th  wa').equals(
					search.findSomePartOfString('th was', 'Mr John Smith  wa')
				);

				expect(false).equals(
					search.findSomePartOfString('th was', 'Mr John Smith s')
				);

				expect(true).equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith washed'
					)
				);

				expect(true).equals(
					search.findSomePartOfString(
						'th  was',
						'Mr John Smith washed'
					)
				);

				expect(true).equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith washed window'
					)
				);
			});
			it('Should find needle in haystack steb by step in back direction', function () {
				// const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.findSomePartOfString('th was', 'window', false)
				);
				expect('was').equals(
					search.findSomePartOfString(
						'th was',
						'washed window',
						false
					)
				);
				expect('h was').equals(
					search.findSomePartOfString(
						'th was',
						'h washed window',
						false
					)
				);
				expect(true).equals(
					search.findSomePartOfString(
						'th was',
						'Smith washed window',
						false
					)
				);
			});
		});

		describe('Haystack less needle', function () {
			it('Should return false', function () {
				expect(false).equals(
					search.findSomePartOfString('th was', ' ', true)
				);
				expect(false).equals(
					search.findSomePartOfString(
						'Smith washed window',
						'washed',
						true
					)
				);
			});
		});
	});

	describe('Fire search event', function () {
		it('Should select some elements which consists query string', function () {
			const editor = getJodit({
				observer: {
					timeout: 0
				}
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
					observer: {
						timeout: 0
					}
				});

				clickButton('find', editor);

				expect(
					editor.container.querySelector(
						'.jodit-search.jodit-search_active'
					)
				).is.not.null;
			});
		});

		describe('Press Replace button', function () {
			it('Should open search dialog', function () {
				const editor = getJodit({
					observer: {
						timeout: 0
					}
				});

				clickTrigger('find', editor);
				clickButton('replace', getOpenedPopup(editor));

				expect(
					editor.container.querySelector(
						'.jodit-search.jodit-search_active.jodit-search_replace'
					)
				).is.not.null;
			});
		});
	});
});
