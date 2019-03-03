describe('Test editor size plugin', function () {
    it('should show resize handler in right-bottom corner and allow resize editor by vertical', function () {
        var area = appendTestArea();
        var editor = new Jodit(area, {
            height: 300,
            iframe: true
        });
        expect(editor.container.querySelectorAll('.jodit_editor_resize').length).to.be.equal(1);
    });
    describe('Disable auto-height', function () {
        describe('Resize handle', function () {
            it('Should resize editor', function () {
                var box = getBox();
                box.style.width = 'auto';
                box.style.height = 'auto';

                var editor = new Jodit(appendTestArea(), {
                    height: 300,
                    width: 400,
                    allowResizeX: true,
                    allowResizeY: true,
                });
                expect(editor.container.offsetHeight).to.be.equal(300);

                var handle = editor.container.querySelector('.jodit_editor_resize');

                simulateEvent('mousedown', 0, handle, function (options) {
                    options.clientX = 100;
                    options.clientY = 100;
                });
                simulateEvent('mousemove', 0, window, function (options) {
                    options.clientX = 200;
                    options.clientY = 200;
                });
                simulateEvent('mouseup', 0, window);

                expect(editor.container.offsetHeight).to.be.equal(400);
                expect(editor.container.offsetWidth).to.be.equal(500);
            });
            describe('Disable X resizing', function () {
                it('Should resize editor only by vertical', function () {
                    box.style.width = 'auto';
                    box.style.height = 'auto';

                    var editor = new Jodit(appendTestArea(), {
                        height: 300,
                        width: 400,
                        allowResizeX: false,
                        allowResizeY: true,
                    });

                    var handle = editor.container.querySelector('.jodit_editor_resize');

                    expect(editor.container.offsetHeight).to.be.equal(300);
                    expect(editor.container.offsetWidth).to.be.equal(400);


                    simulateEvent('mousedown', 0, handle, function (options) {
                        options.clientX = 100;
                        options.clientY = 100;
                    });

                    simulateEvent('mousemove', 0, window, function (options) {
                        options.clientX = 200;
                        options.clientY = 200;
                    });
                    simulateEvent('mouseup', 0, window);

                    expect(editor.container.offsetHeight).to.be.equal(400);
                    expect(editor.container.offsetWidth).to.be.equal(400);
                });
            });
        });
        describe('Change box size', function () {
            describe('Auto width mode', function () {
                describe('Change box width', function () {
                    it('should set fixed height but width must be auto', function () {
                        var box = getBox();
                        var editor = new Jodit(appendTestArea(), {
                            height: 300
                        });

                        box.style.width = '400px';

                        var handle = editor.container.querySelector('.jodit_editor_resize');

                        expect(editor.container.offsetHeight).to.be.equal(300);

                        simulateEvent('mousedown', 0, handle, function (options) {
                            options.clientX = 100;
                            options.clientY = 100;
                        });

                        simulateEvent('mousemove', 0, window, function (options) {
                            options.clientX = 200;
                            options.clientY = 200;
                        });

                        simulateEvent('mouseup', 0, window);

                        box.style.width = '600px';

                        expect(editor.container.offsetHeight).to.be.equal(400);
                        expect(editor.container.offsetWidth).to.be.equal(600);
                    });
                });
            });
        });
    });
});
