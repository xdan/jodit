describe('CodeMirror editor source code', function() {
	describe('Init', function() {
		it('After init container must has codeeditor container', function(done) {
			unmockPromise();

			let timeout;
			const
				area = appendTestArea(false, true),
				__done = function() {
					clearTimeout(timeout);
					this.events.off('beforeDestruct');
					this.destruct();
					area.parentNode.removeChild(area);
					done();
				};

			timeout = setTimeout(function() {
				expect(false).is.true;
				__done.call(editor);
			}, 5000);

			editor = new Jodit(area, {
				defaultMode: Jodit.MODE_SOURCE,
				sourceEditor: 'ace',
				events: {
					beforeDestruct: function() {
						return false;
					},
					sourceEditorReady: function(editor) {
						expect(editor.container.querySelectorAll('.jodit_source_mirror-fake').length).equals(1);
						__done.call(editor);
					}
				}
			});
		}).timeout(6000);
	});
	describe('Change mode', function() {
		describe('In WYSIWYG mode isEditorMode', function() {
			it('Should return true', function() {
				const editor = new Jodit(appendTestArea());
				expect(editor.isEditorMode()).is.true;
				editor.toggleMode();
				expect(editor.isEditorMode()).is.false;
			});
		});

		it('Should not fire Change event', function() {
			const editor = new Jodit(appendTestArea(), {
				useAceEditor: false // because onChange can be fired after aceInited
			});

			const defaultValue = 'test';
			let count = 0;

			editor.value = defaultValue;

			editor.events
				.on('change', function(value, oldvalue) {
					expect(oldvalue).does.not.equal(value);
					expect(defaultValue).does.not.equal(value);
					count++;
				});


			editor.selection.setCursorAfter(editor.editor.firstChild);
			editor.setMode(Jodit.MODE_SOURCE);
			editor.setMode(Jodit.MODE_WYSIWYG);
			editor.value = defaultValue;
			editor.value = 'another';

			expect(1).equals(count);
		});

		describe('After change mode to source mode and use insertHTML method', function() {
			it('Should insert text on caret position', function(done) {
				unmockPromise();

				Jodit.make(appendTestArea(), {
					sourceEditor: 'ace',
					beautifyHTML: false,
					events: {
						sourceEditorReady: function(jodit) {
							jodit.selection.focus();
							jodit.value = '<p>test <span>test</span> test</p>';
							const range = jodit.editorDocument.createRange();

							range.selectNodeContents(jodit.editor.querySelector('span'));
							range.collapse(false);

							jodit.selection.selectRange(range);

							jodit.setMode(Jodit.MODE_SOURCE);

							jodit.selection.insertHTML('loop');

							expect(jodit.value).equals('<p>test <span>testloop</span> test</p>');
							mockPromise();

							done();
						}
					}
				});
			}).timeout(4000);

			describe('Without ace', function() {
				it('Should insert text on caret position', function() {
					const editor = new Jodit(appendTestArea(), {
						useAceEditor: false
					});

					editor.value = '<p>one <span>two</span> three</p>';
					const range = editor.selection.createRange();
					range.selectNodeContents(editor.editor.querySelector('span'));
					range.collapse(false);
					editor.selection.selectRange(range);

					editor.selection.insertHTML('stop');
					expect(editor.value).equals('<p>one <span>twostop</span> three</p>');

					editor.setMode(Jodit.MODE_SOURCE);

					editor.selection.insertHTML('loop');
					expect(editor.value).equals('<p>one <span>twostoploop</span> three</p>');
				});
			});
		});
	});

	afterEach(removeStuff);
});
