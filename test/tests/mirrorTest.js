describe('CodeMirror editor source code', function() {
    describe('Init', function() {
        it('After init container must has codeeditor container', function(done) {
            var timeout,
                area = appendTestArea(false, true),
                __done = function () {
                    clearTimeout(timeout);
                    this.events.off('beforeDestruct');
                    this.destruct();
                    area.parentNode.removeChild(area);
                    done();
                };

            timeout = setTimeout(function () {
                expect(false).to.equal(true);
                __done.call(editor);
            }, 5000);

            editor = new Jodit(area, {
                defaultMode: Jodit.MODE_SOURCE,
                useAceEditor: true,
                events: {
                    beforeDestruct: function () {
                        return false;
                    },
                    aceInited: function (editor) {
                        expect(editor.container.querySelectorAll('.jodit_source_mirror-fake').length).to.equal(1);
                        __done.call(editor);
                    }
                }
            });
        }).timeout(6000);
    });
    describe('Change mode', function() {
        describe('In WYSIWYG mode isEditorMode', function() {
            it('Should return true', function() {
                var editor = new Jodit(appendTestArea());
                expect(editor.isEditorMode()).to.be.true;
                editor.toggleMode();
                expect(editor.isEditorMode()).to.be.false;
            });
        });
        it('Should not fire Change event', function() {
            var editor = new Jodit(appendTestArea());
            var defaultValue = 'test';
            var count = 0;

            editor.value = defaultValue;

            editor.events.on('change', function (value, oldvalue) {
                expect(oldvalue).to.be.not.equal(value);
                expect(defaultValue).to.be.not.equal(value);
                count++;
            });


            editor.selection.setCursorAfter(editor.editor.firstChild);
            editor.setMode(Jodit.MODE_SOURCE);
            editor.setMode(Jodit.MODE_WYSIWYG);
            editor.value = defaultValue;
            editor.value = 'another';

            expect(1).to.be.equal(count);
        })
    })
});