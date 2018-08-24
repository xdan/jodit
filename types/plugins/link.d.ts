/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
/**
* @property {object}  link `{@link link|link}` plugin's options
* @property {boolean} link.followOnDblClick=true Follow lnk address after dblclick
* @property {boolean} link.processVideoLink=true Replace inserted youtube/vimeo link toWYSIWYG `iframe`
* @property {boolean} link.processPastedLink=true Wrap inserted link in &lt;a href="link">link&lt;/a>
* @property {boolean} link.openLinkDialogAfterPost=true Open Link dialog after post
* @property {boolean} link.removeLinkAfterFormat=true When the button is pressed toWYSIWYG clean format, if it was done on the link is removed like command `unlink`
*/
declare module "../Config" {
    interface Config {
        link: {
            followOnDblClick: boolean;
            processVideoLink: boolean;
            processPastedLink: boolean;
            openLinkDialogAfterPost: boolean;
            removeLinkAfterFormat: boolean;
            noFollowCheckbox: boolean;
            openInNewTabCheckbox: boolean;
        };
    }
}
/**
 * Process link. Insert, dbclick or remove format
 *
 * @module plugins/link
 */
export declare function link(jodit: Jodit): void;
