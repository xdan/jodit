describe('Selection Module Tests', function() {
    appendTestArea('selection_tested_area', true);
    it('If cursor in the end of P Selction.cursorInTheEdge(false) must return true', function() {
        var editor = new Jodit('#selection_tested_area');
        editor.setEditorValue('<p>test</p>>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.setStart(editor.editor.firstChild.firstChild, 4);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        expect(editor.selection.cursorInTheEdge(false)).to.equal(true);


        range.setStart(editor.editor.firstChild.firstChild, 2);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

        expect(editor.selection.cursorInTheEdge(false)).to.equal(false);
    });
    it('If cursor inside of SPAN in the end of P Selction.cursorInTheEdge(false) must return true', function() {
        var editor = new Jodit('#selection_tested_area');
        editor.setEditorValue('<p>test<span>1</span></p>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.selectNodeContents(editor.editor.firstChild.lastChild);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        expect(editor.selection.cursorInTheEdge(false)).to.equal(true);
    });
    describe('Change mode', function () {
        it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false
            });
            editor.setEditorValue('<p>test</p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 2);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            editor.setMode(Jodit.MODE_SOURCE);

            var mirror = editor.container.querySelector('textarea.jodit_source_mirror');

            expect(mirror.value).to.equal('<p>test</p>');
            expect(mirror.selectionStart).to.equal(5);
            expect(mirror.selectionEnd).to.equal(5);
        });
        it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA for long string', function (done) {
            var timeout,
                __done = function () {
                    clearTimeout(timeout);
                    done();
                };

            timeout = setTimeout(function () {
                expect(false).to.equal(true);
                __done();
            }, 4000);

            var editor = new Jodit('#selection_tested_area', {
                defaultMode: Jodit.MODE_SOURCE,
                useAceEditor: true,
                beautifyHTML: false,
                events: {
                    /**
                     * @this Jodit
                     */
                    aceInited: function () {
                        this.setMode(Jodit.MODE_WYSIWYG);
                        this.setEditorValue(('<p>' + 'test '.repeat(50) + '</p>').repeat(1));

                        var sel = this.win.getSelection(),
                            range = this.doc.createRange();

                        range.selectNodeContents(this.editor.querySelector('p'));
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);

                        this.selection.insertHTML('hello');

                        this.setMode(Jodit.MODE_SOURCE);

                        expect(this.__plugins.source.aceEditor.getSelectionRange().start.column).to.equal(258);
                        expect(this.__plugins.source.aceEditor.getSelectionRange().start.row).to.equal(0);

                        this.__plugins.source.aceEditor.session.insert(this.__plugins.source.aceEditor.getCursorPosition(), ' world');

                        expect(this.__plugins.source.aceEditor.getValue()).to.equal('<p>' + 'test '.repeat(49) + 'test hello world</p>');
                        __done();
                    }
                }
            });

        }).timeout(6000);

        it('Should restore collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false,
                defaultMode: Jodit.MODE_SOURCE
            });
            editor.setEditorValue('<p>test</p>')

            var mirror = editor.container.querySelector('textarea.jodit_source_mirror');
            mirror.setSelectionRange(5, 5);

            editor.setMode(Jodit.MODE_WYSIWYG);
            editor.selection.insertNode(editor.doc.createTextNode(' a '));

            expect(editor.getEditorValue()).to.equal('<p>te a st</p>');
        });

        it('Should restore non collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false
            });
            editor.setEditorValue('<p>test</p>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 1);
            range.setEnd(editor.editor.firstChild.firstChild, 3);
            sel.removeAllRanges();
            sel.addRange(range);

            editor.setMode(Jodit.MODE_SOURCE);

            var mirror = editor.container.querySelector('textarea.jodit_source_mirror');

            expect(mirror.value).to.equal('<p>test</p>');
            expect(mirror.selectionStart).to.equal(4);
            expect(mirror.selectionEnd).to.equal(6);
        });
        it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false,
                defaultMode: Jodit.MODE_SOURCE
            });
            editor.setEditorValue('<p>test</p>')


            var mirror = editor.container.querySelector('textarea.jodit_source_mirror');
            mirror.setSelectionRange(2, 8);

            editor.setMode(Jodit.MODE_WYSIWYG);
            expect(editor.selection.isCollapsed()).to.equal(false);
            editor.selection.insertNode(editor.doc.createTextNode(' a '));
            expect(editor.getEditorValue()).to.equal(' a ');
        });
        it('Should restore collapsed selection inside empty element - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false,
                defaultMode: Jodit.MODE_SOURCE
            });
            editor.setEditorValue('<a>11</a>')


            var mirror = editor.container.querySelector('textarea.jodit_source_mirror');
            mirror.setSelectionRange(4, 4);

            editor.setMode(Jodit.MODE_WYSIWYG);
            expect(editor.selection.isCollapsed()).to.equal(true);
            editor.selection.insertNode(editor.doc.createTextNode(' a '));
            expect(editor.getEditorValue()).to.equal('<a>1 a 1</a>');
        });

    });
    after(function() {
        selection_tested_area.parentNode.removeChild(selection_tested_area);
    });
    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});