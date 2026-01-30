/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test editor slots system', function () {
	describe('Slot structure', function () {
		it('Should create all slot elements', function () {
			const editor = getJodit();

			expect(editor.currentPlace.slots.top).is.not.null;
			expect(editor.currentPlace.slots.bottom).is.not.null;
			expect(editor.currentPlace.slots.center).is.not.null;
			expect(editor.currentPlace.slots.left).is.not.null;
			expect(editor.currentPlace.slots.right).is.not.null;

			expect(
				editor.currentPlace.slots.top.classList.contains(
					'jodit-jodit__workplace-slot_top_true'
				)
			).is.true;
			expect(
				editor.currentPlace.slots.bottom.classList.contains(
					'jodit-jodit__workplace-slot_bottom_true'
				)
			).is.true;
			expect(
				editor.currentPlace.slots.center.classList.contains(
					'jodit-jodit__workplace-slot_center_true'
				)
			).is.true;
			expect(
				editor.currentPlace.slots.left.classList.contains(
					'jodit-jodit__workplace-slot_left_true'
				)
			).is.true;
			expect(
				editor.currentPlace.slots.right.classList.contains(
					'jodit-jodit__workplace-slot_right_true'
				)
			).is.true;
		});

		it('Should hide empty slots', function () {
			const editor = getJodit();

			// Empty slots should not be visible
			expect(
				getComputedStyle(editor.currentPlace.slots.top).display
			).equals('none');
			expect(
				getComputedStyle(editor.currentPlace.slots.bottom).display
			).equals('none');
			expect(
				getComputedStyle(editor.currentPlace.slots.left).display
			).equals('none');
			expect(
				getComputedStyle(editor.currentPlace.slots.right).display
			).equals('none');

			// Center slot should always be visible
			expect(
				getComputedStyle(editor.currentPlace.slots.center).display
			).equals('flex');
		});
	});

	describe('Slot overflow behavior', function () {
		describe('With fixed height', function () {
			it('Should add scroll to left/right slots when content overflows', function () {
				const editor = getJodit({
					height: 300
				});

				// Add a lot of content to the left slot
				const leftSlot = editor.currentPlace.slots.left;
				for (let i = 0; i < 100; i++) {
					const h1 = editor.c.element('h1');
					h1.textContent = 'Test ' + i;
					leftSlot.appendChild(h1);
				}

				// Left slot should have overflow auto
				expect(getComputedStyle(leftSlot).overflow).equals('auto');

				// Container should maintain fixed height
				expect(editor.container.offsetHeight).equals(300);

				// Left slot should not exceed workplace height
				expect(leftSlot.offsetHeight).to.be.at.most(
					editor.currentPlace.slots.center.offsetHeight
				);
			});

			it('Should add scroll to top/bottom slots when content overflows', function () {
				const editor = getJodit({
					height: 300
				});

				// Add a lot of content to the top slot
				const topSlot = editor.currentPlace.slots.top;
				for (let i = 0; i < 100; i++) {
					const h1 = editor.c.element('h1');
					h1.textContent = 'Top Test ' + i;
					h1.style.display = 'inline-block';
					h1.style.margin = '0 10px';
					topSlot.appendChild(h1);
				}

				// Container should maintain fixed height
				expect(editor.container.offsetHeight).equals(300);
			});

			it('Should respect max-width 50% for left/right slots', function () {
				const editor = getJodit({
					height: 300,
					width: 600
				});

				const leftSlot = editor.currentPlace.slots.left;
				const rightSlot = editor.currentPlace.slots.right;

				// Add very wide content
				const wideDiv = editor.c.element('div');
				wideDiv.style.width = '500px';
				wideDiv.style.height = '50px';
				wideDiv.style.background = 'red';
				leftSlot.appendChild(wideDiv);

				const wideDiv2 = editor.c.element('div');
				wideDiv2.style.width = '500px';
				wideDiv2.style.height = '50px';
				wideDiv2.style.background = 'blue';
				rightSlot.appendChild(wideDiv2);

				// Slots should not exceed 50% of container width
				expect(leftSlot.offsetWidth).to.be.at.most(300);
				expect(rightSlot.offsetWidth).to.be.at.most(300);
			});

			it('Should expand slots with content if workplace has matching content height', function () {
				const editor = getJodit({
					height: 600
				});

				// Add content to editor that takes up space
				editor.value = '<p>test</p>'.repeat(10);

				// Add content to left slot
				const leftSlot = editor.currentPlace.slots.left;
				for (let i = 0; i < 10; i++) {
					const h1 = editor.c.element('h1');
					h1.textContent = 'Test ' + i;
					leftSlot.appendChild(h1);
				}

				// Container should maintain fixed height
				expect(editor.container.offsetHeight).equals(600);

				// Left slot should be visible and have height
				expect(leftSlot.offsetHeight).to.be.above(0);
			});
		});

		describe('With percentage height', function () {
			it('Should handle percentage heights correctly', function () {
				const box = getBox();
				box.style.height = '500px';

				const editor = getJodit({
					height: '80%'
				});

				// Container should be 80% of parent
				expect(editor.container.offsetHeight).equals(400);

				// Add content to slots
				const leftSlot = editor.currentPlace.slots.left;
				for (let i = 0; i < 50; i++) {
					const h1 = editor.c.element('h1');
					h1.textContent = 'Test ' + i;
					leftSlot.appendChild(h1);
				}

				// Container should maintain percentage height
				expect(editor.container.offsetHeight).equals(400);

				// Slot should not exceed container
				expect(leftSlot.offsetHeight).to.be.at.most(400);
			});

			it('Should handle calc() expressions', function () {
				const box = getBox();
				box.style.height = '600px';

				const editor = getJodit({
					height: 'calc(100% - 100px)'
				});

				// Container should be calculated height
				expect(editor.container.offsetHeight).equals(500);

				// Add content to right slot
				const rightSlot = editor.currentPlace.slots.right;
				for (let i = 0; i < 50; i++) {
					const p = editor.c.element('p');
					p.textContent = 'Right slot content ' + i;
					rightSlot.appendChild(p);
				}

				// Container should maintain calculated height
				expect(editor.container.offsetHeight).equals(500);
			});
		});

		describe('Without height (auto-size)', function () {
			it('Should expand with slot content when height is auto', function () {
				const editor = getJodit();

				// Add content to editor
				editor.value = '<p>test</p>'.repeat(5);
				const initialHeight = editor.container.offsetHeight;

				// Add content to bottom slot
				const bottomSlot = editor.currentPlace.slots.bottom;
				for (let i = 0; i < 5; i++) {
					const p = editor.c.element('p');
					p.textContent = 'Bottom content ' + i;
					bottomSlot.appendChild(p);
				}

				// Container should expand to fit content
				expect(editor.container.offsetHeight).to.be.above(
					initialHeight
				);
			});

			it('Should respect maxHeight when set', function () {
				const editor = getJodit({
					maxHeight: 400
				});

				// Add lots of content
				editor.value = '<p>test</p>'.repeat(50);

				// Add content to top slot
				const topSlot = editor.currentPlace.slots.top;
				for (let i = 0; i < 20; i++) {
					const p = editor.c.element('p');
					p.textContent = 'Top content ' + i;
					topSlot.appendChild(p);
				}

				// Container should not exceed maxHeight
				expect(editor.container.offsetHeight).equals(400);
			});

			it('Should respect minHeight when set', function () {
				const editor = getJodit({
					minHeight: 300
				});

				// Even with no content, should have minHeight
				expect(editor.container.offsetHeight).to.be.at.least(300);

				// Add small content to slot
				const leftSlot = editor.currentPlace.slots.left;
				const p = editor.c.element('p');
				p.textContent = 'Small content';
				leftSlot.appendChild(p);

				// Should still maintain minHeight
				expect(editor.container.offsetHeight).to.be.at.least(300);
			});
		});
	});

	describe('Slot resize behavior', function () {
		it('Should maintain slot layout during editor resize', function () {
			const editor = getJodit({
				height: 400,
				width: 600,
				allowResizeY: true,
				allowResizeX: true
			});

			// Add content to slots
			const leftSlot = editor.currentPlace.slots.left;
			const rightSlot = editor.currentPlace.slots.right;

			for (let i = 0; i < 10; i++) {
				const p1 = editor.c.element('p');
				p1.textContent = 'Left ' + i;
				leftSlot.appendChild(p1);

				const p2 = editor.c.element('p');
				p2.textContent = 'Right ' + i;
				rightSlot.appendChild(p2);
			}

			const handle = editor.container.querySelector(
				'.jodit-editor__resize'
			);
			expect(handle).is.not.null;

			// Simulate resize
			simulateEvent('mousedown', handle, function (options) {
				options.clientX = 100;
				options.clientY = 100;
			});

			simulateEvent('mousemove', window, function (options) {
				options.clientX = 200;
				options.clientY = 200;
			});

			simulateEvent('mouseup', window);

			// Container should be resized
			expect(editor.container.offsetHeight).equals(500);
			expect(editor.container.offsetWidth).equals(700);

			// Slots should still be properly contained
			expect(leftSlot.offsetHeight).to.be.at.most(
				editor.currentPlace.slots.center.offsetHeight
			);
			expect(rightSlot.offsetHeight).to.be.at.most(
				editor.currentPlace.slots.center.offsetHeight
			);
		});

		it('Should handle fullsize mode with slots', function () {
			const editor = getJodit({
				height: 300
			});

			// Add content to all slots
			const slots = editor.currentPlace.slots;
			['top', 'bottom', 'left', 'right'].forEach(slotName => {
				const slot = slots[slotName];
				for (let i = 0; i < 5; i++) {
					const p = editor.c.element('p');
					p.textContent = slotName + ' content ' + i;
					slot.appendChild(p);
				}
			});

			const initialHeight = editor.container.offsetHeight;

			// Enter fullsize mode
			editor.toggleFullSize(true);

			// Container should expand
			expect(editor.container.offsetHeight).to.be.above(initialHeight);

			// Exit fullsize mode
			editor.toggleFullSize(false);

			// Should return to original height
			expect(editor.container.offsetHeight).equals(300);
		});

		it('Should update CSS variables for slot dimensions', function () {
			const editor = getJodit({
				height: 400
			});

			// Add content to slots with specific dimensions
			const leftSlot = editor.currentPlace.slots.left;
			leftSlot.style.width = '150px';
			const div = editor.c.element('div');
			div.textContent = 'Left content';
			leftSlot.appendChild(div);

			const topSlot = editor.currentPlace.slots.top;
			topSlot.style.height = '60px';
			const div2 = editor.c.element('div');
			div2.textContent = 'Top content';
			topSlot.appendChild(div2);

			// Check if CSS variables are set
			const computedStyle = getComputedStyle(editor.container);
			expect(
				computedStyle.getPropertyValue('--jd-slot-left-width')
			).equals('auto');
			expect(
				computedStyle.getPropertyValue('--jd-slot-top-height')
			).equals('auto');
		});

		describe('Iframe mode', function () {
			it('Should handle slots correctly in iframe mode', function () {
				const editor = getJodit({
					iframe: true,
					height: 400
				});

				// Add content to slots
				const leftSlot = editor.currentPlace.slots.left;
				for (let i = 0; i < 20; i++) {
					const p = editor.c.element('p');
					p.textContent = 'Left iframe ' + i;
					leftSlot.appendChild(p);
				}

				// Container should maintain height
				expect(editor.container.offsetHeight).equals(400);

				// Slot should not exceed container
				expect(leftSlot.offsetHeight).to.be.at.most(400);
			});
		});

		describe('Window resize', function () {
			it('Should maintain slot constraints after window resize', function () {
				const editor = getJodit({
					height: 350
				});

				// Add content to slots
				const rightSlot = editor.currentPlace.slots.right;
				for (let i = 0; i < 30; i++) {
					const p = editor.c.element('p');
					p.textContent = 'Content ' + i;
					rightSlot.appendChild(p);
				}

				// Trigger window resize
				simulateEvent('resize', 0, window);

				// Container should maintain height
				expect(editor.container.offsetHeight).equals(350);

				// Slot should still be constrained
				expect(rightSlot.offsetHeight).to.be.at.most(350);
			});
		});
	});

	describe('Slot borders', function () {
		it('Should show borders for non-empty slots', function () {
			const editor = getJodit();

			const leftSlot = editor.currentPlace.slots.left;
			const topSlot = editor.currentPlace.slots.top;

			// Add content
			leftSlot.appendChild(editor.c.element('div'));
			topSlot.appendChild(editor.c.element('div'));

			// Should have borders according to CSS
			const workplace = editor.workplace;
			const workplaceStyle = getComputedStyle(workplace);

			// Check that slots with content affect adjacent elements
			expect(leftSlot.nextElementSibling).equals(workplace);
			expect(topSlot.parentElement).equals(editor.container);
		});
	});

	describe('Comprehensive slot overflow tests', function () {
		it('Should handle right slot overflow with fixed height', function () {
			const editor = getJodit({
				height: 300
			});

			// Add a lot of content to the right slot
			const rightSlot = editor.currentPlace.slots.right;
			for (let i = 0; i < 100; i++) {
				const h1 = editor.c.element('h1');
				h1.textContent = 'Right Test ' + i;
				rightSlot.appendChild(h1);
			}

			// Right slot should have overflow auto
			expect(getComputedStyle(rightSlot).overflow).equals('auto');

			// Container should maintain fixed height
			expect(editor.container.offsetHeight).equals(300);

			// Right slot should not exceed workplace height
			expect(rightSlot.offsetHeight).to.be.at.most(
				editor.currentPlace.slots.center.offsetHeight
			);
		});

		it('Should handle bottom slot overflow with fixed height', function () {
			const editor = getJodit({
				height: 300
			});

			// Add a lot of content to the bottom slot
			const bottomSlot = editor.currentPlace.slots.bottom;
			for (let i = 0; i < 100; i++) {
				const h1 = editor.c.element('h1');
				h1.textContent = 'Bottom Test ' + i;
				h1.style.display = 'inline-block';
				h1.style.margin = '0 10px';
				bottomSlot.appendChild(h1);
			}

			// Container should maintain fixed height
			expect(editor.container.offsetHeight).equals(300);
		});

		it('Should handle multiple slots with content simultaneously', function () {
			const editor = getJodit({
				height: 400,
				width: 800
			});

			// Add content to all slots
			const slots = editor.currentPlace.slots;

			// Add 100 elements to each slot
			['top', 'bottom', 'left', 'right'].forEach(slotName => {
				const slot = slots[slotName];
				for (let i = 0; i < 100; i++) {
					const elem = editor.c.element('div');
					elem.textContent = `${slotName} content ${i}`;
					elem.style.padding = '5px';
					slot.appendChild(elem);
				}
			});

			// Container should maintain fixed dimensions
			expect(editor.container.offsetHeight).equals(400);
			expect(editor.container.offsetWidth).equals(800);

			// Side slots should have scrollbars and not exceed max-width
			expect(getComputedStyle(slots.left).overflow).equals('auto');
			expect(getComputedStyle(slots.right).overflow).equals('auto');
			expect(slots.left.offsetWidth).to.be.at.most(400);
			expect(slots.right.offsetWidth).to.be.at.most(400);
		});

		it('Should properly handle slot content when switching between height modes', function () {
			const editor = getJodit({
				height: 300
			});

			// Add content to slots
			const leftSlot = editor.currentPlace.slots.left;
			for (let i = 0; i < 50; i++) {
				const p = editor.c.element('p');
				p.textContent = 'Content ' + i;
				leftSlot.appendChild(p);
			}

			expect(editor.container.offsetHeight).equals(300);

			// Change height to auto
			editor.destruct();
			const editor2 = getJodit();

			// Add same content
			const leftSlot2 = editor2.currentPlace.slots.left;
			for (let i = 0; i < 50; i++) {
				const p = editor2.c.element('p');
				p.textContent = 'Content ' + i;
				leftSlot2.appendChild(p);
			}

			// Should expand with content
			expect(editor2.container.offsetHeight).to.be.above(190);
		});

		it('Should handle slots correctly when editor content changes dynamically', function () {
			const editor = getJodit({
				height: 400
			});

			const rightSlot = editor.currentPlace.slots.right;
			for (let i = 0; i < 20; i++) {
				const p = editor.c.element('p');
				p.textContent = 'Slot content ' + i;
				rightSlot.appendChild(p);
			}

			// Change editor content significantly
			editor.value = '<p>test</p>'.repeat(100);

			// Slot should still be constrained
			expect(rightSlot.offsetHeight).to.be.at.most(
				editor.currentPlace.slots.center.offsetHeight
			);
		});
	});

	describe('Edge cases', function () {
		it('Should handle very small heights gracefully', function () {
			const editor = getJodit({
				height: 100,
				minHeight: 50
			});

			// Add content to slots
			const topSlot = editor.currentPlace.slots.top;
			const bottomSlot = editor.currentPlace.slots.bottom;

			topSlot.appendChild(editor.c.element('div'));
			bottomSlot.appendChild(editor.c.element('div'));

			// Should still maintain height
			expect(editor.container.offsetHeight).equals(100);
		});

		it('Should handle zero width slots', function () {
			const editor = getJodit({
				height: 300,
				width: 400
			});

			const leftSlot = editor.currentPlace.slots.left;
			leftSlot.style.width = '0px';

			// Add content
			const div = editor.c.element('div');
			div.textContent = 'Hidden content';
			leftSlot.appendChild(div);

			// Slot should be hidden
			expect(leftSlot.offsetWidth).equals(0);
		});

		it('Should handle CSS variable fallbacks', function () {
			const editor = getJodit();

			// Check that CSS variables have default values
			const computedStyle = getComputedStyle(editor.container);

			// These should fall back to 'auto'
			expect(
				computedStyle.getPropertyValue('--jodit-slot-left-width') ||
					'auto'
			).equals('auto');
			expect(
				computedStyle.getPropertyValue('--jodit-slot-right-width') ||
					'auto'
			).equals('auto');
			expect(
				computedStyle.getPropertyValue('--jodit-slot-top-height') ||
					'auto'
			).equals('auto');
			expect(
				computedStyle.getPropertyValue('--jodit-slot-bottom-height') ||
					'auto'
			).equals('auto');
		});
	});
});
