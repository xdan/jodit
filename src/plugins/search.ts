/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { MODE_WYSIWYG } from '../constants';
import { Dom } from '../modules/Dom';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { Plugin } from '../modules/Plugin';
import { debounce } from '../modules/helpers/async';
import { trim } from '../modules/helpers/string';
import { ISelectionRange, markerInfo } from '../types/types';
import { IJodit } from '../types';

declare module '../Config' {
    interface Config {
        /**
         * Enable custom search plugin
         * ![search](https://user-images.githubusercontent.com/794318/34545433-cd0a9220-f10e-11e7-8d26-7e22f66e266d.gif)
         */
        useSearch: boolean;
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
export class search extends Plugin {
    public static getSomePartOfStringIndex(
        needle: string,
        haystack: string,
        start: boolean = true
    ): number | false {
        return this.findSomePartOfString(needle, haystack, start, true) as
            | number
            | false;
    }

    public static findSomePartOfString(
        needle: string,
        haystack: string,
        start: boolean = true,
        getIndex: boolean = false
    ): boolean | string | number {
        needle = trim(needle.toLowerCase().replace(consts.SPACE_REG_EXP, ' '));
        haystack = haystack.toLowerCase();

        let i: number = start ? 0 : haystack.length - 1,
            needleStart: number = start ? 0 : needle.length - 1,
            tmpEqualLength: number = 0,
            startAtIndex: number | null = null;

        const inc: number = start ? 1 : -1,
            tmp: string[] = [];

        for (; haystack[i] !== undefined; i += inc) {
            const some: boolean = needle[needleStart] === haystack[i];
            if (
                some ||
                (startAtIndex !== null &&
                    consts.SPACE_REG_EXP.test(haystack[i]))
            ) {
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
                return getIndex ? (startAtIndex as number) : true;
            }
        }

        return getIndex
            ? startAtIndex !== null
                ? startAtIndex
                : false
            : tmp.length
            ? start
                ? tmp.join('')
                : tmp.reverse().join('')
            : false;
    }

    private template: string =
        '<div class="jodit_search">' +
        '<div class="jodit_search_box">' +
        '<div class="jodit_search_inputs">' +
        '<input tabindex="0" class="jodit_search-query" placeholder="' +
        this.jodit.i18n('Search for') +
        '" type="text"/>' +
        '<input tabindex="0" class="jodit_search-replace" placeholder="' +
        this.jodit.i18n('Replace with') +
        '" type="text"/>' +
        '</div>' +
        '<div class="jodit_search_counts">' +
        '<span>0/0</span>' +
        '</div>' +
        '<div class="jodit_search_buttons">' +
        '<button tabindex="0" type="button" class="jodit_search_buttons-next">' +
        ToolbarIcon.getIcon('angle-down') +
        '</button>' +
        '<button tabindex="0" type="button" class="jodit_search_buttons-prev">' +
        ToolbarIcon.getIcon('angle-up') +
        '</button>' +
        '<button tabindex="0" type="button" class="jodit_search_buttons-cancel">' +
        ToolbarIcon.getIcon('cancel') +
        '</button>' +
        '<button tabindex="0" type="button" class="jodit_search_buttons-replace">' +
        this.jodit.i18n('Replace') +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    private isOpened: boolean = false;

    private selInfo: markerInfo[] | null = null;
    private current: Node | false = false;

    private eachMap = (
        node: Node,
        callback: (elm: Node) => boolean,
        next: boolean
    ) => {
        Dom.findWithCurrent(
            node,
            (child: Node | null): boolean => {
                return !!child && callback(child);
            },
            this.jodit.editor,
            next ? 'nextSibling' : 'previousSibling',
            next ? 'firstChild' : 'lastChild'
        );
    };

