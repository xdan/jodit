describe('Test states', function() {

	describe('ReadOnly', function() {
		describe('Set readonly mode in options', function() {
			describe('Readonly', function() {
				it('Should deny edit content in simple source editor', function() {
					const editor = new Jodit(appendTestArea(), {
						readonly: true,
						sourceEditor: 'area'
					});
					editor.setMode(Jodit.MODE_SOURCE);
					expect(true).equals(editor.__plugins.source.sourceEditor.instance.hasAttribute('readonly'));
				});
			});

			describe('For iframe', function() {
				it('Should deny edit content in iframe\'s body', function(done) {
					unmockPromise();

					const editor = new Jodit(appendTestArea(), {
						readonly: true,
						iframe: true,
						events: {
							afterConstructor: function(jodit) {
								expect(false).equals(jodit.editor.hasAttribute('contenteditable'));
								expect('BODY').equals(jodit.editor.nodeName);
								done();
							}
						}
					});

				});
			});

			it('Should deny edit content in wysiwyg', function() {
				const editor = new Jodit(appendTestArea(), {
					readonly: true
				});
				expect(false).equals(editor.editor.hasAttribute('contenteditable'));
			});

			it('Should deny exec any commands', function() {
				const editor = new Jodit(appendTestArea(), {
					readonly: true
				});

				editor.value = 'test';

				editor.selection.select(editor.editor.firstChild);

				editor.execCommand('bold');

				expect('test').equals(editor.value);
			});
			it('Should disable all toolbar buttons besides source, print, about, fullsize', function() {
				const editor = new Jodit(appendTestArea(), {
					readonly: true,
					toolbarAdaptive: false,
					observer: {
						timeout: 0
					}
				});

				editor.value = 'test';
				const buttons = [].slice.call(editor.container.querySelectorAll('.jodit_toolbar_btn'));
				buttons.forEach(function(btn) {
					if (!/(source|print|about|fullsize|separator|selectall|break)/.test(btn.className)) {
						expect(true).equals(btn.classList.contains('jodit_disabled'));
						expect(true).equals(btn.hasAttribute('disabled'));
					}
				});
			});

			describe('Readonly for ACE', function() {
				it('Should deny edit content in ace source editor', function(done) {
					unmockPromise();

					const editor = new Jodit(appendTestArea(), {
						readonly: true,
						sourceEditor: 'ace',
						events: {
							sourceEditorReady: function(editor) {
								expect(null).is.not.equal(editor.__plugins.source.sourceEditor.instance);
								expect(true).equals(editor.__plugins.source.sourceEditor.instance.getReadOnly());
								mockPromise();

								done();
							}
						}
					});

					editor.setMode(Jodit.MODE_SOURCE);
				}).timeout(6000);
			});

			it('Should hide placeholder', function() {
				const table_editor_interface = appendTestArea();
				table_editor_interface.value = '';

				const editor = new Jodit(table_editor_interface, {
					readonly: true
				});

				expect(!editor.container.querySelectorAll('.jodit_placeholder').length).is.true;
				editor.value = 'test';
				expect(!editor.container.querySelectorAll('.jodit_placeholder').length).is.true;
			});

			describe('Search plugin', function() {
				describe('CTRL + H', function() {
					describe('In readonly editor', function() {
						it('Should be deny', function() {
							const editor = new Jodit(appendTestArea(), {
								readonly: true,
								observer: {
									timeout: 0
								}
							});

							const search = editor.container.querySelector('.jodit_search');
							expect(false).equals(search.classList.contains('jodit_search-active'));
							simulateEvent('keydown', Jodit.KEY_H, editor.editor, function(options) {
								options.ctrlKey = true;
							});
							expect(false).equals(search.classList.contains('jodit_search-active'));
							expect(false).equals(search.classList.contains('jodit_search-and-replace'));
							expect(false).equals(editor.ownerDocument.activeElement === search.querySelector('.jodit_search-query'));
						});
					});
				});
			});

			describe('Method get read only', function() {
				it('Should return enable/disable readonly', function() {
					const editor = new Jodit(appendTestArea(), {
						readonly: true
					});

					expect(true).equals(editor.getReadOnly());
					editor.setReadOnly(false);
					expect(false).equals(editor.getReadOnly());
					editor.destruct();

					const editor2 = new Jodit(appendTestArea());
					expect(false).equals(editor2.getReadOnly());
				});
			});
		});

		describe('Set readonly mode by source element attribute', function() {
			it('Should work like by options', function() {
				const area = appendTestArea();

				area.setAttribute('readonly', 'true');

				const editor = new Jodit(area);

				expect(editor.editor.hasAttribute('contenteditable')).is.false;
				expect(editor.getReadOnly()).is.true;
			});

			describe('In short form', function() {
				it('Should work like by options', function() {
					const area = appendTestArea();

					area.setAttribute('readonly', '');

					const editor = new Jodit(area);

					expect(editor.editor.hasAttribute('contenteditable')).is.false;
					expect(editor.getReadOnly()).is.true;
				});

			});
		});

		describe('Disable readonly mode', function() {
			it('Should allow edit content in wysiwyg', function() {
				const editor = new Jodit(appendTestArea(), {
					readonly: true
				});
				expect(false).equals(editor.editor.hasAttribute('contenteditable'));
				editor.setReadOnly(false);
				expect(true).equals(editor.editor.hasAttribute('contenteditable'));
			});

			it('Should allow edit content in simple source editor', function() {
				const editor = new Jodit(appendTestArea(), {
					readonly: true,
					sourceEditor: 'area'
				});

				editor.setMode(Jodit.MODE_SOURCE);
				expect(true).equals(editor.__plugins.source.sourceEditor.instance.hasAttribute('readonly'));

				editor.setReadOnly(false);

				expect(false).equals(editor.__plugins.source.sourceEditor.instance.hasAttribute('readonly'));
			});

			it('Should allow edit content in ace source editor', function(done) {
				unmockPromise();

				const editor = new Jodit(appendTestArea(), {
					readonly: true,
					sourceEditor: 'ace',
					defaultMode: Jodit.MODE_SOURCE,
					events: {
						sourceEditorReady: function(editor) {
							expect(null).does.not.equal(editor.__plugins.source.sourceEditor.instance);
							expect(true).equals(editor.__plugins.source.sourceEditor.instance.getReadOnly());

							editor.setReadOnly(false);
							expect(false).equals(editor.__plugins.source.sourceEditor.instance.getReadOnly());

							mockPromise();

							done();
						}
					}
				});

				editor.setMode(Jodit.MODE_SOURCE);

			}).timeout(6000);
		});
	});

	describe('Disabled', function() {
		describe('Set disabled mode in options', function() {
			it('Should enable readonly mode too and editor\'s container should have jodit_disabled class', function() {
				const area = appendTestArea();

				area.setAttribute('disabled', 'true');

				const editor = new Jodit(area);

				expect(editor.container.classList.contains('jodit_disabled')).is.true;
				expect(editor.editor.hasAttribute('contenteditable')).is.false;
				expect(editor.getReadOnly()).is.true;
				expect(editor.getDisabled()).is.true;
			});
		});
		describe('Switch disabled mode', function() {
			it('Should enable readonly if true but set default readonly mode in false', function() {
				const area = appendTestArea();

				area.setAttribute('disabled', 'true');
				area.setAttribute('readonly', 'true');

				const editor = new Jodit(area);

				expect(editor.getReadOnly()).is.true;
				expect(editor.getDisabled()).is.true;

				editor.setDisabled(false);


				expect(editor.getReadOnly()).is.true;
				expect(editor.getDisabled()).is.false;
			});
		});
	});
	afterEach(removeStuff);
});
