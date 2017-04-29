describe('Enter behavior Jodit Editor Tests', function() {
    describe('Enter key', function () {
        it('If Enter was pressed in not wrapped text in the end, it text should be wrap in paragraph and cursor should be in next new paragraph', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 9);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>Some text</p><p> a </p>');
        })
        it('If Enter was pressed inside text without wrapper and near were some another elements', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('as<span style="color: rgb(147, 101, 184);">da</span>s');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            // set focus in the span
            range.setStart(editor.editor.firstChild.nextSibling.firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p>as<span style="color: rgb(147, 101, 184);">d</span></p><p><span style="color: rgb(147, 101, 184);"> a a</span>s</p>');
        })
        it('If Enter was pressed inside H1-6 that should be spliced on two', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<h1>Some text</h1>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 5);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<h1>Some </h1><h1> a text</h1>');

        })
        it('If Enter was pressed inside empty LI it should be removed and cursor must be after UL|OL', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<ul><li>Some text</li><li> </li></ul>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.lastChild.firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<ul><li>Some text</li></ul><p> a </p>');

        })
        it('If Enter was pressed inside H1-6 cursor should be move in new paragraph below', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('<h1>Some text</h1>');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild.firstChild, 9);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<h1>Some text</h1><p> a </p>');

        })

        it('If Enter was pressed in not wrapped text in the start, it text should be wrap in paragraph and cursor should be in that, and before should be empty new paragraph', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p></p><p> a Some text</p>');
        })
        it('If Enter was pressed inside empty editor, should be added 2 paragraph and cursor must be in second', function () {
            var editor = new Jodit(appendTestArea())


            editor.setEditorValue(''); // empty


            editor.editor.focus(),


            simulateEvent('keydown',  Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(editor.doc.createTextNode(' a '))

            expect(editor.getEditorValue()).to.be.equal('<p></p><p> a </p>');
        })
        it('If Enter was pressed in no wrapped text, it text should be wrap in paragraph and spliced on two parts', function () {
            var editor = new Jodit(appendTestArea())
            editor.setEditorValue('Some text');

            var sel = editor.win.getSelection(),
                range = editor.doc.createRange();

            range.setStart(editor.editor.firstChild, 5);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(editor.doc.createTextNode(' a '))

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

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(document.createTextNode('test'));

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(document.createTextNode('test2'));

            simulateEvent('keydown',     Jodit.KEY_ENTER, editor.editor);
            editor.selection.insertNode(document.createTextNode('test3'));

            expect(editor.getEditorValue()).to.be.equal('<p></p><p>test</p><p>test2</p><p>test3</p>');
        })
        it('Split paragraph', function () {
            var editor = new Jodit(appendTestArea())

            var p = document.createElement('p'),
                node = document.createTextNode('Split paragraph');

            p.appendChild(node);

            editor.selection.insertNode(p);

            var range = document.createRange();

            range.setStart(node, 6);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);

            editor.selection.insertNode(document.createTextNode('a '));

            expect(editor.getEditorValue()).to.be.equal('<p>Split </p><p>a paragraph</p>');
        })
        it('If cursor in the right edge of paragraph after enter cursor should be in another new paragraph', function () {
            var editor = new Jodit(appendTestArea())

            var p = document.createElement('p'),
                p2 = document.createElement('p');


            p.innerHTML = 'Split paragraph';
            p2.innerHTML = 'Test';
            editor.selection.insertNode(p);
            editor.selection.insertNode(p2);

            // set cursor in end of element
            editor.selection.setCursorIn(p, false);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(document.createTextNode('a '));


            expect(editor.getEditorValue()).to.be.equal('<p>Split paragraph</p><p>a </p><p>Test</p>');
        })

        it('If cursor in the left edge of paragraph after enter cursor should be in another new paragraph before old place', function () {
            var editor = new Jodit(appendTestArea())

            var p = document.createElement('p'),
                p2 = document.createElement('p');


            p.innerHTML = 'Split paragraph';
            p2.innerHTML = 'Test';
            editor.selection.insertNode(p);
            editor.selection.insertNode(p2);


            var range = document.createRange();


            // set cursor in start of element
            range.setStart(p.firstChild, 0);
            range.collapse(true);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);


            editor.selection.insertNode(document.createTextNode('a '));


            expect(editor.getEditorValue()).to.be.equal('<p></p><p>a Split paragraph</p><p>Test</p>');
        })
        it('If cursor in TD tag', function () {
            var editor = new Jodit(appendTestArea())

            editor.setEditorValue('<table><tr><td>text</td></tr></table>');

            var range = document.createRange();


            // set cursor in start of element
            range.selectNodeContents(editor.editor.querySelector('td'));
            range.collapse(true);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            editor.selection.insertNode(document.createTextNode('split '));

            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);

            expect(editor.getEditorValue()).to.be.equal('<table><tbody><tr><td>split <br>text</td></tr></tbody></table>');
        })
        it('Press packspace after enter', function () {
            var editor = new Jodit(appendTestArea())

            editor.setEditorValue('test');

            var range = document.createRange();


            // set cursor in start of element
            range.selectNodeContents(editor.editor.firstChild);
            range.collapse(false);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);


            simulateEvent('keydown',    Jodit.KEY_ENTER, editor.editor);
            simulateEvent('keydown',    Jodit.KEY_BACKSPACE, editor.editor);

            editor.selection.insertNode(document.createTextNode(' 2 '));

            expect(editor.getEditorValue()).to.be.equal('<p>test 2 </p>');
        })
    });
    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});