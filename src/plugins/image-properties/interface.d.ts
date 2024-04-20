/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/image-properties
 */

import type { ImageHAlign } from 'jodit/types';

export type EditValues = {
	style: string;
	imageSrc: string;
	borderRadius: number;
	imageTitle: string;
	imageAlt: string;
	imageLink: string;
	imageLinkOpenInNewTab: boolean;
	imageWidth: number | string;
	imageHeight: number | string;
	marginTop: number | string;
	marginRight: number | string;
	marginBottom: number | string;
	marginLeft: number | string;
	classes: string;
	id: string;
	align: ImageHAlign;
};

export interface ImagePropertiesState {
	image: HTMLImageElement;
	sourceImage: HTMLImageElement;
	ratio: number;
	sizeIsLocked: boolean;
	marginIsLocked: boolean;
	values: EditValues;
}

export interface ImagePropertiesAPI {
	openImageEditor: () => void;
	openImagePopup: (target: HTMLElement) => void;
}

export interface ImagePropertiesOptions {
	dialogWidth: number;

	/**
	 * Open editing dialog after double click on image
	 */
	openOnDblClick: boolean;

	/**
	 * Show edit 'src' input
	 */
	editSrc: boolean;

	/**
	 * Show crop/resize btn
	 */
	useImageEditor: boolean;

	/**
	 * Show edit 'title' input
	 */
	editTitle: boolean;

	/**
	 * Show edit 'alt' input
	 */
	editAlt: boolean;

	/**
	 * Show edit image link's options
	 */
	editLink: boolean;

	/**
	 * Show edit image size's inputs
	 */
	editSize: boolean;

	/**
	 * Show edit margin inputs
	 */
	editMargins: boolean;
	editBorderRadius: boolean;

	/**
	 * Show edit classNames input
	 */
	editClass: boolean;

	/**
	 * Pre-define available classes to select from
	 *
	 * Classes can be provided as list of strings or as list of tuples
	 * `["classname", "human label"]`.
	 *
	 * @example
	 * ```javascript
	 * new Jodit('#editor', {
	 *    image: {
	 *        availableClasses: [
	 *            "rte-image-width-50",
	 *            ["rte-image-width-75", "75 % width"]
	 *        ]
	 *    }
	 * })
	 * ```
	 */

	availableClasses: [string, string][] | string[];

	/**
	 * Show style edit input
	 */
	editStyle: boolean;

	/**
	 * Show edit ID input
	 */
	editId: boolean;

	/**
	 * Show Alignment selector
	 */
	editAlign: boolean;

	/**
	 * Show preview image
	 */
	showPreview: boolean;

	/**
	 * Select image after close dialog
	 */
	selectImageAfterClose: boolean;
}
