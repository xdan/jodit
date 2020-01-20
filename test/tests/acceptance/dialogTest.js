describe('Dialog system tests', function() {
	describe('About dialog', function() {
		it('Should be opened when use clicks on the About button', function() {
			getBox().style.width = '100%';

			const editor = new Jodit(appendTestArea(), {
				disablePlugins: 'mobile'
			});

			const about = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-about');
			expect(about).is.not.null;

			simulateEvent('mousedown', 0, about);

			const dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active');
			expect(dialog).is.not.null;

			expect(dialog.innerHTML.indexOf('xdsoft.net') !== -1).is.true;
		});

		describe('Close About dialog', function() {
			it('Should show Close button in right top corner and close dialog after click', function() {
				getBox().style.width = '100%';
				const editor = new Jodit(appendTestArea(), {
					disablePlugins: 'mobile'
				});

				const about = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-about');
				expect(about).is.not.null;;

				simulateEvent('mousedown', 0, about);

				const dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active');
				expect(dialog).is.not.null;;

				expect(dialog.innerHTML.indexOf('xdsoft.net') !== -1).is.true;

				const close = dialog.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-close');
				expect(close).is.not.null;;

				simulateEvent('mousedown', 0, close);

				expect(editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active')).is.null;

				expect(Jodit.modules.Helpers.css(dialog, 'display')).equals('none');
			});
		});
	});
	describe('Short Jodit.Alert etc static methods', function() {
		it('Should work without Jodit instance', function() {
			const dialog = Jodit.Alert('Hello');
			dialog.close();
		});
		it('Should return Dialog instance', function() {
			const dialog = Jodit.Alert('Hello');
			expect(dialog instanceof Jodit.modules.Dialog).is.true;
			dialog.close();
		});
		describe('Show not string', function() {
			it('Should show dialog with toString value', function() {
				const dialog = Jodit.Alert(111);
				expect(dialog.dialog.querySelector('.jodit_dialog_content').textContent).equals('111');
				dialog.close();
			});
		});
		it('Should get string or HTMLElement or array of string or array of HTMLElement in arguments', function() {
			const dialog = Jodit.Alert(['<div id="hello1">Hello</div>']);
			expect(document.getElementById('hello1')).is.not.null;;
			dialog.close();

			const dialog2 = Jodit.Alert(document.createTextNode('Test'));
			expect(dialog2 instanceof Jodit.modules.Dialog).is.true;
			dialog2.close();

			const div = document.createElement('div');
			div.id = 'hello3';
			const dialog3 = Jodit.Alert(div);
			expect(div).equals(document.getElementById('hello3'));
			dialog3.close();

		});
	});
	describe('Dialog image', function() {
		describe('Opened dialog image', function() {
			it('Should disable margin inputs for left, bottom, right if element has equals margins(margin:10px;)', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value = '<img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="margin:10px;border:1px solid red;width:100px;height:100px;"/>';
				simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

				const dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active');

				expect(dialog.style.display).does.not.equal('none');
				expect(dialog.querySelectorAll('input.margins[disabled]').length).equals(3);
			});
			it('Should enable margin inputs for left, bottom, right if element has not equals margins(margin:10px 5px;)', function() {
				const editor = new Jodit(appendTestArea(), {
					observer: {
						timeout: 0
					},
					image: {
						openOnDblClick: true
					}
				});
				editor.value = '<img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="margin:10px 5px;border:1px solid red;width:100px;height:100px;"/>';
				simulateEvent('dblclick', 0, editor.editor.querySelector('img'));

				const dialog = editor.ownerDocument.querySelector('.jodit.jodit_dialog_box.active');

				expect(dialog.style.display).does.not.equal('none');
				expect(dialog.querySelectorAll('input.margins[disabled]').length).equals(0);
			});
		});
	});
	afterEach(removeStuff);
});
