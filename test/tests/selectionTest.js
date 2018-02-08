describe('Selection Module Tests', function() {
    appendTestArea('selection_tested_area', true);
    it('If cursor in the end of P Selction.cursorInTheEdge(false) must return true', function() {
        var editor = new Jodit('#selection_tested_area');
        editor.setEditorValue('<p>test</p>>');

        var sel = editor.editorWindow.getSelection(),
            range = editor.editorDocument.createRange();

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

        var sel = editor.editorWindow.getSelection(),
            range = editor.editorDocument.createRange();

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

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

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
                     * @this Events
                     */
                    aceInited: function (jodit) {
                        jodit.setMode(Jodit.MODE_WYSIWYG);
                        jodit.setEditorValue(('<p>' + 'test '.repeat(50) + '</p>').repeat(1));

                        var sel = jodit.editorWindow.getSelection(),
                            range = jodit.editorDocument.createRange();

                        range.selectNodeContents(jodit.editor.querySelector('p'));
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);

                        jodit.selection.insertHTML('hello');

                        jodit.setMode(Jodit.MODE_SOURCE);

                        expect(jodit.__plugins.source.aceEditor.getSelectionRange().start.column).to.equal(258);
                        expect(jodit.__plugins.source.aceEditor.getSelectionRange().start.row).to.equal(0);

                        jodit.__plugins.source.aceEditor.session.insert(jodit.__plugins.source.aceEditor.getCursorPosition(), ' world');

                        expect(jodit.__plugins.source.aceEditor.getValue()).to.equal('<p>' + 'test '.repeat(49) + 'test hello world</p>');
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
            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '));

            expect(editor.getEditorValue()).to.equal('<p>te a st</p>');
        });

        it('Should restore non collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false
            });
            editor.setEditorValue('<p>test</p>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

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
            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '));
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
            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '));
            expect(editor.getEditorValue()).to.equal('<a>1 a 1</a>');
        });

    });
    describe('Click on empty tag', function () {
        it('Should move cursore inside that', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p></p><p></p><p></p>'
            simulateEvent('mousedown', 0, editor.editor.getElementsByTagName('p')[1])
            editor.selection.insertHTML('test');
            expect('<p></p><p>test</p><p></p>').to.be.equal(editor.value);
        });
    });
    describe('Method setCursorIn', function () {
        describe('Call for not Node element', function () {
            it('Should throw exception', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<p>1</p><p>2</p>'
                expect(function () {
                    editor.selection.setCursorIn(editor.editor.querySelector('strong'));
                }).to.throw();
            });
        });
        describe('Call for element what is not inside the current editor', function () {
            it('Should throw exception', function () {
                var editor = new Jodit(appendTestArea());
                expect(function () {
                    editor.selection.setCursorIn(document.body);
                }).to.throw();
            });
        });
        it('Should move cursor inside node in the end', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p>1</p><p>2</p>'

            editor.selection.setCursorIn(editor.editor.lastChild);
            editor.selection.insertHTML('test');

            expect(editor.value).to.be.equal('<p>1</p><p>2test</p>');
        });
        describe('With inStart = true', function () {
            it('Should move cursor inside node in the start', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<p>1</p><p>2</p>'

                editor.selection.setCursorIn(editor.editor.lastChild, true);
                editor.selection.insertHTML('test');

                expect(editor.value).to.be.equal('<p>1</p><p>test2</p>');
            });
        });
    });
    describe('Method eachSelection', function () {
        it('Should call callback for each node in selection', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p>1</p><p>2</p><strong><span>22</span></strong><p>4</p>stop'
            var range = editor.editorDocument.createRange();
            range.setStartBefore(editor.editor.firstChild);
            range.setEndAfter(editor.editor.lastChild);
            editor.selection.selectRange(range);

            var nodesNames = [];
            editor.selection.eachSelection((node) => {
                nodesNames.push(node.nodeName);
            });

            expect(['P', 'P', 'STRONG', 'P', '#text'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        it('Should call callback for each node in selection range', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p>1</p><p>2</p><strong><span>22</span></strong><p>4</p>stop'
            var range = editor.editorDocument.createRange();
            range.setStartBefore(editor.editor.firstChild.nextSibling);
            range.setEndAfter(editor.editor.lastChild.previousSibling);
            editor.selection.selectRange(range);

            var nodesNames = [];
            editor.selection.eachSelection((node) => {
                nodesNames.push(node.nodeName);
            });

            expect(['p','strong','p'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        it('Should not call callback for editor', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '';

            editor.selection.setCursorIn(editor.editor);

            var nodesNames = [];
            editor.selection.eachSelection((node) => {
                nodesNames.push(node.nodeName);
            });

            expect([].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        it('Should call callback for current node if selection is collapsed', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p>1</p><p>2</p>';

            editor.selection.setCursorIn(editor.editor.firstChild);

            var nodesNames = [];
            editor.selection.eachSelection((node) => {
                nodesNames.push(node.nodeName);
            });

            expect(['#text'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
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