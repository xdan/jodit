import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {ctrlKey, debounce, dom, val} from "../modules/Helpers";
import {Component, Dom, Toolbar} from "../modules";
import * as consts from "../constants";
import {markerInfo} from "../modules/Selection";

declare module "../Config" {
    interface Config {
        useSearch: boolean,
        searchByInput: boolean,
    }
}

Config.prototype.useSearch = true;
Config.prototype.searchByInput = true;

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
    query: HTMLInputElement;
    cancel: HTMLButtonElement;
    next: HTMLButtonElement;
    prev: HTMLButtonElement;

    private eachMap = (node: Node, callback, next: boolean) => {
        Dom.find(node, (child: Node): boolean => {
            child && callback(child);
            return false;
        }, this.jodit.editor, true, next ? 'nextSibling' : 'previousSibling', next ? 'firstChild' : 'lastChild')
    };

    private static compareStrings(first: string, second: string, start: boolean): boolean {
        first = first.toLowerCase();
        second = second.toLowerCase();

        let i: number = start ? 0 : first.length,
            inc: number = start ? 1 : -1;

        for (; first[i] !== undefined && second[i] !== undefined; i += inc) {
            if (first[i] !== second[i]) {
                return false;
            }
        }

        return true;
    }

    search = (value: string, next: boolean) => {
         let start: Node|null = this.current || this.jodit.editor.firstChild;
         if (start) {
             let sentence: string = '';
             this.eachMap(start, (elm: Node) => {
                 if (elm.nodeType === Node.TEXT_NODE && elm.nodeValue !== null && elm.nodeValue.length) {
                     let tmpSentence: string = next ? sentence + elm.nodeValue : elm.nodeValue + sentence;

                     if (search.compareStrings(tmpSentence, value, next)) {
                         sentence = tmpSentence;
                     } else {
                         sentence = '';
                     }
                 } else if (Dom.isBlock(elm) && sentence !== '') {
                     sentence = next ? sentence + ' ' : ' ' + sentence;
                 }
             }, next);

             if (sentence) {
                 console.log(sentence);
             }
         }
    };
    private isOpened: boolean = false;

    open = () => {
        this.searchBox.classList.add('jodit_search-active');
        this.current = this.jodit.selection.current();
        this.selInfo = this.jodit.selection.save();
        let sel: string = this.jodit.ownerWindow.getSelection().toString();
        if (sel) {
            this.query.value = sel;
            this.query.select();
        } else {
            this.query.focus();
        }
        this.isOpened = true;
    };
    selInfo :markerInfo[]|null = null;
    current :Node|false = false;
    close = () => {
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
            self.query = <HTMLInputElement>self.searchBox.querySelector('input.jodit_search-query');
            self.cancel = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-cancel');
            self.next = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-next');
            self.prev = <HTMLButtonElement>self.searchBox.querySelector('.jodit_search_buttons-prev');

            editor
                .__on(self.cancel, 'click', this.close)
                .__on(self.query, 'mousedown', () => {
                    if (editor.selection.isFocused()) {
                        editor.selection.clear();
                        self.selInfo = editor.selection.save();
                    }
                })
                .__on([self.next, self.prev], 'mousedown', function (this: HTMLButtonElement, e: MouseEvent) {
                    self.search(self.query.value, self.next === this);
                    e.preventDefault();
                    e.stopImmediatePropagation();
                })
                .__on(this.query, 'keydown', debounce((e: KeyboardEvent) => {
                    switch (e.which) {
                        case  consts.KEY_ESC:
                            this.close();
                            break;
                        case  consts.KEY_ENTER:
                            this.search(this.query.value, true);
                            break;
                        default:
                            this.jodit.options.searchByInput && this.search(this.query.value, true);
                            break;
                    }
                }, this.jodit.options.observer.timeout))
                .events
                .on('afterInit', () => {
                    editor.workplace.appendChild(this.searchBox);
                })
                .on('keydown mousedown', () => {
                    if (this.selInfo) {
                        editor.selection.clear();
                        this.selInfo = null;
                    }
                    if (this.isOpened) {
                        this.current = this.jodit.selection.current();
                    }
                })
                .on('keydown', (e: KeyboardEvent) => {
                    if (ctrlKey(e) && e.which === consts.KEY_F) {
                        this.open();
                        e.preventDefault();
                    }
                });
        }
    }
}