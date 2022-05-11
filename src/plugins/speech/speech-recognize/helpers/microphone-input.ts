/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const SpeechRecognition =
	(window as any).SpeechRecognition ||
	(window as any).webkitSpeechRecognition;

const PII = 440;
const WARN = 940;

export function Sound({
	sec = 0.1,
	sound = PII
}: {
	sec?: number;
	sound?: number;
} = {}): void {
	// one context per document
	const context = new (window.AudioContext ||
		(window as any).webkitAudioContext)();
	const vol = context.createGain();
	const osc = context.createOscillator(); // instantiate an oscillator
	osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
	osc.frequency.value = sound; // Hz
	osc.connect(vol); // connect it to the destination
	vol.connect(context.destination); // connect it to the destination
	osc.start(); // start the oscillator
	osc.stop(context.currentTime + sec); // stop 2 seconds after the current time

	vol.gain.value = 0.1;
}

export class WrapperRecognition {
	isEnabled: boolean = false;

	static instances: Map<typeof SpeechRecognition, Function> = new Map();

	private restartTimeout: number = 0;

	clearTimeout(): void {
		clearTimeout(this.restartTimeout);
	}

	private _onSpeechStart = (e: any): void => {
		if (!this.isEnabled) {
			return;
		}

		if (process.env.NODE_ENV === 'development') {
			console.info('SpeechStart:', e);
		}

		clearTimeout(this.restartTimeout);
		this.restartTimeout = setTimeout(() => {
			this.restart();
			this.setPulse(false);
			Sound({ sound: WARN });
		}, 5000) as unknown as number;

		this.setPulse(true);
	};

	constructor(
		private readonly native: typeof SpeechRecognition,
		private setPulse: (toggle: boolean) => void
	) {
		native.lang = 'ru-RU';
	}

	start(): void {
		this.isEnabled = true;
		this.native.start();
		this.on('speechstart', this._onSpeechStart);
	}

	end(): void {
		try {
			this.native.abort();
			this.native.stop();
		} catch {}
		this.off('speechstart', this._onSpeechStart);
		this.isEnabled = false;
	}

	restart(): void {
		if (this.isEnabled) {
			this.end();
		}

		this.start();
	}

	on(event: string, callback: Function): void {
		this.native.addEventListener(event, callback);
	}

	off(event: string, callback: Function): void {
		this.native.removeEventListener(event, callback);
	}
}

/**
export function MicrophoneInput({
	onSpeech
}: {
	onSpeech: (text: string) => void;
}): ReactElement {
	const [enabled, toggle] = useState(false);
	const [pulse, setPulse] = useState(false);

	const recognizer = useMemo(() => {
		const _recognizer = new WrapperRecognition(
			new SpeechRecognition(),
			setPulse
		);

		WrapperRecognition.instances.set(_recognizer, () => {
			_recognizer.end();
			toggle(false);
		});

		_recognizer.on('result', (e: any): void => {
			if (!_recognizer.isEnabled) {
				return;
			}

			if (process.env.NODE_ENV === 'development') {
				console.info('Result:', e);
			}

			setPulse(false);
		});

		['error'].forEach(eventName => {
			_recognizer.on(eventName, (e: any): void => {
				if (!_recognizer.isEnabled) {
					return;
				}

				if (process.env.NODE_ENV === 'development') {
					console.info(`${eventName}:`, e);
				}

				Sound({ sound: WARN });

				setPulse(false);
				recognizer.restart();
			});
		});

		return _recognizer;
	}, []);

	useEffect(() => {
		if (enabled) {
			for (const instance of WrapperRecognition.instances.keys()) {
				if (instance !== recognizer) {
					const clear = WrapperRecognition.instances.get(instance);

					if (typeof clear === 'function') {
						clear();
					}
				}
			}
		}
	}, [recognizer, enabled]);

	useEffect(() => {
		const onSpeechNative = (e: any): void => {
			if (!enabled) {
				return;
			}

			try {
				recognizer.clearTimeout();
				onSpeech(e.results[0][0].transcript);
			} catch {}

			recognizer.restart();
			Sound();
		};

		recognizer.on('result', onSpeechNative);

		return () => {
			recognizer.off('result', onSpeechNative);
		};
	}, [onSpeech, recognizer, enabled]);

	const onToggle = (e => {
		toggle(!enabled);

		if (!enabled) {
			recognizer.start();
		} else {
			recognizer.end();
		}

		e.stopPropagation();
		e.preventDefault();
	}) as MouseEventHandler<HTMLDivElement>;

	return (
		<div
			onPointerDown={onToggle}
			className={classNames(s.icon, s.iconButton, {
				[s.enabled]: enabled,
				[s.pulse]: pulse
			})}
		>
			<IconMicro />
		</div>
	);
}
*/
