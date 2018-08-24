/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Plugin } from "../modules/Plugin";
declare module "../Config" {
    interface Config {
        showCharsCounter: boolean;
        showWordsCounter: boolean;
    }
}
/**
 * Show stat data - words and chars count
 */
export declare class stat extends Plugin {
    private charCounter;
    private wordCounter;
    private calc;
    afterInit(): void;
}
