describe('Test mobile mode', function () {
    appendTestArea('editor_mobile_test', true);
    getBox().style.width = 'auto';

    describe('Toollbar', function () {
        it('Should have different count buttons for different container sizes', function () {
            getBox().style.width = '1000px';
            var editor = new Jodit(editor_mobile_test);
            expect(27).to.be.below(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '790px';
            simulateEvent('resize', 0, window)

            expect(27).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '690px';
            simulateEvent('resize', 0, window)

            expect(26).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '390px';
            simulateEvent('resize', 0, window)

            expect(15).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);
        });
    });

    after(function() {
        editor_mobile_test.parentNode.removeChild(editor_plugins_test);
    });

    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});