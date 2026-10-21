/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Undo/Redo behaviors', () => {
	describe('Do some changes', () => {
		it('Should change redo/undo stack', () => {
			const editor = getJodit({
				history: {
					timeout: 0
				}
			});

			editor.value = 'test';

			const range = editor.s.createRange();
			range.setEnd(editor.editor.firstChild.firstChild, 4);
			range.collapse(false);
			editor.s.selectRange(range);

			clickTrigger('paragraph', editor);

			const list = getOpenedPopup(editor);

			clickButton('h1', list);

			expect(editor.value).equals('<h1>test</h1>');

			editor.execCommand('undo');

			expect(editor.value).equals('<p>test</p>');

			editor.execCommand('redo');

			expect(editor.value).equals('<h1>test</h1>');
		});

		describe('Several operations', () => {
			it('Should work perfect', () => {
				const editor = getJodit();
				editor.value =
					'<p>t|est</p>' +
					'<ul>' +
					'<li>test2|</li>' +
					'<li>test3</li>' +
					'<li><a>test4</a></li>' +
					'</ul>';

				setCursorToChar(editor);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals(
					'<p>t</p><ul><li>test3</li><li><a>test4</a></li></ul>'
				);

				editor.execCommand('undo');

				const RESULT =
					'<p>test</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>';

				if (editor.value !== RESULT) {
					strCompare(editor.value, RESULT);
				}

				expect(editor.value).equals(RESULT);

				const range = editor.s.createRange();
				range.setStart(editor.editor.firstChild.firstChild, 0);
				range.setEnd(editor.editor.firstChild.firstChild, 3);
				editor.s.selectRange(range);

				simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

				expect(editor.value).equals(
					'<p>t</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>'
				);

				editor.execCommand('undo');

				expect(editor.value).equals(
					'<p>test</p><ul><li>test2</li><li>test3</li><li><a>test4</a></li></ul>'
				);
			});

			describe('Several changes from autside with editor.value', () => {
				it('Should change redo/undo stack immediately', () => {
					const editor = getJodit();

					editor.value = '<p>test1<p>';
					expect(editor.history.length).eq(1);
					editor.value = '<p>test2<p>';
					expect(editor.history.length).eq(2);
					editor.value = '<p>test3<p>';
					expect(editor.history.length).eq(3);
					editor.value = '<p>test3<p>';
					expect(editor.history.length).eq(3);
				});
			});
		});
	});

	describe('Commands', () => {
		it('Undo. Enter text wait and again enter text. After execute "undo" command. First text should be returned', () => {
			const editor = getJodit({
				history: {
					timeout: 0 // disable delay
				}
			});

			editor.value = 'test';
			editor.value = 'test2';
			editor.execCommand('undo');
			expect(editor.value).equals('<p>test</p>');
		});

		it('Redo. Enter text wait and again enter text. After execute "undo" + "redo" command in editor should be second text', () => {
			const editor = getJodit({
				history: {
					timeout: 0
				}
			});

			editor.value = 'test';
			editor.value = 'test2';
			editor.execCommand('undo');
			expect(editor.value).equals('<p>test</p>');
			editor.execCommand('redo');
			expect(editor.value).equals('<p>test2</p>');
		});

		it('Check react UndoRedo to another changes', () => {
			const editor = getJodit({
				history: {
					timeout: 0
				}
			});

			editor.value = 'test';

			const range = editor.s.createRange();
			range.setEnd(editor.editor.firstChild.firstChild, 4);
			range.collapse(false);
			editor.s.sel.removeAllRanges();
			editor.s.sel.addRange(range);

			editor.s.insertNode(editor.createInside.text('test2'));
			editor.execCommand('undo');
			expect(editor.value).equals('<p>test</p>');

			editor.execCommand('redo');
			expect(editor.value).equals('<p>testtest2</p>');
		});
	});

	describe('Clear stack', () => {
		it('Should disable both buttons in toolbar and all calls redo and undo must do nothing', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				history: {
					timeout: 0
				}
			});

			const undo = getButton('undo', editor);
			expect(undo).is.not.null;
			const redo = getButton('redo', editor);
			expect(redo).is.not.null;

			expect(undo.hasAttribute('disabled')).is.true;
			expect(redo.hasAttribute('disabled')).is.true;

			editor.value = 'test';
			editor.value = 'stop';

			expect(undo.hasAttribute('disabled')).is.false;
			expect(redo.hasAttribute('disabled')).is.true;

			simulateEvent('click', 0, undo);
			expect(editor.value).equals('<p>test</p>');
			expect(undo.hasAttribute('disabled')).is.false;
			expect(redo.hasAttribute('disabled')).is.false;

			simulateEvent('click', 0, redo);
			expect(editor.value).equals('<p>stop</p>');
			expect(undo.hasAttribute('disabled')).is.false;
			expect(redo.hasAttribute('disabled')).is.true;

			editor.history.clear();

			expect(undo.hasAttribute('disabled')).is.true;
			expect(redo.hasAttribute('disabled')).is.true;
			expect(editor.value).equals('<p>stop</p>');

			editor.execCommand('undo');
			expect(undo.hasAttribute('disabled')).is.true;
			expect(redo.hasAttribute('disabled')).is.true;
			expect(editor.value).equals('<p>stop</p>');
		});
	});

	describe('Limited history', () => {
		it('Should store only limited history', () => {
			const editor = getJodit({
				history: {
					maxHistoryLength: 3
				}
			});

			editor.value = '<p>123456789|</p>';

			setCursorToChar(editor);

			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
			simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);

			expect(editor.value).equals('<p>123</p>');

			editor.execCommand('undo');
			editor.execCommand('undo');
			editor.execCommand('undo');
			editor.execCommand('undo');
			editor.execCommand('undo');
			editor.execCommand('undo');

			expect(editor.value).equals('<p>123456</p>');
		});
	});

	describe('Transactions', () => {
		it('should pack all changes inside one and not create history point', () => {
			const editor = getJodit();
			editor.value = '<p>test|</p>';
			setCursorToChar(editor);
			editor.s.insertNode(editor.createInside.text('123'));
			editor.s.insertNode(editor.createInside.text('123'));
			expect(editor.history.length).equals(4);

			editor.history.snapshot.transaction(() => {
				editor.s.insertNode(editor.createInside.text('123'));
				editor.s.insertNode(editor.createInside.text('123'));
				editor.s.insertNode(editor.createInside.text('123'));
			});

			expect(editor.history.length).equals(4);
			expect(editor.value).equals('<p>test123123123123123</p>');
		});

		it('should block the snapshot', () => {
			const editor = getJodit();

			expect(editor.history.snapshot.isBlocked).is.false;

			editor.history.snapshot.transaction(() => {
				expect(editor.history.snapshot.isBlocked).is.true;
				editor.s.insertNode(editor.createInside.text('123'));
				editor.s.insertHTML('123');
				expect(editor.history.snapshot.isBlocked).is.true;
			});

			expect(editor.history.snapshot.isBlocked).is.false;
		});
	});

	describe('Enter over a selection (#1292)', () => {
		it('Should be undone in a single step', () => {
			const editor = getJodit({ history: { timeout: 0 } });
			editor.value = '<p>test</p>';
			editor.s.focus();
			editor.execCommand('selectall');
			simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

			expect(editor.value).does.not.equal('<p>test</p>');

			// A single undo must restore the original text, not an intermediate
			// empty state.
			editor.execCommand('undo');
			expect(editor.value).equals('<p>test</p>');
		});
	});

	describe('history.timeout (#1601)', () => {
		// What typing does: the text changes and an input event follows
		const type = (editor, text) => {
			editor.editor.firstChild.firstChild.nodeValue += text;
			simulateEvent('input', editor.editor);
		};

		// Types `count` words in a row. Timers are mocked, so
		// `timers.delay(timeout)` stands for the time passing: the step
		// timer fires, however slow the machine is
		const typeWords = (editor, count) => {
			for (let i = 1; i <= count; i += 1) {
				type(editor, ' ' + i);
			}
		};

		// The value at each step that goes into the history from now on
		const watchSteps = editor => {
			const steps = [];
			editor.e.on('changeStack', () => {
				if (editor.history.length > steps.length) {
					steps.push(editor.value);
				}
			});
			return steps;
		};

		let timers = null;

		afterEach(() => {
			timers?.cleanup();
			timers = null;
		});

		it('Should not record the first change of a step on its own', async () => {
			const editor = getJodit({ history: { timeout: 300 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			type(editor, ' t');
			await delay(50);
			type(editor, 'wo');
			expect(editor.history.length).equals(0);

			await delay(400);
			expect(editor.history.length).equals(1);

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one</p>');
		});

		it('Should record steady typing as a step every timeout', () => {
			timers = mockTimers();
			const editor = getJodit({ history: { timeout: 300 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			// Six words, the timeout passes, six more, it passes again, three
			// more, and it passes once more
			typeWords(editor, 6);
			timers.delay(300);
			typeWords(editor, 6);
			timers.delay(300);
			typeWords(editor, 3);
			timers.delay(300);

			expect(editor.history.length).equals(3);
		});

		it('Should undo only the open step straight after typing', () => {
			timers = mockTimers();
			const editor = getJodit({ history: { timeout: 300 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			const steps = watchSteps(editor);
			typeWords(editor, 6);
			timers.delay(300);
			typeWords(editor, 6);
			timers.delay(300);
			typeWords(editor, 3);
			expect(steps.length).equals(2);

			editor.execCommand('undo');
			expect(editor.value).equals(steps[1]);

			editor.execCommand('undo');
			expect(editor.value).equals(steps[0]);

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one</p>');
		});

		it('Should start a new step after a pause longer than the timeout', async () => {
			const editor = getJodit({ history: { timeout: 200 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			type(editor, ' two');
			await delay(300);
			type(editor, ' three');
			await delay(300);
			expect(editor.history.length).equals(2);

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one two</p>');
		});

		it('Should undo and redo a change that is still within the timeout', () => {
			const editor = getJodit({ history: { timeout: 10000 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			type(editor, ' two');
			expect(editor.history.canUndo()).is.true;

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one</p>');

			editor.execCommand('redo');
			expect(editor.value).equals('<p>one two</p>');
		});

		it('Should drop the redo steps as soon as a change comes in after Undo', () => {
			const editor = getJodit({
				toolbarAdaptive: false,
				history: { timeout: 10000 }
			});
			editor.value = '<p>one</p>';
			editor.history.clear();

			const redo = getButton('redo', editor);

			type(editor, ' two');
			editor.execCommand('undo');
			expect(editor.history.canRedo()).is.true;
			expect(redo.hasAttribute('disabled')).is.false;

			type(editor, ' three');
			expect(editor.history.canRedo()).is.false;
			expect(redo.hasAttribute('disabled')).is.true;

			editor.execCommand('redo');
			expect(editor.value).equals('<p>one three</p>');

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one</p>');
		});

		it('Should keep a change within the timeout when an internal change follows it', () => {
			const editor = getJodit({ history: { timeout: 10000 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			type(editor, ' two');
			editor.e.fire('internalChange');

			editor.execCommand('undo');
			expect(editor.value).equals('<p>one</p>');
		});

		it('Should not add a step for a transaction once the timeout runs out', async () => {
			const editor = getJodit({ history: { timeout: 100 } });
			editor.value = '<p>one</p>';
			editor.history.clear();

			editor.history.snapshot.transaction(() => {
				type(editor, ' two');
			});

			await delay(200);
			expect(editor.history.length).equals(0);
			expect(editor.value).equals('<p>one two</p>');
		});
	});
});
