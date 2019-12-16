describe('Limit plugin', function() {
	describe('Keydown', function() {
		describe('On keydown when editor already full', function() {
			it('should deny insert any chars', function(done) {
				const editor = new Jodit(appendTestArea(), {
					limitChars: 5,
					observer: {
						timeout: 5
					}
				});

				editor.value = '11111';
				editor.selection.insertHTML('a');
				setTimeout(() => {
					expect('11111').to.be.equal(editor.value);
					done();
				}, 200);
			});

			describe('Stat plugin', function() {
				it('should show chars count', function(done) {
					const editor = new Jodit(appendTestArea(), {
						limitChars: 5,
						observer: {
							timeout: 5
						}
					});

					editor.value = '1111';

					editor.selection.insertHTML('a');
					editor.selection.insertHTML('a');

					setTimeout(() => {
						expect('a1111').to.equal(editor.value);
						const chars = editor.statusbar.container.querySelector('.jodit_statusbar_item');
						expect(chars.textContent.trim()).to.equal('Chars: 5');
						done();
					}, 200);
				});

				describe('Prevent keypress', function() {
					it('should show chars count', function(done) {
						const editor = new Jodit(appendTestArea(), {
							limitChars: 5,
							observer: {
								timeout: 5
							}
						});

						editor.value = '1111';

						const sel = editor.selection.sel,
							range = editor.editorDocument.createRange();

						range.setEndAfter(editor.editor.firstChild);
						range.collapse(false);

						editor.selection.selectRange(range);
						range.insertNode(editor.editorDocument.createTextNode('v'));
						simulateEvent('keydown', Jodit.KEY_V, editor.editor);

						range.insertNode(editor.editorDocument.createTextNode('v'));
						simulateEvent('keydown', Jodit.KEY_V, editor.editor);

						setTimeout(() => {
							expect('1111vv').to.equal(editor.value);
							const chars = editor.statusbar.container.querySelector('.jodit_statusbar_item');
							expect(chars.textContent.trim()).to.equal('Chars: 6');
							done();
						}, 200);
					});
				});
			});
		});
	});

	describe('Paste', function() {
		describe('When editor aleady full', function() {
			it('should deny insert any chars', function(done) {
				const editor = new Jodit(appendTestArea(), {
					limitChars: 5,
					observer: {
						timeout: 5
					}
				});

				editor.value = '11111';

				simulateEvent('paste', 0, editor.editor, function(data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function(type) {
							return 'a';
						}
					};
				});

				setTimeout(() => {
					expect('11111').to.be.equal(editor.value);
					done();
				}, 200);
			});
		});
	});

	describe('Limit words', function() {
		describe('Paste', function() {
			describe('When editor aleady full', function() {
				it('should deny insert any chars', function(done) {
					const editor = new Jodit(appendTestArea(), {
						limitWords: 3,
						observer: {
							timeout: 5
						}
					});

					editor.value = '11111';

					editor.selection.setCursorAfter(
						editor.editor.firstChild
					);

					const paste = () => {
						simulateEvent('paste', 0, editor.editor, function(
							data
						) {
							data.clipboardData = {
								types: ['text/html'],
								getData: function(type) {
									return ' aaa';
								}
							};
						});
					};

					const timeout = () => {
						setTimeout(() => {
							expect('11111 aaa aaa').to.be.equal(
								editor.value
							);
							done();
						}, 200);
					};

					paste();
					expect('11111 aaa').to.be.equal(editor.value);

					paste();
					expect('11111 aaa aaa').to.be.equal(editor.value);

					paste();
					timeout();
				});
			});
		});
	});
});
