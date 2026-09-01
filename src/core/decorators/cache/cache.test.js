/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

// https://github.com/xdan/jodit/issues/1457
describe('cacheHTML decorator', () => {
	function createFrame() {
		const iframe = document.createElement('iframe');
		iframe.style.width = '600px';
		iframe.style.height = '300px';
		document.body.appendChild(iframe);

		const idoc = iframe.contentDocument;
		idoc.open();
		idoc.write('<html><body></body></html>');
		idoc.close();

		const area = idoc.createElement('textarea');
		idoc.body.appendChild(area);

		return { iframe, area };
	}

	function findButton(editor, name) {
		return editor.toolbar.buttons.find(b => b.state.name === name);
	}

	function makeEditor(frame) {
		return Jodit.make(frame.area, {
			ownerDocument: frame.iframe.contentDocument,
			ownerWindow: frame.iframe.contentWindow,
			toolbarAdaptive: false,
			history: { timeout: 0 },
			buttons: ['bold', 'italic']
		});
	}

	describe('Editors created in different documents', () => {
		it('Should keep a separate template per owner document', () => {
			const { UIElement } = Jodit.modules;

			class Box extends UIElement {
				createContainer() {
					return this.j.c.div('box');
				}
			}

			const descriptor = Object.getOwnPropertyDescriptor(
				Box.prototype,
				'createContainer'
			);
			Jodit.decorators.cacheHTML(
				Box.prototype,
				'createContainer',
				descriptor
			);
			Object.defineProperty(Box.prototype, 'createContainer', descriptor);

			const first = createFrame();
			const editor1 = makeEditor(first);
			const box1 = new Box(editor1);
			expect(box1.container.ownerDocument).equals(
				first.iframe.contentDocument
			);

			editor1.destruct();
			first.iframe.remove();

			const second = createFrame();
			const editor2 = makeEditor(second);
			const box2 = new Box(editor2);

			// Before the fix the template built inside the first (already
			// destroyed) document was cloned for every later instance
			expect(box2.container.ownerDocument).equals(
				second.iframe.contentDocument
			);

			editor2.destruct();
			second.iframe.remove();
		});

		it('Should keep toolbar buttons clickable after the first document was destroyed', () => {
			const first = createFrame();
			const editor1 = makeEditor(first);
			editor1.destruct();
			first.iframe.remove();

			const second = createFrame();
			const editor2 = makeEditor(second);
			editor2.value = '<p>test</p>';
			editor2.s.select(editor2.editor.firstChild.firstChild);

			clickButton('bold', editor2);

			expect(editor2.value).equals('<p><strong>test</strong></p>');

			editor2.destruct();
			second.iframe.remove();
		});

		it('Should reuse a cached template inside the same document', () => {
			const editor1 = getJodit({
				buttons: ['bold'],
				toolbarAdaptive: false
			});
			const editor2 = getJodit({
				buttons: ['bold'],
				toolbarAdaptive: false
			});

			const b1 = findButton(editor1, 'bold').container;
			const b2 = findButton(editor2, 'bold').container;

			expect(b1).does.not.equal(b2);
			expect(b1.ownerDocument).equals(document);
			expect(b2.ownerDocument).equals(document);
			expect(b1.outerHTML.replace(/id="[^"]*"/g, '')).equals(
				b2.outerHTML.replace(/id="[^"]*"/g, '')
			);
		});
	});
});
