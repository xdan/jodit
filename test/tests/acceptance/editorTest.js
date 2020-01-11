describe('Jodit Editor Tests', function() {
	describe('Constructor', function() {
		it('Constructor Jodit must be in global scope', function() {
			expect(window.Jodit).to.be.a('function');
		});

		describe('First argument', function() {
			describe('String #id', function() {
				it('Should be valid selector', function() {
					const area = appendTestArea('editor');

					const editor = new Jodit('#editor');
					expect(editor.element).equals(area);
					editor.destruct();
				});
			});

			describe('Undefined,null,false,bad seelctor,function,number, text node', function() {
				it('Should be not valid selector', function() {
					expect(function() {
						new Jodit(0);
					}).to.throw(Error);

					expect(function() {
						new Jodit();
					}).to.throw(Error);

					expect(function() {
						new Jodit(null);
					}).to.throw(Error);

					expect(function() {
						new Jodit(false);
					}).to.throw(Error);

					expect(function() {
						new Jodit('.salomon');
					}).to.throw(Error);

					expect(function() {
						new Jodit('>asdsad.salomon');
					}).to.throw(Error);

					expect(function() {
						new Jodit(function() {
						});
					}).to.throw(Error);

					expect(function() {
						new Jodit(233);
					}).to.throw(Error);

					const elm = document.createTextNode('stop');
					expect(function() {
						new Jodit(elm);
					}).to.throw(Error);
				});
			});
			describe('HTMLTextAreaElement', function() {
				it('Should be instance of HTMLElement', function() {
					const area = appendTestArea('editor2');

					const editor2 = new Jodit(area);
					expect(editor2.element).equals(area);
					editor2.destruct();
				});
			});
			describe('HTMLDivElement', function() {
				it('Should be instance of HTMLElement', function() {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					document.body.appendChild(div);
					const editor3 = new Jodit(div);

					expect(editor3.element).equals(div);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());

					editor3.destruct();
					document.body.removeChild(div);
				});
			});
			describe('Found element', function() {
				it('Should be instance of HTMLElement', function() {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					div.setAttribute('id', 'test2222');
					document.body.appendChild(div);

					const found = document.getElementById('test2222');

					const editor3 = new Jodit(found);

					expect(editor3.element).equals(found);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());
					editor3.destruct();

					document.body.removeChild(div);
				});
			});
		});

		it('Editor should replace and hide source textarea', function() {
			const area = appendTestArea();

			const editor = new Jodit(area);
			expect(area.style.display).equals('none');

			if (!editor.options.iframe) {
				expect(editor.editor).equals(document.querySelector('.jodit_wysiwyg'));
			} else {
				expect(editor.editor).equals(editor.editorDocument.body);
			}
		});

		describe('Options', function() {
			it('Options should be inherited from the default values', function() {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					zIndex: 1986
				});
				expect(editor.options.zIndex).equals(1986);
				expect(editor.options.spellcheck).equals(true);
			});

			describe('Set nested array', function() {
				it('Should create editor with merged default array and set array', function() {
					const area = appendTestArea();
					Jodit.defaultOptions.someArray = {
						data: [1, 2, 3, 4]
					};
					const editor = new Jodit(area, {
						someArray: {
							data: [5, 6, 7]
						}
					});

					expect(editor.options.someArray.data.toString()).equals('5,6,7,4');
				});

				describe('Set nested array like Jodit.Array', function() {
					it('Should create editor with set array', function() {
						const area = appendTestArea();
						Jodit.defaultOptions.someArray = {
							data: [1, 2, 3, 4]
						};
						const editor = new Jodit(area, {
							someArray: {
								data: Jodit.Array([5, 6, 7])
							}
						});

						expect(editor.options.someArray.data.toString()).equals('5,6,7');
					});
				});
			});

			describe('Set nested object', function() {
				it('Should create editor with merged default object and set object', function() {
					const area = appendTestArea();
					Jodit.defaultOptions.someObject = {
						data: {
							left: 10,
							right: 20
						}
					};
					const editor = new Jodit(area, {
						someObject: {
							data: {
								top: 10,
								right: 10
							}
						}
					});

					expect(JSON.stringify(editor.options.someObject.data)).equals('{"left":10,"right":10,"top":10}');
				});

				describe('Set nested object like Jodit.Object', function() {
					it('Should create editor with set object', function() {
						const area = appendTestArea();
						Jodit.defaultOptions.someObject = {
							data: {
								left: 10,
								right: 20
							}
						};
						const editor = new Jodit(area, {
							someObject: {
								data: Jodit.Object({
									top: 10,
									right: 10
								})
							}
						});

						expect(JSON.stringify(editor.options.someObject.data)).equals('{"top":10,"right":10}');
					});
				});
			});
		});

		describe('Sizes', function() {
			describe('Set fixed height', function() {
				it('Should set editor height by option', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						height: 300
					});

					editor.value = '<p>test</p>'.repeat(100);

					expect(editor.container.offsetHeight).to.be.below(1000);
				});

				it('Should set editor height by option for iframe', function() {
					const editor = new Jodit(appendTestArea(), {
						height: 300,
						iframe: true
					});

					editor.value = '<p>test</p>'.repeat(100);
					expect(editor.container.offsetHeight).is.below(1000);
				});

				it('Should not change size by content after window was resized', function() {
					const editor = new Jodit(appendTestArea(), {
						height: 300
					});

					editor.value = '<p>test</p>'.repeat(20);
					expect(editor.container.offsetHeight).equals(300);

					simulateEvent('resize', 0, window);
					expect(editor.container.offsetHeight).equals(300);
				});


				describe('Fullsize mode', function() {
					it('Should set heights of workplace to 100% - toolbar\'s height', function() {
						const editor = new Jodit(appendTestArea(), {
							fullsize: true
						});

						expect(editor.workplace.offsetHeight).to.be.above(300);

					});
					it('Should restore size after fullsized mode', function() {
						const editor = new Jodit(appendTestArea(), {
							height: 300
						});

						editor.setEditorValue('<p>test</p>'.repeat(20));
						expect(editor.container.offsetHeight).equals(300);

						editor.toggleFullSize(true);
						expect(editor.container.offsetHeight).to.be.above(300);

						editor.toggleFullSize(false);
						expect(editor.container.offsetHeight).equals(300);
						expect(editor.container.offsetWidth).to.be.above(300);
					});

					it('Should hide resizer', function() {
						const editor = new Jodit(appendTestArea(), {
							height: 300,
							iframe: true
						});
						const handle = editor.container.querySelector('.jodit_editor_resize');

						expect(handle).is.not.null;
						editor.toggleFullSize(true);
						expect(editor.ownerWindow.getComputedStyle(handle).display).equals('none');
					});
					it('Should change the icon in toolbar', function() {
						const editor = new Jodit(appendTestArea());
						const button = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-fullsize');
						expect(button).is.not.null;

						expect(button.querySelector('svg')).is.not.null;

						const old_icon = button.querySelector('svg').innerHTML;

						editor.toggleFullSize(true);
						expect(button.querySelector('svg').innerHTML).does.not.equal(old_icon);

						editor.toggleFullSize(false);
						expect(button.querySelector('svg').innerHTML).equals(old_icon);
					});
					describe('For text icons', function() {
						it('Should change the text in toolbar', function() {
							const editor = new Jodit(appendTestArea(), {
								'textIcons': true
							});
							const button = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-fullsize');
							expect(button).is.not.null;
							expect(button.querySelector('svg')).equals(null);

							const old_icon = button.textContent;

							editor.toggleFullSize(true);
							expect(button.textContent).does.not.equal(old_icon);

							editor.toggleFullSize(false);
							expect(button.textContent).equals(old_icon);
						});
					});
				});

				it('Should not change size by content after window was resized', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						height: 300
					});
					editor.setEditorValue('<p>test</p>'.repeat(20));
					expect(editor.container.offsetHeight).equals(300);

					simulateEvent('resize', 0, window);
					expect(editor.container.offsetHeight).equals(300);
				});
			});

			describe('Autosize', function() {
				it('Should set editor height by content', function() {
					const area = appendTestArea();
					const editor = new Jodit(area);
					editor.setEditorValue('<p>test</p>'.repeat(100));
					expect(editor.container.offsetHeight).to.be.above(1000);
				});
				it('Should set editor height by content in iframe mode', function() {
					const area = appendTestArea();
					const editor = new Jodit(area, {
						iframe: true
					});
					editor.setEditorValue('<p>test</p>'.repeat(100));
					expect(editor.container.offsetHeight).to.be.above(1000);
				});
			});
		});

		describe('Set font for editor', function() {
			it('Should set the font-family of the editor by option', function() {
				const
					editor = new Jodit(appendTestArea(), {
						style: {
							fontFamily: 'Arial'
						}
					});

				editor.value = '<some>test</some>';

				const
					style = window.getComputedStyle(editor.editor.firstChild);

				expect(style.fontFamily).equals('Arial');
			});
		});

		describe('Check preset', function() {
			it('Should set option by preset', function() {
				const editor2 = new Jodit(appendTestArea());
				expect(editor2.options.inline).to.be.false;
				expect(editor2.options.toolbar).is.true;
				expect(editor2.options.readonly).to.be.false;

				const editor = new Jodit(appendTestArea(), {
					preset: 'inline'
				});
				expect(editor.options.inline).is.true;
				expect(editor.options.toolbar).to.be.false;

				Jodit.defaultOptions.presets.custom = { readonly: true };
				const editor3 = new Jodit(appendTestArea(), {
					preset: 'custom'
				});
				expect(editor3.options.readonly).is.true;

				const editor4 = new Jodit(appendTestArea(), {
					preset: 'inline',
					inline: false
				});
				expect(editor4.options.inline).to.be.false;
				expect(editor4.options.toolbar).to.be.false;
			});
		});
	});

	describe('Editors stack', function() {
		it('Jodit.instances should contain all instances of Jodit', function() {
			const editor = new Jodit(appendTestArea('textarea_editor'));
			expect(Jodit.instances.textarea_editor).equals(editor);
		});

		it('Jodit.instances should not contain editor after destruct', function() {
			const editor = new Jodit(appendTestArea('textarea_editor'));
			editor.destruct();
			expect(Jodit.instances.textarea_editor).to.be.an('undefined');
		});
	});

	describe('Destructor', function() {
		it('After call "destruct" method, should return source textarea and remove Editor\'s stuf', function() {
			const area = appendTestArea();
			area.style.display = 'block';

			const editor = new Jodit(area);
			expect(area.style.display).equals('none');
			expect(editor.container.parentNode).equals(area.parentNode);
			editor.destruct();

			expect(area.style.display).equals('block');
			expect(editor.editor).equals(undefined);

		});

		it('After call "destruct" method, should return source textarea and remove all Editor\'s stuf', function() {
			const box = document.createElement('div'),
				area = document.createElement('textarea');

			box.appendChild(area);
			document.body.appendChild(box);

			const editor = new Jodit(area);
			editor.destruct();

			expect(box.innerHTML).equals('<textarea></textarea>');
			box.parentNode.removeChild(box);
		});
	});

	describe('Set/Get', function() {
		describe('Set value', function() {
			it('Set element value', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.setElementValue('Test');
				expect(area.value).equals('Test');
			});

			it('Set value by magic property', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.value = 'Test';
				expect(area.value).equals('Test');
				expect(editor.getEditorValue()).equals('Test');
				expect(editor.value).equals('Test');
			});
		});

		it('Set wrong element value', function() {
			const
				area = appendTestArea(),
				editor = new Jodit(area);

			expect(function() {
				editor.setElementValue(document.createTextNode('Test'));
			}).to.throw(/value must be/);
		});

		it('Set editor value', function() {
			const
				area = appendTestArea(),
				editor = new Jodit(area);

			editor.setEditorValue('<div>Test</div>');
			expect(editor.editor.innerHTML).equals('<div>Test</div>');
		});

		it('Set no string editor value', function() {
			const
				area = appendTestArea(),
				editor = new Jodit(area);

			expect(function() {
				editor.setEditorValue(document.createElement('div'));
			}).to.throw(/value must be/);
		});

		it('Set wrong editor value', function() {
			const
				area = appendTestArea(),
				editor = new Jodit(area);

			editor.setEditorValue('<div>Test<div>');
			expect(editor.editor.innerHTML).equals('<div>Test<div></div></div>');
		});

		describe('Placeholder', function() {
			describe('After init on empty textarea', function() {
				it('Should show placeholder', function() {
					const
						area = appendTestArea();

					area.value = '';

					const
						editor = new Jodit(area);

					expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'block').equals(true);
				});
			});

			describe('After init on not empty textarea', function() {
				it('Should hide placeholder', function() {
					const area = appendTestArea();
					area.value = '111';
					const editor = new Jodit(area);
					expect(!editor.container.querySelectorAll('.jodit_placeholder').length).equals(true);
				});
			});
		});

		it('Show placeholder', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);

			editor.setEditorValue('');

			expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'block').equals(true);

			editor.selection.insertNode(editor.editorDocument.createTextNode('test'));

			expect(!editor.container.querySelectorAll('.jodit_placeholder').length).equals(true);
		});

		describe('For element with fontsize 12px', function() {
			it('Should set Placeholder\'s fontsize', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);

				editor.editor.style.fontSize = '12px';
				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
				expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.fontSize === '12px').equals(true);
			});
		});

		describe('Synchronization', function() {
			it('Check synchronization between element and editor', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.setEditorValue('<div>Test<div>');

				const sel = window.getSelection(),
					range = document.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);

				expect(editor.getElementValue()).equals('<div>Test<div></div></div>');
			});

			it('Check synchronization between editor and element', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				area.value = '<div>Test</div>';
				editor.setElementValue();
				expect(editor.getEditorValue()).equals('<div>Test</div>');
			});

			it('Check synchronization between editor and element with wrong html', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.setElementValue('<div>Test</div>');
				expect(editor.getEditorValue()).equals(editor.getElementValue());
			});

			it('Check synchronization between editor and element when was pressed button', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);
				editor.setElementValue('<div>Test</div>');
				expect(editor.getEditorValue()).equals(editor.getElementValue());

				const sel = window.getSelection(),
					range = document.createRange();

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);
				sel.removeAllRanges();
				sel.addRange(range);


				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.getEditorValue()).equals(editor.getElementValue());
			});
		});

		describe('Save selection stuf', function() {
			describe('Set false in getEditorValue method', function() {
				it('Should return HTML with selections markers', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = 'test';
					editor.selection.setCursorAfter(editor.editor.firstChild);
					editor.selection.save(); // add selection markers
					expect(/<span[^>]+id="jodit_selection_marker_[^>]+><\/span>/.test(editor.getEditorValue(false))).is.true;
					expect(/<span[^>]+id="jodit_selection_marker_[^>]+><\/span>/.test(editor.getEditorValue(true))).to.be.false;
				});
			});
		});

		describe('Change returning value', function() {
			describe('Event "beforeGetValueFromEditor"', function() {
				it('Should restore &gt; to normal value in Liquid expressions', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = 'test {% if a > b %} stop {% if a < b %}';
					expect(editor.value).equals('test {% if a &gt; b %} stop {% if a &lt; b %}');

					editor.events.on('beforeGetValueFromEditor', function() {
						return editor.getNativeEditorValue().replace(/\{%[^\}]+%\}/g, function(match) {
							return match
								.replace(/&gt;/g, '>')
								.replace(/&lt;/g, '<');
						});
					});

					expect(editor.value).equals('test {% if a > b %} stop {% if a < b %}');
				});
			});

			describe('Event "beforeSetValueToEditor"', function() {
				it('Should be fired before set editor value', function() {
					const editor = new Jodit(appendTestArea());
					editor.value = 'test';
					expect(editor.value).equals('test');

					editor.events.on('beforeSetValueToEditor', function(old_value) {
						return old_value + ' stop';
					});

					editor.value = 'test';

					expect(editor.value).equals('test stop');

					editor.events.on('beforeSetValueToEditor', function(old_value) {
						return false;
					});

					editor.value = 'uuups';

					expect(editor.value).equals('test stop');
				});
			});
		});

		describe('Check Cache decorator', function() {
			describe('Get filebrowser and uploader property from editor', function() {
				describe('FileBrowser', function() {
					it('should create instance of Filebrowser  only one time and in lazy mode', function() {
						const editor = new Jodit(appendTestArea());

						editor.components.forEach(function(cmp) {
							expect(cmp instanceof Jodit.modules.FileBrowser).to.be.false;
						});

						const filebrowser = editor.filebrowser;
						expect(filebrowser instanceof Jodit.modules.FileBrowser).is.true;

						let instanceCount = 0;

						editor.components.forEach(function(cmp) {
							if (cmp instanceof Jodit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const filebrowser2 = editor.filebrowser;
						editor.components.forEach(function(cmp) {
							if (cmp instanceof Jodit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(2);
						expect(filebrowser2 === filebrowser).is.true;
					});
				});

				describe('Uploader', function() {
					it('should create instance of Uploader  only one time and in lazy mode', function() {
						const editor = new Jodit(appendTestArea());
						editor.components.forEach(function(cmp) {
							expect(cmp instanceof Jodit.modules.Uploader).to.be.false;
						});

						const uploader = editor.uploader;
						expect(uploader instanceof Jodit.modules.Uploader).is.true;

						let instanceCount = 0;

						editor.components.forEach(function(cmp) {
							if (cmp instanceof Jodit.modules.Uploader) {
								instanceCount += 1;
								expect(uploader === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const uploader2 = editor.uploader;

						editor.components.forEach(function(cmp) {
							if (cmp instanceof Jodit.modules.Uploader) {
								instanceCount += 1;
								expect(uploader === cmp).is.true;
							}
						});

						expect(instanceCount).equals(2);
						expect(uploader2 === uploader).is.true;
					});
				});
			});
		});
	});

	describe('Selection module', function() {
		it('Current selection element should be inside editor', function() {
			const
				editor = new Jodit(appendTestArea()),
				div = document.createElement('div');

			document.body.appendChild(div);
			div.innerHTML = 'jingl';

			const sel = window.getSelection(),
				range = document.createRange();

			range.selectNodeContents(div);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			expect(editor.selection.current()).equals(false);
			div.parentNode.removeChild(div);
		});

		it('Current selection element', function() {
			const editor = new Jodit(appendTestArea()),
				div = editor.editorDocument.createElement('div'),
				text = editor.editorDocument.createTextNode('jingl');


			editor.setEditorValue('');
			div.appendChild(text);
			editor.selection.insertNode(div);
			editor.selection.setCursorIn(text);

			expect(editor.selection.current()).equals(text);
		});

		it('Insert simple text node in editor', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);
			editor.selection.insertNode(editor.editorDocument.createTextNode('Test'));
			expect(editor.getEditorValue()).equals('Test');
			editor.destruct();
		});

		it('Insert 3 divs', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);

			function insert(digit) {
				const div = editor.editorDocument.createElement('div');

				div.innerHTML = digit;
				editor.selection.insertNode(div);
			}

			insert(1);
			insert(2);
			insert(3);

			expect(editor.getEditorValue()).equals('<div>1</div><div>2</div><div>3</div>');
			editor.destruct();
		});

		it('Insert wrong data', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);

			expect(function() {
				editor.selection.insertNode();
			}).to.throw(/node must be/);

			expect(function() {
				editor.selection.insertNode('Text');
			}).to.throw(/node must be/);

			expect(function() {
				editor.selection.insertNode(null);
			}).to.throw(/node must be/);

			editor.destruct();
		});

		it('Select all and delete. Check plugin "backspace"', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);
			editor.setEditorValue('<p>asdasd</p><p>asdasd</p><p>asd</p>');
			editor.execCommand('selectall');
			editor.execCommand('delete');
			expect(editor.getEditorValue()).equals('');
			editor.destruct();
		});

		describe('Editor after focus and after blur', function() {
			it('Should change editorIsActive field', function() {
				const
					input = document.createElement('input'),
					p = document.createElement('p'),
					editor = new Jodit(appendTestArea());

				input.type = 'input';
				document.body.appendChild(input);

				p.textContent = 'Hi';
				document.body.appendChild(p);

				editor.value = '<p>Hello world</p>';
				editor.selection.focus();
				editor.selection.setCursorAfter(editor.editor.firstChild);

				expect(editor.editorIsActive).is.true;

				input.focus();
				simulateEvent('blur', 0, editor.editor);
				expect(editor.editorIsActive).to.be.false;
				document.body.removeChild(input);

				editor.selection.focus();
				editor.selection.setCursorAfter(editor.editor.firstChild);
				expect(editor.editorIsActive).is.true;

				const sel = window.getSelection(),
					range = document.createRange();

				range.selectNodeContents(p);
				sel.removeAllRanges();
				sel.addRange(range);

				simulateEvent('blur', 0, editor.editor);
				expect(editor.editorIsActive).to.be.false;
				document.body.removeChild(p);
			});
		});

		describe('Cursor position', function() {
			it('Should set cursor after node', function() {
				const area = appendTestArea();
				const editor = new Jodit(area, {
					cleanHTML: {
						removeEmptyElements: false
					}
				});
				const spans = [editor.editorDocument.createElement('span'), editor.editorDocument.createElement('span'), editor.editorDocument.createElement('span')];

				editor.selection.insertNode(spans[0]);
				editor.selection.insertNode(spans[1]);
				editor.selection.insertNode(spans[2]);

				editor.selection.setCursorAfter(spans[1]);
				editor.selection.insertNode(editor.editorDocument.createElement('i'));


				expect(editor.getEditorValue()).equals('<span></span><span></span><i></i><span></span>');
			});

			it('Set cursor in non placed element', function() {
				const area = appendTestArea();
				const editor = new Jodit(area);

				expect(function() {
					const div = editor.editorDocument.createElement('div');
					editor.selection.setCursorIn(div);
				}).to.Throw(/in editor/);
			});
		});
	});

	afterEach(removeStuff);
});
