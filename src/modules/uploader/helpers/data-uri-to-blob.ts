/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

/**
 * Convert dataURI to Blob. Both base64 and percent-encoded payloads are
 * supported — `data:image/svg+xml,%3Csvg...` is as valid as
 * `data:image/png;base64,...`
 */
export function dataURItoBlob(dataURI: string): Blob {
	const [header, ...rest] = dataURI.split(','),
		payload = rest.join(','),
		mimeString: string = header.split(':')[1]?.split(';')[0] ?? '',
		byteString: string = /;base64/i.test(header)
			? atob(payload)
			: decodeURIComponent(payload),
		ab: ArrayBuffer = new ArrayBuffer(byteString.length),
		ia: Uint8Array = new Uint8Array(ab);

	for (let i: number = 0; i < byteString.length; i += 1) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia.buffer as ArrayBuffer], { type: mimeString });
}
