describe('Test Creator module', function() {
	describe('Create inside element', function() {
		it('Should be different in iframe mode', function() {
			const editor1 = Jodit.make(appendTestArea());
			const editor2 = Jodit.make(appendTestArea(), {iframe: true});

			const div1 = editor1.create.inside.div();
			expect(div1.ownerDocument).equals(document);

			const div2 = editor2.create.inside.div();
			expect(div2.ownerDocument).does.not.equal(document);
			expect(div2.ownerDocument).equals(editor2.editorDocument);

			const div3 = editor2.create.div();
			expect(div3.ownerDocument).equals(document);
		});
	});

	describe('createAttributes', function() {
		it('Should add to every nodes some attributes', function() {
			const editor = Jodit.make(appendTestArea());
			const div = editor.create.inside.div();
			expect(div.className).equals('');

			const editor2 = Jodit.make(appendTestArea(), {
				createAttributes: {
					strong: function (elm) {
						elm.setAttribute('test', 'true');
					},
					p: {
						'data-attr': 'stop'
					},
					div: {
						class: 'test'
					},
					ul: function (ul) {
						ul.classList.add('ui-test');
					}
				}
			});

			const div2 = editor2.create.inside.div();
			expect(div2.className).equals('test');

			const ul = editor2.create.inside.element('ul');
			expect(ul.className).equals('ui-test');

			editor2.value = 'test';
			editor2.selection.setCursorAfter(editor2.editor.firstChild);
			simulateEvent('keydown', 13, editor2.editor);

			expect(editor2.value).equals('<p data-attr="stop">test</p><p data-attr="stop"><br></p>');

			editor2.value = 'test';
			editor2.selection.select(editor2.editor.firstChild);
			editor2.execCommand('bold');

			expect(editor2.value).equals('<strong test="true">test</strong>');
		});
	});
});
