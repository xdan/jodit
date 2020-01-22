describe('Selection Module Tests', function() {
	describe('Current method', function() {
		describe('Cursor outside the editor', function() {
			it('Should return false', function() {
				const editor = new Jodit(appendTestArea()),
					div = document.createElement('div');

				div.innerHTML = 'test';
				document.body.appendChild(div);
				editor.value = '<h1>test <span>test</span>sdfsdfds</h1>';
				const range = document.createRange();
				range.setStart(div.firstChild, 1);
				range.setEnd(div.firstChild, 2);
				const sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);

				expect(editor.selection.current()).is.false;
				document.body.removeChild(div);
			});
		});

		describe('Cursor in the left of some SPAN', function() {
			it('Should return text before this span', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>one<span>two</span>tree</h1>';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild, 1);
				range.collapse(true);

				editor.selection.selectRange(range);

				expect(editor.selection.current()).equals(
					editor.editor.firstChild.firstChild
				); //one
			});
		});
		describe('Cursor inside the text node ', function() {
			it('Should return text', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>test</h1>';
				const range = editor.selection.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 1);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(editor.selection.current()).equals(
					editor.editor.firstChild.firstChild
				); // test
			});
		});
		describe('Cursor after h1', function() {
			it('Should return text inside h1', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>test</h1>';
				const range = editor.selection.createRange();
				range.setStart(editor.editor, 1);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(editor.selection.current()).equals(
					editor.editor.firstChild.firstChild
				); // test
			});
			describe('With false argument', function() {
				it('Should return h1', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<h1>test</h1>';
					const range = editor.selection.createRange();
					range.setStart(editor.editor, 1);
					range.collapse(true);
					editor.selection.selectRange(range);

					expect([
						editor.editor.firstChild,
						editor.editor.firstChild.firstChild
					]).to.be.include(editor.selection.current(false)); // h1
				});
			});
		});
		describe('Select img', function() {
			it('Should return this image', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<h1>test <img src="#" alt=""> sdfsdfs</h1>';
				const range = editor.selection.createRange();
				range.selectNode(editor.editor.querySelector('img'));
				editor.selection.selectRange(range);

				expect(editor.selection.current()).equals(
					editor.editor.querySelector('img')
				);
			});
		});
	});

	describe('cursorInTheEdge', function() {
		describe('Cursor in the text', function() {
			describe('cursorOnTheLeft and cursorOnTheRight', function() {
				describe('Cursor inside P but inside Li', function() {
					describe('Cursor in the end of text node', function() {
						it('Should work correct', function() {
							const editor = new Jodit(appendTestArea());
							editor.value = '<ul><li><p>test</p></li></ul>';

							const range = editor.selection.createRange();

							range.setStartAfter(
								editor.editor.querySelector('p').firstChild
							);
							range.collapse(true);
							editor.selection.selectRange(range);

							['li', 'p'].forEach(function(tag) {
								expect(
									editor.selection.cursorOnTheLeft(
										editor.editor.querySelector(tag)
									)
								).is.false;

								expect(
									editor.selection.cursorOnTheRight(
										editor.editor.querySelector(tag)
									)
								).is.true;
							});
						});
					});

					describe('Cursor in the start of text node', function() {
						it('Should work correct', function() {
							const editor = new Jodit(appendTestArea());
							editor.value = '<ul><li><p>test</p></li></ul>';

							const range = editor.selection.createRange();

							range.setStartBefore(
								editor.editor.querySelector('p').firstChild
							);
							range.collapse(true);
							editor.selection.selectRange(range);

							['li', 'p'].forEach(function(tag) {
								expect(
									editor.selection.cursorOnTheLeft(
										editor.editor.querySelector(tag)
									)
								).is.true;

								expect(
									editor.selection.cursorOnTheRight(
										editor.editor.querySelector(tag)
									)
								).is.false;
							});
						});
					});
				});
			});

			describe('Cursor in the end of text node but after this has BR', function() {
				it('Should return true', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test<br></p>';

					const range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 4);
					range.collapse(true);
					editor.selection.selectRange(range);

					expect(
						editor.selection.cursorOnTheRight(
							editor.editor.firstChild
						)
					).is.true;
				});
			});

			describe('Cursor in the end of text node but after this has image', function() {
				it('Should return false', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test<img/></p>';

					const range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 4);
					range.collapse(true);
					editor.selection.selectRange(range);

					expect(
						editor.selection.cursorOnTheRight(
							editor.editor.firstChild
						)
					).is.false;
				});
			});

			describe('Cursor in the middle of text node', function() {
				it('Should return false', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>test</p>';

					const range = editor.selection.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.collapse(true);
					editor.selection.selectRange(range);

					expect(
						editor.selection.cursorOnTheRight(
							editor.editor.firstChild
						)
					).is.false;
				});

				describe('Cursor in the middle of text node but after cursor only invisible spaces', function() {
					it('Should return true', function() {
						const editor = new Jodit(appendTestArea());
						editor.value =
							'<p>test' +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							'</p>';

						const range = editor.selection.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.selection.selectRange(range);

						expect(
							editor.selection.cursorOnTheRight(
								editor.editor.firstChild
							)
						).is.true;
					});
				});
				describe('Cursor in the middle of text node but before cursor only invisible spaces', function() {
					it('Should return true', function() {
						const editor = new Jodit(appendTestArea());
						editor.value =
							'<p>' +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							Jodit.INVISIBLE_SPACE +
							'test</p>';

						const range = editor.selection.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 3);
						range.collapse(true);
						editor.selection.selectRange(range);

						expect(
							editor.selection.cursorOnTheLeft(
								editor.editor.firstChild
							)
						).is.true;
					});
				});

				describe('Cursor in the end of text node but after this has several not empty text nodes', function() {
					it('Should return false', function() {
						const editor = new Jodit(appendTestArea());
						editor.value = '<p>test</p>';

						const range = editor.selection.createRange();

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.selection.selectRange(range);
						editor.selection.insertNode(
							editor.create.inside.text('a')
						);

						range.setStart(editor.editor.firstChild.firstChild, 4);
						range.collapse(true);
						editor.selection.selectRange(range);

						expect(
							editor.selection.cursorOnTheRight(
								editor.editor.firstChild
							)
						).is.false;
					});

					describe('Cursor in the end of text node and after are only text nodes with invisible spaces', function() {
						it('Should return true', function() {
							const editor = new Jodit(appendTestArea());
							editor.value = '<p>test</p>';

							const range = editor.selection.createRange();

							range.setStart(
								editor.editor.firstChild.firstChild,
								4
							);
							range.collapse(true);
							editor.selection.selectRange(range);

							editor.selection.insertNode(
								editor.create.inside.text(Jodit.INVISIBLE_SPACE)
							);
							editor.selection.insertNode(
								editor.create.inside.text(Jodit.INVISIBLE_SPACE)
							);
							editor.selection.insertNode(
								editor.create.inside.text(Jodit.INVISIBLE_SPACE)
							);

							range.setStart(
								editor.editor.firstChild.firstChild,
								4
							);
							range.collapse(true);
							editor.selection.selectRange(range);

							expect(
								editor.selection.cursorOnTheRight(
									editor.editor.firstChild
								)
							).is.true;
						});
					});

					describe('Inverse', function() {
						describe('Cursor in the start of text node but before this has several not empty text nodes', function() {
							it('Should return false', function() {
								const editor = new Jodit(appendTestArea());
								editor.value = '<p>test</p>';

								const range = editor.selection.createRange();

								range.setStart(
									editor.editor.firstChild.firstChild,
									0
								);
								range.collapse(true);
								editor.selection.selectRange(range);
								editor.selection.insertNode(
									editor.create.inside.text('a')
								);

								range.setStart(
									editor.editor.firstChild.lastChild,
									0
								);
								range.collapse(true);
								editor.selection.selectRange(range);

								expect(
									editor.selection.cursorOnTheLeft(
										editor.editor.firstChild
									)
								).is.false;
							});
							describe('Cursor in the start of text node and before are only text nodes with invisible spaces', function() {
								it('Should return true', function() {
									const editor = new Jodit(appendTestArea());
									editor.value = '<p>test</p>';

									const range = editor.selection.createRange();

									range.setStart(
										editor.editor.firstChild.firstChild,
										0
									);
									range.collapse(true);
									editor.selection.selectRange(range);

									editor.selection.insertNode(
										editor.create.inside.text(
											Jodit.INVISIBLE_SPACE
										)
									);
									editor.selection.insertNode(
										editor.create.inside.text(
											Jodit.INVISIBLE_SPACE
										)
									);
									editor.selection.insertNode(
										editor.create.inside.text(
											Jodit.INVISIBLE_SPACE
										)
									);

									range.setStart(
										editor.editor.firstChild.lastChild,
										0
									);
									range.collapse(true);
									editor.selection.selectRange(range);

									expect(
										editor.selection.cursorOnTheLeft(
											editor.editor.firstChild
										)
									).is.true;
								});
							});
						});
					});
				});
			});
		});

		describe('Cursor after element', function() {
			it('Should return null', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const range = editor.selection.createRange();

				range.setStartAfter(editor.editor.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheRight(editor.editor.firstChild)
				).is.null;
			});
		});

		describe('Cursor before element', function() {
			it('Should return null', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const range = editor.selection.createRange();

				range.setStartBefore(editor.editor.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheLeft(editor.editor.firstChild)
				).is.null;
			});
		});

		describe('Cursor in the start of element ', function() {
			it('Should return true', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p><span>test</span></p>';

				const range = editor.selection.createRange();

				range.setStartBefore(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheLeft(editor.editor.firstChild)
				).is.true;
			});
		});

		describe('Cursor in the end of element ', function() {
			it('Should return true', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p><span>test</span></p>';

				const range = editor.selection.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheRight(editor.editor.firstChild)
				).is.true;
			});
		});

		describe('Cursor not in the end of element ', function() {
			it('Should return false', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p><span>test</span><span>stop</span></p>';

				const range = editor.selection.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheRight(editor.editor.firstChild)
				).is.false;
			});
		});

		describe('Cursor not in the start of element ', function() {
			it('Should return false', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p><span>test</span><span>stop</span></p>';

				const range = editor.selection.createRange();

				range.setStartAfter(editor.editor.firstChild.firstChild);
				range.collapse(true);
				editor.selection.selectRange(range);

				expect(
					editor.selection.cursorOnTheLeft(editor.editor.firstChild)
				).is.false;
			});
		});

		describe('If cursor in the end of P', function() {
			it('Should return true', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test</p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.setStart(editor.editor.firstChild.firstChild, 4);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(
					editor.selection.cursorOnTheRight(editor.editor.firstChild)
				).is.true;

				range.setStart(editor.editor.firstChild.firstChild, 2);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(
					editor.selection.cursorOnTheRight(editor.editor.firstChild)
				).is.false;
			});
		});

		describe('If cursor in the end of SPAN in the end of P', function() {
			it('Should return true', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>test<span>1</span></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild.lastChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(
					editor.selection.cursorInTheEdge(
						false,
						editor.editor.firstChild
					)
				).is.true;
			});
		});

		describe('Curson in the end of span inside P and check cursorInTheEdge(true)', function() {
			it('Should return false', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>Some <span>text</span></p>';

				const sel = editor.selection.sel,
					range = editor.selection.createRange();

				range.selectNodeContents(editor.editor.firstChild.lastChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(
					editor.selection.cursorInTheEdge(
						true,
						editor.editor.firstChild
					)
				).is.false;
			});
		});
	});

	describe('Change mode', function() {
		it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function() {
			const editor = new Jodit(appendTestArea());

			editor.value = '<p>test</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 2);
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.setMode(Jodit.MODE_SOURCE);

			const mirror = editor.container.querySelector(
				'textarea.jodit_source_mirror'
			);

			expect(mirror.value).equals('<p>test</p>');
			expect(mirror.selectionStart).equals(5);
			expect(mirror.selectionEnd).equals(5);
		}).timeout(6000);

		it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA for long string', function(done) {
			unmockPromise();

			let timeout;
			const __done = function() {
				clearTimeout(timeout);
				done();
			};

			timeout = setTimeout(function() {
				expect(false).is.true;
				__done();
			}, 140100);

			Jodit.make(appendTestArea(), {
				defaultMode: Jodit.MODE_SOURCE,
				sourceEditor: 'ace',
				beautifyHTML: false,
				events: {
					/**
					 * @this Events
					 */
					sourceEditorReady: function(jodit) {
						jodit.setMode(Jodit.MODE_WYSIWYG);
						jodit.setEditorValue(
							('<p>' + 'test '.repeat(50) + '</p>').repeat(1)
						);

						const sel = jodit.editorWindow.getSelection(),
							range = jodit.editorDocument.createRange();

						range.selectNodeContents(
							jodit.editor.querySelector('p')
						);

						range.collapse(false);
						sel.removeAllRanges();
						sel.addRange(range);

						jodit.selection.insertHTML('hello');

						jodit.setMode(Jodit.MODE_SOURCE);

						const ace =
							jodit.__plugins.source.sourceEditor.instance;

						expect(ace).not.null;

						expect(ace.getSelectionRange().start.column).equals(
							258
						);

						expect(ace.getSelectionRange().start.row).equals(0);

						ace.session.insert(ace.getCursorPosition(), ' world');

						expect(
							jodit.__plugins.source.sourceEditor.getValue()
						).equals(
							'<p>' + 'test '.repeat(49) + 'test hello world</p>'
						);

						mockPromise();
						__done();
					}
				}
			});
		}).timeout(116000);

		it('Should restore collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function() {
			const editor = new Jodit(appendTestArea(), {
				useAceEditor: false,
				defaultMode: Jodit.MODE_SOURCE
			});
			editor.value = '<p>test</p>';

			const mirror = editor.container.querySelector(
				'textarea.jodit_source_mirror'
			);
			mirror.setSelectionRange(5, 5);

			editor.setMode(Jodit.MODE_WYSIWYG);
			editor.selection.insertNode(editor.create.inside.text(' a '));

			expect(editor.value).equals('<p>te a st</p>');
		});

		it('Should restore non collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function() {
			const editor = new Jodit(appendTestArea(), {
				useAceEditor: false
			});
			editor.value = '<p>test</p>';

			const sel = editor.selection.sel,
				range = editor.selection.createRange();

			range.setStart(editor.editor.firstChild.firstChild, 1);
			range.setEnd(editor.editor.firstChild.firstChild, 3);
			sel.removeAllRanges();
			sel.addRange(range);

			editor.setMode(Jodit.MODE_SOURCE);

			const mirror = editor.container.querySelector(
				'textarea.jodit_source_mirror'
			);

			expect(mirror.value).equals('<p>test</p>');
			expect(mirror.selectionStart).equals(4);
			expect(mirror.selectionEnd).equals(6);
		});

		describe('Problem', function() {
			it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function() {
				const editor = new Jodit(appendTestArea(), {
					useAceEditor: false,
					defaultMode: Jodit.MODE_SOURCE
				});
				editor.selection.focus();
				editor.value = '<p>test</p>';

				const mirror = editor.container.querySelector(
					'textarea.jodit_source_mirror'
				);
				mirror.setSelectionRange(2, 8);

				editor.setMode(Jodit.MODE_WYSIWYG);

				expect(editor.selection.isCollapsed()).is.false;

				editor.selection.insertNode(editor.create.inside.text(' a '));
				expect(editor.value).equals(' a ');
			});
		});

		it('Should restore collapsed selection inside empty element - from TEXTAREA to WYSIWYG', function() {
			const editor = new Jodit(appendTestArea(), {
				useAceEditor: false,
				defaultMode: Jodit.MODE_SOURCE
			});
			editor.value = '<a>11</a>';

			const mirror = editor.container.querySelector(
				'textarea.jodit_source_mirror'
			);
			mirror.setSelectionRange(4, 4);

			editor.setMode(Jodit.MODE_WYSIWYG);
			expect(editor.selection.isCollapsed()).is.true;
			editor.selection.insertNode(editor.create.inside.text(' a '));
			expect(editor.value).equals('<a>1 a 1</a>');
		});
	});

	describe('Click on empty tag', function() {
		it('Should move cursore inside that', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p></p><p></p><p></p>';
			simulateEvent(
				'mousedown',
				0,
				editor.editor.getElementsByTagName('p')[1]
			);
			editor.selection.insertHTML('test');
			expect('<p></p><p>test</p><p></p>').equals(editor.value);
		});
	});

	describe('Method setCursorIn', function() {
		describe('Call for not Node element', function() {
			it('Should throw exception', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>1</p><p>2</p>';
				expect(function() {
					editor.selection.setCursorIn(
						editor.editor.querySelector('strong')
					);
				}).to.throw();
			});

			describe('Call for inserted fragment', function() {
				it('Should not throw exception', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = '<p>1<span>3</span>2</p>';
					editor.selection.select(
						editor.editor.querySelector('span')
					);
					const fragment = editor.selection.range.extractContents();
					editor.selection.insertNode(fragment);
				});
			});
		});

		describe('Call for element what is not inside the current editor', function() {
			it('Should throw exception', function() {
				const editor = new Jodit(appendTestArea());
				expect(function() {
					editor.selection.setCursorIn(document.body);
				}).to.throw();
			});
		});

		it('Should move cursor inside node in the end', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>1</p><p>2</p>';

			editor.selection.setCursorIn(editor.editor.lastChild);
			editor.selection.insertHTML('test');

			expect(editor.value).equals('<p>1</p><p>2test</p>');
		});

		describe('With inStart = true', function() {
			it('Should move cursor inside node in the start', function() {
				const editor = new Jodit(appendTestArea());
				editor.value = '<p>1</p><p>2</p>';

				editor.selection.setCursorIn(editor.editor.lastChild, true);
				editor.selection.insertHTML('test');

				expect(editor.value).equals('<p>1</p><p>test2</p>');
			});
		});
	});

	describe('Method eachSelection', function() {
		it('Should call callback for each node in selection', function() {
			const editor = new Jodit(appendTestArea());
			editor.value =
				'<p>1</p><p>2</p><strong><span>22</span></strong><p>4</p>stop';
			const range = editor.selection.createRange();
			range.setStartBefore(editor.editor.firstChild);
			range.setEndAfter(editor.editor.lastChild);
			editor.selection.selectRange(range);

			const nodesNames = [];
			editor.selection.eachSelection(function(node) {
				nodesNames.push(node.nodeName);
			});

			expect(
				['P', 'P', 'STRONG', 'P', '#text'].toString().toLowerCase()
			).equals(nodesNames.toString().toLowerCase());
		});
		it('Should call callback for each node in selection range', function() {
			const editor = new Jodit(appendTestArea());
			editor.value =
				'<p>1</p><p>2</p><strong><span>22</span></strong><p>4</p>stop';
			const range = editor.selection.createRange();
			range.setStartBefore(editor.editor.firstChild.nextSibling);
			range.setEndAfter(editor.editor.lastChild.previousSibling);
			editor.selection.selectRange(range);

			const nodesNames = [];
			editor.selection.eachSelection(function(node) {
				nodesNames.push(node.nodeName);
			});

			expect(['p', 'strong', 'p'].toString().toLowerCase()).equals(
				nodesNames.toString().toLowerCase()
			);
		});
		it('Should not call callback for editor', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '';

			editor.selection.setCursorIn(editor.editor);

			const nodesNames = [];
			editor.selection.eachSelection(function(node) {
				nodesNames.push(node.nodeName);
			});

			expect(['#text'].toString().toLowerCase()).equals(
				nodesNames.toString().toLowerCase()
			);
		});
		it('Should call callback for current node if selection is collapsed', function() {
			const editor = new Jodit(appendTestArea());
			editor.value = '<p>1</p><p>2</p>';

			editor.selection.setCursorIn(editor.editor.firstChild);

			const nodesNames = [];
			editor.selection.eachSelection(function(node) {
				nodesNames.push(node.nodeName);
			});

			expect(['#text'].toString().toLowerCase()).equals(
				nodesNames.toString().toLowerCase()
			);
		});
		describe('If selected element is UL or LI or content in LI', function() {});
	});
	afterEach(removeStuff);
});
