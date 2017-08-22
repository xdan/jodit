describe('Dialog system tests', function() {
    appendTestArea('dialog_area', true);
    describe('Short Jodit.Alert etc static methods', function() {
        it('Should work without Jodit instance', function () {
            var dialog = Jodit.Alert('Hello');
            dialog.close();
        });
        it('Should return Dialog instance', function () {
            var dialog = Jodit.Alert('Hello');
            expect(dialog instanceof Jodit.modules.Dialog).to.equal(true);
            dialog.close();
        });
        it('Should get string or HTMLElement or array of string or array of HTMLElement in arguments', function () {
            var dialog = Jodit.Alert(['<div id="hello1">Hello</div>']);
            expect(document.getElementById('hello1')).not.to.equal(null);
            dialog.close();

            var dialog2 = Jodit.Alert(document.createTextNode('Test'));
            expect(dialog2 instanceof Jodit.modules.Dialog).to.equal(true);
            dialog2.close()

            var div = document.createElement('div');
            div.id = 'hello3';
            var dialog3 = Jodit.Alert(div);
            expect(div).to.equal(document.getElementById('hello3'));
            dialog3.close()

        });
    });
    after(function() {
        dialog_area.parentNode.removeChild(dialog_area);
    });
    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});