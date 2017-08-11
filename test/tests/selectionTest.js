describe('Selection Module functinal Tests', function() {
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

            var mirror = editor.querySelector('textarea.jodit_source_mirror');

            expect(editor.value).to.equal('<p>test</p>');
            expect(editor.selectionStart).to.equal(4);
            expect(editor.selectionEnd).to.equal(4);
        });
        it('Should restore collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false,
                defaultMode: Jodit.MODE_SOURCE
            });
            editor.setEditorValue('<p>test</p>')


            var mirror = editor.querySelector('textarea.jodit_source_mirror');
            mirror.setSelectionRange(5, 5);

            editor.setMode(Jodit.MODE_WYSIWYG);
            editor.selection.insertNode(editor.doc.createTextNode(' a '));

            expect(editor.value).to.equal('<p>tes a t</p>');;
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

            var mirror = editor.querySelector('textarea.jodit_source_mirror');

            expect(editor.value).to.equal('<p>test</p>');
            expect(editor.selectionStart).to.equal(3);
            expect(editor.selectionEnd).to.equal(5);
        });
        it('Should restore non collapsed selection when user change mode - from TEXTAREA to WYSIWYG', function () {
            var editor = new Jodit('#selection_tested_area', {
                useAceEditor: false,
                defaultMode: Jodit.MODE_SOURCE
            });
            editor.setEditorValue('<p>test</p>')


            var mirror = editor.querySelector('textarea.jodit_source_mirror');
            mirror.setSelectionRange(2, 6);

            editor.setMode(Jodit.MODE_WYSIWYG);
            expect(editor.selection.isCollapsed()).to.equal(false);
            editor.selection.insertNode(editor.doc.createTextNode(' a '));
            expect(editor.value).to.equal('<p>t a t</p>');
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