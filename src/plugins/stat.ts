/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from "../Config";
import {Plugin} from "../modules/Plugin";
import {throttle} from "../modules/Helpers";
import {INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP} from "../constants";

declare module "../Config" {
    interface Config {
        showCharsCounter: boolean,
        showWordsCounter: boolean,
    }
}

Config.prototype.showCharsCounter = true;
Config.prototype.showWordsCounter = true;


/**
 * Show stat data - words and chars count
 */
export class stat extends Plugin{
    private charCounter: HTMLElement;
    private wordCounter: HTMLElement;

    private  calc =  throttle(() => {
        let text: string = this.jodit.getEditorText();
        if (this.jodit.options.showCharsCounter) {
            this.charCounter.innerText = this.jodit.i18n('Chars: %d', text.replace(SPACE_REG_EXP, '').length);
        }
        if (this.jodit.options.showWordsCounter) {
            this.wordCounter.innerText = this.jodit.i18n('Words: %d',
                text
                    .replace(INVISIBLE_SPACE_REG_EXP, '')
                    .split(SPACE_REG_EXP)
                    .filter((e: string) => e.length).length
            );
        }
    }, this.jodit.defaultTimeout);

    afterInit() {
        if (this.jodit.options.showCharsCounter) {
            this.charCounter = this.jodit.ownerDocument.createElement('span');
            this.jodit.statusbar.append(this.charCounter, true);
        }
        if (this.jodit.options.showWordsCounter) {
            this.wordCounter = this.jodit.ownerDocument.createElement('span');
            this.jodit.statusbar.append(this.wordCounter, true);
        }

        this.jodit.events.on('change', this.calc);
        this.calc();
    }
}