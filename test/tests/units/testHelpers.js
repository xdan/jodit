describe('Test helpers', function () {
    describe('normalizeKeyAliases', function () {
        it('Should convert some hotkeys to normal', function () {
            var hotkeys = {
                'cmd+ alt+s': 'alt+meta+s',
                'cmd++': '++meta',
                'ctrl+ alt+s': 'alt+control+s',
                ' command+s': 'meta+s',
                'alt+s+ctrl': 'alt+control+s',
                'shift+ctrl+cmd+D': 'control+d+meta+shift',
                'meta+windows+win+ctrl+cmd': 'control+meta',
                'cmd+ alt+ shift ': 'alt+meta+shift',
                'return + esc ': 'enter+escape',
            };

            Object.keys(hotkeys).forEach(function (key) {
                expect(hotkeys[key]).to.be.equal(Jodit.modules.Helpers.normalizeKeyAliases(key));
            });
        });
    });
});