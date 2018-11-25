/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { IControlTypeStrong } from "../../types/toolbar";
import { IViewBased } from "../../types/view";
import { Component } from "../Component";
import { dom } from "../Helpers";
import { ToolbarCollection } from "./collection";
import { ToolbarIcon } from "./icon";

export abstract class ToolbarElement extends Component {
    public container: HTMLElement;

    public parentToolbar: ToolbarCollection | null = null;

    protected constructor(jodit: IViewBased, containerTag: string = "li", containerClass: string = "jodit_toolbar_btn") {
        super(jodit);
        this.container = this.jodit.ownerDocument.createElement(containerTag);
        this.container.classList.add(containerClass);
    }

    public createIcon(clearName: string, control ?: IControlTypeStrong): HTMLElement {
        const icon: string = control ? control.icon || control.name : clearName;

        if (!this.jodit.options.textIcons) {
            let iconSVG: string | undefined | HTMLElement = this.jodit.events.fire("getIcon", icon, control, clearName);
            let iconElement: HTMLElement;

            if (control && control.iconURL && iconSVG === undefined) {
                iconElement = dom("<i></i>", this.jodit.ownerDocument);
                iconElement.style.backgroundImage =  "url(" + control.iconURL + ")";
            } else {
                if (iconSVG === undefined) {
                    if (ToolbarIcon.exists(icon)) {
                        iconSVG =  ToolbarIcon.getIcon(icon);
                    } else {
                        iconSVG =  ToolbarIcon.getIcon("empty");
                    }
                }

                iconElement = dom(iconSVG, this.jodit.ownerDocument);

            }

            iconElement.classList.add("jodit_icon", "jodit_icon_" + clearName);

            return iconElement;
        }

        return dom(`<span class="jodit_icon">${this.jodit.i18n(control ? control.name : clearName)}</span>`, this.jodit.ownerDocument);
    }
}
