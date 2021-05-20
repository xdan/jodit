/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Jodit Editor Tests', function () {
	describe('Constructor', function () {
		it('Constructor Jodit must be in global scope', function () {
			expect(window.Jodit).is.a('function');
		});

		it('Constructor default should not be in global scope', function () {
			expect(window.default).is.not.a('function');
			expect(window.default).does.not.equal(window.Jodit);
		});

		describe('First argument', function () {
			describe('String #id', function () {
				it('Should be valid selector', function () {
					const area = appendTestArea('editor');

					const editor = new Jodit('#editor');
					expect(editor.element).equals(area);
					editor.destruct();
				});
			});

			describe('Undefined,null,false,bad seelctor,function,number, text node', function () {
				it('Should be not valid selector', function () {
					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(0);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit();
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(null);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(false);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit('.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit('>asdsad.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(function () {});
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(233);
					}).to.throw(Error);

					const elm = document.createTextNode('stop');
					expect(function () {
						// eslint-disable-next-line no-new
						new Jodit(elm);
					}).to.throw(Error);
				});
			});

			describe('HTMLTextAreaElement', function () {
				it('Should be instance of HTMLElement', function () {
					const area = appendTestArea('editor2');

					const editor2 = getJodit(undefined, area);
					expect(editor2.element).equals(area);
					editor2.destruct();
				});
			});

			describe('HTMLDivElement', function () {
				it('Should be instance of HTMLElement', function () {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					document.body.appendChild(div);
					const editor3 = getJodit(undefined, div);

					expect(editor3.element).equals(div);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());

					editor3.destruct();
					document.body.removeChild(div);
				});
			});

			describe('Found element', function () {
				it('Should be instance of HTMLElement', function () {
					const div = document.createElement('div');
					div.innerHTML = '<h1>Test</h1>';
					div.setAttribute('id', 'test2222');
					document.body.appendChild(div);

					const found = document.getElementById('test2222');

					const editor3 = getJodit(undefined, found);

					expect(editor3.element).equals(found);
					expect('<h1>Test</h1>').equals(editor3.getEditorValue());
					editor3.destruct();

					document.body.removeChild(div);
				});
			});
		});

		it('Editor should replace and hide source textarea', function () {
			const area = appendTestArea();

			const editor = getJodit(undefined, area);
			expect(area.style.display).equals('none');

			if (!editor.options.iframe) {
				expect(editor.editor).equals(
					document.querySelector('.jodit-wysiwyg')
				);
			} else {
				expect(editor.editor).equals(editor.ed.body);
			}
		});

		describe('Source textarea', () => {
			it('should have component properties with Jodit instance', function () {
				const area = appendTestArea();

				const editor = getJodit(undefined, area);
				expect(area.component).equals(editor);
			});

			describe('After destruct', () => {
				it('should not have component properties with Jodit instance', function () {
					const area = appendTestArea();

					const editor = getJodit(undefined, area);
					editor.destruct();
					expect(area.component).is.null;
				});
			});
		});

		describe('Options', function () {
			it('Options should be inherited from the default values', function () {
				const editor = getJodit({
					zIndex: 1986
				});

				expect(editor.options.zIndex).equals(1986);
				expect(editor.options.spellcheck).is.true;
			});

			describe('Set nested array', function () {
				it('Should create editor with merged default array and set array', function () {
					Jodit.defaultOptions.someArray = {
						data: [1, 2, 3, 4]
					};
					const editor = getJodit({
						someArray: {
							data: [5, 6, 7]
						}
					});

					expect(editor.options.someArray.data.toString()).equals(
						'5,6,7,4'
					);
				});

				describe('Set nested array like Jodit.atom', function () {
					it('Should create editor with set array', function () {
						Jodit.defaultOptions.someArray = {
							data: [1, 2, 3, 4]
						};

						const editor = getJodit({
							someArray: {
								data: Jodit.atom([5, 6, 7])
							}
						});

						expect(editor.options.someArray.data.toString()).equals(
							'5,6,7'
						);
					});
				});
			});

			describe('Set nested object', function () {
				it('Should create editor with merged default object and set object', function () {
					Jodit.defaultOptions.someObject = {
						data: {
							left: 10,
							right: 20
						}
					};

					const editor = getJodit({
						someObject: {
							data: {
								top: 10,
								right: 10
							}
						}
					});

					expect(
						JSON.stringify(flatten(editor.options.someObject.data))
					).equals('{"top":10,"right":10,"left":10}');
				});

				describe('Set nested object like Jodit.atom', function () {
					it('Should create editor with set object', function () {
						Jodit.defaultOptions.someObject = {
							data: {
								left: 10,
								right: 20
							}
						};

						const editor = getJodit({
							someObject: {
								data: Jodit.atom({
									top: 10,
									right: 10
								})
							}
						});

						expect(
							JSON.stringify(editor.options.someObject.data)
						).equals('{"top":10,"right":10}');
					});
				});
			});

			describe('Statusbar', function () {
				describe('Hide', function () {
					it('should not show statusbar', function () {
						const editor = getJodit({
							statusbar: false
						});

						expect(
							editor.container
								.querySelector('.jodit-status-bar')
								.classList.contains('jodit_hidden')
						).is.true;

						expect(editor.statusbar.isShown).is.false;
					});

					describe('Show programmatically', function () {
						it('should show statusbar', function () {
							const editor = getJodit({
								statusbar: false
							});

							expect(
								editor.container
									.querySelector('.jodit-status-bar')
									.classList.contains('jodit_hidden')
							).is.true;
							expect(editor.statusbar.isShown).is.false;

							editor.statusbar.show();

							expect(
								editor.container
									.querySelector('.jodit-status-bar')
									.classList.contains('jodit_hidden')
							).is.false;
							expect(editor.statusbar.isShown).is.true;
						});
					});
				});

				describe('Show', function () {
					it('should show statusbar', function () {
						const editor = getJodit();

						expect(
							editor.container
								.querySelector('.jodit-status-bar')
								.classList.contains('jodit_hidden')
						).is.false;
						expect(editor.statusbar.isShown).is.true;
					});
				});
			});
		});

		describe('Set font for editor', function () {
			it('Should set the font-family of the editor by option', function () {
				const editor = getJodit({
					style: {
						fontFamily: 'Arial'
					}
				});

				editor.value = '<some>test</some>';

				const style = window.getComputedStyle(editor.editor.firstChild);

				expect(style.fontFamily).equals('Arial');
			});
		});

		describe('Check preset', function () {
			it('Should set option by preset', function () {
				const editor2 = getJodit();

				expect(editor2.options.inline).is.false;
				expect(editor2.options.toolbar).is.true;
				expect(editor2.options.readonly).is.false;

				const editor = getJodit({
					preset: 'inline'
				});
				expect(editor.options.inline).is.true;
				expect(editor.options.toolbar).is.false;

				Jodit.defaultOptions.presets.custom = { readonly: true };
				const editor3 = getJodit({
					preset: 'custom'
				});
				expect(editor3.options.readonly).is.true;

				const editor4 = getJodit({
					preset: 'inline',
					inline: false
				});
				expect(editor4.options.inline).is.false;
				expect(editor4.options.toolbar).is.false;
			});
		});
	});

	describe('Editors stack', function () {
		it('Jodit.instances should contain all instances of Jodit', function () {
			const editor = getJodit(
				undefined,
				appendTestArea('textarea_editor')
			);
			expect(Jodit.instances.textarea_editor).equals(editor);
		});

		it('Jodit.instances should not contain editor after destruct', function () {
			const editor = getJodit(
				undefined,
				appendTestArea('textarea_editor')
			);
			editor.destruct();
			expect(Jodit.instances.textarea_editor).to.be.an('undefined');
		});
	});

	describe('Destructor', function () {
		it('After call "destruct" method, should return source textarea and remove Editor\'s stuf', function () {
			const area = appendTestArea();
			area.style.display = 'block';

			const editor = getJodit(undefined, area);
			expect(area.style.display).equals('none');
			expect(editor.container.parentNode).equals(area.parentNode);
			editor.destruct();

			expect(area.style.display).equals('block');
			expect(editor.editor).equals(undefined);
		});

		it('After call "destruct" method, should return source textarea and remove all Editor\'s stuf', function () {
			const box = document.createElement('div'),
				area = document.createElement('textarea');

			box.appendChild(area);
			document.body.appendChild(box);

			const editor = getJodit(undefined, area);
			editor.destruct();

			expect(box.innerHTML).equals('<textarea></textarea>');
			box.parentNode.removeChild(box);
		});
	});

	describe('Set/Get', function () {
		describe('Set value', function () {
			it('Set element value', function () {
				const area = appendTestArea();
				const editor = getJodit(undefined, area);
				editor.setElementValue('<p>Test</p>');
				expect(area.value).equals('<p>Test</p>');
			});

			it('Set value by magic property', function () {
				const area = appendTestArea();
				const editor = getJodit(undefined, area);
				editor.value = 'Test';

				expect(area.value).equals('<p>Test</p>');
				expect(editor.value).equals('<p>Test</p>');
			});
		});

		it('Set wrong element value', function () {
			const area = appendTestArea(),
				editor = getJodit(undefined, area);

			expect(function () {
				editor.setElementValue(document.createTextNode('Test'));
			}).to.throw(/value must be/);
		});

		it('Set editor value', function () {
			const editor = getJodit();

			editor.value = '<div>Test</div>';
			expect(editor.editor.innerHTML).equals('<div>Test</div>');
		});

		it('Set no string editor value', function () {
			const editor = getJodit();

			expect(function () {
				editor.value = document.createElement('div');
			}).to.throw(/value must be/);
		});

		it('Set wrong editor value', function () {
			const editor = getJodit();

			editor.value = '<div>Test<div>';
			expect(editor.editor.innerHTML).equals(
				'<div>Test<div></div></div>'
			);
		});

		describe('Synchronization', function () {
			it('Check synchronization between element and editor', function () {
				const editor = getJodit();
				editor.value = '<div>Test<div>';

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);

				expect(editor.getElementValue()).equals(
					'<div>Test<div></div></div>'
				);
			});

			it('Check synchronization between editor and element', function () {
				const area = appendTestArea();
				const editor = getJodit(undefined, area);
				area.value = '<div>Test</div>';
				editor.setElementValue();
				expect(editor.value).equals('<div>Test</div>');
			});

			it('Check synchronization between editor and element with wrong html', function () {
				const editor = getJodit();
				editor.setElementValue('<div>Test</div>');
				expect(editor.value).equals(editor.getElementValue());
			});

			it('Check synchronization between editor and element when was pressed button', function () {
				const editor = getJodit();
				editor.setElementValue('<div>Test</div>');
				expect(editor.value).equals(editor.getElementValue());

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);

				simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
				expect(editor.value).equals(editor.getElementValue());
			});
		});

		describe('Save selection stuf', function () {
			describe('Set false in getEditorValue method', function () {
				it('Should return HTML with selections markers', function () {
					const editor = getJodit();
					editor.value = 'test';
					editor.s.setCursorAfter(editor.editor.firstChild);
					editor.s.save(); // add selection markers
					expect(
						/<span[^>]+id="jodit-selection_marker_[^>]+><\/span>/.test(
							editor.getEditorValue(false)
						)
					).is.true;
					expect(
						/<span[^>]+id="jodit-selection_marker_[^>]+><\/span>/.test(
							editor.getEditorValue(true)
						)
					).is.false;
				});
			});
		});

		describe('Change returning value', function () {
			describe('Event "beforeGetValueFromEditor"', function () {
				it('Should restore &gt; to normal value in Liquid expressions', function () {
					const editor = getJodit();
					editor.value = 'test {% if a > b %} stop {% if a < b %}';
					expect(editor.value).equals(
						'<p>test {% if a &gt; b %} stop {% if a &lt; b %}</p>'
					);

					editor.events.on('beforeGetValueFromEditor', function () {
						return editor
							.getNativeEditorValue()
							.replace(/{%[^}]+%}/g, function (match) {
								return match
									.replace(/&gt;/g, '>')
									.replace(/&lt;/g, '<');
							});
					});

					expect(editor.value).equals(
						'<p>test {% if a > b %} stop {% if a < b %}</p>'
					);
				});
			});

			describe('Event "beforeSetValueToEditor"', function () {
				it('Should be fired before set editor value', function () {
					const editor = getJodit();
					editor.value = 'test';
					expect(editor.value).equals('<p>test</p>');

					editor.events.on(
						'beforeSetValueToEditor',
						function (old_value) {
							return old_value + ' stop';
						}
					);

					editor.value = 'test';

					expect(editor.value).equals('<p>test stop</p>');

					editor.events.on('beforeSetValueToEditor', function () {
						return false;
					});

					editor.value = 'uuups';

					expect(editor.value).equals('<p>test stop</p>');
				});
			});
		});

		describe('Check Cache decorator', function () {
			describe('Get filebrowser and uploader property from editor', function () {
				describe('FileBrowser', function () {
					it('should create instance of Filebrowser  only one time and in lazy mode', function () {
						const editor = getJodit();

						editor.components.forEach(function (cmp) {
							expect(
								cmp instanceof Jodit.modules.FileBrowser
							).is.false;
						});

						const filebrowser = editor.filebrowser;
						expect(filebrowser instanceof Jodit.modules.FileBrowser)
							.is.true;

						let instanceCount = 0;

						editor.components.forEach(function (cmp) {
							if (cmp instanceof Jodit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const filebrowser2 = editor.filebrowser;
						editor.components.forEach(function (cmp) {
							if (cmp instanceof Jodit.modules.FileBrowser) {
								instanceCount += 1;
								expect(filebrowser === cmp).is.true;
							}
						});

						expect(instanceCount).equals(2);
						expect(filebrowser2 === filebrowser).is.true;
					});
				});

				describe('Uploader', function () {
					it('should create instance of Uploader  only one time and in lazy mode', function () {
						const editor = getJodit();
						editor.components.forEach(function (cmp) {
							expect(
								cmp instanceof Jodit.modules.Uploader
							).is.false;
						});

						const uploader = editor.uploader;
						expect(uploader instanceof Jodit.modules.Uploader).is
							.true;

						let instanceCount = 0;

						editor.components.forEach(function (cmp) {
							if (cmp instanceof Jodit.modules.Uploader) {
								instanceCount += 1;
								expect(uploader === cmp).is.true;
							}
						});

						expect(instanceCount).equals(1);

						const uploader2 = editor.uploader;

						editor.components.forEach(function (cmp) {
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

	describe('Selection module', function () {
		it('Current selection element should be inside editor', function () {
			const editor = getJodit(),
				div = document.createElement('div');

			document.body.appendChild(div);
			div.innerHTML = 'jingl';

			const sel = window.getSelection(),
				range = document.createRange();

			range.selectNodeContents(div);
			range.collapse(false);
			sel.removeAllRanges();
			sel.addRange(range);

			expect(editor.s.current()).is.null;
			div.parentNode.removeChild(div);
		});

		it('Current selection element', function () {
			const editor = getJodit(),
				div = editor.ed.createElement('div'),
				text = editor.createInside.text('jingl');

			editor.value = '';
			div.appendChild(text);
			editor.s.insertNode(div);
			editor.s.setCursorIn(text);

			expect(editor.s.current()).equals(text);
		});

		it('Insert simple text node in editor', function () {
			const area = appendTestArea();
			const editor = new Jodit(area);
			editor.s.insertNode(editor.createInside.text('Test'));
			expect(editor.value).equals('<p>Test</p>');
			editor.destruct();
		});

		it('Insert 3 divs', function () {
			const editor = getJodit();

			function insert(digit) {
				const div = editor.ed.createElement('div');

				div.innerHTML = digit;
				editor.s.insertNode(div);
			}

			insert(1);
			insert(2);
			insert(3);

			expect(editor.value).equals('<div>1</div><div>2</div><div>3</div>');
			editor.destruct();
		});

		it('Insert wrong data', function () {
			const editor = getJodit();

			expect(function () {
				editor.s.insertNode();
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode('Text');
			}).to.throw(/node must be/);

			expect(function () {
				editor.s.insertNode(null);
			}).to.throw(/node must be/);

			editor.destruct();
		});

		it('Select all and delete. Check plugin "backspace"', function () {
			const editor = getJodit();
			editor.value = '<p>asdasd</p><p>asdasd</p><p>asd</p>';
			editor.execCommand('selectall');
			editor.execCommand('delete');
			expect(editor.value).equals('');
			editor.destruct();
		});

		describe('Editor after focus and after blur', function () {
			it('Should change editorIsActive field', function () {
				const input = document.createElement('input'),
					p = document.createElement('p'),
					editor = getJodit();

				editor.s.focus({
					preventScroll: false
				});

				input.type = 'input';
				document.body.appendChild(input);

				p.textContent = 'Hi';
				document.body.appendChild(p);

				editor.value = '<p>Hello world</p>';
				editor.s.focus();
				editor.s.setCursorAfter(editor.editor.firstChild);

				expect(editor.editorIsActive).is.true;

				input.focus();
				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(input);

				editor.s.focus();
				simulateEvent('focus', editor.editor);
				editor.s.setCursorAfter(editor.editor.firstChild);
				expect(editor.editorIsActive).is.true;

				const range = editor.s.createRange(true);

				range.selectNodeContents(p);

				simulateEvent('blur', editor.editor);
				expect(editor.editorIsActive).is.false;
				document.body.removeChild(p);
			});
		});

		describe('Cursor position', function () {
			it('Should set cursor after node', function () {
				const editor = getJodit({
					cleanHTML: {
						removeEmptyElements: false
					}
				});

				editor.value = '<p></p>';
				editor.s.setCursorIn(editor.editor.firstChild);

				const spans = [
					editor.ed.createElement('span'),
					editor.ed.createElement('span'),
					editor.ed.createElement('span')
				];

				editor.s.insertNode(spans[0]);
				editor.s.insertNode(spans[1]);
				editor.s.insertNode(spans[2]);

				editor.s.setCursorAfter(spans[1]);
				editor.s.insertNode(editor.ed.createElement('i'));

				expect(editor.value).equals(
					'<p><span></span><span></span><i></i><span></span></p>'
				);
			});

			it('Set cursor in non placed element', function () {
				const editor = getJodit();

				expect(function () {
					const div = editor.ed.createElement('div');
					editor.s.setCursorIn(div);
				}).to.Throw(/in editor/);
			});
		});
	});

	describe('Readiness', () => {
		describe('Method waitForReady', () => {
			describe('Sync init', () => {
				it('Should return resolved promise', done => {
					const jodit = getJodit();

					expect(jodit.isReady).is.true;

					jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
						done();
					});
				});
			});

			describe('Async init', () => {
				it('Should return resolved promise', done => {
					unmockPromise();
					const jodit = getJodit({
						events: {
							createEditor: () => delay(100)
						}
					});

					expect(jodit.isReady).is.false;

					jodit.waitForReady().then(j => {
						expect(jodit).eq(j);
						expect(jodit.isReady).is.true;
						done();
					});
				});
			});
		});
	});
});
