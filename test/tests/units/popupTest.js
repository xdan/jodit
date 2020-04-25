describe("Test popup", function () {
	const position = Jodit.modules.Helpers.position;

	describe("Open popup on some target", function () {
		describe("Usual case - there is enough space under element", function () {
			it('should show popup under element', function () {
				const popup = new Jodit.modules.Popup();
				const div = appendTestDiv();
				div.innerText = 'test';

				const getBound = function () {return position(div)};

				popup.setContent('Test content').open(getBound);

				expect(popup.container.style.left).equals(getBound().left);
			});
		});
	});
});
