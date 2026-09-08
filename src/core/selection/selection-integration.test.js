/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Selection integration audit', () => {
	function selectBackwards(editor) {
		const range = editor.s.range;
		editor.s.sel.setBaseAndExtent(
			range.endContainer,
			range.endOffset,
			range.startContainer,
			range.startOffset
		);
	}

	function expectBackward(editor) {
		const range = editor.s.range;
		expect(range.collapsed).is.false;
		expect(editor.s.sel.anchorNode).equals(range.endContainer);
		expect(editor.s.sel.anchorOffset).equals(range.endOffset);
	}

	function selectedTexts(editor) {
		return Array.from(
			{ length: editor.s.sel.rangeCount },
			(_, i) => editor.s.sel.getRangeAt(i).cloneContents().textContent
		);
	}

	function selectTwoRanges(editor, test) {
		editor.value = '<p>abcdef</p>';
		editor.s.focus();
		const text = editor.editor.firstChild.firstChild;
		editor.s.sel.removeAllRanges();
		[1, 4].forEach(offset => {
			const range = editor.s.createRange();
			range.setStart(text, offset);
			range.setEnd(text, offset + 1);
			editor.s.sel.addRange(range);
		});
		if (editor.s.sel.rangeCount !== 2) {
			test.skip(); // Firefox supports disjoint ranges; Chromium does not.
		}
	}

	[false, true].forEach(iframe => {
		describe(`iframe: ${iframe}`, () => {
			['markers', 'fakes', 'format', 'expand'].forEach(operation => {
				it(`Should preserve backward selection through ${operation}`, () => {
					const editor = getJodit({ iframe });
					editor.value = '<p>a<span>|bc|</span>d</p>';
					setCursorToChar(editor);
					selectBackwards(editor);

					if (operation === 'markers') {
						editor.s.save();
						editor.s.restore();
					} else if (operation === 'fakes') {
						editor.s.restoreFakes(editor.s.fakes());
					} else if (operation === 'format') {
						editor.s.commitStyle({ element: 'strong' });
					} else {
						editor.s.expandSelection();
					}

					expect(selectedTexts(editor)).deep.equals(['bc']);
					expectBackward(editor);
					expect(editor.s.range.startContainer.ownerDocument).equals(
						editor.ed
					);
				});
			});

			it('Should undo and redo formatting as one change with the backward selection', () => {
				const editor = getJodit({ iframe, history: { timeout: 0 } });
				editor.value = '<p>a|bc|d</p>';
				setCursorToChar(editor);
				selectBackwards(editor);
				editor.history.clear();

				editor.s.commitStyle({ element: 'strong' });

				expect(editor.history.length).equals(1);
				expect(editor.value).equals('<p>a<strong>bc</strong>d</p>');
				editor.execCommand('undo');
				expect(editor.value).equals('<p>abcd</p>');
				expect(selectedTexts(editor)).deep.equals(['bc']);
				expectBackward(editor);
				editor.execCommand('redo');
				expect(editor.value).equals('<p>a<strong>bc</strong>d</p>');
				expect(selectedTexts(editor)).deep.equals(['bc']);
				expectBackward(editor);
				expect(editor.editor.textContent).equals('abcd');
			});

			it('Should undo and redo replacing selected text with a fragment', () => {
				const editor = getJodit({ iframe, history: { timeout: 0 } });
				editor.value = '<p>a|bc|d</p>';
				setCursorToChar(editor);
				editor.history.clear();
				editor.s.insertHTML('<em>X</em><strong>Y</strong>');
				const result = editor.value;
				expect(result).equals('<p>a<em>X</em><strong>Y</strong>d</p>');
				expect(editor.history.length).equals(1);
				editor.execCommand('undo');
				expect(editor.value).equals('<p>abcd</p>');
				expect(selectedTexts(editor)).deep.equals(['bc']);
				editor.execCommand('redo');
				expect(editor.value).equals(result);
				expect(editor.s.isCollapsed()).is.true;
			});
		});
	});

	[
		'markers',
		'fakes',
		'format',
		'html',
		'remove',
		'eachSelection',
		'history'
	].forEach(operation => {
		it(`Should handle both disjoint ranges in ${operation}`, function () {
			const editor = getJodit({ history: { timeout: 0 } });
			selectTwoRanges(editor, this);
			editor.history.clear();

			if (operation === 'markers') {
				expect(editor.s.save().length).equals(2);
				editor.s.restore();
			} else if (operation === 'fakes') {
				editor.s.restoreFakes(editor.s.fakes());
			} else if (operation === 'format' || operation === 'history') {
				editor.s.commitStyle({ element: 'strong' });
				expect(editor.value).equals(
					'<p>a<strong>b</strong>cd<strong>e</strong>f</p>'
				);
				if (operation === 'history') {
					expect(editor.history.length).equals(1);
					editor.execCommand('undo');
					expect(editor.value).equals('<p>abcdef</p>');
					expect(selectedTexts(editor)).deep.equals(['b', 'e']);
					editor.execCommand('redo');
				}
			} else if (operation === 'html') {
				expect(editor.s.html).equals('be');
			} else if (operation === 'remove') {
				editor.s.remove();
				expect(editor.value).equals('<p>acdf</p>');
				return;
			} else {
				const nodes = [];
				editor.s.eachSelection(node => nodes.push(node));
				expect(nodes).deep.equals([
					editor.editor.firstChild.firstChild
				]);
			}

			expect(selectedTexts(editor)).deep.equals(['b', 'e']);
			expect(editor.s.hasMarkers).is.false;
			expect(editor.editor.textContent).equals('abcdef');
		});
	});

	it('Should skip later fragments removed by a style hook', () => {
		const editor = getJodit();
		editor.value = '<p>|one</p><p>two|</p>';
		setCursorToChar(editor);
		const removed = editor.editor.lastChild;
		let calls = 0;
		editor.s.commitStyle({
			attributes: { class: 'highlight' },
			hooks: {
				afterToggleAttribute() {
					calls += 1;
					removed.remove();
				}
			}
		});
		expect(calls).equals(1);
		expect(removed.querySelector('.highlight')).is.null;
		expect(editor.value).equals(
			'<p><span class="highlight">one</span></p>'
		);
		expect(editor.editor.querySelector('font')).is.null;
	});

	it('Should stop formatting if a hook replaces the editor content', () => {
		const editor = getJodit();
		editor.value = '<p>|one</p><p>two|</p>';
		setCursorToChar(editor);
		let calls = 0;
		editor.s.commitStyle({
			attributes: { class: 'highlight' },
			hooks: {
				afterToggleAttribute() {
					calls += 1;
					editor.value = '<p>replacement</p>';
				}
			}
		});
		expect(calls).equals(1);
		expect(editor.value).equals('<p>replacement</p>');
	});

	it('Should permit destroying the editor from a style hook', () => {
		const editor = getJodit();
		editor.value = '<p>|one</p><p>two|</p>';
		setCursorToChar(editor);
		expect(() =>
			editor.s.commitStyle({
				attributes: { class: 'highlight' },
				hooks: { afterToggleAttribute: () => editor.destruct() }
			})
		).not.to.throw();
		expect(editor.isDestructed).is.true;
	});
	['safeHTML', 'beforeInsertNode'].forEach(event => {
		it(`Should place the cursor after the surviving fragment child after ${event}`, () => {
			const editor = getJodit();
			editor.value = '<p>a|bc|d</p>';
			setCursorToChar(editor);
			const fragment = editor.ed.createDocumentFragment();
			const first = editor.ed.createElement('em');
			first.textContent = 'X';
			const last = editor.ed.createElement('strong');
			last.textContent = 'Y';
			fragment.append(first, last);
			editor.e.on(event, node => {
				if (node === fragment) {
					last.remove();
				}
			});
			expect(() => editor.s.insertNode(fragment)).not.to.throw();
			expect(editor.value).equals('<p>a<em>X</em>d</p>');
			expect(editor.s.isInsideArea).is.true;
			expect(editor.s.isCollapsed()).is.true;
			editor.s.insertHTML('!');
			expect(editor.value).equals('<p>a<em>X</em>!d</p>');
		});
	});

	it('Should leave selected content intact when sanitization empties the fragment', () => {
		const editor = getJodit();
		editor.value = '<p>a|bc|d</p>';
		setCursorToChar(editor);
		editor.e.on('safeHTML', node => node.replaceChildren());
		editor.s.insertHTML('<em>X</em>');
		expect(editor.value).equals('<p>abcd</p>');
		expect(selectedTexts(editor)).deep.equals(['bc']);
	});

	['miss', 'outside', 'unsupported', 'inside'].forEach(target => {
		it(`Should validate cursor point: ${target}`, () => {
			const editor = getJodit();
			editor.value = '<p>a|bc|d</p>';
			setCursorToChar(editor);
			const outside = appendTestDiv();
			outside.textContent = 'outside';
			const doc = editor.ed;
			const keys = ['caretPositionFromPoint', 'caretRangeFromPoint'];
			const descriptors = keys.map(key =>
				Object.getOwnPropertyDescriptor(doc, key)
			);
			try {
				Object.defineProperty(doc, keys[0], {
					configurable: true,
					value:
						target === 'unsupported'
							? undefined
							: () =>
									target === 'miss'
										? null
										: {
												offsetNode:
													target === 'outside'
														? outside.firstChild
														: editor.editor
																.firstChild
																.firstChild,
												offset: 1
											}
				});
				Object.defineProperty(doc, keys[1], {
					configurable: true,
					value: undefined
				});
				expect(editor.s.insertCursorAtPoint(0, 0)).equals(
					target === 'inside'
				);
				expect(editor.s.isInsideArea).is.true;
				if (target !== 'inside') {
					expect(selectedTexts(editor)).deep.equals(['bc']);
				}
			} finally {
				keys.forEach((key, i) =>
					descriptors[i]
						? Object.defineProperty(doc, key, descriptors[i])
						: delete doc[key]
				);
			}
		});
	});

	it('Should select editor contents when selecting the editor root', () => {
		const editor = getJodit();
		editor.value = '<p>text</p>';
		editor.s.select(editor.editor);
		expect(editor.s.isInsideArea).is.true;
		expect(editor.s.html).equals('<p>text</p>');
	});

	['setCursorBefore', 'setCursorAfter'].forEach(method => {
		it(`Should reject ${method} outside the editor root`, () => {
			const editor = getJodit();
			expect(() => editor.s[method](editor.editor)).to.throw();
		});
	});

	it('Should visit disjoint ranges in different paragraphs once each', function () {
		const editor = getJodit();
		selectTwoRanges(editor, this);
		editor.value = '<p>abc</p><p>def</p><p>ghi</p>';
		const texts = [
			editor.editor.firstChild.firstChild,
			editor.editor.lastChild.firstChild
		];
		editor.s.sel.removeAllRanges();
		texts.forEach(text => {
			const range = editor.s.createRange();
			range.selectNodeContents(text);
			editor.s.sel.addRange(range);
		});
		const visited = [];
		editor.s.eachSelection(node => visited.push(node));
		expect(visited).deep.equals(texts);
		editor.s.expandSelection();
		expect(selectedTexts(editor)).deep.equals(['abc', 'ghi']);
	});

	it('Should format a large document without losing content or selection', function () {
		this.timeout(20000);
		const editor = getJodit();
		[100, 1000, 3000].forEach(size => {
			editor.value = '<p>text</p>'.repeat(size);
			editor.s.select(editor.editor, true);
			editor.s.commitStyle({ element: 'strong' });
			expect(editor.value).equals(
				'<p><strong>text</strong></p>'.repeat(size)
			);
			expect(editor.editor.querySelector('font')).is.null;
			expect(editor.editor.textContent).equals('text'.repeat(size));
			expect(editor.s.range.cloneContents().textContent).equals(
				'text'.repeat(size)
			);
		});
	});
	['other block', 'outside', 'root', 'outside edge'].forEach(target => {
		it(`Should leave DOM intact when splitting at ${target}`, () => {
			const editor = getJodit();
			editor.value = '<p>abc</p><p>d|ef</p>';
			setCursorToChar(editor);
			const outside = appendTestDiv();
			outside.textContent = 'outside';
			const before = editor.value;
			const box =
				target === 'outside'
					? outside
					: target === 'root'
						? editor.editor
						: target === 'outside edge'
							? editor.editor.lastChild
							: editor.editor.firstChild;
			expect(
				editor.s.splitSelection(
					box,
					target === 'outside edge' ? outside : undefined
				)
			).is.null;
			expect(editor.value).equals(before);
			expect(outside.textContent).equals('outside');
		});
	});
});
