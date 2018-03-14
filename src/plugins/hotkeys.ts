/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {Component} from "../modules/Component";
import {asArray} from "../modules/Helpers";

declare module "../Config" {
    interface Config {
        commandToHotkeys: {[key: string]:string | string[]}
    }
}

/**
 * You can redefine hotkeys for some command
 *
 * var jodit = new Jodit('#editor', {
 *  commandToHotkeys: {
 *      bold: 'ctrl+shift+b',
 *      italic: ['ctrl+i', 'ctrl+b'],
 *  }
 * })
 * @type {{}}
 */
Config.prototype.commandToHotkeys = {
    removeFormat: 'ctrl+shift+m',
    insertOrderedList: 'ctrl+shift+7',
    insertUnorderedList: 'ctrl+shift+8',
    selectall: 'ctrl+a',
};

/**
 * Allow set hotkey for command or button
 */
export class hotkeys extends Component{
    specialKeys: {[key: number]: string} = {
        8: "backspace",
        9: "tab",
        10: "return",
        13: "return",
        16: "shift",
        17: "ctrl",
        18: "alt",
        19: "pause",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "insert",
        46: "del",
        59: ";",
        61: "=",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12",
        144: "numlock",
        145: "scroll",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
    };

    shiftNums: {[key: string]: string} = {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        ";": ": ",
        "'": "\"",
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
    };

    private possible: {[key: string]: boolean} = {};

    private onKeyPress = (event: KeyboardEvent): false | void => {
        const special: string | false = event.type !== "keypress" && this.specialKeys[event.which],
            character: string = String.fromCharCode(event.which).toLowerCase();

        let modif: string = "";

        if (event.metaKey && !event.ctrlKey) {
            modif += "ctrl+"; // for mac OS -  CMD will be CTRL
        }

        ["alt", "ctrl", "shift"].forEach( (specialKey) => {
            if ((<any>event)[specialKey + 'Key'] && special !== specialKey) {
                modif += specialKey + '+';
            }
        });

        if (event.metaKey && modif.indexOf("alt+ctrl+shift+") > -1) {
            modif = modif.replace("alt+ctrl+shift+", "hyper+");
        }

        if (special) {
            this.possible[modif + special] = true;
        }  else {
            this.possible[modif + character] = true;
            if (this.shiftNums[character]) {
                this.possible[modif + this.shiftNums[character]] = true;
            }

            // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
            if (modif === "shift+") {
                this.possible[this.shiftNums[character]] = true;
            }
        }


    };

    constructor(editor: Jodit) {
        super(editor);

        const commands: string[] = Object.keys(editor.options.commandToHotkeys);
        commands.forEach((commandName: string) => {
            const hotkeys: string | string[] | void = editor.options.commandToHotkeys[commandName];

            if (hotkeys) {
                editor.events
                    .off(asArray(hotkeys).map((hotkey: string) => hotkey + '.hotkey').join(' '))
                    .on(asArray(hotkeys).map((hotkey: string) => hotkey + '.hotkey').join(' '), () => {
                        return editor.execCommand(commandName); // because need `beforeCommand`
                    });
            }
        });


        editor.events
            .on('afterInit', () => {
                const runPossible: Function = (event: KeyboardEvent): void | false => {
                    let noStop: boolean = true;

                    Object.keys(this.possible).forEach((hotkey: string) => {
                        if (this.jodit.events.fire(hotkey, event.type) === false) {
                            noStop = false;
                        }
                    });

                    if (!noStop) {
                        return false;
                    }
                };

                let itIsHotkey: boolean = false;
                const self = this;

                editor.events
                    .on('keydown', (event: KeyboardEvent) : void | false => {
                        self.possible = {};
                        self.onKeyPress(event);

                        if (runPossible(event) === false) {
                            itIsHotkey = true;

                            editor.events.stopPropagation('keydown');

                            return false;
                        }

                    }, void(0), void(0), true)
                    .on('keyup', () : void | false => {
                        if (itIsHotkey) {
                            itIsHotkey = false;
                            editor.events.stopPropagation('keyup');
                            return false;
                        }
                    }, void(0), void(0), true);
            });
    }
}