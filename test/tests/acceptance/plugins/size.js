describe('Test editor size plugin', function () {
    it('should show resize handler in right-bottom corner and allow resize editor by vertical', function () {
        const area = appendTestArea();
        const editor = new Jodit(area, {
            height: 300,
            iframe: true
        });
        expect(editor.container.querySelectorAll('.jodit_editor_resize').length).equals(1);
    });
    describe('Disable auto-height', function () {
        describe('Resize handle', function () {
            it('Should resize editor', function () {
                const box = getBox();
                box.style.width = 'auto';
                box.style.height = 'auto';

                const editor = new Jodit(appendTestArea(), {
                    height: 300,
                    width: 400,
                    allowResizeX: true,
                    allowResizeY: true,
                });
                expect(editor.container.offsetHeight).equals(300);

                const handle = editor.container.querySelector('.jodit_editor_resize');

                simulateEvent('mousedown', 0, handle, function (options) {
                    options.clientX = 100;
                    options.clientY = 100;
                });
                simulateEvent('mousemove', 0, window, function (options) {
                    options.clientX = 200;
                    options.clientY = 200;
                });
                simulateEvent('mouseup', 0, window);

                expect(editor.container.offsetHeight).equals(400);
                expect(editor.container.offsetWidth).equals(500);
            });
            describe('Disable X resizing', function () {
                it('Should resize editor only by vertical', function () {
                    box.style.width = 'auto';
                    box.style.height = 'auto';

                    const editor = new Jodit(appendTestArea(), {
                        height: 300,
                        width: 400,
                        allowResizeX: false,
                        allowResizeY: true,
                    });

                    const handle = editor.container.querySelector('.jodit_editor_resize');

                    expect(editor.container.offsetHeight).equals(300);
                    expect(editor.container.offsetWidth).equals(400);


                    simulateEvent('mousedown', 0, handle, function (options) {
                        options.clientX = 100;
                        options.clientY = 100;
                    });

                    simulateEvent('mousemove', 0, window, function (options) {
                        options.clientX = 200;
                        options.clientY = 200;
                    });
                    simulateEvent('mouseup', 0, window);

                    expect(editor.container.offsetHeight).equals(400);
                    expect(editor.container.offsetWidth).equals(400);
                });
            });
        });
        describe('Change box size', function () {
            describe('Auto width mode', function () {
                describe('Change box width', function () {
                    it('should set fixed height but width must be auto', function () {
                        const box = getBox();
                        const editor = new Jodit(appendTestArea(), {
                            height: 300
                        });

                        box.style.width = '400px';

                        const handle = editor.container.querySelector('.jodit_editor_resize');

                        expect(editor.container.offsetHeight).equals(300);

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

                        expect(editor.container.offsetHeight).equals(400);
                        expect(editor.container.offsetWidth).equals(600);
                    });
                });
            });
        });
    });
});
