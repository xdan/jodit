/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Helper inView', () => {
	const { inView } = Jodit.modules.Helpers;

	const make = topPx => {
		const box = document.createElement('div');
		box.style.cssText = `position:fixed;left:0;width:100px;height:100px;top:${topPx}px;`;

		const child = document.createElement('p');
		child.style.cssText = 'height:100px;margin:0;';
		box.appendChild(child);

		document.body.appendChild(box);
		return { box, child };
	};

	// https://github.com/xdan/jodit/issues/1279
	it('Should return false for an element scrolled above the viewport top', () => {
		const { box, child } = make(-200);
		try {
			expect(inView(child, box, document)).is.false;
		} finally {
			box.remove();
		}
	});

	it('Should return true for an element within the viewport', () => {
		const { box, child } = make(10);
		try {
			expect(inView(child, box, document)).is.true;
		} finally {
			box.remove();
		}
	});

	it('Should return false for an element below the viewport bottom', () => {
		const { box, child } = make(window.innerHeight + 200);
		try {
			expect(inView(child, box, document)).is.false;
		} finally {
			box.remove();
		}
	});

	// Fractional rect values vs integer scroll offsets: a container scrolled
	// to its limit can still "clip" the element by a fraction of a pixel and
	// must not trigger a whole-page scrollIntoView
	describe('Sub-pixel clipping', () => {
		const makeScrollable = () => {
			const box = document.createElement('div');
			box.style.cssText =
				'position:fixed;left:0;top:0;width:100px;height:100px;overflow:auto;';

			const filler = document.createElement('div');
			filler.style.cssText = 'height:90.4px;margin:0;';

			const child = document.createElement('p');
			child.style.cssText = 'height:19px;margin:0;';

			box.appendChild(filler);
			box.appendChild(child);

			document.body.appendChild(box);
			return { box, child };
		};

		it('Should treat an element clipped by a fraction of a pixel as visible', () => {
			const { box, child } = makeScrollable();
			try {
				// Integer scroll position leaves a 0.4px overhang below the box
				box.scrollTop = 9;
				expect(inView(child, box, document)).is.true;
			} finally {
				box.remove();
			}
		});

		it('Should still treat an element clipped by a whole line as invisible', () => {
			const { box, child } = makeScrollable();
			try {
				// Not scrolled: the child sits ~9.4px below the box bottom
				expect(inView(child, box, document)).is.false;
			} finally {
				box.remove();
			}
		});

		it('Should not fall back to scrollIntoView when scrolling the container is enough', () => {
			const { scrollIntoViewIfNeeded } = Jodit.modules.Helpers;
			const { box, child } = makeScrollable();

			let called = false;
			child.scrollIntoView = () => {
				called = true;
			};

			try {
				scrollIntoViewIfNeeded(child, box, document);
				expect(box.scrollTop).is.above(0);
				expect(inView(child, box, document)).is.true;
				expect(called).is.false;
			} finally {
				box.remove();
			}
		});
	});
});
