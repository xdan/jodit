/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Test Creator module', function () {
	describe('Create inside element', function () {
		it('Should be different in iframe mode', function () {
			const editor1 = getJodit();
			const editor2 = Jodit.make(appendTestArea(), { iframe: true });

			const div1 = editor1.createInside.div();
			expect(div1.ownerDocument).equals(document);

			const div2 = editor2.createInside.div();
			expect(div2.ownerDocument).does.not.equal(document);
			expect(div2.ownerDocument).equals(editor2.ed);

			const div3 = editor2.create.div();
			expect(div3.ownerDocument).equals(document);
		});
	});

	describe('createAttributes', function () {
		it('Should add to every nodes some attributes', function () {
			const editor = getJodit();
			const div = editor.createInside.div();
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

			const div2 = editor2.createInside.div();
			expect(div2.className).equals('test');

			const ul = editor2.createInside.element('ul');
			expect(ul.className).equals('ui-test');

			editor2.value = 'test';
			editor2.s.setCursorAfter(editor2.editor.firstChild);
			simulateEvent('keydown', 13, editor2.editor);

			expect(editor2.value).equals(
				'<p data-attr="stop">test</p><p data-attr="stop"><br></p>'
			);

			editor2.value = 'test';
			editor2.s.select(editor2.editor.firstChild);
			editor2.execCommand('bold');

			expect(editor2.value).equals(
				'<p data-attr="stop"><strong test="true">test</strong></p>'
			);
		});

		describe('For UL and LI', function () {
			it('Should add to every nodes some attributes', function () {
				const editor = getJodit({
					createAttributes: {
						ul: { class: 'indent_small list list_offset_left' },
						li: { class: 'some_li' },
						ol: { class: 'indent_small ollist list_offset_left' }
					}
				});

				const ul = editor.createInside.element('ul');
				expect(ul.className).equals(
					'indent_small list list_offset_left'
				);

				const li = editor.createInside.element('li');
				expect(li.className).equals('some_li');

				const ol = editor.createInside.element('ol');
				expect(ol.className).equals(
					'indent_small ollist list_offset_left'
				);

				editor.value = 'one';
				editor.execCommand('selectall');
				editor.execCommand('insertUnorderedList');

				expect(editor.value).equals(
					'<ul class="indent_small list list_offset_left"><li class="some_li">one</li></ul>'
				);
			});
		});
	});
});
