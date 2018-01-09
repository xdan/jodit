import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {ctrlKey, debounce, dom, trim} from "../modules/Helpers";
import {Component, Dom, Toolbar} from "../modules";
import * as consts from "../constants";
import {markerInfo} from "../modules/Selection";

declare module "../Config" {
    interface Config {
        /**
         * Enable custom search plugin ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
         */
        useSearch: boolean,
        // searchByInput: boolean,
    }
}

Config.prototype.useSearch = true;

/**
 * Search plugin. it is used for custom search in text
 * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
 *
 * @example
 * ```typescript
 * var jodit = new Jodit('#editor', {
 *  useSearch: false
 * });
 * // or
 * var jodit = new Jodit('#editor', {
 *  disablePlugins: 'search'
 * });
 * ```
 */
export class search extends Component {
    private template: string = '<div class="jodit_search">' +
        '<div class="jodit_search_box">' +
            '<div class="jodit_search_inputs">' +
                '<input class="jodit_search-query" type="text"/>' +
            '</div>' +
            '<div class="jodit_search_buttons">' +
                '<button type="button" class="jodit_search_buttons-next">' + Toolbar.getIcon('angle-down') + '</button>' +
                '<button type="button" class="jodit_search_buttons-prev">' + Toolbar.getIcon('angle-up') + '</button>' +
                '<button type="button" class="jodit_search_buttons-cancel">' + Toolbar.getIcon('cancel') + '</button>' +
            '</div>' +
        '</div>' +
    '</div>';

    searchBox: HTMLDivElement;
    queryInput: HTMLInputElement;
    closeButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    prevButton: HTMLButtonElement;

    private eachMap = (node: Node, callback, next: boolean) => {
        Dom.findWithCurrent(node, (child: Node): boolean => {
            return child && callback(child) === true;
        }, this.jodit.editor, next ? 'nextSibling' : 'previousSibling', next ? 'firstChild' : 'lastChild')
    };

    public static getSomePartOfStringIndex(needle: string, haystack: string, start: boolean = true): number|false {
        return <number|false>this.findSomePartOfString(needle, haystack, start, true)
    }

    public static findSomePartOfString(needle: string, haystack: string, start: boolean = true, getIndex: boolean = false): boolean|string|number {
        needle = trim(needle.toLowerCase().replace(consts.SPACE_REG_EXP, ' '));
        haystack = haystack.toLowerCase();

        let i: number = start ? 0 : haystack.length - 1,
            needleStart: number = start ? 0 : needle.length - 1,
            startAtIndex: number|null = null,
            inc: number = start ? 1 : -1;

        const tmp: string[] = [];
        let tmpEqualLength: number = 0;

        for (;haystack[i] !== undefined; i += inc) {
            let some: boolean = needle[needleStart] === haystack[i];
            if (some || (startAtIndex !== null && consts.SPACE_REG_EXP.test(haystack[i]))) {
                if (startAtIndex === null || !start) {
                    startAtIndex = i;
                }

                tmp.push(haystack[i]);

                if (some) {
                    tmpEqualLength += 1;
                    needleStart += inc;
                }
            } else {
                startAtIndex = null;
                tmp.length = 0;
                tmpEqualLength = 0;
                needleStart = start ? 0 : needle.length - 1;
            }

            if (tmpEqualLength === needle.length) {
                return getIndex ? <number>startAtIndex : true;
            }
        }

        return getIndex ? (startAtIndex !== null ? startAtIndex : false) : (tmp.length ? (start ? tmp.join('') : tmp.reverse().join('')) : false);
    }

