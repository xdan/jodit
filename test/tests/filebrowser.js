describe('Jodit FileBrowser Tests', function() {
    describe('Constructor/Destructor', function () {
        it('Should create dialog and load files', function () {
            var editor = new Jodit(appendTestArea(), {
                filebrowser: {
                    ajax: {
                        url: 'http://localhost:8181/index-test.php'
                    }
                }
            });
            (new Jodit.modules.FileBrowser(editor)).open(function () {});
            expect(document.querySelectorAll('.jodit_dialog_box.active').length).to.be.equal(1);
        })
    })
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});