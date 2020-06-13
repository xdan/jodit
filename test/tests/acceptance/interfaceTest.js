describe('Test interface', function() {
	describe('About dialog', function() {
		it('Should conteins License element', function() {
			const editor = getJodit({
					license: '111',
					toolbarAdaptive: false
				});

			const aboutButton = getButton('about', editor);

			expect(aboutButton).is.not.null;
			simulateEvent('click', 0, aboutButton);

			const dialog = getOpenedDialog(editor);

			expect(dialog).is.not.null;

			expect(
				dialog.textContent.match(/License:.*(MIT)/)
			).is.not.null;
		});

		describe('Set license', function() {
			it('Should show License in about dialog', function() {
				const area = appendTestArea(),
					editor = new Jodit(area, {
						license: '12345678901234567890123456789022', // don't use this key - it is wrong
						toolbarAdaptive: false
					});

				const aboutButton = getButton('about', editor);

				expect(aboutButton).is.not.null;
				simulateEvent('click', 0, aboutButton);

				const dialog = getOpenedDialog(editor)
				expect(dialog).is.not.null;

				expect(
					dialog.textContent.match(/License:.*(GPL|GNU)/)
				).is.null;

				expect(
					dialog.textContent.match(
						/License: 12345678-\*\*\*\*\*\*\*\*-\*\*\*\*\*\*\*\*-56789022/
					)
				).is.not.null;
			});
		});
	});

	describe('Direction', function() {
		describe('Set RTL direction', function() {
			it('Should have RTL direction', function() {
				const editor = getJodit({
					direction: 'rtl'
				});

				expect('rtl').equals(editor.editor.getAttribute('dir'));
				expect('rtl').equals(editor.container.getAttribute('dir'));
				expect('rtl').equals(
					editor.toolbar.container.getAttribute('dir')
				);
			});
		});

		describe('For iframe mode', function() {
			it('Should have same direction and language', function() {
				const editor = getJodit({
					iframe: true,
					direction: 'rtl',
					language: 'de'
				});

				expect('rtl').equals(
					editor.ed.documentElement.getAttribute('dir')
				);
				expect('de').equals(
					editor.ed.documentElement.getAttribute('lang')
				);
			});
		});
	});

	afterEach(removeStuff);
});
