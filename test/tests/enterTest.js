describe('Enter behavior Jodit Editor Tests', function() {
    describe('Backspace key', function () {
        it('Should return in first <p> after pressing enter', function () {
            var editor = new Jodit(appendTestArea())

            editor.setEditorValue('test');

            var range = editor.editorDocument.createRange();


            // set cursor in start of element
            range.selectNodeContents(editor.editor.firstChild);
            range.collapse(false);
            editor.editorWindow.getSelection().removeAllRanges();
            editor.editorWindow.getSelection().addRange(range);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);
            simulateEvent('keydown',    Jodit.KEY_BACKSPACE, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' 2 '));

            expect(editor.getEditorValue()).to.be.equal('<p>test 2 </p>');
        });
        it('Should remove empty tag and set cursor in previous element', function () {
            var editor = new Jodit(appendTestArea())

            editor.setEditorValue('<table><tbody>' +
                '<tr><td></td></tr>' +
                '</tbody></table><p><br></p>');

            var range = editor.editorDocument.createRange();


            // set cursor in start of element

            range.selectNodeContents(editor.editor.lastChild);
            range.collapse(true);
            editor.editorWindow.getSelection().removeAllRanges();
            editor.editorWindow.getSelection().addRange(range);



            simulateEvent('keydown',    Jodit.KEY_BACKSPACE, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' 2 '));

            expect(editor.getEditorValue()).to.be.equal('<table><tbody>' +
                '<tr><td> 2 </td></tr>' +
                '</tbody></table>');
        })
    });
    describe('Enter key', function () {
        it('If Enter was pressed in not wrapped text in the end, it text should be wrap in paragraph and cursor should be in next new paragraph', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild, 9);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>Some text</p><p> a </p>');
        })
        it('If Enter was pressed in the end of SPAN inside P it should clone SPAN copy it in new created P and move cursor inside new SPAN', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<p>Some <span>text</span></p>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.selectNodeContents(editor.editor.firstChild.lastChild);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>Some <span>text</span></p><p> a </p>');
        })
        it('If Enter was pressed inside text without wrapper and near were some another elements', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('as<span style="color: rgb(147, 101, 184);">da</span>s');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            // set focus in the span
            range.setStart(editor.editor.firstChild.nextSibling.firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>as<span style="color: rgb(147, 101, 184);">d</span></p><p><span style="color: rgb(147, 101, 184);"> a a</span>s</p>');
        })
        it('If Enter was pressed inside H1-6 that should be spliced on two', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<h1>Some text</h1>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 5);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<h1>Some </h1><h1> a text</h1>');

        })
        it('If Enter was pressed inside first empty LI and it was alone LI in UL it should be remove LI and UL and cursor must b inside new P', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li></li></ul>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p> a </p>');

        })
        it('If Enter was pressed inside empty LI it should be removed and cursor must be after UL|OL', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li>Some text</li><li> </li></ul>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.lastChild.firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<ul><li>Some text</li></ul><p> a </p>');

        })

        it('If Enter was pressed inside empty middle LI it should split parent UL, remove LI, insert new P in the middle of two new Ul and insert cursor inside this', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li>Test</li><li></li><li>Some text</li></ul>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.childNodes[1], 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<ul><li>Test</li></ul><p> a </p><ul><li>Some text</li></ul>');

        })

        it('If Enter was pressed inside start of first(not empty) LI it should add empty LI and cursor should not move', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li>Some text</li></ul>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.firstChild.firstChild, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<ul><li></li><li> a Some text</li></ul>');
        })

        it('If Enter was pressed inside start of first empty LI it should remove this LI, and insert new P element before parent UL, cursor should move to inside it', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li></li><li>Some text</li></ul>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p> a </p><ul><li>Some text</li></ul>');
        })

        it('If Enter was pressed inside H1-6 cursor should be move in new paragraph below', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<h1>Some text</h1>');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 9);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<h1>Some text</h1><p> a </p>');

        })

        it('If Enter was pressed in not wrapped text in the start, it text should be wrap in paragraph and cursor should be in that, and before should be empty new paragraph', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p></p><p> a Some text</p>');
        })
        it('If Enter was pressed inside empty editor, should be added 2 paragraph and cursor must be in second', function () {
            var editor = new Jodit(appendTestArea())


            editor.setEditorValue(''); // empty
            editor.selection.focus();



            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))


            expect(editor.getEditorValue()).to.be.equal('<p></p><p> a </p>');
        })
        it('If Enter was pressed in no wrapped text, it text should be wrap in paragraph and spliced on two parts', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.editorWindow.getSelection(),
                range = editor.editorDocument.createRange();

            range.setStart(editor.editor.firstChild, 5);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>Some </p><p> a text</p>');
        })
        it('Content editor after pressing the Enter key must contain the specified tag settings', function () {
            var editor = new Jodit(appendTestArea())
            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            expect(editor.getEditorValue()).to.be.equal('<p></p><p></p><p></p><p></p>');
        })
        it('Content editor after pressing the Enter key must contain the specified tag settings and afte this cursor must be inside that tag', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('');
            editor.selection.focus();

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(editor.editorDocument.createTextNode('test'));

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(editor.editorDocument.createTextNode('test2'));

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(editor.editorDocument.createTextNode('test3'));

            expect('<p></p><p>test</p><p>test2</p><p>test3</p>').to.be.equal(editor.getEditorValue());
        })
        it('Split paragraph', function () {
            var editor = new Jodit(appendTestArea())

            var p = editor.editorDocument.createElement('p'),
                node = editor.editorDocument.createTextNode('Split paragraph');

            p.appendChild(node);

            editor.selection.insertNode(p);

            var range = editor.editorDocument.createRange();

            range.setStart(node, 6);
            editor.editorWindow.getSelection().removeAllRanges();
            editor.editorWindow.getSelection().addRange(range);

            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.editorDocument.createTextNode('a '));

            expect(editor.getEditorValue()).to.be.equal('<p>Split </p><p>a paragraph</p>');
        })
        it('If cursor in the right edge of paragraph after enter cursor should be in another new paragraph', function () {
            var editor = new Jodit(appendTestArea())

            var p = editor.editorDocument.createElement('p'),
                p2 = editor.editorDocument.createElement('p');


            p.innerHTML = 'Split paragraph';
            p2.innerHTML = 'Test';
            editor.selection.insertNode(p);
            editor.selection.insertNode(p2);

            // set cursor in end of element
            editor.selection.setCursorIn(p, false);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(editor.editorDocument.createTextNode('a '));


            expect(editor.getEditorValue()).to.be.equal('<p>Split paragraph</p><p>a </p><p>Test</p>');
        })

        it('If cursor in the left edge of paragraph after enter cursor should be in another new paragraph before old place', function () {
            var editor = new Jodit(appendTestArea())

            var p = editor.editorDocument.createElement('p'),
                p2 = editor.editorDocument.createElement('p');


            p.innerHTML = 'Split paragraph';
            p2.innerHTML = 'Test';
            editor.selection.insertNode(p);
            editor.selection.insertNode(p2);


            var range = editor.editorDocument.createRange();


            // set cursor in start of element
            range.setStart(p.firstChild, 0);
            range.collapse(true);
            editor.editorWindow.getSelection().removeAllRanges();
            editor.editorWindow.getSelection().addRange(range);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(editor.editorDocument.createTextNode('a '));


            expect(editor.getEditorValue()).to.be.equal('<p></p><p>a Split paragraph</p><p>Test</p>');
        })
        describe('with table', function () {
            it('If cursor in TD tag', function () {
                var editor = new Jodit(appendTestArea())

                editor.setEditorValue('<table><tr><td>text</td></tr></table>');

                var range = editor.editorDocument.createRange();


                // set cursor in start of element
                range.selectNodeContents(editor.editor.querySelector('td'));
                range.collapse(true);
                editor.editorWindow.getSelection().removeAllRanges();
                editor.editorWindow.getSelection().addRange(range);

                editor.selection.insertNode(editor.editorDocument.createTextNode('split '));

                simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);

                expect(editor.getEditorValue()).to.be.equal('<table><tbody><tr><td>split <br>text</td></tr></tbody></table>');
            })
            it('If cursor in right side of table', function () {
                var editor = new Jodit(appendTestArea())

                editor.setEditorValue('<table><tr><td>test</td></tr></table>');

                var range = editor.editorDocument.createRange();


                // set cursor in start of element
                range.setEndAfter(editor.editor.querySelector('table'));
                range.collapse(false);
                editor.editorWindow.getSelection().removeAllRanges();
                editor.editorWindow.getSelection().addRange(range);

                simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);

                editor.selection.insertNode(editor.editorDocument.createTextNode('text'), false)

                expect(editor.getEditorValue()).to.be.equal('<table><tbody><tr><td>test</td></tr></tbody></table><p>text</p>');
            })
        });
        describe('with SHIFT button', function () {
            it('should insert <br> tag and move cursor after it.', function () {
                var editor = new Jodit(appendTestArea())

                editor.setEditorValue('test');

                var range = editor.editorDocument.createRange();


                // set cursor in start of element
                range.setStart(editor.editor.firstChild, 2);
                range.collapse(true);
                editor.editorWindow.getSelection().removeAllRanges();
                editor.editorWindow.getSelection().addRange(range);

                simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor, function (options) {
                    options.shiftKey = true;
                });

                editor.selection.insertNode(editor.editorDocument.createTextNode('split '));

                expect(editor.getEditorValue()).to.be.equal('<p>te<br>split st</p>');

                simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor, function (options) {
                    options.shiftKey = true;
                });

                expect(editor.getEditorValue()).to.be.equal('<p>te<br>split <br>st</p>');
            })
        });
        describe('In PRE tag', function () {
            it('Should add <br> element', function () {
                var editor = new Jodit(appendTestArea())

                editor.setEditorValue('<pre>test</pre>');

                editor.selection.setCursorIn(editor.editor.querySelector('pre'), false);
                simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);
                editor.selection.insertNode(editor.editorDocument.createTextNode('split'));


                expect('<pre>test<br>split</pre>').to.be.equal(sortAtrtibutes(editor.getEditorValue()));
            });
        });
        describe('In UL tag', function () {
            describe('In LI tag inside table cell', function () {
                it('Should work like usual', function () {
                    var editor = new Jodit(appendTestArea())

                    editor.setEditorValue('<table>' +
                            '<tbody>' +
                                '<tr>' +
                                    '<td>' +
                                        '<ul><li>test</li></ul>' +
                                    '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>');

                    editor.selection.setCursorIn(editor.editor.querySelector('ul>li'), false);
                    simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);
                    editor.selection.insertNode(editor.editorDocument.createTextNode('split'));


                    expect('<table>' +
                        '<tbody>' +
                        '<tr>' +
                        '<td>' +
                        '<ul>' +
                            '<li>test</li>' +
                            '<li>split</li>' +
                        '</ul>' +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>').to.be.equal(sortAtrtibutes(editor.getEditorValue()));
                });
            })
            describe('In last LI tag', function () {
                describe('In tag was only one Image element but cursor was before it', function () {
                    it('Should not add new P element and move image there', function () {
                        var editor = new Jodit(appendTestArea())

                        editor.setEditorValue('<ul>' +
                            '<li>1</li>' +
                            '<li>2</li>' +
                            '<li><img style="width:30px" src="https://xdsoft.net/jodit/images/artio.jpg"></li>' +
                            '</ul>');

                        editor.selection.setCursorBefore(editor.editor.firstChild.lastChild.firstChild);
                        simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);
                        editor.selection.insertNode(editor.editorDocument.createTextNode('split '));


                        expect('<ul>' +
                            '<li>1</li>' +
                            '<li>2</li>' +
                            '<li></li>' +
                            '<li>split <img src="https://xdsoft.net/jodit/images/artio.jpg" style="width:30px"></li>' +
                            '</ul>').to.be.equal(sortAtrtibutes(editor.getEditorValue()));
                    });
                });

            });
        });
    });
    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
        removeStuff();
    });
});