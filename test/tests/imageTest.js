describe('Test image', function() {
    it('Double click on image should open image properties dialog', function () {
        var editor = new Jodit(appendTestArea());

        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')
        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
        var dialogs = document.querySelectorAll('.jodit.jodit_dialog_box.active');

        expect(dialogs.length).to.equal(1);
    });
    it('Double click on image then openOnDblClick=false should select image', function () {
        var editor = new Jodit(appendTestArea(), {
            image: { openOnDblClick: false }
        });
        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')
        simulateEvent('dblclick', 0, editor.editor.querySelector('img'));
        var dialogs = document.querySelectorAll('.jodit.jodit_dialog_box.active');

        expect(dialogs.length).to.equal(0);

        expect(editor.selection.current().tagName).to.equal('IMG');
    });
    it('One click on image should show resizer', function () {

        var editor = new Jodit(appendTestArea());
        editor.setEditorValue('<img src="https://xdsoft.net/jodit/images/artio.jpg"/>')

        var img = editor.editor.querySelector('img');

        simulateEvent('mousedown', 0, img);

        var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');

        expect(resizer.style.display === 'block').to.equal(true);
    });
    it('One click inside table cell should show resizer', function () {
        var editor = new Jodit(appendTestArea());
        editor.setEditorValue('<table><tr><td>1</td></tr></table>')

        var td = editor.editor.querySelector('td');

        simulateEvent('mousedown', 0, td);

        var resizer = document.querySelector('.jodit_resizer[data-editor_id=' + editor.id + ']');

        expect(resizer.style.display === 'block').to.equal(true);
    });

    describe('Popup box', function () {
        describe('In relative object', function () {
            it('should be under image', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);
                var editor = new Jodit('#text_area0', {
                    observer: {
                        timeout: 0
                    }
                });
                window.scrollTo(0, offset(div).top);
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

                var popup = document.querySelector('.jodit_toolbar_popup-inline[data-editor_id=text_area0]');

                expect(popup.parentNode.parentNode !== null).to.equal(true);

                var positionPopup = offset(popup.parentNode);
                var positionImg = offset(editor.editor.querySelector('img'));


                expect(Math.abs(positionPopup.left - (positionImg.left + positionImg.width/2)) < 20).to.be.true;
                expect(Math.abs(positionPopup.top - (positionImg.top + positionImg.height)) < 20).to.be.true;


                editor.destruct();
                document.body.removeChild(div);
            });
        });
    });
    describe('Resize box', function () {
        describe('In relative object', function () {
            it('should be in front of image', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area0"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);
                var editor = new Jodit('#text_area0');
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

                var resizer = document.querySelector('.jodit_resizer[data-editor_id=text_area0]');
                expect(resizer.style.display === 'block').to.equal(true);

                var positionResizer = offset(resizer);
                var positionImg = offset(editor.editor.querySelector('img'));

                expect(Math.abs(positionResizer.left - positionImg.left) < 2).to.be.true;
                expect(Math.abs(positionResizer.top - positionImg.top) < 2).to.be.true;

                editor.destruct();
                document.body.removeChild(div);
            });
        });
        describe('After resize - popup', function () {
            it('should be hidden and after this should be shown', function () {
                var div = document.createElement('div');
                div.innerHTML = '<div style="width:800px; margin:auto; border:1px solid red;">\n' +
                    '        wrong image selection\n' +
                    '        <div style="position:relative;text-align: left">\n' +
                    '            <textarea id="text_area1"> <img src="https://xdsoft.net/jodit/build/images/artio.jpg" style="border:1px solid red;width:100px;height:100px;"/></textarea>\n' +
                    '        </div>\n' +
                    '    </div>';

                document.body.appendChild(div);
                var editor = new Jodit('#text_area1');
                simulateEvent('mousedown', 0, editor.editor.querySelector('img'));

                var popup = document.querySelector('.jodit_toolbar_popup-inline[data-editor_id=text_area1]');

                expect(popup.parentNode.parentNode !== null).to.equal(true);

                var resizer = document.querySelector('.jodit_resizer[data-editor_id=text_area1]');
                expect(resizer.style.display === 'block').to.equal(true);

                var positionResizer = offset(resizer);
                var positionImg = offset(editor.editor.querySelector('img'));

                simulateEvent('mousedown', 0, resizer.getElementsByTagName('i')[0]);
                simulateEvent('mousemove', 0, editor.ownerWindow, function (data) {
                    data.clientX = positionResizer.left - 10;
                    data.clientY = positionResizer.top - 10;
                });

                expect(popup.parentNode.parentNode).to.be.equal(null);
                simulateEvent('mouseup', 0, editor.ownerWindow, function (data) {
                    data.clientX = positionResizer.left - 10;
                    data.clientY = positionResizer.top - 10;
                });
                expect(popup.parentNode.parentNode).to.be.not.equal(null);

                editor.destruct();
                document.body.removeChild(div);
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