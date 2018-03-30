describe('Jodit Editor Tests', function() {
    describe('Constructor', function() {
        it('Constructor Jodit must be in global scope', function() {
            expect(window.Jodit).to.be.a('function');
        });
        describe('First argument', function() {
            describe('String #id', function() {
                it('Should be valid selector', function() {
                    var area = appendTestArea('editor');

                    var editor = new Jodit('#editor');
                    expect(editor.element).to.equal(area);
                    editor.destruct();
                });
            });
            describe('Undefined,null,false,bad seelctor,function,number, text node', function() {
                it('Should be not valid selector', function() {
                    expect(function () {
                        new Jodit(0)
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit()
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit(null)
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit(false)
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit('.salomon')
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit('>asdsad.salomon')
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit(function () {})
                    }).to.throw(Error);

                    expect(function () {
                        new Jodit(233)
                    }).to.throw(Error);

                    var elm = document.createTextNode('stop');
                    expect(function () {
                        new Jodit(elm)
                    }).to.throw(Error);
                });
            });
            describe('HTMLTextAreaElement', function() {
                it('Should be instance of HTMLElement', function() {
                    var area = appendTestArea('editor2');

                    var editor2 = new Jodit(area);
                    expect(editor2.element).to.equal(area);
                    editor2.destruct();
                });
            });
            describe('HTMLDivElement', function() {
                it('Should be instance of HTMLElement', function() {
                    var div = document.createElement('div');
                    div.innerHTML = '<h1>Test</h1>';
                    document.body.appendChild(div);
                    var editor3 = new Jodit(div);

                    expect(editor3.element).to.equal(div);
                    expect('<h1>Test</h1>').to.equal(editor3.getEditorValue());

                    editor3.destruct();
                    document.body.removeChild(div);
                });
            });
            describe('Found element', function() {
                it('Should be instance of HTMLElement', function() {
                    var div = document.createElement('div');
                    div.innerHTML = '<h1>Test</h1>';
                    div.setAttribute('id', 'test2222')
                    document.body.appendChild(div);

                    var found = document.getElementById('test2222');

                    var editor3 = new Jodit(found);

                    expect(editor3.element).to.equal(found);
                    expect('<h1>Test</h1>').to.equal(editor3.getEditorValue());
                    editor3.destruct();

                    document.body.removeChild(div);
                });
            });
        });

        it('Editor should replace and hide source textarea', function() {
            var area = appendTestArea();

            var editor = new Jodit(area);
            expect(area.style.display).to.equal('none');

            if (!editor.options.iframe) {
                expect(editor.editor).to.equal(document.querySelector('.jodit_wysiwyg'));
            } else {
                expect(editor.editor).to.equal(editor.editorDocument.body);
            }
        });
        describe('Options', function () {
            it('Options should be inherited from the default values', function() {
                var area = appendTestArea();
                var editor = new Jodit(area, {
                    zIndex: 1986
                });
                expect(editor.options.zIndex).to.equal(1986);
                expect(editor.options.spellcheck).to.equal(true);
            });
            describe('Set nested array', function () {
                it('Should create editor with merged default array and set array', function() {
                    var area = appendTestArea();
                    Jodit.defaultOptions.someArray = {
                        data: [1, 2 ,3, 4]
                    };
                    var editor = new Jodit(area, {
                        someArray: {
                            data: [5 ,6 ,7]
                        }
                    });

                    expect(editor.options.someArray.data.toString()).to.equal('5,6,7,4');
                });
                describe('Set nested array like Jodit.Array', function () {
                    it('Should create editor with set array', function() {
                        var area = appendTestArea();
                        Jodit.defaultOptions.someArray = {
                            data: [1, 2 ,3, 4]
                        };
                        var editor = new Jodit(area, {
                            someArray: {
                                data: Jodit.Array([5 ,6 ,7])
                            }
                        });

                        expect(editor.options.someArray.data.toString()).to.equal('5,6,7');
                    });
                });
            });
            describe('Set nested object', function () {
                it('Should create editor with merged default object and set object', function() {
                    var area = appendTestArea();
                    Jodit.defaultOptions.someObject = {
                        data: {
                            left: 10,
                            right: 20
                        }
                    };
                    var editor = new Jodit(area, {
                        someObject: {
                            data: {
                                top: 10,
                                right: 10
                            }
                        }
                    });

                    expect(JSON.stringify(editor.options.someObject.data)).to.equal('{"left":10,"right":10,"top":10}');
                });
                describe('Set nested object like Jodit.Object', function () {
                    it('Should create editor with set object', function() {
                        var area = appendTestArea();
                        Jodit.defaultOptions.someObject = {
                            data: {
                                left: 10,
                                right: 20
                            }
                        };
                        var editor = new Jodit(area, {
                            someObject: {
                                data: Jodit.Object({
                                    top: 10,
                                    right: 10
                                })
                            }
                        });

                        expect(JSON.stringify(editor.options.someObject.data)).to.equal('{"top":10,"right":10}');
                    });
                });
            });
        });

        describe('Sizes', function () {
            describe('Set fixed height', function () {
                it('Should set editor height by option', function () {
                    var area = appendTestArea();
                    var editor = new Jodit(area, {
                        height: 300
                    });
                    editor.setEditorValue('<p>test</p>'.repeat(100));
                    expect(editor.container.offsetHeight).to.be.below(1000);
                });
                it('Should set editor height by option for iframe', function () {
                    var editor = new Jodit(appendTestArea(), {
                        height: 300,
                        iframe: true
                    });
                    editor.setEditorValue('<p>test</p>'.repeat(100));
                    expect(editor.container.offsetHeight).to.be.below(1000);
                });
                it('Should not change size by content after window was resized', function () {
                    var editor = new Jodit(appendTestArea(), {
                        height: 300
                    });
                    editor.setEditorValue('<p>test</p>'.repeat(20))
                    expect(editor.container.offsetHeight).to.be.equal(300);

                    simulateEvent('resize', 0, window);
                    expect(editor.container.offsetHeight).to.be.equal(300);
                });



                describe('Fullsize mode', function () {
                    it('Should set heights of workplace to 100% - toolbar\'s height', function () {
                        var editor = new Jodit(appendTestArea(), {
                            fullsize: true
                        });

                        expect(editor.workplace.offsetHeight).to.be.above(300);

                    });
                    it('Should restore size after fullsized mode', function () {
                        var editor = new Jodit(appendTestArea(), {
                            height: 300
                        });
                        editor.setEditorValue('<p>test</p>'.repeat(20))
                        expect(editor.container.offsetHeight).to.be.equal(300);

                        editor.toggleFullSize(true);
                        expect(editor.container.offsetHeight).to.be.above(300);

                        editor.toggleFullSize(false);
                        expect(editor.container.offsetHeight).to.be.equal(300);
                        expect(editor.container.offsetWidth).to.be.above(300);
                    });

                    it('Should hide resizer', function () {
                        var editor = new Jodit(appendTestArea(), {
                            height: 300,
                            iframe: true
                        });
                        var handle = editor.container.querySelector('.jodit_editor_resize');

                        expect(handle).to.be.not.equal(null);
                        editor.toggleFullSize(true);
                        expect(editor.ownerWindow.getComputedStyle(handle).display).to.be.equal('none');
                    });
                    it('Should change the icon in toolbar', function () {
                        var editor = new Jodit(appendTestArea());
                        var button = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-fullsize');
                        expect(button).to.be.not.equal(null);

                        expect(button.querySelector('svg')).to.be.not.equal(null);

                        var old_icon = button.querySelector('svg').innerHTML;

                        editor.toggleFullSize(true);
                        expect(button.querySelector('svg').innerHTML).to.be.not.equal(old_icon);

                        editor.toggleFullSize(false);
                        expect(button.querySelector('svg').innerHTML).to.be.equal(old_icon);
                    });
                    describe('For text icons', function () {
                        it('Should change the text in toolbar', function () {
                            var editor = new Jodit(appendTestArea(), {
                                "textIcons": true
                            });
                            var button = editor.container.querySelector('.jodit_toolbar_btn.jodit_toolbar_btn-fullsize');
                            expect(button).to.be.not.equal(null);
                            expect(button.querySelector('svg')).to.be.equal(null);

                            var old_icon = button.innerText;

                            editor.toggleFullSize(true);
                            expect(button.innerText).to.be.not.equal(old_icon);

                            editor.toggleFullSize(false);
                            expect(button.innerText).to.be.equal(old_icon);
                        });
                    });
                });
                it('Should add resize handle', function () {
                    var area = appendTestArea();
                    var editor = new Jodit(area, {
                        height: 300,
                        iframe: true
                    });
                    expect(editor.container.querySelectorAll('.jodit_editor_resize').length).to.be.equal(1);
                });
                it('Should not change size by content after window was resized', function () {
                    var area = appendTestArea();
                    var editor = new Jodit(area, {
                        height: 300
                    });
                    editor.setEditorValue('<p>test</p>'.repeat(20))
                    expect(editor.container.offsetHeight).to.be.equal(300);

                    simulateEvent('resize', 0, window);
                    expect(editor.container.offsetHeight).to.be.equal(300);
                });
                describe('Resize handle', function () {
                    it('Should resize editor', function () {
                        var area = appendTestArea();
                        var editor = new Jodit(area, {
                            height: 300,
                            width: 400,
                            allowResizeX: true,
                            allowResizeY: true,
                        });

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

                        expect(editor.container.offsetHeight).to.be.equal(400);
                        expect(editor.container.offsetWidth).to.be.equal(500);
                    });
                    describe('Disable X resizing', function () {
                        it('Should resize editor only by vertical', function () {
                            var area = appendTestArea();
                            var editor = new Jodit(area, {
                                height: 300,
                                width: 400,
                                allowResizeX: false,
                                allowResizeY: true,
                            });

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

                            expect(editor.container.offsetHeight).to.be.equal(400);
                            expect(editor.container.offsetWidth).to.be.equal(400);
                        });
                    });
                });
            });
            describe('Autosize', function () {
               it('Should set editor height by content', function () {
                    var area = appendTestArea();
                    var editor = new Jodit(area);
                    editor.setEditorValue('<p>test</p>'.repeat(100));
                    expect(editor.container.offsetHeight).to.be.above(1000);
                });
                it('Should set editor height by content in iframe mode', function () {
                    var area = appendTestArea();
                    var editor = new Jodit(area, {
                        iframe: true
                    });
                    editor.setEditorValue('<p>test</p>'.repeat(100));
                    expect(editor.container.offsetHeight).to.be.above(1000);
                });
            });
        });
        describe('Check preset', function () {
            it('Should set option by preset', function () {
                var editor2 = new Jodit(appendTestArea());
                expect(editor2.options.inline).to.be.false;
                expect(editor2.options.toolbar).to.be.true;
                expect(editor2.options.readonly).to.be.false;

                var editor = new Jodit(appendTestArea(), {
                    preset: 'inline'
                });
                expect(editor.options.inline).to.be.true;
                expect(editor.options.toolbar).to.be.false;

                Jodit.defaultOptions.presets.custom = {readonly: true}
                var editor3 = new Jodit(appendTestArea(), {
                    preset: 'custom'
                });
                expect(editor3.options.readonly).to.be.true;

                var editor4 = new Jodit(appendTestArea(), {
                    preset: 'inline',
                    inline: false
                });
                expect(editor4.options.inline).to.be.false;
                expect(editor4.options.toolbar).to.be.false;
            })
        });
    });
    describe('Editors stack', function() {
        it('Jodit.instances should contain all instances of Jodit', function() {
            var editor = new Jodit(appendTestArea('textarea_editor'));
            expect(Jodit.instances.textarea_editor).to.equal(editor);
        });
        it('Jodit.instances should not contain editor after destruct', function() {
            var editor = new Jodit(appendTestArea('textarea_editor'));
            editor.destruct();
            expect(Jodit.instances.textarea_editor).to.be.an('undefined')
        });
    });
    describe('Destructor', function() {
        it('After call "destruct" method, should return source textarea and remove Editor\'s stuf', function() {
            var area = appendTestArea();
            area.style.display = 'block';

            var editor = new Jodit(area);
            expect(area.style.display).to.equal('none');
            expect(editor.container.parentNode).to.equal(area.parentNode    );
            editor.destruct();

            expect(area.style.display).to.equal('block');
            expect(editor.editor).to.equal(undefined);

        });
        it('After call "destruct" method, should return source textarea and remove all Editor\'s stuf', function() {
            var box = document.createElement('div'),
                area = document.createElement('textarea');

            box.appendChild(area);
            document.body.appendChild(box);

            var editor = new Jodit(area);
            editor.destruct();

            expect(box.innerHTML).to.equal('<textarea></textarea>');
            box.parentNode.removeChild(box);
        });
    });
    describe('Set/Get', function () {

        describe('Set value', function () {
            it('Set element value', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setElementValue('Test');
                expect(area.value).to.be.equal('Test');
            });
            it('Set value by magic property', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.value = 'Test';
                expect(area.value).to.be.equal('Test');
                expect(editor.getEditorValue()).to.be.equal('Test');
                expect(editor.value).to.be.equal('Test');
            });
        });
        it('Set wrong element value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.setElementValue(document.createTextNode('Test'));
            }).to.throw(/value must be/);
        });
        it('Set editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<div>Test</div>');
            expect(editor.editor.innerHTML).to.be.equal('<div>Test</div>');
        });
        it('Set no string editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.setEditorValue(document.createElement('div'));
            }).to.throw(/value must be/);
        });
        it('Set wrong editor value', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<div>Test<div>');
            expect(editor.editor.innerHTML).to.be.equal('<div>Test<div></div></div>');
        });
        describe('Placeholder', function () {
            describe('After init on empty textarea', function () {
                it('Should show placeholder', function () {
                    var area = appendTestArea();
                    area.value = '';
                    var editor = new Jodit(area);
                    expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'block').to.be.equal(true);
                });
            });
            describe('After init on not empty textarea', function () {
                it('Should hide placeholder', function () {
                    var area = appendTestArea();
                    area.value = '111';
                    var editor = new Jodit(area);
                    expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
                });
            });
        });
        it('Show placeholder', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            editor.setEditorValue('');

            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'block').to.be.equal(true);

            editor.selection.insertNode(Jodit.modules.Dom.create('text', 'test', editor.editorDocument));
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.display === 'none').to.be.equal(true);
        });
        it("Placeholder's fontsize", function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            editor.editor.style.fontSize = '12px';
            simulateEvent('keydown', Jodit.KEY_BACKSPACE, editor.editor);
            expect(editor.container.querySelectorAll('.jodit_placeholder').length && editor.container.querySelector('.jodit_placeholder').style.fontSize === '12px').to.be.equal(true);
        });
        describe('Synchronization', function () {
            it('Check synchronization between element and editor', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setEditorValue('<div>Test<div>');

                var sel = window.getSelection(),
                    range = document.createRange();

                range.selectNodeContents(editor.editor.firstChild);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);

                expect(editor.getElementValue()).to.be.equal('<div>Test<div></div></div>');
            });
            it('Check synchronization between editor and element', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                area.value = '<div>Test</div>';
                editor.setElementValue();
                expect(editor.getEditorValue()).to.be.equal('<div>Test</div>');
            });
            it('Check synchronization between editor and element with wrong html', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setElementValue('<div>Test</div>');
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());
            });
            it('Check synchronization between editor and element when was pressed button', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);
                editor.setElementValue('<div>Test</div>');
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());

                var sel = window.getSelection(),
                    range = document.createRange();

                range.selectNodeContents(editor.editor.firstChild);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);


                simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
                expect(editor.getEditorValue()).to.be.equal(editor.getElementValue());
            });
        });
        describe('Save selection stuf', function () {
            describe('Set false in getEditorValue method', function () {
                it('Should return HTML with selections markers', function () {
                    var editor = new Jodit(appendTestArea());
                    editor.value = 'test';
                    editor.selection.setCursorAfter(editor.editor.firstChild);
                    editor.selection.save(); // add selection markers
                    expect(/<span[^>]+id="jodit_selection_marker_[^>]+><\/span>/.test(editor.getEditorValue(false))).to.be.true;
                    expect(/<span[^>]+id="jodit_selection_marker_[^>]+><\/span>/.test(editor.getEditorValue(true))).to.be.false;
                });
            });
        });

    });
    describe('Selection module', function () {
        it('Current selection element should be inside editor', function () {
            var editor = new Jodit(appendTestArea()),
                div = document.createElement('div');
            document.body.appendChild(div);
            div.innerHTML = 'jingl';

            var sel = window.getSelection(),
                range = document.createRange();

            range.selectNodeContents(div);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);

            expect(editor.selection.current()).to.be.equal(false);
            div.parentNode.removeChild(div)
        });
        it('Current selection element', function () {
            var editor = new Jodit(appendTestArea()),
                div = editor.editorDocument.createElement('div'),
                text = editor.editorDocument.createTextNode('jingl');


            editor.setEditorValue('');
            div.appendChild(text);
            editor.selection.insertNode(div);
            editor.selection.setCursorIn(text);

            expect(editor.selection.current()).to.be.equal(text);
        });
        it('Insert simple text node in editor', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.selection.insertNode(editor.editorDocument.createTextNode('Test'));
            expect(editor.getEditorValue()).to.be.equal('Test');
            editor.destruct();
        });
        it('Insert 3 divs', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            function insert(digit) {
                var div = editor.editorDocument.createElement('div');
                div.innerHTML = digit;
                editor.selection.insertNode(div);
            }

            insert(1);
            insert(2);
            insert(3);

            expect(editor.getEditorValue()).to.be.equal('<div>1</div><div>2</div><div>3</div>');
            editor.destruct();
        });
        it('Insert wrong data', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);

            expect(function () {
                editor.selection.insertNode()
            }).to.throw(/node most be/);

            expect(function () {
                editor.selection.insertNode('Text')
            }).to.throw(/node most be/);

            expect(function () {
                editor.selection.insertNode(null)
            }).to.throw(/node most be/);

            editor.destruct();
        });
        it('Select all and delete. Check plugin "backspace"', function () {
            var area = appendTestArea();
            var editor = new Jodit(area);
            editor.setEditorValue('<p>asdasd</p><p>asdasd</p><p>asd</p>');
            editor.execCommand('selectall');
            editor.execCommand('delete');
            expect(editor.getEditorValue()).to.be.equal('');
            editor.destruct();
        });
        describe('Cursor position', function () {
            it('Should set cursor after node', function () {
                var area = appendTestArea();
                var editor = new Jodit(area, {
                    cleanHTML: {
                        removeEmptyElements: false,
                    }
                });
                var spans = [editor.editorDocument.createElement('span'), editor.editorDocument.createElement('span'), editor.editorDocument.createElement('span')];

                editor.selection.insertNode(spans[0]);
                editor.selection.insertNode(spans[1]);
                editor.selection.insertNode(spans[2]);

                editor.selection.setCursorAfter(spans[1]);
                editor.selection.insertNode(editor.editorDocument.createElement('i'));


                expect(editor.getEditorValue()).to.be.equal('<span></span><span></span><i></i><span></span>');
            });
            it('Set cursor in non placed element', function () {
                var area = appendTestArea();
                var editor = new Jodit(area);

                expect(function () {
                    var div = editor.editorDocument.createElement('div')
                    editor.selection.setCursorIn(div);
                }).to.Throw(/in editor/)
            });
        });
    });
    afterEach(removeStuff);
});