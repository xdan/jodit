describe('Search plugin', function() {
	const search = Jodit.plugins.get('search');

	describe('CTRL + F', function() {
		it('Should show search form and query field must have focus', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0
				}
			});
			const search = editor.container.querySelector('.jodit_search');
			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);
			simulateEvent('keydown', Jodit.KEY_F, editor.editor, function(
				options
			) {
				options.ctrlKey = true;
			});
			expect(true).equals(
				search.classList.contains('jodit_search-active')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
				search.querySelector('.jodit_search-query')
			);
		});
	});

	describe('CTRL + H', function() {
		it('Should show search and replace form and query field must have focus', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0
				}
			});

			const search = editor.container.querySelector('.jodit_search');
			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);
			simulateEvent('keydown', Jodit.KEY_H, editor.editor, function(
				options
			) {
				options.ctrlKey = true;
			});
			expect(true).equals(
				search.classList.contains('jodit_search-active')
			);
			expect(true).equals(
				search.classList.contains('jodit_search-and-replace')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
				search.querySelector('.jodit_search-query')
			);
		});

		describe('Press Replace button', function() {
			it('Should replace value form query field to value from replace field in editor', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test test';

				const search = editor.container.querySelector(
					'.jodit_search'
				);
				expect(false).equals(
					search.classList.contains('jodit_search-active')
				);
				simulateEvent(
					'keydown',
					Jodit.KEY_H,
					editor.editor,
					function(options) {
						options.ctrlKey = true;
					}
				);

				expect(true).equals(
					search.classList.contains('jodit_search-active')
				);

				expect(true).equals(
					search.classList.contains('jodit_search-and-replace')
				);

				expect(true).equals(
					editor.ownerDocument.activeElement ===
					search.querySelector('.jodit_search-query')
				);

				const query = search.querySelector('.jodit_search-query');
				const replace = search.querySelector(
					'.jodit_search-replace'
				);
				const replaceButton = search.querySelector(
					'.jodit_search_buttons-replace'
				);

				query.value = 't';
				replace.value = 'w';

				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);
				simulateEvent('click', 0, replaceButton);

				expect('wesw wesw test').equals(
					editor.value
				);
			});
		});
	});

	describe('F3 after search', function() {
		it('Should find a next match', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0
				}
			});

			editor.value = 'test test test';

			let range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.firstChild, 4);
			editor.selection.selectRange(range);

			const search = editor.container.querySelector('.jodit_search');
			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);

			// press ctrl(cmd) + f
			simulateEvent('keydown', Jodit.KEY_F, editor.editor, function(
				options
			) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit_search-active')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
				search.querySelector('.jodit_search-query')
			);

			editor.selection.removeMarkers();
			Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

			editor.events.fire('searchNext');

			simulateEvent('keydown', Jodit.KEY_F3, editor.editor, function(
				options
			) {
				options.shiftKey = false;
			}); //

			const sel = editor.selection.sel;

			expect(1).equals(sel.rangeCount);
			range = sel.getRangeAt(0);

			expect(editor.editor.firstChild).equals(range.startContainer);
			expect(5).equals(range.startOffset);

			expect(editor.editor.firstChild).equals(range.endContainer);
			expect(9).equals(range.endOffset);
		});

		it('Should find the next match in a circle', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0
				}
			});

			editor.value = 'test test test';

			let range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild, 0);
			range.setEnd(editor.editor.firstChild, 1);
			editor.selection.selectRange(range);

			const search = editor.container.querySelector('.jodit_search');

			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);

			// press ctrl(cmd) + f
			simulateEvent('keydown', Jodit.KEY_F, editor.editor, function(
				options
			) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit_search-active')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
				search.querySelector('.jodit_search-query')
			);

			editor.selection.removeMarkers();
			Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

			const sel = editor.selection.sel;

			editor.events.fire('searchNext');
			[
				[3, 4],
				[5, 6],
				[8, 9],
				[10, 11],
				[13, 14],
				[0, 1],
				[3, 4]
			].forEach(function(pars) {
				simulateEvent(
					'keydown',
					Jodit.KEY_F3,
					editor.editor,
					function(options) {
						options.shiftKey = false;
					}
				); //

				expect(1).equals(sel.rangeCount);
				range = sel.getRangeAt(0);

				expect(pars[0]).equals(range.startOffset);
				expect(pars[1]).equals(range.endOffset);
			});
		});

		describe('with SHIFT key', function() {
			it('Should find a previous match', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test test test';

				let range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild, 0);
				range.setEnd(editor.editor.firstChild, 4);
				editor.selection.selectRange(range);

				const search = editor.container.querySelector(
					'.jodit_search'
				);

				expect(false).equals(
					search.classList.contains('jodit_search-active')
				);

				// press ctrl(cmd) + f
				simulateEvent(
					'keydown',
					Jodit.KEY_F,
					editor.editor,
					function(options) {
						options.ctrlKey = true;
					}
				);

				expect(true).equals(
					search.classList.contains('jodit_search-active')
				);
				expect(true).equals(
					editor.ownerDocument.activeElement ===
					search.querySelector('.jodit_search-query')
				);

				editor.selection.removeMarkers();
				Jodit.modules.Helpers.normalizeNode(
					editor.editor.firstChild
				); // because Select module splits text node

				editor.events.fire('searchNext');

				simulateEvent(
					'keydown',
					Jodit.KEY_F3,
					editor.editor,
					function(options) {
						options.shiftKey = true;
					}
				); //

				const sel = editor.selection.sel;

				expect(1).equals(sel.rangeCount);
				range = sel.getRangeAt(0);

				expect(editor.editor.firstChild).equals(
					range.startContainer
				);
				expect(10).equals(range.startOffset);

				expect(editor.editor.firstChild).equals(
					range.endContainer
				);
				expect(14).equals(range.endOffset);
			});
		});
	});

	describe('Esc in query field', function() {
		it('Should hide search form and restore selection', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>text</p>';

			const range = editor.selection.createRange();
			range.setStart(editor.editor.firstChild.firstChild, 1);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			const sel = editor.selection.sel;
			sel.removeAllRanges();
			sel.addRange(range);

			const search = editor.container.querySelector('.jodit_search');
			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);
			simulateEvent('keydown', Jodit.KEY_F, editor.editor, function(
				options
			) {
				options.ctrlKey = true;
			});

			expect(true).equals(
				search.classList.contains('jodit_search-active')
			);
			expect(true).equals(
				editor.ownerDocument.activeElement ===
				search.querySelector('.jodit_search-query')
			);
			simulateEvent(
				'keydown',
				Jodit.KEY_ESC,
				search.querySelector('.jodit_search-query')
			);

			expect(false).equals(
				search.classList.contains('jodit_search-active')
			);
			expect('ex').equals(sel.toString());
		});
	});

	describe('Unit test compare string', function() {
		describe('Get index of found string', function() {
			it('Should find needle in haystack', function() {
				const
					str = 'Mr John Smith washed window';

				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						str
					)
				);

				expect(11).equals(
					search.getSomePartOfStringIndex(
						'TH WAS',
						str
					)
				);

				expect(false).equals(
					search.getSomePartOfStringIndex(
						'TH WASNT',
						str
					)
				);
			});

			it('Should find needle in haystack steb by step', function() {
				const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr'
					)
				);
				expect(false).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John'
					)
				);

				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith'
					)
				);
				expect(11).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith wa'
					)
				);
				expect(false).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'Mr John Smith s'
					)
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

			it('Should find needle in haystack steb by step in back direction', function() {
				const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.getSomePartOfStringIndex(
						'th was',
						'window',
						false
					)
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

		describe('Compare strings and return boolean', function() {
			it('Should find needle in haystack', function() {
				const str = 'Mr John Smith washed window';
				expect(true).equals(
					search.findSomePartOfString('th was', str)
				);
				expect(true).equals(
					search.findSomePartOfString('TH WAS', str)
				);
				expect(true).equals(
					search.findSomePartOfString(
						'TH  WAS',
						str
					)
				);
				expect(false).equals(
					search.findSomePartOfString(
						'TH WASNT',
						str
					)
				);
			});

			it('Should find needle in haystack steb by step', function() {
				const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.findSomePartOfString(
						'th was',
						'Mr'
					)
				);
				expect(false).equals(
					search.findSomePartOfString(
						'th was',
						'Mr John'
					)
				);

				expect('th').equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith'
					)
				);

				expect('th wa').equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith wa'
					)
				);

				expect('th wa').equals(
					search.findSomePartOfString(
						'th  was',
						'Mr John Smith wa'
					)
				);

				expect('th  wa').equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith  wa'
					)
				);

				expect(false).equals(
					search.findSomePartOfString(
						'th was',
						'Mr John Smith s'
					)
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
			it('Should find needle in haystack steb by step in back direction', function() {
				const str = 'Mr John Smith washed window';
				expect(false).equals(
					search.findSomePartOfString(
						'th was',
						'window',
						false
					)
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

		describe('Haystack less needle', function() {
			it('Should return false', function() {
				expect(false).equals(
					search.findSomePartOfString(
						'th was',
						' ',
						true
					)
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

	describe('Fire search event', function() {
		it('Should select some elements which consists query string', function() {
			const editor = new Jodit(appendTestArea(), {
				observer: {
					timeout: 0
				}
			});
			editor.value =
				'<p><span>Mr</span> <span>John</span> <span>Smith</span> <span>washed</span> <span>window</span></p>'
			;
			const sel = editor.selection.sel;
			sel.removeAllRanges();

			editor.events.fire('search', 'th was');
			expect(1).equals(sel.rangeCount);
			const range = sel.getRangeAt(0);

			expect(
				editor.editor.firstChild.childNodes[4].firstChild
			).equals(range.startContainer);
			expect(3).equals(range.startOffset);

			expect(
				editor.editor.firstChild.childNodes[6].firstChild
			).equals(range.endContainer);
			expect(3).equals(range.startOffset);
		});
	});
});
