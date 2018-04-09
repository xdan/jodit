describe('Test uploader module', function () {
    describe('Drop file', function () {
        describe('Drop Image like base64', function () {
            it('Should insert image with SRC in base64', function (done) {
                var file = new FileImage(),
                    editor = new Jodit(appendTestArea(), {
                        uploader: {
                            insertImageAsBase64URI: true
                        },
                        events: {
                            afterInsertImage: function (img) {
                                expect(img.src).to.be.equal(file.dataURI);
                                expect(editor.value).to.be.equal('<img src="' + file.dataURI + '">');
                                done();
                            }
                        }
                    });

                simulateEvent('drop', 0, editor.editor, function (data) {
                    Object.defineProperty(data, 'dataTransfer',{
                        value: {
                            files: [
                                file
                            ],
                        }
                    })
                });

            });
        });
        describe('Drop Image and upload on server', function () {
            it('Should upload file and insert image with SRC from server', function (done) {
                var file = new FileImage(),
                    editor = new Jodit(appendTestArea(), {
                        observer: {
                            timeout: 0
                        },
                        uploader: {
                            url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
                        },
                        events: {
                            afterInsertImage: function (img) {
                                expect(img.src).to.be.equal('https://xdsoft.net/jodit/files/logo.gif');
                                expect(editor.value).to.be.equal('<img src="https://xdsoft.net/jodit/files/logo.gif">');
                                done();
                            }
                        }
                    });

                simulateEvent('drop', 0, editor.editor, function (data) {
                    Object.defineProperty(data, 'dataTransfer',{
                        value: {
                            files: [
                                file
                            ],
                        }
                    })
                });

            });
        })
        describe('Drop File and upload on server', function () {
            it('Should upload file and insert A element with HREF to file on server', function (done) {
                var file = new FileXLS(),
                    editor = new Jodit(appendTestArea(), {
                        observer: {
                            timeout: 0
                        },
                        uploader: {
                            url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload'
                        },
                        events: {
                            afterInsertNode: function (node) {
                                expect(node.href).to.be.equal('https://xdsoft.net/jodit/files/file.xls');
                                expect(editor.value).to.be.equal('<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a>');
                                done();
                            }
                        }
                    });

                simulateEvent('drop', 0, editor.editor, function (data) {
                    Object.defineProperty(data, 'dataTransfer',{
                        value: {
                            files: [
                                file
                            ],
                        }
                    })
                });

            });
            describe('Drop with insertImageAsBase64URI=true', function () {
                it('Should upload file and insert A element with HREF to file on server', function (done) {
                    var file = new FileXLS(),
                        editor = new Jodit(appendTestArea(), {
                            observer: {
                                timeout: 0
                            },
                            uploader: {
                                url: 'https://xdsoft.net/jodit/connector/index.php?action=fileUpload',
                                insertImageAsBase64URI: true
                            },
                            events: {
                                afterInsertNode: function (node) {
                                    expect(node.href).to.be.equal('https://xdsoft.net/jodit/files/file.xls');
                                    expect(editor.value).to.be.equal('<a href="https://xdsoft.net/jodit/files/file.xls">https://xdsoft.net/jodit/files/file.xls</a>');
                                    done();
                                }
                            }
                        });

                    simulateEvent('drop', 0, editor.editor, function (data) {
                        Object.defineProperty(data, 'dataTransfer',{
                            value: {
                                files: [
                                    file
                                ],
                            }
                        })
                    });

                });
            });
        })
    });
    afterEach(removeStuff);
});