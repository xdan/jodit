describe('Input test', () => {
	const { UIInput, UIGroup } = Jodit.modules;
	const { refs } = Jodit.modules.Helpers;

	let jodit, dlg, group, input;
	beforeEach(() => {
		jodit = getJodit();

		dlg = jodit.dlg();

		group = new UIGroup(jodit);

		input = new UIInput(jodit, {
			label: 'URL',
			type: 'url',
			ref: 'url',
			required: true,
			value: 'https://xdsoft.net/jodit/',
			onChange: src => {
				this.state.src = src;
			}
		});

		group.append(input);
		dlg.setContent(group);
		dlg.open();
	});

	afterEach(() => {
		dlg.close();
		group.remove(input);
		input.destruct();
		group.destruct();
		dlg.destruct();
	});

	describe('Inside dialog', () => {
		it('should render fine', () => {
			const refsElements = refs(dlg.container);
			expect(refsElements.url.closest('.jodit-ui-input')).eq(
				input.container
			);
		});

		it('should be focusable', () => {
			const refsElements = refs(dlg.container);
			refsElements.url.focus();
			expect(refsElements.url).eq(jodit.od.activeElement);
		});
	});
});
