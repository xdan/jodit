/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test ProgressBar', () => {
	const { ProgressBar } = Jodit.modules;

	let editor;
	beforeEach(() => {
		editor = getJodit();
	});

	describe('show', () => {
		it('should append progress bar to workplace', () => {
			const bar = new ProgressBar(editor);
			bar.show();
			expect(editor.workplace.contains(bar.container)).to.be.true;
			bar.destruct();
		});
	});

	describe('hide', () => {
		it('should remove progress bar from DOM', () => {
			const bar = new ProgressBar(editor);
			bar.show();
			expect(editor.workplace.contains(bar.container)).to.be.true;
			bar.hide();
			expect(editor.workplace.contains(bar.container)).to.be.false;
		});
	});

	describe('progress', () => {
		it('should set container width as percentage', () => {
			const bar = new ProgressBar(editor);
			bar.show();
			bar.progress(50);
			expect(bar.container.style.width).eq('50%');
			bar.destruct();
		});

		it('should return self for chaining', () => {
			const bar = new ProgressBar(editor);
			expect(bar.progress(10)).eq(bar);
			bar.destruct();
		});
	});

	describe('destruct', () => {
		it('should remove progress bar from DOM on destruct', () => {
			const bar = new ProgressBar(editor);
			bar.show();
			expect(editor.workplace.contains(bar.container)).to.be.true;
			bar.destruct();
			expect(editor.workplace.contains(bar.container)).to.be.false;
		});
	});

	describe('showFileUploadAnimation', () => {
		const sel = '.jodit-progress-bar__file-animation';

		it('should create animation element in DOM', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();

			expect(document.querySelector(sel)).is.not.null;
			bar.destruct();
		});

		it('should contain an SVG icon inside animation element', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();

			const svg = document.querySelector(sel + ' svg');
			expect(svg).is.not.null;
			bar.destruct();
		});

		it('should apply position based on editor container rect', () => {
			const bar = new ProgressBar(editor);
			const rect = editor.container.getBoundingClientRect();
			bar.showFileUploadAnimation({ x: 100, y: 50 });

			const animEl = document.querySelector(sel);
			// End position = rect offset + to (default to = from + 60, from - 80)
			expect(animEl.style.left).eq(rect.left + 160 + 'px');
			expect(animEl.style.top).eq(rect.top + -30 + 'px');
			bar.destruct();
		});

		it('should use custom from and to positions', () => {
			const bar = new ProgressBar(editor);
			const rect = editor.container.getBoundingClientRect();
			bar.showFileUploadAnimation({ x: 10, y: 20 }, { x: 200, y: 300 });

			const animEl = document.querySelector(sel);
			expect(animEl.style.left).eq(rect.left + 200 + 'px');
			expect(animEl.style.top).eq(rect.top + 300 + 'px');
			bar.destruct();
		});

		it('should set opacity to 0 for fade out', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();

			const animEl = document.querySelector(sel);
			expect(animEl.style.opacity).eq('0');
			bar.destruct();
		});

		it('should remove animation element on destruct', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();

			expect(document.querySelector(sel)).is.not.null;
			bar.destruct();
			expect(document.querySelector(sel)).is.null;
		});

		it('should remove previous animation if called again', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();
			bar.showFileUploadAnimation();

			expect(document.querySelectorAll(sel).length).eq(1);
			bar.destruct();
		});

		it('should remove element after transitionend event', () => {
			const bar = new ProgressBar(editor);
			bar.showFileUploadAnimation();

			const animEl = document.querySelector(sel);
			expect(animEl).is.not.null;

			animEl.dispatchEvent(new Event('transitionend'));

			expect(document.querySelector(sel)).is.null;
			bar.destruct();
		});
	});
});
