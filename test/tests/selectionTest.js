describe('Selection Module Tests', function() {
    describe('Current method', function () {
        describe('Cursor outside the editor', function () {
            it('Should return false', function () {
                var editor = new Jodit(appendTestArea()),
                    div = document.createElement('div');

                div.innerHTML = 'test';
                document.body.appendChild(div);
                editor.value = '<h1>test <span>test</span>sdfsdfds</h1>';
                var range = document.createRange();
                range.setStart(div.firstChild, 1);
                range.setEnd(div.firstChild, 2);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.selection.current()).to.be.false;
                document.body.removeChild(div);
            });
        });
        describe('Cursor in the left of some SPAN', function () {
            it('Should return text before this span', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<h1>one<span>two</span>tree</h1>';
                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild, 1);
                range.collapse(true);

                editor.selection.selectRange(range);

                expect(editor.selection.current()).to.be.equal(editor.editor.firstChild.firstChild) //one
            });
        });
        describe('Cursor inside the text node ', function () {
            it('Should return text', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<h1>test</h1>';
                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor.firstChild.firstChild, 1);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.current()).to.be.equal(editor.editor.firstChild.firstChild) // test
            });
        });
        describe('Cursor after h1', function () {
            it('Should return text inside h1', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<h1>test</h1>';
                var range = editor.editorDocument.createRange();
                range.setStart(editor.editor, 1);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.current()).to.be.equal(editor.editor.firstChild.firstChild)// test
            });
            describe('With false argument', function () {
                it('Should return h1', function () {
                    var editor = new Jodit(appendTestArea());
                    editor.value = '<h1>test</h1>';
                    var range = editor.editorDocument.createRange();
                    range.setStart(editor.editor, 1);
                    range.collapse(true);
                    editor.selection.selectRange(range);

                    expect([editor.editor.firstChild, editor.editor.firstChild.firstChild]).to.be.include(editor.selection.current(false))// h1
                });
            });
        });
        describe('Select img', function () {
            it('Should return this image', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<h1>test <img src="#" alt=""> sdfsdfs</h1>';
                var range = editor.editorDocument.createRange();
                range.selectNode(editor.editor.querySelector('img'));
                editor.selection.selectRange(range);

                expect(editor.selection.current()).to.be.equal(editor.editor.querySelector('img'))
            });
        });
    });
    describe('cursorInTheEdge', function () {
        describe('Cursor in the text', function () {
            describe('Cursor in the end of text node but after this has BR', function () {
                it('Should return true', function() {
                    var editor = new Jodit(appendTestArea());
                    editor.setEditorValue('<p>test<br></p>');

                    var range = editor.editorDocument.createRange();

                    range.setStart(editor.editor.firstChild.firstChild, 4);
                    range.collapse(true);
                    editor.selection.selectRange(range);

                    expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.be.true
                });
            });
            describe('Cursor in the end of text node but after this has image', function () {
                it('Should return false', function() {
                    var editor = new Jodit(appendTestArea());
                    editor.setEditorValue('<p>test<img/></p>');

                    var range = editor.editorDocument.createRange();

                    range.setStart(editor.editor.firstChild.firstChild, 4);
                    range.collapse(true);
                    editor.selection.selectRange(range);

                    expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(false);
                });
            });
            describe('Cursor in the middle of text node', function () {
                it('Should return false', function() {
                    var editor = new Jodit(appendTestArea());
                    editor.setEditorValue('<p>test</p>');

                    var range = editor.editorDocument.createRange();

                    range.setStart(editor.editor.firstChild.firstChild, 2);
                    range.collapse(true);
                    editor.selection.selectRange(range);

                    expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(false);
                });
                describe('Cursor in the middle of text node but after cursor only invisible spaces', function () {
                    it('Should return true', function() {
                        var editor = new Jodit(appendTestArea());
                        editor.setEditorValue('<p>test'  + Jodit.INVISIBLE_SPACE + Jodit.INVISIBLE_SPACE + Jodit.INVISIBLE_SPACE + '</p>');

                        var range = editor.editorDocument.createRange();

                        range.setStart(editor.editor.firstChild.firstChild, 4);
                        range.collapse(true);
                        editor.selection.selectRange(range);

                        expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(true);
                    });
                });
                describe('Cursor in the middle of text node but before cursor only invisible spaces', function () {
                    it('Should return true', function() {
                        var editor = new Jodit(appendTestArea());
                        editor.setEditorValue('<p>'  + Jodit.INVISIBLE_SPACE + Jodit.INVISIBLE_SPACE + Jodit.INVISIBLE_SPACE + 'test</p>');

                        var range = editor.editorDocument.createRange();

                        range.setStart(editor.editor.firstChild.firstChild, 3);
                        range.collapse(true);
                        editor.selection.selectRange(range);

                        expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.equal(true);
                    });
                });
                describe('Cursor in the end of text node but after this has several not empty text nodes', function () {
                    it('Should return false', function() {
                        var editor = new Jodit(appendTestArea());
                        editor.setEditorValue('<p>test</p>');

                        var range = editor.editorDocument.createRange();

                        range.setStart(editor.editor.firstChild.firstChild, 4);
                        range.collapse(true);
                        editor.selection.selectRange(range);
                        editor.selection.insertNode(editor.editorDocument.createTextNode('a'));

                        range.setStart(editor.editor.firstChild.firstChild, 4);
                        range.collapse(true);
                        editor.selection.selectRange(range);

                        expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.be.false;
                    });
                    describe('Cursor in the end of text node and after are only text nodes with invisible spaces', function () {
                        it('Should return true', function() {
                            var editor = new Jodit(appendTestArea());
                            editor.setEditorValue('<p>test</p>');

                            var range = editor.editorDocument.createRange();

                            range.setStart(editor.editor.firstChild.firstChild, 4);
                            range.collapse(true);
                            editor.selection.selectRange(range);

                            editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))
                            editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))
                            editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))

                            range.setStart(editor.editor.firstChild.firstChild, 4);
                            range.collapse(true);
                            editor.selection.selectRange(range);

                            expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(true);
                        });
                    });
                    describe('Inverse', function () {
                        describe('Cursor in the start of text node but before this has several not empty text nodes', function () {
                            it('Should return false', function() {
                                var editor = new Jodit(appendTestArea());
                                editor.setEditorValue('<p>test</p>');

                                var range = editor.editorDocument.createRange();

                                range.setStart(editor.editor.firstChild.firstChild, 0);
                                range.collapse(true);
                                editor.selection.selectRange(range);
                                editor.selection.insertNode(editor.editorDocument.createTextNode('a'));

                                range.setStart(editor.editor.firstChild.lastChild, 0);
                                range.collapse(true);
                                editor.selection.selectRange(range);

                                expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.be.false;
                            });
                            describe('Cursor in the start of text node and before are only text nodes with invisible spaces', function () {
                                it('Should return true', function() {
                                    var editor = new Jodit(appendTestArea());
                                    editor.setEditorValue('<p>test</p>');

                                    var range = editor.editorDocument.createRange();

                                    range.setStart(editor.editor.firstChild.firstChild, 0);
                                    range.collapse(true);
                                    editor.selection.selectRange(range);

                                    editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))
                                    editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))
                                    editor.selection.insertNode(editor.editorDocument.createTextNode(Jodit.INVISIBLE_SPACE))

                                    range.setStart(editor.editor.firstChild.lastChild, 0);
                                    range.collapse(true);
                                    editor.selection.selectRange(range);

                                    expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.equal(true);
                                });
                            });
                        });
                    });
                });
            });
        });
        describe('Cursor after element', function () {
            it('Should return null', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p>test</p>');

                var range = editor.editorDocument.createRange();

                range.setStartAfter(editor.editor.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.be.equal(null);
            });
        });
        describe('Cursor before element', function () {
            it('Should return null', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p>test</p>');

                var range = editor.editorDocument.createRange();

                range.setStartBefore(editor.editor.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.be.equal(null);
            });
        });
        describe('Cursor in the start of element ', function () {
            it('Should return true', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p><span>test</span></p>');

                var range = editor.editorDocument.createRange();

                range.setStartBefore(editor.editor.firstChild.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.be.true;
            });
        });
        describe('Cursor in the end of element ', function () {
            it('Should return true', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p><span>test</span></p>');

                var range = editor.editorDocument.createRange();

                range.setStartAfter(editor.editor.firstChild.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.be.true;
            });
        });
        describe('Cursor not in the end of element ', function () {
            it('Should return false', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p><span>test</span><span>stop</span></p>');

                var range = editor.editorDocument.createRange();

                range.setStartAfter(editor.editor.firstChild.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.be.false;
            });
        });
        describe('Cursor not in the start of element ', function () {
            it('Should return false', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p><span>test</span><span>stop</span></p>');

                var range = editor.editorDocument.createRange();

                range.setStartAfter(editor.editor.firstChild.firstChild);
                range.collapse(true);
                editor.selection.selectRange(range);

                expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.be.false;
            });
        });
        describe('If cursor in the end of P', function () {
            it('Should return true', function() {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p>test</p>>');

                var sel = editor.editorWindow.getSelection(),
                    range = editor.editorDocument.createRange();

                range.setStart(editor.editor.firstChild.firstChild, 4);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(true);


                range.setStart(editor.editor.firstChild.firstChild, 2);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.selection.cursorInTheEdge(false)).to.equal(false);
            });
        });
        describe('If cursor in the end of SPAN in the end of P', function () {
            it('Should return true', function () {
                var editor = new Jodit(appendTestArea());
                editor.setEditorValue('<p>test<span>1</span></p>');

                var sel = editor.editorWindow.getSelection(),
                    range = editor.editorDocument.createRange();

                range.selectNodeContents(editor.editor.firstChild.lastChild);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.selection.cursorInTheEdge(false, editor.editor.firstChild)).to.equal(true);
            });
        });
        describe('Curson in the end of span inside P and check cursorInTheEdge(true)', function () {
            it('Should return false', function () {
                var editor = new Jodit(appendTestArea())
                editor.setEditorValue('<p>Some <span>text</span></p>');

                var sel = editor.editorWindow.getSelection(),
                    range = editor.editorDocument.createRange();

                range.selectNodeContents(editor.editor.firstChild.lastChild);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.selection.cursorInTheEdge(true, editor.editor.firstChild)).to.be.false;
            });
        });
    });

    describe('Change mode', function () {
        it('Should restore collapsed selection when user change mode - from WYSIWYG to TEXTAREA', function () {
            var editor = new Jodit(appendTestArea(), {
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

            var editor = new Jodit(appendTestArea(), {
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
            var editor = new Jodit(appendTestArea(), {
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
            var editor = new Jodit(appendTestArea(), {
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

        describe('Problem', function () {
            it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
                var editor = new Jodit(appendTestArea(), {
                    useAceEditor: false,
                    defaultMode: Jodit.MODE_SOURCE
                });
                editor.selection.focus();
                editor.setEditorValue('<p>test</p>')

                var mirror = editor.container.querySelector('textarea.jodit_source_mirror');
                mirror.setSelectionRange(2, 8);

                editor.setMode(Jodit.MODE_WYSIWYG);
                expect(editor.selection.isCollapsed()).to.equal(false);

                editor.selection.insertNode(editor.editorDocument.createTextNode(' a '));
                expect(editor.getEditorValue()).to.equal(' a ');
            });
        });
        it('Should restore collapsed selection inside empty element - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit(appendTestArea(), {
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
            editor.selection.eachSelection(function (node) {
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
            editor.selection.eachSelection(function (node) {
                nodesNames.push(node.nodeName);
            });

            expect(['p','strong','p'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        it('Should not call callback for editor', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '';

            editor.selection.setCursorIn(editor.editor);

            var nodesNames = [];
            editor.selection.eachSelection(function (node) {
                nodesNames.push(node.nodeName);
            });

            expect(['#text'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        it('Should call callback for current node if selection is collapsed', function () {
            var editor = new Jodit(appendTestArea());
            editor.value = '<p>1</p><p>2</p>';

            editor.selection.setCursorIn(editor.editor.firstChild);

            var nodesNames = [];
            editor.selection.eachSelection(function (node) {
                nodesNames.push(node.nodeName);
            });

            expect(['#text'].toString().toLowerCase()).to.be.equal(nodesNames.toString().toLowerCase());
        });
        describe('If selected element is UL or LI or content in LI', function () {

        });
    });
    afterEach(removeStuff);
});