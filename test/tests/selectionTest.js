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
        editor.setEditorValue('<p>test<span>1</span></p>>');

        var sel = editor.win.getSelection(),
            range = editor.doc.createRange();

        range.selectNodeContents(editor.editor.firstChild.lastChild);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        expect(editor.selection.cursorInTheEdge(false)).to.equal(true);
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