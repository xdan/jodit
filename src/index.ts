/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import "./styles/bundle.less";
import './polyfills';

import {Jodit}            from './Jodit';
import {ToolbarIcon}          from './modules/ToolbarCollection';


import * as consts      from './constants';
import * as Plugins     from "./plugins/index";
import * as Modules     from "./modules/index";
import * as Languages   from "./langs/index";
import * as Icons       from "./styles/icons/index";

import {Config, OptionsDefault} from "./Config";

// copy constants in Jodit
Object.keys(consts).forEach((key: string) => {
    (<any>Jodit)[key] = (<any>consts)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons).filter(esFilter).forEach((key: string) => {
    ToolbarIcon.icons[key.replace('_', '-')] = (<any>Icons)[key];
});

// Modules
Object.keys(Modules).filter(esFilter).forEach((key: string) => {
    Jodit.modules[key] = (<any>Modules)[key];
});


//Plugins
Object.keys(Plugins).filter(esFilter).forEach((key: string) => {
    Jodit.plugins[key] = (<any>Plugins)[key];
});

// Languages
Object.keys(Languages).filter(esFilter).forEach((key: string) => {
    Jodit.lang[key] = (<any>Languages)[key];
});

Jodit.defaultOptions = new Config();
OptionsDefault.prototype = Jodit.defaultOptions;

declare let module: { hot: any };
if (module.hot) {
    module.hot.accept('./plugins/index', function() {
        Object.keys(Jodit.instances).forEach((id: string) => {
            let plainOptions = {...(<any>Jodit.instances[id].options).plainOptions};
            Jodit.instances[id].destruct();
            new Jodit('#' + id, plainOptions);
        });
    })
}

export = Jodit;