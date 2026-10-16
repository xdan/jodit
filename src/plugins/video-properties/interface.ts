/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/video-properties
 */

export type EditedMedia =
	HTMLVideoElement | HTMLAudioElement | HTMLIFrameElement;

export interface VideoPropertiesValues {
	width: number | string;
	height: number | string;
	poster: string;
	autoplay: boolean;
	loop: boolean;
	muted: boolean;
	controls: boolean;
}

export interface VideoPropertiesState {
	/**
	 * What the dialog was opened for: the media, or a wrapper round it
	 */
	target: HTMLElement;
	media: EditedMedia;
	ratio: number;
	sizeIsLocked: boolean;
	values: VideoPropertiesValues;
}

export interface VideoPropertiesAPI {
	openPosterPopup: (target: HTMLElement) => void;
}
