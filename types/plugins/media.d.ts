/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
declare module "../Config" {
    interface Config {
        mediaInFakeBlock: boolean;
        mediaFakeTag: string;
        mediaBlocks: string[];
    }
}
export declare function media(editor: Jodit): void;