    private updateCounters = () => {
        if (!this.isOpened) {
            return;
        }

        this.counterBox.style.display = this.queryInput.value.length
            ? 'inline-block'
            : 'none';

        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount
                ? sel.getRangeAt(0)
                : this.jodit.editorDocument.createRange(),
            counts: [number, number] = this.calcCounts(
                this.queryInput.value,
                range
            );

        this.counterBox.innerText = counts.join('/');
    };

    private boundAlreadyWas(
        current: ISelectionRange,
        bounds: ISelectionRange[]
    ): boolean {
        return bounds.some((bound: ISelectionRange) => {
            return (
                bound.startContainer === current.startContainer &&
                bound.endContainer === current.endContainer &&
                bound.startOffset === current.startOffset &&
                bound.endOffset === current.endOffset
            );
        }, false);
    }

    private tryScrollToElement(startContainer: Node) {
        // find scrollable element
        let parentBox: HTMLElement | false = Dom.closest(
            startContainer,
            elm => elm && elm.nodeType === Node.ELEMENT_NODE,
            this.jodit.editor
        ) as HTMLElement | false;

        if (!parentBox) {
            parentBox = Dom.prev(
                startContainer,
                (elm: Node | null) => elm && elm.nodeType === Node.ELEMENT_NODE,
                this.jodit.editor
            ) as HTMLElement | false;
        }

        parentBox &&
            parentBox !== this.jodit.editor &&
            parentBox.scrollIntoView();
    }

    public searchBox: HTMLDivElement;
    public queryInput: HTMLInputElement;
    public replaceInput: HTMLInputElement;
    public closeButton: HTMLButtonElement;
    public nextButton: HTMLButtonElement;
    public prevButton: HTMLButtonElement;
    public replaceButton: HTMLButtonElement;
    public counterBox: HTMLSpanElement;

