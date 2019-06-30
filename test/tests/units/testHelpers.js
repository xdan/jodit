describe('Test helpers', function() {
	describe('Normalizers', function() {
		describe('normalizeKeyAliases', function() {
			it('Should convert some hotkeys to normal', function() {
				var hotkeys = {
					'cmd+ alt+s': 'alt+meta+s',
					'cmd++': '++meta',
					'ctrl+ alt+s': 'alt+control+s',
					' command+s': 'meta+s',
					'alt+s+ctrl': 'alt+control+s',
					'shift+ctrl+cmd+D': 'control+d+meta+shift',
					'meta+windows+win+ctrl+cmd': 'control+meta',
					'cmd+ alt+ shift ': 'alt+meta+shift',
					'return + esc ': 'enter+escape'
				};

				Object.keys(hotkeys).forEach(function(key) {
					expect(hotkeys[key]).to.be.equal(Jodit.modules.Helpers.normalizeKeyAliases(key));
				});
			});
		});
		describe('normalizePath', function() {
			it('Should normalize slashes and join some parts', function() {
				var variants = {
					'/data/test/': ['/data/test/'],
					'data/test/': ['data/test/'],
					'data/test': ['data', 'test', ''],
					'test/test/': ['test//test//'],
					'https://xdsoft.net/jodit/connector/index.html': ['https://xdsoft.net', 'jodit/connector/', '/index.html'],
					'https://xdsoft.net/jodit/connector/index2.html': ['https://xdsoft.net\\jodit/connector/', '/index2.html'],
				};

				Object.keys(variants).forEach(function(key) {
					expect(key).to.be.equal(Jodit.modules.Helpers.normalizePath.apply(null, variants[key]));
				});
			});
		});
	});

	describe('Checkers', function() {
		describe('isInt', function() {
			it('Should check value is int or not', function() {
				var values = [
					'cmd+ alt+s', false,
					'+1', true,
					'-1', true,
					'-1dddd', false,
					'10', true,
					'10.1', false,
					'10e10', true,
					'10e10', true,
					10, true,
					11.33, false
				];

				for (var i = 0; i < values.length; i += 2) {
					expect(values[i + 1]).to.be.equal(Jodit.modules.Helpers.isInt(values[i]));
				}
			});
		});

		describe('isNumeric', function() {
			it('Should check value is int or not', function() {
				var values = [
					'cmd+ alt+s', false,
					'+1', true,
					'-1', true,
					'-1000.333', true,
					'-1dddd', false,
					's1999999', false,
					' -1 ', false,
					'10', true,
					'10.1', true,
					'12312310.1243234', true,
					'10e10', true,
					'10e10', true,
					10, true,
					11.33, true
				];

				for (var i = 0; i < values.length; i += 2) {
					expect(values[i + 1]).to.be.equal(Jodit.modules.Helpers.isNumeric(values[i]));
				}
			});
		});
	});
});
