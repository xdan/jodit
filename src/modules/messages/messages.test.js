/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Messages module', () => {
	let editor;

	beforeEach(() => {
		editor = getJodit();
	});

	describe('Test info', () => {
		it('Should be called', () => {
			editor.message.info('Hello world! This is info message');
			expect(editor.container.querySelector('.jodit-ui-message')).is.not
				.null;
		});

		it('Can not be called with event errorMessage', () => {
			editor.e.fire('errorMessage', 'Hello world!', 'info');

			expect(
				editor.container.querySelector('.jodit-ui-message_variant_info')
			).is.null;
		});
	});

	describe('Test success', () => {
		it('Should be called', done => {
			editor.message.success('Hello Mars! This is success message', 100);
			expect(
				editor.container.querySelector('.jodit-ui-message_active_true')
			).is.not.null;

			editor.async.setTimeout(() => {
				expect(
					editor.container.querySelector(
						'.jodit-ui-message_active_true'
					)
				).is.null;

				done();
			}, 200);
		});

		describe('Several calls with same content', () => {
			it('Should show only one message', () => {
				editor.message.success('Hello Mars!', 100);
				editor.message.success('Hello Mars!', 100);
				editor.message.success('Hello Mars!', 100);
				expect(
					editor.container.querySelectorAll('.jodit-ui-message')
						.length
				).equals(1);
			});

			it('Should increase hide timeout', done => {
				editor.message.success('Hello Mars!', 150);
				expect(editor.container.querySelector('.jodit-ui-message')).is
					.not.null;

				editor.async.setTimeout(() => {
					editor.message.success('Hello Mars!', 150);

					editor.async.setTimeout(() => {
						editor.message.success('Hello Mars!', 150);
					}, 100);
				}, 100);

				editor.async.setTimeout(() => {
					expect(editor.container.querySelector('.jodit-ui-message'))
						.is.not.null;
					done();
				}, 400);
			});
		});
	});

	describe('Test error', () => {
		it('Should be called', () => {
			editor.message.error('Hello Venus! This is error message');
			expect(editor.container.querySelector('.jodit-ui-message')).is.not
				.null;
		});
	});
});
