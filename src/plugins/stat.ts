/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP } from '../constants';
import { throttle } from '../modules/helpers/async';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';

declare module '../Config' {
    interface Config {
        showCharsCounter: boolean;
        showWordsCounter: boolean;
    }
}

Config.prototype.showCharsCounter = true;
Config.prototype.showWordsCounter = true;

/**
 * Show stat data - words and chars count
 */
export class stat extends Plugin {
    private charCounter: HTMLElement | null;
    private wordCounter: HTMLElement | null;

    private calc = throttle(() => {
        const text: string = this.jodit.getEditorText();
        if (this.jodit.options.showCharsCounter && this.charCounter) {
            this.charCounter.innerText = this.jodit.i18n(
                'Chars: %d',
                text.replace(SPACE_REG_EXP, '').length
            );
        }
        if (this.jodit.options.showWordsCounter && this.wordCounter) {
            this.wordCounter.innerText = this.jodit.i18n(
                'Words: %d',
                text
                    .replace(INVISIBLE_SPACE_REG_EXP, '')
                    .split(SPACE_REG_EXP)
                    .filter((e: string) => e.length).length
            );
        }
    }, this.jodit.defaultTimeout);

    public afterInit() {
        if (this.jodit.options.showCharsCounter) {
            this.charCounter = this.jodit.create.span();
            this.jodit.statusbar.append(this.charCounter, true);
        }

        if (this.jodit.options.showWordsCounter) {
            this.wordCounter = this.jodit.create.span();
            this.jodit.statusbar.append(this.wordCounter, true);
        }

        this.jodit.events.on('change', this.calc);
        this.calc();
    }

    public beforeDestruct(): void {
        Dom.safeRemove(this.charCounter);
        Dom.safeRemove(this.wordCounter);

        this.charCounter = null;
        this.wordCounter = null;
    }
}
