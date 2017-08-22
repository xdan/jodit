describe('Test image', function() {
    appendTestArea('table_editor_image', true);
    it('Double click on image should open image properties dialog', function () {
        var editor = new Jodit('#table_editor_image');

        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')
        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
        var dialogs = document.querySelectorAll('.jodit.jodit_dialog_box.active');

        expect(dialogs.length).to.equal(1);
    });
    it('Double click on image then openOnDblClick=false should select image', function () {
        var editor = new Jodit('#table_editor_image', {
            image: { openOnDblClick: false }
        });
        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')
        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
        var dialogs = document.querySelectorAll('.jodit.jodit_dialog_box.active');

        expect(dialogs.length).to.equal(0);

        expect(editor.selection.current().tagName).to.equal('IMG');
    });
    it('One click on image should show resizer', function () {
        var editor = new Jodit('#table_editor_image');
        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')

        var img = editor.editor.querySelector('img');

        simulateEvent('mousedown', 0, img);

        var resizer = document.querySelector('.jodit_resizer');

        expect(resizer.style.display === 'block').to.equal(true);
    });
    it('One click inside table cell should show resizer', function () {
        var editor = new Jodit('#table_editor_image');
        editor.setEditorValue('<table><tr><td>1</td></tr></table>')

        var td = editor.editor.querySelector('td');

        simulateEvent('mousedown', 0, td);

        var resizer = document.querySelector('.jodit_resizer');

        expect(resizer.style.display === 'block').to.equal(true);
    });

    after(function() {
        table_editor_image.parentNode.removeChild(table_editor_image);
    });

    afterEach(function () {
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
        table_editor_image.value = '';
    });
});