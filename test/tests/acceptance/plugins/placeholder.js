describe('Placeholder plugin', function() {
	describe('After init on empty textarea', function() {
		it('Should show placeholder', function() {
			const area = appendTestArea();

			area.value = '';

			const editor = new Jodit(area);

			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.display === 'block'
			).is.true;
		});
	});

	describe('After init on not empty textarea', function() {
		it('Should hide placeholder', function() {
			const area = appendTestArea();
			area.value = '111';
			const editor = new Jodit(area);
			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});

		describe('Empty P', function() {
			it('Should show placeholder', function() {
				const area = appendTestArea();
				area.value = '<p><br></p>';
				const editor = new Jodit(area);

				expect(
					editor.container.querySelector('.jodit-placeholder')
				).is.not.null;
			});
		});

		describe('Empty UL/LI', function() {
			it('Should hide placeholder', function() {
				const area = appendTestArea();
				area.value = '<ul><li><br></li></ul>';
				const editor = new Jodit(area);
				expect(
					editor.container.querySelector('.jodit-placeholder')
				).is.null;
			});
		});
	});

	describe('Add text inside editor', function() {
		it('should show placeholder', function() {
			const area = appendTestArea();
			const editor = new Jodit(area);

			editor.value = '';

			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.display === 'block'
			).is.true;

			editor.selection.insertNode(editor.create.inside.text('test'));

			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});
	});

	describe('For element with fontsize 12px', function() {
		it("Should set Placeholder's fontsize", function() {
			const area = appendTestArea();
			const editor = new Jodit(area);

			editor.editor.style.fontSize = '12px';
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			expect(
				editor.container.querySelectorAll('.jodit-placeholder')
					.length &&
					editor.container.querySelector('.jodit-placeholder').style
						.fontSize === '12px'
			).is.true;
		});
	});

	describe('ReadOnly', function() {
		it('Should hide placeholder', function() {
			const table_editor_interface = appendTestArea();
			table_editor_interface.value = '';

			const editor = new Jodit(table_editor_interface, {
				readonly: true
			});

			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
			editor.value = 'test';
			expect(
				!editor.container.querySelectorAll('.jodit-placeholder').length
			).is.true;
		});
	});
});
