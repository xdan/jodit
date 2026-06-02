/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/speech-recognize
 */

import { globalWindow } from 'jodit/core/constants';

import { PII } from 'jodit/plugins/speech-recognize/constants';

/**
 * One AudioContext per owner (e.g. a RecognizeManager). Previously a new context
 * was created on every beep and never closed, so during continuous recognition
 * they piled up — leaking until the browser's per-page limit was hit and the
 * overlapping audio turned into a "roar". We now reuse a single context per
 * owner and release it via {@link closeSound} when the owner is destroyed.
 * @internal
 */
const contexts = new WeakMap<object, AudioContext>();

function getContext(owner: object): AudioContext | null {
	if (!globalWindow) {
		return null;
	}

	const existing = contexts.get(owner);

	if (existing && existing.state !== 'closed') {
		return existing;
	}

	const Ctor: typeof AudioContext | undefined =
		(globalWindow as any).AudioContext ||
		(globalWindow as any).webkitAudioContext;

	if (!Ctor) {
		return null;
	}

	const context = new Ctor();
	contexts.set(owner, context);

	return context;
}

/**
 * Play a short beep on the owner's (lazily created, reused) AudioContext.
 * @internal
 */
export function sound(
	owner: object,
	{
		sec = 0.1,
		frequency = PII,
		gain = 0.1,
		type = 'sine'
	}: {
		sec?: number;
		frequency?: number;
		gain?: number;
		type?: 'sine' | 'square' | 'sawtooth' | 'triangle';
	} = {}
): void {
	const context = getContext(owner);

	if (!context) {
		return;
	}

	const vol = context.createGain();
	const osc = context.createOscillator();
	osc.type = type;
	osc.frequency.value = frequency; // Hz
	vol.gain.value = gain;
	osc.connect(vol);
	vol.connect(context.destination);
	osc.start(); // start the oscillator
	osc.stop(context.currentTime + sec);
}

/**
 * Close and forget the owner's AudioContext. Call this when the owner is
 * destroyed so the context does not leak.
 * @internal
 */
export function closeSound(owner: object): void {
	const context = contexts.get(owner);

	if (context) {
		contexts.delete(owner);

		if (context.state !== 'closed') {
			void context.close();
		}
	}
}
