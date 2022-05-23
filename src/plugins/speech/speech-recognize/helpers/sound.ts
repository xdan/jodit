/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech/speech-recognize
 */

import { PII } from '../../constants';

export function Sound({
	sec = 0.1,
	sound = PII,
	gain = 0.1,
	type = 'sine'
}: {
	sec?: number;
	sound?: number;
	gain?: number;
	type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
} = {}): void {
	if (
		typeof window.AudioContext === 'undefined' &&
		typeof (window as any).webkitAudioContext === 'undefined'
	) {
		return;
	}

	// one context per document
	const context = new (window.AudioContext ||
		(window as any).webkitAudioContext)();

	const vol = context.createGain();
	const osc = context.createOscillator();
	osc.type = type;
	osc.frequency.value = sound; // Hz
	osc.connect(vol);
	vol.connect(context.destination);
	osc.start(); // start the oscillator
	osc.stop(context.currentTime + sec);
	vol.gain.value = gain;
}
