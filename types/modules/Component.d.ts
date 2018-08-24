/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from "../Jodit";
import { IViewBased } from "./view/type";
export declare class Component {
    /**
     * @property{string} ID attribute for source element, id add {id}_editor it's editor's id
     */
    id: string;
    jodit: Jodit;
    constructor(jodit?: IViewBased | Jodit);
    protected __whoLocked: string | false;
    isLocked: () => boolean;
    isLockedNotBy: (name: string) => boolean;
    destruct(): void;
    private __modulesInstances;
    getInstance(moduleName: string, options?: object): Component;
    /**
     * Editor was destructed
     *
     * @type {boolean}
     */
    isDestructed: boolean;
}
