/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const { UIForm, UISelect, UITextArea, UIInput, UICheckbox, UIFileInput } =
	Jodit.modules;
describe('Create UI Form', () => {
	it('Should create form', () => {
		const jodit = getJodit();

		const form = new UIForm(
			jodit,
			[
				new UIFileInput(jodit, {
					onlyImages: true
				}),

				new UICheckbox(jodit, {
					checked: true,
					name: 'check1',
					switch: true
				}),

				new UISelect(jodit, {
					name: 'language',
					label: 'open quote',
					value: 'en',
					options: [
						{
							value: 'en',
							text: 'Classe 1'
						},
						{
							value: 'ru',
							text: 'Classe 2'
						}
					],
					required: true
				}),

				new UITextArea(jodit, {
					label: 'Class name',
					resizable: false,
					name: 'code',
					required: true,
					rows: 10,
					className: 'jodit-paste-code__textarea'
				}),

				new UIInput(jodit, {
					label: 'Courier New',
					name: 'caption',
					value: 10,
					type: 'number'
				})
			],
			{
				className: 'jodit-paste-code'
			}
		);
		expect(form).is.not.null;

		const attrs = [
			'name',
			'type',
			'value',
			'accept',
			'dir',
			'rows',
			'required'
		];

		function snapshot(t) {
			const result = [
				`${t.tagName.toLowerCase()}${attrs
					.filter(a => t.hasAttribute(a))
					.map(a => `[${a}=${t.getAttribute(a)}]`)
					.join('')}`
			];

			Array.from(t.children).map(c => result.push(...snapshot(c)));

			return result;
		}

		const result = snapshot(form.container);
		const expected = [
			'form[dir=auto]',
			'button[type=button]',
			'span',
			'svg',
			'path',
			'span',
			'input[name=][type=file][accept=image/*][dir=auto]',
			'label',
			'div',
			'input[name=check1][type=checkbox][value=true][dir=auto]',
			'div',
			'div',
			'span',
			'div',
			'select[name=language][type=text][dir=auto][required=true]',
			'option[value=en]',
			'option[value=ru]',
			'div',
			'span',
			'div',
			'textarea[name=code][type=text][dir=auto][required=true]',
			'div',
			'span',
			'div',
			'input[name=caption][type=number][dir=auto]'
		];

		for (let i = 0; i < result.length; i++) {
			expect(result[i]).equals(expected[i]);
		}
	});

	describe('onChange', () => {
		[
			['input', UIInput, 'value', 100],
			['area', UITextArea, 'value', 'code'],
			['checkbox', UICheckbox, 'value', true]
		].forEach(([name, Control, key, value]) => {
			describe('For ' + name, () => {
				it('Should call onChange callback', () => {
					const jodit = getJodit();

					let v = '';
					const onChangeSpy = val => {
						v = val;
					};

					const input = new Control(jodit, {
						name: 'caption',
						value: 10,
						type: 'number',
						onChange: onChangeSpy
					});

					input[key] = value;
					expect(v).equals(value.toString());
				});
			});
		});
	});
});
