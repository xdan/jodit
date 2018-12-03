/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IViewOptions } from './view';

export interface IDialogOptions extends IViewOptions {
    resizable?: boolean;
    draggable?: boolean;
}