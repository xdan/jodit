/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Search plugin', function () {
	const search = Jodit.plugins.get('search');

	beforeEach(() => {
		unmockPromise();
	});

	function getSearchInputs(editor) {
		const search = editor.container.querySelector('.jodit-ui-search');
		const query = search.querySelector('[data-ref="query"]');
		const replace = search.querySelector('[data-ref="replace"]');
		const replaceButton = search.querySelector('[data-ref="replace-btn"]');

		return { search, query, replace, replaceButton };
	}

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
			it('Should replace value form query field to value from replace field in editor', done => {
				const editor = getJodit({
					defaultTimeout: 0
				});

				editor.value = 'test test test';

				expect(editor.container.querySelector('.jodit-ui-search')).is
					.null;

				simulateEvent('keydown', 'h', editor.editor, options => {
					options.ctrlKey = true;
				});

				const search =
					editor.container.querySelector('.jodit-ui-search');

				expect(true).equals(
					search.classList.contains('jodit-ui-search_replace_true')
				);

				expect(true).equals(
					editor.ownerDocument.activeElement ===
						search.querySelector('[data-ref="query"]')
				);

				const { query, replace, replaceButton } =
					getSearchInputs(editor);

				query.value = 't';
				replace.value = 'w';

				let cnt = 1;

				editor.e.on('afterFindAndReplace', () => {
					if (cnt < 4) {
						cnt++;
						simulateEvent('pointerdown', replaceButton);
					} else {
						replaceCursorToChar(editor);

						try {
							expect(editor.value).equals(
								'<p>wesw wesw |t|est</p>'
							);
							done();
						} catch (e) {
							done(e);
						}
					}
				});

				simulateEvent('pointerdown', replaceButton);
			});

			describe('After replacing', () => {
				it('Should set selection on next found posision', done => {
					unmockPromise();

					const editor = getJodit({
						defaultTimeout: 0
					});

					editor.value = '<p>test test test</p>';

					simulateEvent('keydown', 'h', editor.editor, options => {
						options.ctrlKey = true;
					});

					const { query, replace, replaceButton } =
						getSearchInputs(editor);

					query.value = 'test';
					replace.value = 'pop';

					let cnt = 1;

					editor.e.on('afterFindAndReplace', () => {
						replaceCursorToChar(editor);
						try {
							expect(editor.value).equals(
								'<p>pop |test| test</p>'
							);
							done();
						} catch (e) {
							done(e);
						}
					});

					simulateEvent('pointerdown', replaceButton);
				});
			});
		});
	});

	describe('F3 after search', function () {
		beforeEach(() => {
			unmockPromise();
		});

		it('Should find a next match', async () => {
			const editor = getJodit({
				defaultTimeout: 0
			});

			editor.value = '<p>|test| test test</p>';
			setCursorToChar(editor);

			expect(editor.container.querySelector('.jodit-ui-search')).is.null;

			// press ctrl(cmd) + f
			simulateEvent('keydown', 'f', editor.editor, options => {
				options.ctrlKey = true;
			});

			const { query } = getSearchInputs(editor);
			expect(editor.ownerDocument.activeElement === query).is.true;
			expect(query.value).eq('test');

			editor.s.removeMarkers();
			Jodit.modules.Helpers.normalizeNode(editor.editor.firstChild); // because Select module splits text node

			await new Promise((resolve, reject) => {
				editor.events.fire('searchNext').then(() => {
					simulateEvent(
						'keydown',
						'F3',
						editor.editor,
						function (options) {
							options.shiftKey = false;
						}
					);

					editor.e.on('afterFindAndSelect', () => {
						try {
							const sel = editor.s.sel;

							expect(1).equals(sel.rangeCount);
							const range = sel.getRangeAt(0);

							expect(
								editor.editor.firstChild.firstChild
									.nextElementSibling.firstChild
							).equals(range.startContainer);
							expect(0).equals(range.startOffset);
							expect(
								editor.editor.firstChild.firstChild
									.nextElementSibling.firstChild
							).equals(range.endContainer);
							expect(4).equals(range.endOffset);
							editor.destruct();
							resolve();
						} catch (e) {
							reject(e);
						}
					});
				});
			});
		});

		describe('Select and return value', function (done) {
			it('Should select all found substring and value should be clean', function (done) {
				const editor = getJodit();

				editor.value = '<p>|test| test test</p>';
				setCursorToChar(editor);

				editor.events.fire('searchNext').then(() => {
					expect(editor.value).eq('<p>test test test</p>');
					expect(
						editor.editor.querySelectorAll('[jd-tmp-selection]')
							.length
					).eq(3);
					done();
				});
			});
		});

		it('Should find the next match in a circle', function (done) {
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

			editor.events.fire('searchNext').then(() => {
				const list = [
					[0, 1],
					[0, 1],
					[0, 1],
					[0, 1],
					[0, 1],
					[0, 1]
				];

				list.forEach(function (pars, index) {
					simulateEvent(
						'keydown',
						'F3',
						editor.editor,
						function (options) {
							options.shiftKey = false;
						}
					); //

					editor.e.one('afterFindAndSelect', () => {
						expect(1).equals(sel.rangeCount);
						const range = sel.getRangeAt(0);

						expect(pars[0]).equals(range.startOffset);
						expect(pars[1]).equals(range.endOffset);

						if (index === list.length - 1) {
							done();
						}
					});
				});
			});
		});

		describe('with SHIFT key', function () {
			it('Should find a previous match', function (done) {
				const editor = getJodit({
					history: {
						timeout: 0
					}
				});

				editor.value = '<p>|test| test test</p>';
				setCursorToChar(editor);

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

				editor.events.fire('searchNext').then(() => {
					simulateEvent(
						'keydown',
						'F3',
						editor.editor,
						function (options) {
							options.shiftKey = true;
						}
					);

					editor.e.on('afterFindAndSelect', () => {
						const sel = editor.s.sel;

						expect(1).equals(sel.rangeCount);
						range = sel.getRangeAt(0);
						expect(
							editor.editor.firstChild.lastChild.firstChild
						).equals(range.startContainer);
						expect(0).equals(range.startOffset);

						expect(
							editor.editor.firstChild.lastChild.firstChild
						).equals(range.endContainer);
						expect(4).equals(range.endOffset);
						done();
					});
				});
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
		describe('Fire search event', function () {
			it('Should select some elements which consists query string', function () {
				const editor = getJodit({
					defaultTimeout: 0
				});
				editor.value =
					'<p><span>Mr</span> <span>John</span> <span>Smith</span> <span>washed</span> <span>window</span></p>';
				const sel = editor.s.sel;
				sel.removeAllRanges();

				editor.events.fire('search', 'th was').then(() => {
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

		describe('Case insensitive', function () {
			it('Should select some elements which consists query string', function () {
				const editor = getJodit({
					defaultTimeout: 0
				});

				editor.value =
					'<p><span>Mr</span> <span>John</span> <span>Smith</span> <span>washed</span> <span>window</span></p>';
				const sel = editor.s.sel;
				sel.removeAllRanges();

				editor.events.fire('search', 'tH WaS').then(() => {
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

		describe('Find by toolbar button event', function () {
			describe('Press Search button', function () {
				it('Should open search dialog', function () {
					const editor = getJodit({
						defaultTimeout: 0
					});

					clickButton('find', editor);

					expect(editor.container.querySelector('.jodit-ui-search'))
						.is.not.null;
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
							'.jodit-ui-search.jodit-ui-search_replace_true'
						)
					).is.not.null;
				});
			});
		});
	});

	describe('Search highlight', () => {
		it('Should not put highlighting into history stack', async () => {
			const editor = getJodit({
				defaultTimeout: 0
			});

			editor.value = '<p>test</p>';
			editor.history.clear();

			editor.events.fire('search', 't');
			await editor.async.requestIdlePromise();

			expect(sortAttributes(editor.getNativeEditorValue())).equals(
				'<p><span data-jodit-temp="true" jd-tmp-selection="true">t</span>es<span data-jodit-temp="true" jd-tmp-selection="true">t</span></p>'
			);
			expect(editor.history.length).equals(0);
		});

		describe('After replacing', () => {
			it('Should not put highlighting into history stack', done => {
				const editor = getJodit({
					defaultTimeout: 0
				});

				editor.value = '<p>test</p>';
				editor.history.clear();

				editor.execCommand('openReplaceDialog', 't', 'p');

				const { query, replace, replaceButton } =
					getSearchInputs(editor);
				expect(query.value).eq('t');
				expect(replace.value).eq('p');

				editor.e.on('afterFindAndReplace', async () => {
					try {
						await editor.async.requestIdlePromise();

						expect(
							sortAttributes(editor.getNativeEditorValue())
						).equals(
							'<p>pes<span data-jodit-temp="true" jd-tmp-selection="true">t</span></p>'
						);
						expect(editor.history.length).equals(1);

						editor.s.insertHTML('stop');
						expect(
							sortAttributes(editor.getNativeEditorValue())
						).equals('<p>pesstop</p>');

						editor.execCommand('undo');

						expect(
							sortAttributes(editor.getNativeEditorValue())
						).equals('<p>pest</p>');

						editor.execCommand('redo');

						expect(
							sortAttributes(editor.getNativeEditorValue())
						).equals('<p>pesstop</p>');
						done();
					} catch (e) {
						done(e);
					}
				});

				simulateEvent('pointerdown', replaceButton);
			});
		});
	});
});
