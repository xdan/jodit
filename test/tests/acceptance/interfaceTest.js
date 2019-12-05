describe('Test interface', function() {
	describe('About dialog', function() {
		it('Should conteins License element', function() {
			const area = appendTestArea(),
				editor = new Jodit(area, {
					license: '111',
					toolbarAdaptive: false
				});
			const aboutButton = editor.container.querySelector(
				'.jodit_toolbar_btn.jodit_toolbar_btn-about'
			);

			expect(aboutButton).to.be.not.equal(null);
			simulateEvent('mousedown', 0, aboutButton);

			const dialog = editor.ownerDocument.querySelector(
				'.jodit.jodit_dialog_box.active[data-editor_id=' + area.id + ']'
			);
			expect(dialog).to.be.not.equal(null);

			expect(
				dialog.textContent.match(/License:.*(GPL|GNU)/)
			).to.be.not.equal(null);
		});

		describe('Set license', function() {
			it('Should show License in about dialog', function() {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						license: '12345678901234567890123456789022', // don't use this key - it is wrong
						toolbarAdaptive: false
					});
				const aboutButton = editor.container.querySelector(
					'.jodit_toolbar_btn.jodit_toolbar_btn-about'
				);

				expect(aboutButton).to.be.not.equal(null);
				simulateEvent('mousedown', 0, aboutButton);

				const dialog = editor.ownerDocument.querySelector(
					'.jodit.jodit_dialog_box.active[data-editor_id=' +
						area.id +
						']'
				);
				expect(dialog).to.be.not.equal(null);

				expect(
					dialog.textContent.match(/License:.*(GPL|GNU)/)
				).to.be.equal(null);

				expect(
					dialog.textContent.match(
						/License: 12345678-\*\*\*\*\*\*\*\*-\*\*\*\*\*\*\*\*-56789022/
					)
				).to.be.not.equal(null);
			});
		});
	});

	describe('Direction', function() {
		describe('Set RTL direction', function() {
			it('Should have RTL direction', function() {
				const editor = new Jodit(appendTestArea(), {
					direction: 'rtl'
				});

				expect('rtl').to.be.equal(editor.editor.getAttribute('dir'));
				expect('rtl').to.be.equal(editor.container.getAttribute('dir'));
				expect('rtl').to.be.equal(
					editor.toolbar.container.getAttribute('dir')
				);
			});
		});

		describe('For iframe mode', function() {
			it('Should have same direction and language', function() {
				const editor = new Jodit(appendTestArea(), {
					iframe: true,
					direction: 'rtl',
					language: 'de'
				});

				expect('rtl').to.be.equal(
					editor.editorDocument.documentElement.getAttribute('dir')
				);
				expect('de').to.be.equal(
					editor.editorDocument.documentElement.getAttribute('lang')
				);
			});
		});
	});

	afterEach(removeStuff);
});
