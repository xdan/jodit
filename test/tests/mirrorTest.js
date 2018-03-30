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
            var editor = new Jodit(appendTestArea(), {
                useAceEditor: false // because onChange can be fired after aceInited
            });

            var defaultValue = 'test';
            var count = 0;

            editor.value = defaultValue;

            editor.events
                .on('change', function (value, oldvalue) {
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
        });
        describe('After change mode to source mode and use insertHTML method', function () {
            it('Should insert text on caret position', function (done) {
                var editor = new Jodit(appendTestArea(), {
                    useAceEditor: true,
                    beautifyHTML: false,
                    events: {
                        aceInited: function (jodit) {
                            jodit.value = '<p>test <span>test</span> test</p>'
                            var range = jodit.editorDocument.createRange();
                            range.selectNodeContents(jodit.editor.querySelector('span'));
                            range.collapse(false);
                            jodit.selection.selectRange(range)

                            jodit.setMode(Jodit.MODE_SOURCE);
                            jodit.selection.insertHTML('loop');

                            expect(jodit.value).to.be.equal('<p>test <span>testloop</span> test</p>');
                            done();
                        },
                    }
                });
            }).timeout(4000);

            describe('Without ace', function () {
                it('Should insert text on caret position', function () {
                    var editor = new Jodit(appendTestArea(), {
                        useAceEditor: false
                    });
                    editor.value = '<p>one <span>two</span> three</p>'
                    var range = editor.editorDocument.createRange();
                    range.selectNodeContents(editor.editor.querySelector('span'));
                    range.collapse(false);
                    editor.selection.selectRange(range)

                    editor.selection.insertHTML('stop');
                    expect(editor.value).to.be.equal('<p>one <span>twostop</span> three</p>');

                    editor.setMode(Jodit.MODE_SOURCE);

                    editor.selection.insertHTML('loop');
                    expect(editor.value).to.be.equal('<p>one <span>twostoploop</span> three</p>');
                });
            });
        });
    })
    afterEach(removeStuff);
});