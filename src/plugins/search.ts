/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */


import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {debounce, dom, trim} from "../modules/Helpers";
import {Component, Dom, ToolbarIcon} from "../modules/index";
import * as consts from "../constants";
import {markerInfo} from "../modules/Selection";
import {MODE_WYSIWYG} from "../constants";

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
                '<input tabindex="0" class="jodit_search-query" placeholder="' + this.jodit.i18n('Search for')  + '" type="text"/>' +
                '<input tabindex="0" class="jodit_search-replace" placeholder="' + this.jodit.i18n('Replace with')  + '" type="text"/>' +
            '</div>' +
            '<div class="jodit_search_counts">' +
                '<span>0/0</span>' +
            '</div>' +
            '<div class="jodit_search_buttons">' +
                '<button tabindex="0" type="button" class="jodit_search_buttons-next">' + ToolbarIcon.getIcon('angle-down') + '</button>' +
                '<button tabindex="0" type="button" class="jodit_search_buttons-prev">' + ToolbarIcon.getIcon('angle-up') + '</button>' +
                '<button tabindex="0" type="button" class="jodit_search_buttons-cancel">' + ToolbarIcon.getIcon('cancel') + '</button>' +
                '<button tabindex="0" type="button" class="jodit_search_buttons-replace">' + this.jodit.i18n('Replace')  + '</button>' +
            '</div>' +
        '</div>' +
    '</div>';

    searchBox: HTMLDivElement;
    queryInput: HTMLInputElement;
    replaceInput: HTMLInputElement;
    closeButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;
    prevButton: HTMLButtonElement;
    replaceButton: HTMLButtonElement;
    counterBox: HTMLSpanElement;

    private eachMap = (node: Node, callback: (elm: Node) => boolean, next: boolean) => {
        Dom.findWithCurrent(node, (child: Node | null): boolean => {
            return !!child && callback(child) === true;
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

    private updateCounters = () => {
        if (!this.isOpened) {
            return;
        }

        this.counterBox.style.display = this.queryInput.value.length ? 'inline-block' : 'none';

        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount ? sel.getRangeAt(0) : this.jodit.editorDocument.createRange(),
            counts: [number, number] = this.calcCounts(this.queryInput.value, range);

        this.counterBox.innerText = counts.join('/');
    };


    private boundAlreadyWas(current: SelectionRange, bounds: SelectionRange[]): boolean {
        return bounds.some((bound: SelectionRange) => {
            return bound.startContainer === current.startContainer && bound.endContainer === current.endContainer &&
                bound.startOffset === current.startOffset && bound.endOffset === current.endOffset;
        }, false);
    }

    public calcCounts = (query: string, current: SelectionRange|false = false): [number, number] => {
        let currentIndex: number = 0,
            count: number = 0,
            bounds: SelectionRange[] = [],
            bound: SelectionRange|false = false,
            start: Node | null = this.jodit.editor.firstChild;

        while (start && query.length) {
            bound = this.find(start, query, true, 0, <Range>bound || this.jodit.editorDocument.createRange());
            if (bound) {
                if (this.boundAlreadyWas(bound, bounds)) {
                    break;
                }
                bounds.push(bound);
                start = bound.startContainer;
                count += 1;
                if (current && this.boundAlreadyWas(current, [bound])) {
                    currentIndex = count;
                }
            } else {
                start = null;
            }
        }

        return [currentIndex, count];
    };

    private tryScrollToElement(startContainer: Node) {
        // find scrollable element
        let parentBox: HTMLElement|false = <HTMLElement|false>Dom.closest(startContainer, (elm: Node) => elm && elm.nodeType === Node.ELEMENT_NODE, this.jodit.editor);

        if (!parentBox) {
            parentBox = <HTMLElement|false>Dom.prev(startContainer, (elm: Node | null) => elm && elm.nodeType === Node.ELEMENT_NODE, this.jodit.editor);
        }

        parentBox && parentBox !== this.jodit.editor && parentBox.scrollIntoView();
    }
    public findAndReplace = (start: Node|null, query: string): boolean => {
        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount ? sel.getRangeAt(0) : this.jodit.editorDocument.createRange(),
            bound: SelectionRange|false = this.find(start, query, true, 0, range);

        if (bound && bound.startContainer && bound.endContainer) {
            let range: Range = this.jodit.editorDocument.createRange();

            try {
                if (bound && bound.startContainer && bound.endContainer) {
                    range.setStart(bound.startContainer, <number>bound.startOffset);
                    range.setEnd(bound.endContainer, <number>bound.endOffset);
                    range.deleteContents();
                    const textNode: Node = this.jodit.editorDocument.createTextNode(this.replaceInput.value);
                    range.insertNode(textNode);
                    this.jodit.selection.select(textNode);
                    this.tryScrollToElement(textNode);
                }
            } catch (e) {

            }

            return true;
        }

        return false;
    };
    public findAndSelect = (start: Node|null, query: string, next: boolean): boolean => {
        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount ? sel.getRangeAt(0) : this.jodit.editorDocument.createRange(),
            bound: SelectionRange|false = this.find(start, query, next, 0, range);

        if (bound && bound.startContainer && bound.endContainer) {
            const range: Range = this.jodit.editorDocument.createRange();

            try {
                range.setStart(bound.startContainer, <number>bound.startOffset);
                range.setEnd(bound.endContainer, <number>bound.endOffset);
                this.jodit.selection.selectRange(range);
            } catch (e) {
            }

            this.tryScrollToElement(bound.startContainer);

            this.current = bound.startContainer;
            this.updateCounters();

            return true;
        }

        return false;
    };

    public find = (start: Node|null, query: string, next: boolean, deep: number, range: Range): false|SelectionRange => {
        if (start && query.length) {
            let sentence: string = '',
                bound: SelectionRange = {
                    startContainer: null,
                    startOffset: null,
                    endContainer: null,
                    endOffset: null,
                };

            this.eachMap(start, (elm: Node): boolean => {
                if (elm.nodeType === Node.TEXT_NODE && elm.nodeValue !== null && elm.nodeValue.length) {
                    let value: string = elm.nodeValue;

                    if (!next && elm === range.startContainer) {
                        value = !deep ? value.substr(0, range.startOffset) : value.substr(range.endOffset);
                    } else if (next && elm === range.endContainer) {
                        value = !deep ? value.substr(range.endOffset) : value.substr(0, range.startOffset);
                    }

                    let tmpSentence: string = next ? sentence + value : value + sentence;

                    let part: boolean|string = <boolean|string>search.findSomePartOfString(query, tmpSentence, next);

                    if (part !== false) {
                        let currentPart: string|boolean = <string|boolean>search.findSomePartOfString(query, value, next);

                        if (currentPart === true) {
                            currentPart = trim(query);
                        } else if (currentPart === false) {
                            currentPart = <string|true>search.findSomePartOfString(value, query, next);
                            if (currentPart === true) {
                                currentPart = trim(value);
                            }
                        }

                        let currentPartIndex: number = search.getSomePartOfStringIndex(query, value, next) || 0;

                        if (((next && !deep) || (!next && deep)) && elm.nodeValue.length - value.length > 0) {
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
                            bound.endOffset += (<string>currentPart).length;

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

                return false;
            }, next);

            if (bound.startContainer && bound.endContainer) {
                return bound;
            }

            if (!deep) {
                this.current = next ? <Node>this.jodit.editor.firstChild : <Node>this.jodit.editor.lastChild;
                return this.find(this.current, query, next, deep + 1, range);
            }

        }

        return false;
    };

    private isOpened: boolean = false;

    open = (searchAndReplace: boolean = false) => {
        if (!this.isOpened) {
            this.searchBox.classList.add('jodit_search-active');
            this.isOpened = true;
        }

        this.jodit.events.fire('hidePopup');
        this.searchBox.classList.toggle('jodit_search-and-replace', searchAndReplace);

        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();

        const sel: string = this.jodit.ownerWindow.getSelection().toString();

        if (sel) {
            this.queryInput.value = sel;
        }

        this.updateCounters();

        if (sel) {
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
            self.replaceInput = <HTMLInputElement>self.searchBox.querySelector('input.jodit_search-replace');
            self.closeButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-cancel');
            self.nextButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-next');
            self.prevButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-prev');
            self.replaceButton = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-replace');
            self.counterBox = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_counts span');

            editor.events
                .on(self.closeButton, 'click', this.close)
                .on(self.queryInput, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.removeMarkers();
                        self.selInfo = editor.selection.save();
                    }
                })
                .on(self.replaceButton, 'click', (e: MouseEvent) => {

                    self.findAndReplace(editor.selection.current() || editor.editor.firstChild, self.queryInput.value);

                    this.updateCounters();

                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on([self.nextButton, self.prevButton], 'click', function (this: HTMLButtonElement, e: MouseEvent) {
                    editor.events.fire(self.nextButton === this ? 'searchNext' : 'searchPrevious');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on(this.queryInput, 'keydown', debounce((e: KeyboardEvent) => {
                    switch (e.which) {
                        case  consts.KEY_ENTER:
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if (editor.events.fire('searchNext')) {
                                this.close();
                            }
                            break;
                        default:
                            this.updateCounters();
                            break;
                    }
                }, this.jodit.defaultTimeout))
                .on(this.jodit.container, 'keydown', (e: KeyboardEvent) => {
                    if (editor.getRealMode() !== MODE_WYSIWYG) {
                        return;
                    }

                    switch (e.which) {
                        case  consts.KEY_ESC:
                            this.close();
                            break;
                        case  consts.KEY_F3:
                            if (self.queryInput.value) {
                                editor.events.fire(!e.shiftKey ? 'searchNext' : 'searchPrevious');
                                e.preventDefault();
                            }
                            break;
                    }
                })
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
                        this.updateCounters();
                    }
                })
                .on('searchNext searchPrevious', () => {
                    return self.findAndSelect(editor.selection.current() || editor.editor.firstChild, self.queryInput.value, editor.events.current[editor.events.current.length - 1] === 'searchNext');
                })
                .on('search', (value: string, next: boolean = true) => {
                    editor.execCommand('search', value, next);
                });

            editor.registerCommand('search', {
                exec: (command: string, value: string, next: boolean = true) => {
                    self.findAndSelect(editor.selection.current() || editor.editor.firstChild, value, next);
                    return false;
                }
            });
            editor.registerCommand('openSearchDialog', {
                exec: () => {
                    self.open();
                    return false;
                },
                hotkeys: 'ctrl+f'
            });

            editor.registerCommand('openReplaceDialog', {
                exec: () => {
                    if (!editor.options.readonly) {
                        self.open(true);
                    }
                    return false;
                },
                hotkeys: 'ctrl+h'
            });
        }
    }
}