/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Helper inView', () => {
	const { inView } = Jodit.modules.Helpers;

	describe('With scroll-padding on the document (#1792)', () => {
		const root = document.documentElement;
		let box, child;

		// `top` is from the top of the window, and `bottom` from its bottom
		const place = ({ top, bottom }) => {
			child.style.top =
				top === undefined
					? `${root.clientHeight - bottom - 20}px`
					: `${top}px`;
		};

		beforeEach(() => {
			box = appendTestDiv();
			box.style.cssText =
				'position: fixed; top: 0; left: 0; width: 100px; height: 100%; overflow: visible; z-index: 1000';
			child = document.createElement('div');
			child.style.cssText =
				'position: absolute; height: 20px; width: 20px';
			box.appendChild(child);
		});

		afterEach(() => {
			root.style.scrollPadding = '';
			Jodit.modules.Dom.safeRemove(box);
		});

		it('Should count an element in the bottom padding as out of view', () => {
			root.style.scrollPaddingBottom = '100px';
			place({ bottom: 50 });

			expect(inView(child, box, document)).is.false;
		});

		it('Should count an element above the bottom padding as in view', () => {
			root.style.scrollPaddingBottom = '100px';
			place({ bottom: 120 });

			expect(inView(child, box, document)).is.true;
		});

		it('Should count an element in the top padding as out of view', () => {
			root.style.scrollPaddingTop = '100px';
			place({ top: 50 });

			expect(inView(child, box, document)).is.false;
		});

		it('Should count an element below the top padding as in view', () => {
			root.style.scrollPaddingTop = '100px';
			place({ top: 120 });

			expect(inView(child, box, document)).is.true;
		});

		it('Should take a percentage of the window', () => {
			root.style.scrollPaddingBottom = '50%';
			place({ top: root.clientHeight - 100 });

			expect(inView(child, box, document)).is.false;

			place({ top: 10 });

			expect(inView(child, box, document)).is.true;
		});

		it('Should go by the window alone without any', () => {
			place({ bottom: 2 });

			expect(inView(child, box, document)).is.true;
		});
	});

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

	// When only the page itself can reveal the element, the fallback must
	// scroll the minimal distance (block: nearest) — the default aligns the
	// element to the viewport top and the page jumps like PageDown was
	// pressed while typing at the bottom edge of a half-visible editor
	describe('Page-level fallback', () => {
		it('Should call scrollIntoView with block: nearest', () => {
			const { scrollIntoViewIfNeeded } = Jodit.modules.Helpers;

			// a non-scrollable box below the viewport: the container branch
			// cannot help, only the page can be scrolled
			const box = document.createElement('div');
			box.style.cssText = `position:absolute;left:0;top:${
				document.documentElement.clientHeight + 500
			}px;width:100px;height:100px;`;

			const child = document.createElement('p');
			child.style.cssText = 'height:100px;margin:0;';
			box.appendChild(child);
			document.body.appendChild(box);

			let options;
			child.scrollIntoView = opt => {
				options = opt;
			};

			try {
				scrollIntoViewIfNeeded(child, box, document);
				expect(options).deep.equals({ block: 'nearest' });
			} finally {
				box.remove();
			}
		});
	});
});