    public calcCounts = (
        query: string,
        current: ISelectionRange | false = false
    ): [number, number] => {
        const bounds: ISelectionRange[] = [];

        let currentIndex: number = 0,
            count: number = 0,
            bound: ISelectionRange | false = false,
            start: Node | null = this.jodit.editor.firstChild;

        while (start && query.length) {
            bound = this.find(
                start,
                query,
                true,
                0,
                (bound as Range) || this.jodit.editorDocument.createRange()
            );
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
    public findAndReplace = (start: Node | null, query: string): boolean => {
        const sel: Selection = this.jodit.editorWindow.getSelection(),
            range: Range = sel.rangeCount
                ? sel.getRangeAt(0)
                : this.jodit.editorDocument.createRange(),
            bound: ISelectionRange | false = this.find(
                start,
                query,
                true,
                0,
                range
            );

        if (bound && bound.startContainer && bound.endContainer) {
            const rng: Range = this.jodit.editorDocument.createRange();

            try {
                if (bound && bound.startContainer && bound.endContainer) {
                    rng.setStart(
                        bound.startContainer,
                        bound.startOffset as number
                    );
                    rng.setEnd(bound.endContainer, bound.endOffset as number);
                    rng.deleteContents();
                    const textNode: Node = this.jodit.editorDocument.createTextNode(
                        this.replaceInput.value
                    );
                    rng.insertNode(textNode);
                    this.jodit.selection.select(textNode);
                    this.tryScrollToElement(textNode);
                }
            } catch (e) {}

            return true;
        }

        return false;
    };

    /**
     *
     * @param start
     * @param query
     * @param next
     */
    public findAndSelect = (
        start: Node | null,
        query: string,
        next: boolean
    ): boolean => {
        const sel: Selection = this.jodit.selection.sel,
            range: Range = sel.rangeCount
                ? sel.getRangeAt(0)
                : this.jodit.selection.createRange(),
            bound: ISelectionRange | false = this.find(
                start,
                query,
                next,
                0,
                range
            );

        if (bound && bound.startContainer && bound.endContainer) {
            const rng: Range = this.jodit.editorDocument.createRange();

            try {
                rng.setStart(bound.startContainer, bound.startOffset as number);
                rng.setEnd(bound.endContainer, bound.endOffset as number);
                this.jodit.selection.selectRange(rng);
            } catch (e) {}

            this.tryScrollToElement(bound.startContainer);

            this.current = bound.startContainer;
            this.updateCounters();

            return true;
        }

        return false;
    };

    public find = (
        start: Node | null,
        query: string,
        next: boolean,
        deep: number,
        range: Range
    ): false | ISelectionRange => {
        if (start && query.length) {
            let sentence: string = '',
                bound: ISelectionRange = {
                    startContainer: null,
                    startOffset: null,
                    endContainer: null,
                    endOffset: null,
                };

            this.eachMap(
                start,
                (elm: Node): boolean => {
                    if (
                        elm.nodeType === Node.TEXT_NODE &&
                        elm.nodeValue !== null &&
                        elm.nodeValue.length
                    ) {
                        let value: string = elm.nodeValue;

                        if (!next && elm === range.startContainer) {
                            value = !deep
                                ? value.substr(0, range.startOffset)
                                : value.substr(range.endOffset);
                        } else if (next && elm === range.endContainer) {
                            value = !deep
                                ? value.substr(range.endOffset)
                                : value.substr(0, range.startOffset);
                        }

                        const tmpSentence: string = next
                            ? sentence + value
                            : value + sentence;

                        const part:
                            | boolean
                            | string = search.findSomePartOfString(
                            query,
                            tmpSentence,
                            next
                        ) as boolean | string;

                        if (part !== false) {
                            let currentPart:
                                | string
                                | boolean = search.findSomePartOfString(
                                query,
                                value,
                                next
                            ) as string | boolean;

                            if (currentPart === true) {
                                currentPart = trim(query);
                            } else if (currentPart === false) {
                                currentPart = search.findSomePartOfString(
                                    value,
                                    query,
                                    next
                                ) as string | true;
                                if (currentPart === true) {
                                    currentPart = trim(value);
                                }
                            }

                            let currentPartIndex: number =
                                search.getSomePartOfStringIndex(
                                    query,
                                    value,
                                    next
                                ) || 0;

                            if (
                                ((next && !deep) || (!next && deep)) &&
                                elm.nodeValue.length - value.length > 0
                            ) {
                                currentPartIndex +=
                                    elm.nodeValue.length - value.length;
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
                                bound.endOffset += (currentPart as string).length;

                                return true;
                            }
                        } else {
                            sentence = '';
                            bound = {
                                startContainer: null,
                                startOffset: null,
                                endContainer: null,
                                endOffset: null,
                            };
                        }
                    } else if (
                        Dom.isBlock(elm, this.jodit.editorWindow) &&
                        sentence !== ''
                    ) {
                        sentence = next ? sentence + ' ' : ' ' + sentence;
                    }

                    return false;
                },
                next
            );

            if (bound.startContainer && bound.endContainer) {
                return bound;
            }

            if (!deep) {
                this.current = next
                    ? (this.jodit.editor.firstChild as Node)
                    : (this.jodit.editor.lastChild as Node);
                return this.find(this.current, query, next, deep + 1, range);
            }
        }

        return false;
    };

    public open = (searchAndReplace: boolean = false) => {
        if (!this.isOpened) {
            this.searchBox.classList.add('jodit_search-active');
            this.isOpened = true;
        }

        this.jodit.events.fire('hidePopup');
        this.searchBox.classList.toggle(
            'jodit_search-and-replace',
            searchAndReplace
        );

        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();

        const sel: string = this.jodit.selection.sel.toString();

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

    public close = () => {
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

    afterInit(editor: IJodit) {
        if (editor.options.useSearch) {
            const self: search = this;

            self.searchBox = editor.create.fromHTML(
                self.template
            ) as HTMLDivElement;

            self.queryInput = self.searchBox.querySelector(
                'input.jodit_search-query'
            ) as HTMLInputElement;

            self.replaceInput = self.searchBox.querySelector(
                'input.jodit_search-replace'
            ) as HTMLInputElement;

            self.closeButton = self.searchBox.querySelector(
                '.jodit_search_buttons-cancel'
            ) as HTMLButtonElement;

            self.nextButton = self.searchBox.querySelector(
                '.jodit_search_buttons-next'
            ) as HTMLButtonElement;

            self.prevButton = self.searchBox.querySelector(
                '.jodit_search_buttons-prev'
            ) as HTMLButtonElement;

            self.replaceButton = self.searchBox.querySelector(
                '.jodit_search_buttons-replace'
            ) as HTMLButtonElement;

            self.counterBox = self.searchBox.querySelector(
                '.jodit_search_counts span'
            ) as HTMLButtonElement;

            editor.workplace.appendChild(this.searchBox);

            editor.events
                .on(self.closeButton, 'click', this.close)
                .on(self.queryInput, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.removeMarkers();
                        self.selInfo = editor.selection.save();
                    }
                })
                .on(self.replaceButton, 'click', (e: MouseEvent) => {
                    self.findAndReplace(
                        editor.selection.current() || editor.editor.firstChild,
                        self.queryInput.value
                    );

                    this.updateCounters();

                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on([self.nextButton, self.prevButton], 'click', function(
                    this: HTMLButtonElement,
                    e: MouseEvent
                ) {
                    editor.events.fire(
                        self.nextButton === this
                            ? 'searchNext'
                            : 'searchPrevious'
                    );
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .on(
                    this.queryInput,
                    'keydown',
                    debounce((e: KeyboardEvent) => {
                        switch (e.which) {
                            case consts.KEY_ENTER:
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
                    }, this.jodit.defaultTimeout)
                )
                .on(
                    this.jodit.container,
                    'keydown.search',
                    (e: KeyboardEvent) => {
                        if (editor.getRealMode() !== MODE_WYSIWYG) {
                            return;
                        }

                        switch (e.which) {
                            case consts.KEY_ESC:
                                this.close();
                                break;
                            case consts.KEY_F3:
                                if (self.queryInput.value) {
                                    editor.events.fire(
                                        !e.shiftKey
                                            ? 'searchNext'
                                            : 'searchPrevious'
                                    );
                                    e.preventDefault();
                                }
                                break;
                        }
                    }
                )
                .on('beforeSetMode.search', () => {
                    this.close();
                })
                .on('keydown.search mousedown.search', () => {
                    if (this.selInfo) {
                        editor.selection.removeMarkers();
                        this.selInfo = null;
                    }
                    if (this.isOpened) {
                        this.current = this.jodit.selection.current();
                        this.updateCounters();
                    }
                })
                .on('searchNext.search searchPrevious.search', () => {
                    return self.findAndSelect(
                        editor.selection.current() || editor.editor.firstChild,
                        self.queryInput.value,
                        editor.events.current[
                            editor.events.current.length - 1
                        ] === 'searchNext'
                    );
                })
                .on('search.search', (value: string, next: boolean = true) => {
                    editor.execCommand('search', value, next);
                });

            editor.registerCommand('search', {
                exec: (
                    command: string,
                    value?: string,
                    next: boolean = true
                ) => {
                    self.findAndSelect(
                        editor.selection.current() || editor.editor.firstChild,
                        value || '',
                        next
                    );
                    return false;
                },
            });
            editor.registerCommand('openSearchDialog', {
                exec: () => {
                    self.open();
                    return false;
                },
                hotkeys: ['ctrl+f', 'cmd+f'],
            });

            editor.registerCommand('openReplaceDialog', {
                exec: () => {
                    if (!editor.options.readonly) {
                        self.open(true);
                    }
                    return false;
                },
                hotkeys: ['ctrl+h', 'cmd+h'],
            });
        }
    }

    beforeDestruct(jodit: IJodit): void {
        Dom.safeRemove(this.searchBox);
        jodit.events && jodit.events.off('.search');
        jodit.events && jodit.events.off(jodit.container, '.search');
    }
}
