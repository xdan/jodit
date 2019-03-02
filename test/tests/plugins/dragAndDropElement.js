describe('Drag and drop element inside Editor', function () {
    ['mousedown|mousemove|mouseup', 'touchstart|touchmove|touchend'].map(function (item) {
        return item.split('|');
    }).forEach(function (events) {
        describe(events[0] + ' and move image inside the editor', function () {
            it('Should ' + events[1] + ' dom element', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<p>1111</p>' +
                    '<p>2222</p>' +
                    '<img style="width: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt="">' +
                    '<p>3333</p>' +
                    '<p>4444</p>';

                    simulateEvent(events[0], 0, editor.editor.getElementsByTagName('img')[0]);

                window.scrollTo(0, 100000);
                var box = offset(editor.editor.querySelectorAll('p')[1]);
                // createPoint(box.left + 15, box.top + 5);

                simulateEvent(events[1], 0, editor.editor, function (options) {
                    options.clientX = box.left + 15;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;
                });

                simulateEvent(events[2], 0, editor.editor, function (options) {
                    options.clientX = box.left + 20;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;
                });

                expect(sortAttributes(editor.value)).to.be.equal(
                    '<p>1111</p>' +
                    '<p>22<img alt="" src="https://xdsoft.net/jodit/build/images/artio.jpg" style="width:100px">22</p>' +
                    '<p>3333</p>' +
                    '<p>4444</p>'
                );
            });
        });
        describe(events[1] + ' image inside anchor', function () {
            it('Should ' + events[1] + ' anchor with image', function () {
                var editor = new Jodit(appendTestArea());
                editor.value = '<p>1111</p>' +
                    '<p>2222</p>' +
                    '<a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""></a>' +
                    '<p>3333</p>' +
                    '<p>4444</p>';

                simulateEvent(events[0], 0, editor.editor.getElementsByTagName('img')[0]);

                var box = Jodit.modules.Helpers.offset(editor.editor.querySelectorAll('p')[1], editor, editor.editorDocument);

                simulateEvent(events[1], 0, editor.editor, function (options) {
                    options.clientX = box.left + 15;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;
                });
                simulateEvent(events[2], 0, editor.editor, function (options) {
                    options.clientX = box.left + 20;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;

                });

                expect(editor.value).to.be.equal('<p>1111</p><p>22<a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""></a>22</p><p>3333</p><p>4444</p>');
            });
        });
        describe('Disable dragging', function () {
            it('Should not move image', function () {
                var editor = new Jodit(appendTestArea(), {
                    draggableTags: [],
                });

                var defaultValue = '<p>1111</p>' +
                    '<p>2222</p>' +
                    '<a href="#test"><img style="width: 100px" src="https://xdsoft.net/jodit/build/images/artio.jpg" alt=""></a>' +
                    '<p>3333</p>' +
                    '<p>4444</p>';

                editor.value = defaultValue;

                simulateEvent(events[0], 0, editor.editor.getElementsByTagName('img')[0]);

                var box = Jodit.modules.Helpers.offset(editor.editor.querySelectorAll('p')[1], editor, editor.editorDocument);

                simulateEvent(events[1], 0, editor.editor, function (options) {
                    options.clientX = box.left + 15;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;
                });
                simulateEvent(events[2], 0, editor.editor, function (options) {
                    options.clientX = box.left + 20;
                    options.clientY = box.top + 5 - document.documentElement.scrollTop;
                });

                expect(editor.value).to.be.equal(defaultValue);
            });
        });
    });

    afterEach(removeStuff);
});