    public find = (start: Node|null, query: string, next: boolean): boolean => {
        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount ? sel.getRangeAt(0) : this.jodit.editorDocument.createRange();

        if (start && query.length) {
            let sentence: string = '',
                bound: SelectionRange = {
                    startContainer: null,
                    startOffset: null,
                    endContainer: null,
                    endOffset: null,
                };

            this.eachMap(start, (elm: Node) => {
                if (elm.nodeType === Node.TEXT_NODE && elm.nodeValue !== null && elm.nodeValue.length) {
                    let value: string = elm.nodeValue;

                    if (!next && elm === range.startContainer) {
                        value = value.substr(0, range.startOffset);
                    } else if (next && elm === range.endContainer) {
                        value = value.substr(range.endOffset);
                    }

                    let tmpSentence: string = next ? sentence + value : value + sentence;

                    let part: boolean|string = <boolean|string>search.findSomePartOfString(query, tmpSentence, next);

                    if (part !== false) {
                        let currentPart: string|true = <string|true>(search.findSomePartOfString(query, value, next) || search.findSomePartOfString(value, query, next));

                        if (currentPart === true) {
                            currentPart = trim(query);
                        }

                        let currentPartIndex: false|number = search.getSomePartOfStringIndex(query, value, next);
                        if (currentPartIndex === false) {
                            currentPartIndex = !next ? 0 : value.length - currentPart.length;
                        }

                        if (next && elm.nodeValue.length - value.length) {
                            currentPartIndex += elm.nodeValue.length - value.length;
                        }

                        if (bound.startContainer === null) {
                            bound.startContainer = elm;
                            bound.startOffset = currentPartIndex;
                        }
                        if (part !== true) {
                            sentence = tmpSentence;
                        } else {
                            bound.endContainer = elm;
                            bound.endOffset = currentPartIndex;
                            if (bound.startContainer === bound.endContainer && bound.endOffset === bound.startOffset) {
                                bound.endOffset += currentPart.length;
                            }
                            if (bound.endOffset > elm.nodeValue.length) {
                                bound.endOffset = elm.nodeValue.length;
                            }
                            return true;
                         }
                    } else {
                        sentence = '';
                        bound = {
                            startContainer: null,
                            startOffset: null,
                            endContainer: null,
                            endOffset: null,
                        }
                    }

                } else if (Dom.isBlock(elm) && sentence !== '') {
                    sentence = next ? sentence + ' ' : ' ' + sentence;
                }
            }, next);

            if (bound.startContainer && bound.endContainer) {
                const range: Range = this.jodit.editorDocument.createRange();


                try {
                    range.setStart(bound.startContainer, <number>bound.startOffset);
                    range.setEnd(bound.endContainer, <number>bound.endOffset);
                    this.jodit.selection.selectRange(range);
                } catch (e) {
                    debugger
                }

                // find scrollable element
                let parentBox: HTMLElement|false = <HTMLElement|false>Dom.closest(bound.startContainer, (elm: Node) => elm && elm.nodeType === Node.ELEMENT_NODE, this.jodit.editor);

                if (!parentBox) {
                    parentBox = <HTMLElement|false>Dom.prev(bound.startContainer, (elm: Node) => elm && elm.nodeType === Node.ELEMENT_NODE, this.jodit.editor);
                }

                parentBox && parentBox.scrollIntoView();

                this.current = bound.startContainer;
                return true;
            }

            if (next && start !== this.jodit.editor.firstChild) {
                this.current = <Node>this.jodit.editor.firstChild;
                return this.find(<Node>this.jodit.editor.firstChild, query, next);
            }

            if (!next && start !== this.jodit.editor.lastChild) {
                this.current = <Node>this.jodit.editor.lastChild;
                return this.find(<Node>this.jodit.editor.lastChild, query, next);
            }
        }

        return false;
    };

    private isOpened: boolean = false;

    open = () => {
        if (!this.isOpened) {
            this.searchBox.classList.add('jodit_search-active');
            this.isOpened = true;
        }

        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();

        let sel: string = this.jodit.ownerWindow.getSelection().toString();

        if (sel) {
            this.queryInput.value = sel;
            this.queryInput.select();
        } else {
            this.queryInput.focus();
        }
    };

    private selInfo :markerInfo[]|null = null;
    private current :Node|false = false;

    close = () => {
        if (!this.isOpened) {
            return;
        }

        if (this.selInfo) {
            this.jodit.selection.restore(this.selInfo);
            this.selInfo = null;
        }

        this.searchBox.classList.remove('jodit_search-active');
        this.isOpened = false;
    };

    constructor(editor: Jodit) {
        super(editor);
        if (editor.options.useSearch) {
            const self: search = this;

            self.searchBox = <HTMLDivElement>dom(self.template, editor.ownerDocument);
            self.queryInput = <HTMLInputElement>self.searchBox.querySelector('input.jodit_search-query');
            self.closeButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-cancel');
            self.nextButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-next');
            self.prevButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-prev');

            editor
                .__on(self.closeButton, 'click', this.close)
                .__on(self.queryInput, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.removeMarkers();
                        self.selInfo = editor.selection.save();
                    }
                })
                .__on([self.nextButton, self.prevButton], 'mousedown', function (this: HTMLButtonElement, e: MouseEvent) {
                    editor.events.fire(self.nextButton === this ? 'searchNext' : 'searchPrevious');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .__on(this.queryInput, 'keydown', debounce((e: KeyboardEvent) => {
                    switch (e.which) {
                        case  consts.KEY_ENTER:
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (editor.events.fire('searchNext')) {
                                this.close();
                            }
                            break;
                        default:
                            // this.jodit.options.searchByInput && this.search(this.query.value, true);
                            break;
                    }
                }, this.jodit.options.observer.timeout))
                .__on(this.jodit.container, 'keydown', (e: KeyboardEvent) => {
                    switch (e.which) {
                        case  consts.KEY_ESC:
                            this.close();
                            break;
                        case  consts.KEY_F3:
                            if (self.isOpened) {
                                editor.events.fire(!e.shiftKey ? 'searchNext' : 'searchPrevious');
                                e.preventDefault();
                            }
                            break;
                        case  consts.KEY_F:
                            if (ctrlKey(e)) {
                                this.open();
                                e.preventDefault();
                            }
                            break;
                    }
                })
                .events
                    .on('beforeSetMode', () => {
                       this.close();
                    })
                    .on('afterInit', () => {
                        editor.workplace.appendChild(this.searchBox);
                    })
                    .on('keydown mousedown', () => {
                        if (this.selInfo) {
                            editor.selection.removeMarkers();
                            this.selInfo = null;
                        }
                        if (this.isOpened) {
                            this.current = this.jodit.selection.current();
                        }
                    })
                    .on('searchNext', () => {
                        return self.find(this.jodit.selection.current() || self.jodit.editor.firstChild, self.queryInput.value, true);
                    })
                    .on('searchPrevious', () => {
                        return self.find(this.jodit.selection.current() || self.jodit.editor.firstChild, self.queryInput.value, false);
                    })
                    .on('search', (value: string, startNode?: Node, next: boolean = true) => {
                        this.find(startNode || self.jodit.editor.firstChild, value, next);
                    });
        }
    }
}