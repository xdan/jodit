describe('Test mobile mode', function () {
    getBox().style.width = 'auto';

    describe('Toollbar', function () {
        it('Should have different count buttons for different container sizes', function () {
            getBox().style.width = '1000px';
            var editor = new Jodit(appendTestArea(), {
                buttons: [
                    'source',
                    '|',
                    'bold',
                    'strikethrough',
                    'underline',
                    'italic',
                    '|',
                    'ul',
                    'ol',
                    '|',
                    'outdent', 'indent',
                    '|',
                    'font',
                    'fontsize',
                    'brush',
                    'paragraph',
                    '|',
                    'image',
                    'video',
                    'table',
                    'link',
                    '|',
                    'align', 'undo', 'redo',
                    '|',
                    'hr',
                    'eraser',
                    'copyformat',
                    '|',
                    'symbol',
                    'fullsize',
                    'print',
                    'about'
                ]
            });

            expect(27).to.be.below(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '790px';
            simulateEvent('resize', 0, window)

            expect(28).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '690px';
            simulateEvent('resize', 0, window)

            expect(26).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);

            getBox().style.width = '390px';
            simulateEvent('resize', 0, window)

            expect(15).to.be.above(editor.container.querySelectorAll('.jodit_toolbar > li').length);
        });
        describe('If buttons were setted like string', function () {
            it('Should have different count buttons for different container sizes', function () {
                getBox().style.width = '1000px';
                var editor = new Jodit(appendTestArea(), {
                    buttons: 'source,about,print,bold',
                    buttonsMD: 'source,about,print',
                    buttonsSM:  'source,about',
                    buttonsXS: 'source'
                });


                expect(4).to.be.equal(editor.container.querySelectorAll('.jodit_toolbar > li').length);

                getBox().style.width = '790px';
                simulateEvent('resize', 0, window)

                expect(3).to.be.equal(editor.container.querySelectorAll('.jodit_toolbar > li').length);

                getBox().style.width = '690px';
                simulateEvent('resize', 0, window)

                expect(2).to.be.equal(editor.container.querySelectorAll('.jodit_toolbar > li').length);

                getBox().style.width = '390px';
                simulateEvent('resize', 0, window)

                expect(1).to.be.equal(editor.container.querySelectorAll('.jodit_toolbar > li').length);
            });
        });
    });


    afterEach(function () {
        removeStuff();
        var i, keys = Object.keys(Jodit.instances);
        for (i = 0; i < keys.length; i += 1) {
            Jodit.instances[keys[i]].destruct();
        }
    });
});