/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Jodit Editor Tests', function () {
	describe('Constructor', function () {
		it('Constructor Jodit must be in global scope', function () {
			expect(window.Jodit).is.a('function');
		});

		it('Constructor Jodit should have version and esnext field', function () {
			expect(/\d+\.\d+\.\d+/.test(Jodit.prototype.getVersion())).is.true;
			expect(typeof Jodit.esNext).eq('boolean');
		});

		it('Constructor default should not be in global scope', function () {
			expect(window.default).is.not.a('function');
			expect(window.default).does.not.equal(window.Jodit);
		});

		describe('First argument', function () {
			describe('String 	#id', function () {
				it('Should be valid selector', function () {
					const area = appendTestArea('editor');

					const editor = Jodit.make('#editor');
					expect(editor.element).equals(area);
					editor.destruct();
				});
			});

			describe('Undefined,null,false,bad seelctor,function,number, text node', function () {
				it('Should be not valid selector', function () {
					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(0);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make();
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(null);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(false);
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make('.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make('>asdsad.salomon');
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(function () {});
					}).to.throw(Error);

					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(233);
					}).to.throw(Error);

					const elm = document.createTextNode('stop');
					expect(function () {
						// eslint-disable-next-line no-new
						Jodit.make(elm);
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

			describe('Double apply to one element', function () {
				it('Should create only one instance', function () {
					const div = document.createElement('div');
					document.body.appendChild(div);

					const editor3 = getJodit(undefined, div);

					expect(editor3.element).equals(div);

					const editor4 = getJodit(undefined, div);

					expect(editor4.element).equals(div);
					expect(editor4).equals(editor3);

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

		describe('For async plugins all plugins ready', () => {
			it('should allow set and get value', () => {
				const jodit = getJodit({
					extraPlugins: ['ddd']
				});
				jodit.value = '<p>test</p>';
				expect(jodit.value).eq('<p>test</p>');
			});

			it('should allow use editor field', () => {
				const jodit = getJodit({
					extraPlugins: ['ddd']
				});
				expect(jodit.editor).is.not.null;
			});
		});

		describe('Options', function () {
			it('Options should be inherited from the default values', function () {
				const editor = getJodit({
					zIndex: 1986
				});

				expect(editor.options.zIndex).equals(1986);
				expect(editor.options.spellcheck).is.false;
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

		describe('Init in shadow root', function () {
			it('Should create all elements inside shadow root', function () {
				const app = appendTestDiv();
				app.attachShadow({ mode: 'open' });
				const root = app.shadowRoot;

				root.innerHTML = '<div id="edit"></div>';

				const editor = getJodit(
					{
						globalFullSize: false,
						shadowRoot: root
					},
					root.getElementById('edit')
				);

				clickButton('brush', editor);

				const popup = getOpenedPopup(editor);

				expect(popup.parentNode.parentNode === root).is.true;
			});

			it('Should create toolbar button popups elements outside the shadow root for keyboard tab navigation ', function () {
				const app = appendTestDiv();
				app.attachShadow({ mode: 'open' });
				const root = app.shadowRoot;

				root.innerHTML = '<div id="edit"></div>';

				const editor = getJodit(
					{
						globalFullSize: false,
						shadowRoot: root,
						allowTabNavigation: true
					},
					root.getElementById('edit')
				);

				clickButton('brush', editor);

				const popup = getOpenedPopup(editor);

				expect(popup.parentNode.parentNode !== root).is.true;
			});

			describe('Select element inside', function () {
				it('Should use Selection from shadow root', function () {
					const app = appendTestDiv();
					app.attachShadow({ mode: 'open' });
					const root = app.shadowRoot;

					root.innerHTML = '<div id="edit"></div>';

					const editor = getJodit(
						{
							globalFullSize: false,
							shadowRoot: root
						},
						root.getElementById('edit')
					);

					editor.value = '<p>test</p>';
					editor.s.select(editor.editor.firstChild, true);
					replaceCursorToChar(editor);

					expect(editor.value).eq('<p>|test|</p>');
				});
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
				('filebrowser' in window.skipTest ? describe.skip : describe)(
					'FileBrowser',
					function () {
						it('should create instance of Filebrowser  only one time and in lazy mode', function () {
							const editor = getJodit();

							editor.components.forEach(function (cmp) {
								expect(
									cmp instanceof Jodit.modules.FileBrowser
								).is.false;
							});

							const filebrowser = editor.filebrowser;
							expect(
								filebrowser instanceof Jodit.modules.FileBrowser
							).is.true;

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
					}
				);

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

			describe('Composition event', () => {
				it('should handled normal', () => {
					const jodit = getJodit({
						defaultTimeout: 0
					});

					jodit.value = '<p>test</p>';

					simulateEvent('compositionend', jodit.editor);
					expect(jodit.value).eq('<p>test</p>');
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
