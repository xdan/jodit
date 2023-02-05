/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

/**
 * Convert dataURI to Blob
 */
export function dataURItoBlob(dataURI: string): Blob {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this

	const byteString: string = atob(dataURI.split(',')[1]),
		// separate out the mime component
		mimeString: string = dataURI.split(',')[0].split(':')[1].split(';')[0],
		// write the bytes of the string to an ArrayBuffer
		ab: ArrayBuffer = new ArrayBuffer(byteString.length),
		ia: Uint8Array = new Uint8Array(ab);

	for (let i: number = 0; i < byteString.length; i += 1) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], { type: mimeString });
}
