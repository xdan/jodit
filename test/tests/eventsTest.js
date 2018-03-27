describe('Jodit Events system Tests', function() {
    describe('Native Events', function () {
        it('Create simple event handler on some DOM element', function () {
            var editor = new Jodit(appendTestArea()),
                work = false,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.events.on(div, 'click', function () {
                work = true;
            })

            simulateEvent('click', 0, div);

            expect(work).to.be.equal(true);

            div.parentNode.removeChild(div)
        });
        it('Create simple event handler on some DOM element on few events', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.events.on(div, 'click dblclick keydown', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            simulateEvent('dblclick', 0, div);
            simulateEvent('keydown', 0, div);

            expect(work).to.be.equal(3);
            div.parentNode.removeChild(div)
        });
        it('Create simple event handler on all DOM elements which will be inside some starting DOm element', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button'),
                a = document.createElement('a');

            document.body.appendChild(div)

            editor.events.on(div, 'click', function () {
                work++;
            }, 'a.active')

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(0);

            div.appendChild(a);

            simulateEvent('click', 0, a);
            expect(work).to.be.equal(0);

            a.classList.add('active');
            simulateEvent('click', 0, a);
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)

        });
        it('Add and remove event handler', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.events.on(div, 'click', function () {
                work++;
            })

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);

            editor.events.off(div, 'click')

            simulateEvent('click', 0, div);
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)
        })
        describe('Add a few handlers for several evens and remove all handlers', function () {
            it('Should stop listening events', function () {
                var editor = new Jodit(appendTestArea()),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                editor.events.on(div, 'click', function () {
                    work++;
                })
                editor.events.on(div, 'dblclick', function () {
                    work++;
                })
                editor.events.on(div, 'mousedown', function () {
                    work++;
                })

                simulateEvent('click', 0, div);
                simulateEvent('dblclick', 0, div);
                simulateEvent('mousedown', 0, div);

                expect(work).to.be.equal(3);

                editor.events.off(div)

                simulateEvent('click', 0, div);
                simulateEvent('dblclick', 0, div);
                simulateEvent('mousedown', 0, div);

                expect(work).to.be.equal(3);

                div.parentNode.removeChild(div)
            })
        })
        it('Add event handler for several elements', function () {
            var editor = new Jodit(appendTestArea()),
                work = '',
                div1 = editor.editorDocument.createElement('button'),
                div2 = editor.editorDocument.createElement('button');

            editor.editorDocument.body.appendChild(div1)
            editor.editorDocument.body.appendChild(div2)

            div1.innerText = 'test1';
            div2.innerText = 'test2';

            editor.events
                .on([div1, div2], 'click', function () {
                    work += this.innerText;
                })

                .fire(div1, 'click');

            editor.events.fire(div2, 'click');

            expect(work).to.be.equal('test1test2');

            div1.parentNode.removeChild(div1)
            div2.parentNode.removeChild(div2)
        })
        it('Fire trigger', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.events
                .on(div, 'click', function () {
                work++;
            })
                .fire(div, 'click');
            expect(work).to.be.equal(1);

            div.parentNode.removeChild(div)
        })
        it('Remove handler should remove full handler with selector options', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                a = document.createElement('a'),
                div = document.createElement('button');

            a.innerText = 'test';
            div.appendChild(a)
            document.body.appendChild(div)

            editor.events
                .on(div, 'click', function () {
                    work++;
                }, 'a')
                .fire(div, 'click');

            expect(work).to.be.equal(0);


            editor.events.fire(a, 'click');
            expect(work).to.be.equal(1);

            editor.events.off(div, 'click')
            editor.events.fire(a, 'click');
            expect(work).to.be.equal(1);

            editor.events.on(div, 'click', function () {
                work++;
            }, 'a')
            editor.events.fire(a, 'click');
            expect(work).to.be.equal(2);

            div.parentNode.removeChild(div)
        })
        it('Remove all handlers using event namespace', function () {
            var editor = new Jodit(appendTestArea()),
                work = 0,
                div = document.createElement('button');

            document.body.appendChild(div)

            editor.events.on(div, 'click.test', function () {
                work++;
            })
            editor.events.on(div, 'mousedown.test', function () {
                work++;
            })

            editor.events.fire(div, 'click');
            editor.events.fire(div, 'mousedown');
            expect(work).to.be.equal(2);

            editor.events.off(div, '.test')
            editor.events.fire(div, 'click');
            editor.events.fire(div, 'mousedown');
            expect(work).to.be.equal(2);

            div.parentNode.removeChild(div)
        })
        it('Proxy event from iframe.window to main.window', function () {
            var editor = new Jodit(appendTestArea(), {
                    iframe: true
                }),
                work = 0,
                mousedown = function () {
                    work++;
                };

            window.addEventListener('mousedown', mousedown);

            editor.events.fire(editor.editorWindow, 'mousedown');

            expect(work).to.be.equal(1);

            window.removeEventListener('mousedown', mousedown);
        })
    })
    describe('Jodit Events', function () {
        it('Event handler', function () {
            var enable = false;
            var editor = new Jodit(appendTestArea());
            editor.events.on('keydown', function (event) {
                enable = true;
            });
            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);
            expect(enable).to.be.equal(true);
        });

        it('Delete event handler', function () {
            var enable = false, callback = function (event) {
                enable = true;
            };
            var editor = new Jodit(appendTestArea());

            editor.events.on('keydown', callback);
            editor.events.off('keydown', callback);

            simulateEvent('keydown', Jodit.KEY_Y, editor.editor);

            expect(enable).to.be.equal(false);
        });
        it('Proxy events', function () {
            var editor = new Jodit(appendTestArea()), work = false;
            editor.events.on('keydown', function (event) {
                work = true
            });
            simulateEvent('keydown', Jodit.KEY_ENTER, editor.editor);

            expect(work).to.be.equal(true);
        });
    });
    describe('Combine events', function () {
        describe('Pass arguments in handler', function () {
            it('Should pass all Fire arguments in handler', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    simpleObject = {},
                    clicked = 0;

                eventer.on(simpleObject, 'click', function (count) {
                    clicked += count;
                });

                eventer.fire(simpleObject, 'click', 1);
                eventer.fire(simpleObject, 'click', 2);
                eventer.fire(simpleObject, 'click', 3);

                expect(6).to.be.equal(clicked);
            });
        });
        describe('Queue operations', function () {
            it('Should call handlers in order how the were added but handler with onTop option should be called first', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    simpleObject = {},
                    clicked = [];

                eventer.on(simpleObject, 'click', function () {
                    clicked.push(1);
                });
                eventer.on(simpleObject, 'click', function () {
                    clicked.push(2);
                });
                eventer.on(simpleObject, 'click', function () {
                    clicked.push(3);
                });
                eventer.on(simpleObject, 'click', function () {
                    clicked.push(4);
                }, undefined, true);

                eventer.fire(simpleObject, 'click');


                expect('4,1,2,3').to.be.equal(clicked.toString());
            });
            describe('Stop propagation', function () {
                it('Should stop all calls for this event but another events should be called', function () {
                    var eventer = new Jodit.modules.EventsNative(),
                        simpleObject = {},
                        clicked = [];

                    eventer.on(simpleObject, 'lope', function () {
                        clicked.push(15);
                    });
                    eventer.on(simpleObject, 'pop', function () {
                        clicked.push(16);
                    });

                    eventer.on(simpleObject, 'click', function () {
                        clicked.push(1);
                    });

                    eventer.on(simpleObject, 'click', function () {
                        clicked.push(2);
                        eventer.fire(simpleObject, 'pop');
                        eventer.stopPropagation(simpleObject, 'click');
                        eventer.fire(simpleObject, 'lope');
                    });

                    // this handler will not be called
                    eventer.on(simpleObject, 'click', function () {
                        clicked.push(3);
                    });

                    eventer.on(simpleObject, 'click', function () {
                        clicked.push(4);
                    }, undefined, true);

                    eventer.fire(simpleObject, 'click');
                    eventer.fire(simpleObject, 'click');


                    expect('4,1,2,16,15,4,1,2,16,15').to.be.equal(clicked.toString());
                });
                describe('Default object', function () {
                    it('Should stop all calls for this event but another events should be called', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            clicked = [];

                        eventer.on('lope', function () {
                            clicked.push(15);
                        });
                        eventer.on('pop', function () {
                            clicked.push(16);
                        });

                        eventer.on('click', function () {
                            clicked.push(1);
                        });

                        eventer.on('click', function () {
                            clicked.push(2);
                            eventer.fire('pop');
                            eventer.stopPropagation('click');
                            eventer.fire('lope');
                        });

                        // this handler will not be called
                        eventer.on('click', function () {
                            clicked.push(3);
                        });

                        eventer.on('click', function () {
                            clicked.push(4);
                        }, undefined, undefined, true);

                        eventer.fire('click');
                        eventer.fire('click');


                        expect('4,1,2,16,15,4,1,2,16,15').to.be.equal(clicked.toString());
                    });
                });
            });
        });
        describe('Short form', function () {
            describe('Add event to simple object', function () {
                it('Should work with on handler', function () {
                    var eventer = new Jodit.modules.EventsNative(),
                        clicked = false;

                    eventer.on('click', function () {
                        clicked = true;
                    });

                    eventer.fire('click');

                    expect(true).to.be.equal(clicked);
                });
                describe('Remove event listener', function () {
                    it('Should remove handler without namespace', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            clicked = 0,
                            callback = function () {
                                clicked += 1;
                            };

                        eventer.on('click.jodit', callback);
                        eventer.fire('click');

                        expect(1).to.be.equal(clicked);

                        eventer.off('click.jodit');

                        eventer.fire('click.jodit');
                        eventer.fire('click');

                        expect(1).to.be.equal(clicked);
                    });
                });
            });
        });
        describe('Return value', function () {
            it('Should return last not undefined value from fire', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    simpleObject = {},
                    clicked = 0;

                eventer.on(simpleObject, 'click', function () {
                    return 50;
                });
                eventer.on(simpleObject, 'click', function () {
                    return 60;
                });
                eventer.on(simpleObject, 'click', function () {
                    return void(0)
                });

                clicked = eventer.fire(simpleObject, 'click');

                expect(60).to.be.equal(clicked);
            });
        });
        describe('Add event to simple object', function () {
            it('Should work with on handler', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    simpleObject = {},
                    clicked = false;

                eventer.on(simpleObject, 'click', function () {
                    clicked = true;
                });

                eventer.fire(simpleObject, 'click');

                expect(true).to.be.equal(clicked);
            });
            it('Should work with several handlers', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    simpleObject = {},
                    clicked = [];

                eventer.on(simpleObject, 'click', function () {
                    clicked.push(1);
                });
                eventer.on(simpleObject, 'click', function () {
                    clicked.push(2);
                });

                eventer.fire(simpleObject, 'click');

                expect('1,2').to.be.equal(clicked.toString());
            });
            describe('Add event to simple object with namespace', function () {
                describe('Fire event', function () {
                    it('Should work with namespace and without namespace', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            simpleObject = {},
                            clicked = 0;

                        eventer.on(simpleObject, 'click.jodit', function () {
                            clicked += 1;
                        });

                        eventer.fire(simpleObject, 'click.jodit');
                        eventer.fire(simpleObject, 'click');

                        eventer.fire(simpleObject, 'click.test'); // should not work

                        expect(2).to.be.equal(clicked);
                    });
                    it('Should work only for current object', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            simpleObject = {},
                            simpleObject2 = {},
                            clicked = 0;

                        eventer.on(simpleObject, 'click.jodit', function () {
                            clicked += 1;
                        });

                        eventer.fire(simpleObject, 'click.jodit');
                        eventer.fire(simpleObject2, 'click');

                        expect(1).to.be.equal(clicked);
                    });
                });
                describe('Remove event listener', function () {
                    it('Should remove handler without namespace', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            simpleObject = {},
                            clicked = 0,
                            callback = function () {
                                clicked += 1;
                            };

                        eventer.on(simpleObject, 'click.jodit', callback);
                        eventer.fire(simpleObject, 'click');

                        expect(1).to.be.equal(clicked);

                        eventer.off(simpleObject, 'click.jodit');

                        eventer.fire(simpleObject, 'click.jodit');
                        eventer.fire(simpleObject, 'click');

                        expect(1).to.be.equal(clicked);
                    });
                    it('Should remove handler  with namespace', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            simpleObject = {},
                            clicked = 0,
                            callback = function () {
                                clicked += 1;
                            };

                        eventer.on(simpleObject, 'click', callback);
                        eventer.fire(simpleObject, 'click');

                        expect(1).to.be.equal(clicked);

                        eventer.off(simpleObject, 'click.jodit');

                        eventer.fire(simpleObject, 'click.jodit'); // should not work
                        eventer.fire(simpleObject, 'click');

                        expect(2).to.be.equal(clicked);
                    });
                    it('Should remove handler with namespace only for one event', function () {
                        var eventer = new Jodit.modules.EventsNative(),
                            simpleObject = {},
                            clicked = [],
                            callback = function () {
                                clicked.push(1);
                            };

                        eventer.on(simpleObject, 'click.jodit mousedown.jodit', callback);

                        eventer.on(simpleObject, 'mousedown', function () {
                            clicked.push(2);
                        });

                        eventer.fire(simpleObject, 'click');

                        expect('1').to.be.equal(clicked.toString());

                        eventer.off(simpleObject, 'click.jodit');

                        eventer.fire(simpleObject, 'click.jodit');
                        eventer.fire(simpleObject, 'click');

                        expect('1').to.be.equal(clicked.toString());

                        eventer.fire(simpleObject, 'mousedown');

                        expect('1,1,2').to.be.equal(clicked.toString());

                        eventer.off(simpleObject, 'mousedown');

                        eventer.fire(simpleObject, 'mousedown');

                        expect('1,1,2').to.be.equal(clicked.toString());
                    });
                    describe('Remove event listener for specific handler', function () {
                        it('Should remove only specific handler', function () {
                            var eventer = new Jodit.modules.EventsNative(),
                                simpleObject = {},
                                clicked = [],
                                callback2 = function () {
                                    clicked.push(2);
                                },
                                callback = function () {
                                    clicked.push(1);
                                };

                            eventer.on(simpleObject, 'click.jodit', callback);
                            eventer.on(simpleObject, 'click', callback2);

                            eventer.fire(simpleObject, 'click');

                            expect('1,2').to.be.equal(clicked.toString());

                            eventer.off(simpleObject, 'click.jodit', callback);
                            eventer.off(simpleObject, 'click.jodit', callback2);

                            eventer.fire(simpleObject, 'click.jodit');
                            eventer.fire(simpleObject, 'click');
                            expect('1,2,2').to.be.equal(clicked.toString());

                            eventer.off(simpleObject, 'click', callback2);

                            eventer.fire(simpleObject, 'click.jodit');
                            eventer.fire(simpleObject, 'click');
                            expect('1,2,2').to.be.equal(clicked.toString());
                        });
                    });
                    describe('Remove event listener for whole namespace', function () {
                        it('Should remove all handlers from namespace', function () {
                            var eventer = new Jodit.modules.EventsNative(),
                                simpleObject = {},
                                clicked = 0,
                                callback = function () {
                                    clicked += 1;
                                };

                            eventer.on(simpleObject, 'click.jodit', callback);
                            eventer.on(simpleObject, 'mousedown.jodit', callback);
                            eventer.fire(simpleObject, 'click mousedown');

                            expect(2).to.be.equal(clicked);

                            eventer.off(simpleObject, '.jodit');

                            eventer.fire(simpleObject, 'click');
                            eventer.fire(simpleObject, 'mousedown');

                            expect(2).to.be.equal(clicked);
                        });
                    });
                });
            });
        });
        describe('Native Events', function () {
            it('Create simple event handler on some DOM element', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = false,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click', function () {
                    work = true;
                });

                simulateEvent('click', 0, div);

                expect(work).to.be.equal(true);

                div.parentNode.removeChild(div)
            });
            it('Create simple event handler on some DOM element on few events', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click dblclick keydown', function () {
                    work++;
                })

                simulateEvent('click', 0, div);
                simulateEvent('dblclick', 0, div);
                simulateEvent('keydown', 0, div);

                expect(work).to.be.equal(3);
                div.parentNode.removeChild(div)
            });
            it('Create simple event handler on all DOM elements which will be inside some starting DOm element', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button'),
                    a = document.createElement('a');

                document.body.appendChild(div)

                eventer.on(div, 'click', function () {
                    work++;
                }, 'a.active')

                simulateEvent('click', 0, div);
                expect(work).to.be.equal(0);

                div.appendChild(a);

                simulateEvent('click', 0, a);
                expect(work).to.be.equal(0);

                a.classList.add('active');
                simulateEvent('click', 0, a);
                expect(work).to.be.equal(1);

                div.parentNode.removeChild(div)

            });
            it('Add and remove event handler', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click', function () {
                    work++;
                })

                simulateEvent('click', 0, div);
                expect(work).to.be.equal(1);

                eventer.off(div, 'click')

                simulateEvent('click', 0, div);
                expect(work).to.be.equal(1);

                div.parentNode.removeChild(div)
            })
            it('Add a few handlers for several evens and remove all handlers', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click', function () {
                    work++;
                })
                eventer.on(div, 'dblclick', function () {
                    work++;
                })
                eventer.on(div, 'mousedown', function () {
                    work++;
                })

                simulateEvent('click', 0, div);
                simulateEvent('dblclick', 0, div);
                simulateEvent('mousedown', 0, div);

                expect(work).to.be.equal(3);

                eventer.off(div)

                simulateEvent('click', 0, div);
                simulateEvent('dblclick', 0, div);
                simulateEvent('mousedown', 0, div);

                expect(work).to.be.equal(3);

                div.parentNode.removeChild(div)
            })
            it('Add event handler for several elements', function () {
                var editor = new Jodit(appendTestArea()),
                    eventer = new Jodit.modules.EventsNative(),
                    work = '',
                    div1 = editor.editorDocument.createElement('button'),
                    div2 = editor.editorDocument.createElement('button');

                editor.editorDocument.body.appendChild(div1)
                editor.editorDocument.body.appendChild(div2)

                div1.innerText = 'test1';
                div2.innerText = 'test2';

                eventer.on([div1, div2], 'click', function () {
                    work += this.innerText;
                })

                eventer.fire(div1, 'click');
                eventer.fire(div2, 'click');

                expect(work).to.be.equal('test1test2');

                div1.parentNode.removeChild(div1)
                div2.parentNode.removeChild(div2)
            })
            it('Fire trigger', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click', function () {
                    work++;
                });

                eventer.fire(div, 'click');
                expect(work).to.be.equal(1);

                div.parentNode.removeChild(div)
            });
            describe('Add handler like live jQuery method', function () {
                it('Should work for all feature elements', function () {
                    var eventer = new Jodit.modules.EventsNative(),
                        work = 0,
                        div = document.createElement('div');

                    eventer.on(div, 'click',  function () {
                        work++;
                    }, 'img')

                    document.body.appendChild(div);

                    eventer.fire(div, 'click');
                    expect(work).to.be.equal(0);

                    div.appendChild(document.createElement('a'))
                    eventer.fire(div.querySelector('a'), 'click');
                    expect(work).to.be.equal(0);


                    div.querySelector('a').appendChild(document.createElement('img'))
                    eventer.fire(div.querySelector('img'), 'click');
                    expect(work).to.be.equal(1);

                    simulateEvent('click', 0, div.querySelector('img'));
                    expect(work).to.be.equal(2);

                    div.parentNode.removeChild(div)
                });
            });
            it('Remove handler should remove full handler with selector options', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    a = document.createElement('a'),
                    div = document.createElement('button');

                a.innerText = 'test';
                div.appendChild(a)
                document.body.appendChild(div)

                eventer.on(div, 'click',  function () {
                    work++;
                }, 'a')

                eventer.fire(div, 'click');
                expect(work).to.be.equal(0);


                eventer.fire(a, 'click');
                expect(work).to.be.equal(1);

                eventer.off(div, 'click')
                eventer.fire(a, 'click');
                expect(work).to.be.equal(1);

                eventer.on(div, 'click', function () {
                    work++;
                }, 'a')
                eventer.fire(a, 'click');
                expect(work).to.be.equal(2);

                div.parentNode.removeChild(div)
            })
            it('Remove all handlers using event namespace', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    div = document.createElement('button');

                document.body.appendChild(div)

                eventer.on(div, 'click.test', function () {
                    work++;
                })
                eventer.on(div, 'mousedown.test', function () {
                    work++;
                })

                eventer.fire(div, 'click');
                eventer.fire(div, 'mousedown');
                expect(work).to.be.equal(2);

                eventer.off(div, '.test')
                eventer.fire(div, 'click');
                eventer.fire(div, 'mousedown');
                expect(work).to.be.equal(2);

                div.parentNode.removeChild(div)
            })
            it('Proxy event from iframe.window to main.window', function () {
                var eventer = new Jodit.modules.EventsNative(),
                    work = 0,
                    mousedown = function () {
                        work++;
                    };

                window.addEventListener('mousedown', mousedown);

                eventer.fire(window, 'mousedown');

                expect(work).to.be.equal(1);

                window.removeEventListener('mousedown', mousedown);
            })
        })
        describe('Check destruct', function () {
            describe('For window', function () {
                it('Should remove all handlers', function () {
                    var editor = new Jodit(appendTestArea());
                    var checker = 0;
                    editor.events.on(window, 'updateSome1', function () {
                        checker += 1;
                    });

                    editor.events.fire(window, 'updateSome1');

                    expect(1).to.be.equal(checker);

                    simulateEvent('updateSome1', 0, window);

                    expect(2).to.be.equal(checker);

                    editor.destruct();

                    simulateEvent('updateSome1', 0, window);
                    simulateEvent('updateSome1', 0, window);
                    simulateEvent('updateSome1', 0, window);

                    expect(2).to.be.equal(checker);

                });
            });
            describe('For document', function () {
                it('Should remove all handlers', function () {
                    var editor = new Jodit(appendTestArea());
                    var checker = 0;
                    editor.events.on(document, 'updateSome1', function () {
                        checker += 1;
                    });

                    editor.events.fire(document, 'updateSome1');

                    expect(1).to.be.equal(checker);

                    simulateEvent('updateSome1', 0, document);

                    expect(2).to.be.equal(checker);

                    editor.destruct();

                    simulateEvent('updateSome1', 0, document);
                    simulateEvent('updateSome1', 0, document);
                    simulateEvent('updateSome1', 0, document);

                    expect(2).to.be.equal(checker);

                });
            });
            describe('For body', function () {
                it('Should remove all handlers', function () {
                    var editor = new Jodit(appendTestArea());
                    var checker = 0;
                    editor.events.on(document.body, 'updateSome1', function () {
                        checker += 1;
                    });

                    editor.events.fire(document.body, 'updateSome1');

                    expect(1).to.be.equal(checker);

                    simulateEvent('updateSome1', 0, document.body);

                    expect(2).to.be.equal(checker);

                    editor.destruct();

                    simulateEvent('updateSome1', 0, document.body);
                    simulateEvent('updateSome1', 0, document.body);
                    simulateEvent('updateSome1', 0, document.body);

                    expect(2).to.be.equal(checker);

                });
            });
        });
    });
    describe('Helpers', function () {
        describe('dataBind', function () {
            it('Should save value in object', function () {
                var obj = {
                    stop: 2
                };
                Jodit.modules.Helpers.dataBind(obj, 'test', 1);
                expect(Object.keys(obj).toString()).to.be.equal('stop')
                expect(Jodit.modules.Helpers.dataBind(obj, 'test')).to.be.equal(1)
            });
            describe('remove value', function () {
                it('Should save value in object', function () {
                    var obj = {
                        stop: 2
                    };
                    Jodit.modules.Helpers.dataBind(obj, 'test', 1);
                    expect(Object.keys(obj).toString()).to.be.equal('stop')
                    expect(Jodit.modules.Helpers.dataBind(obj, 'test')).to.be.equal(1);
                    Jodit.modules.Helpers.dataBind(obj, 'test', 2);
                    expect(Jodit.modules.Helpers.dataBind(obj, 'test')).to.be.equal(2);
                    Jodit.modules.Helpers.dataBind(obj, 'test', null);
                    expect(Jodit.modules.Helpers.dataBind(obj, 'test')).to.be.not.equal(2);
                });
            });
        });
    });
    describe('Check case sensitive', function () {
        it('Should call event listener only when match case', function () {
            var eventer = new Jodit.modules.EventsNative(),
                simpleObject = {},
                clicked = '';

            eventer.on(simpleObject, 'click', function (count) {
                clicked += count;
            });
            eventer.on(simpleObject, 'CLICK', function (count) {
                clicked += count;
            });

            eventer.fire(simpleObject, 'Click', '1');
            eventer.fire(simpleObject, 'CLICK', '2');
            eventer.fire(simpleObject, 'click', '3');

            expect('23').to.be.equal(clicked);
        });
    });
    afterEach(removeStuff);
});
