/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/* eslint no-unused-vars: 0 */
/* eslint-disable tsdoc/syntax */

const box = document.createElement('div');
document.body.appendChild(box);

typeof before === 'function' &&
	before(async () => {
		if (typeof chai !== 'undefined') {
			window.expect = chai.expect;
			chai.config.includeStack = true;
			chai.config.showDiff = true;
			chai.config.truncateThreshold = 500;
		}

		if (typeof expect === 'undefined') {
			console.error('Please include chai.js');
		}
	});

const staff = [];

const stringify = Jodit.ns.Helpers.stringify;

typeof window.mocha !== 'undefined' && mocha.timeout(15000);
Jodit.constants.SET_TEST();
const oldI18n = Jodit.prototype.i18n,
	oldAjaxSender = Jodit.modules.Ajax.prototype.send,
	naturalPromise = window.Promise;

function mockPromise() {
	window.Promise = SynchronousPromise;
}

function unmockPromise() {
	window.Promise = naturalPromise;
}

let mockTimersCb = [];

const originalSetTimeout = window.setTimeout;
const originalClearTimeout = window.clearTimeout;

/**
 * Mock timers
 * ```javascript
 * let timers;
 * beforeEach(() => {
 *   timers = mockTimers();
 * });
 * afterEach(() => {
 *   timers.cleanup();
 * })
 * it('test', () => {
 *   timers.delay(100);
 *   timers.runAll();
 * });
 * ```
 * @returns {{delay(*): void, cleanup(): void, runAll(): void}}
 */
function mockTimers() {
	mockTimersCb = [];

	window.setTimeout = function (fn, delay) {
		mockTimersCb.push({
			fn,
			activationTime: Date.now() + delay
		});
		return mockTimersCb.length - 1;
	};

	window.clearTimeout = function (id) {
		mockTimersCb[id] = null;
	};

	return {
		delay(time) {
			const now = Date.now();
			for (let i = 0; i < mockTimersCb.length; i += 1) {
				const timer = mockTimersCb[i];
				if (timer && now + time >= timer.activationTime) {
					timer.fn();
					mockTimersCb[i] = null;
				}
			}
		},
		cleanup() {
			unmockTimers();
			mockTimersCb = [];
		},
		runAll() {
			mockTimersCb.forEach(({ fn }) => {
				fn && fn();
			});
			mockTimersCb = [];
		}
	};
}

function unmockTimers() {
	window.setTimeout = originalSetTimeout;
	window.clearTimeout = originalClearTimeout;
}

if (typeof window.skipTest === 'undefined') {
	window.skipTest = {};
}

if (typeof window.toolbarButtonsCount !== 'number') {
	window.toolbarButtonsCount = 41;
	window.toolbarButtonsCountMD = 31;
	window.toolbarButtonsCountSM = 19;
	window.toolbarButtonsCountXS = 13;
}

/**
 *
 * @param {number} timeout
 * @return {*}
 */
function delay(timeout) {
	return new naturalPromise(resolve => {
		/*ok*/ setTimeout(resolve, timeout);
	});
}

/**
 * Waiting for Jodit event. If event not fired in timeout - resolve
 *
 * @param {IJodit} editor
 * @param {string} event
 * @param {number} [timeout]
 * @returns {Promise<void>}
 */
function waitingForEvent(editor, event, timeout = 1000) {
	return new naturalPromise(resolve => {
		let timer = 0;

		if (timeout) {
			timer = setTimeout(() => {
				editor.e.off(event, resolve);
				resolve();
			}, timeout);
		}

		editor.e.one(event, () => {
			clearTimeout(timer);
			resolve();
		});
	});
}

/**
 * Waiting for image loaded
 * ```js
 * let image = new Image();
 * image.src = 'https://xdsoft.net/jodit/images/artio.jpg';
 * await waitForImageLoaded(image);
 * ```
 * @param {HTMLImageElement} image
 * @returns {Promise<void>}
 */
function waitForImageLoaded(image) {
	return new naturalPromise(resolve => {
		if (image.complete) {
			resolve();
		} else {
			image.onload = resolve;
		}
	});
}

/**
 * Waiting for condition
 * ```js
 * await waitForCondition(() => {
 *  return document.querySelector('.jodit');
 * }, 1000);
 * ```
 * @param condition
 * @param timeout
 * @returns {*}
 */
function waitForCondition(condition, timeout = 1000) {
	return new naturalPromise((resolve, reject) => {
		let time = Date.now();

		let fallbackTimer;

		const callFallback = () => {
			clearTimeout(fallbackTimer);
			reject('Timeout waitForCondition');
		};

		fallbackTimer = setTimeout(callFallback, timeout);

		requestAnimationFrame(function check() {
			if (Date.now() - time > timeout) {
				callFallback();
			} else {
				if (condition()) {
					clearTimeout(fallbackTimer);
					resolve();
				} else {
					requestAnimationFrame(check);
				}
			}
		});
	});
}

function idle() {
	return new naturalPromise(resolve => {
		typeof requestIdleCallback === 'function'
			? requestIdleCallback(resolve)
			: setTimeout(resolve, 0);
	});
}

const defaultPermissions = {
	permissions: {
		allowFiles: true,
		allowFileMove: true,
		allowFileUpload: true,
		allowFileUploadRemote: true,
		allowFileRemove: true,
		allowFileRename: true,
		allowFolders: true,
		allowFolderMove: true,
		allowFolderCreate: true,
		allowFolderRemove: true,
		allowFolderRename: true,
		allowImageResize: true,
		allowImageCrop: true
	}
};

function mockAjax() {
	if (typeof window.expect !== 'undefined') {
		let temp = {};
		Jodit.modules.Ajax.prototype.send = function () {
			const ajax = this;

			const request = this.prepareRequest();

			let action = request.data.action;
			let path = request.data.path;

			if (!action && request.data.get) {
				action = request.data.get('action');
			}

			if (
				action === undefined &&
				request.url &&
				request.url.match(/action=/)
			) {
				const actionExec = /action=([\w]+)/.exec(request.url);
				action = actionExec[1];
			}

			const files = path => {
				const list = [
					{
						file: '1966051_524428741092238_1051008806888563137_o.jpg',
						thumb: '_thumbs/1966051_524428741092238_1051008806888563137_o.jpg',
						changed: '03/15/2018 12:40 PM',
						size: '126.59kB',
						isImage: true
					},
					{
						file: 'images.jpg',
						thumb: '_thumbs/images.jpg',
						changed: '01/15/2018 12:40 PM',
						size: '6.84kB',
						isImage: true
					},
					{
						file: 'ibanez-s520-443140.jpg',
						thumb: '_thumbs/ibanez-s520-443140.jpg',
						changed: '04/15/2018 12:40 PM',
						size: '18.73kB',
						isImage: true
					},
					{
						file: 'test.txt',
						thumb: '_thumbs/test.txt.png',
						changed: '05/15/2018 12:40 PM',
						size: '18.72kB',
						isImage: false
					}
				];

				switch (path) {
					case 'test':
						return [list[1], list[2]];

					case 'ceicom':
						return [list[0], list[3]];

					default:
						return list;
				}
			};

			const makeResponse = (resp = {}) => ({
				json() {
					return Promise.resolve(resp);
				}
			});

			// eslint-disable-next-line complexity
			return new Promise(resolve => {
				switch (action) {
					case 'folderCreate': {
						temp.folderName = ajax.options.data.name;

						resolve({
							success: true,
							time: '2020-08-04 19:03:23',
							data: { code: 220 }
						});

						break;
					}

					case 'folderRemove':
					case 'folderRename': {
						temp.folderName = ajax.options.data.newname;
						resolve({
							success: true,
							time: '2020-08-04 19:03:23',
							data: { code: 220 }
						});
						break;
					}
					case 'fileUpload': {
						const file = ajax.options.data.getName('files[0]');
						resolve({
							success: true,
							time: '2018-03-31 23:38:54',
							data: {
								baseurl: 'https://xdsoft.net/jodit/files/',
								messages: [],
								files: [file],
								isImages: [/\.(png|jpg|gif)$/.test(file)],
								code: 220
							}
						});
						break;
					}
					case 'files':
						resolve({
							success: true,
							time: '2018-03-15 12:49:49',
							data: {
								sources: [
									{
										name: 'default',
										baseurl:
											'https://xdsoft.net/jodit/files/',
										path: '',
										files: files(path)
									}
								],
								code: 220
							}
						});
						break;

					case 'folders': {
						const folderName = temp.folderName || 'ceicom';
						delete temp.folderName;

						const FIRST_SOURCE = {
							name: 'default',
							title: 'Some files',
							baseurl: 'https://xdsoft.net/jodit/files/',
							path: '',
							folders: ['.', folderName, 'FolderInArea2', 'test']
						};

						const SECOND_SOURCE = {
							name: 'second',
							title: 'Other files',
							baseurl: 'https://xdsoft.net/jodit/files/others/',
							path: '',
							folders: ['.', 'ceicom1', 'test2']
						};

						if (path === '') {
							resolve({
								success: true,
								time: '2018-03-15 12:49:49',
								data: {
									sources: [FIRST_SOURCE, SECOND_SOURCE],
									code: 220
								}
							});
						} else if (request.data.source === 'default') {
							switch (path) {
								case 'ceicom':
									resolve({
										success: true,
										time: '2018-03-15 12:49:49',
										data: {
											sources: [
												{
													...FIRST_SOURCE,
													path: 'ceicom',
													folders: [
														'.',
														'..',
														'subceicom'
													]
												}
											]
										}
									});
									break;
								case 'FolderInArea2':
									resolve({
										success: true,
										time: '2018-03-15 12:49:49',
										data: {
											sources: [
												{
													...FIRST_SOURCE,
													path: 'FolderInArea2',
													folders: ['.', '..']
												}
											]
										}
									});
									break;
							}
						} else if (request.data.source === 'second') {
							switch (path) {
								case 'ceicom1/subceicom1':
									resolve({
										success: true,
										time: '2018-03-15 12:49:49',
										data: {
											sources: [
												{
													...SECOND_SOURCE,
													path: 'ceicom1/subceicom1',
													folders: [
														'.',
														'..',
														'subceicom2'
													]
												}
											]
										}
									});
								case 'ceicom1':
									resolve({
										success: true,
										time: '2018-03-15 12:49:49',
										data: {
											sources: [
												{
													...SECOND_SOURCE,
													path: 'ceicom1',
													folders: [
														'.',
														'..',
														'subceicom1'
													]
												}
											]
										}
									});
									break;
							}
						}
						break;
					}

					case 'permissions':
						resolve({
							success: true,
							time: '2018-03-15 12:49:49',
							data: defaultPermissions,
							code: 220
						});
						break;

					case 'fileUploadRemote':
						resolve({
							success: true,
							time: '2018-03-15 12:45:03',
							data: {
								newfilename: 'artio.jpg',
								baseurl: 'https://xdsoft.net/jodit/files/',
								code: 220
							}
						});
						break;

					case 'getLocalFileByUrl':
						switch (ajax.options.data.url) {
							case location.protocol +
								'//' +
								location.host +
								'/artio.jpg':
							case location.protocol +
								'//' +
								location.host +
								'/tests/artio.jpg':
							case location.protocol +
								'//' +
								location.host +
								'/test/tests/artio.jpg':
							case location.protocol +
								'//' +
								location.host +
								'/jodit/test/tests/artio.jpg':
							case 'https://xdsoft.net/jodit/files/th.jpg':
								resolve({
									success: true,
									time: '2018-03-15 12:55:00',
									data: {
										path: '',
										name: 'th.jpg',
										source: 'default',
										code: 220
									}
								});
								break;

							default:
								resolve({
									success: false,
									time: '2018-03-15 12:08:54',
									data: {
										messages: [
											'The File does not exist or is above the root of the connector'
										],
										code: 424
									}
								});
								break;
						}

						break;
					default:
						break;
				}
			}).then(makeResponse);
		};
	}
}

function unmockAjax() {
	Jodit.modules.Ajax.prototype.send = oldAjaxSender;
}

typeof before === 'function' &&
	before(() => {
		if (typeof window.expect !== 'undefined') {
			mockPromise();
			mockAjax();
			window.FormData = function () {
				this.data = {};
				this.names = {};
				this.append = function (key, value, name) {
					this.data[key] = value;
					this.names[key] = name;
				};
				this.get = function (key) {
					return this.data[key];
				};
				this.getName = function (key) {
					return this.names[key];
				};
			};
		}
	});

const i18nkeys = new Set();
const excludeI18nKeys = new Set([
	'символ',
	'test',
	'speechRecognize',
	'quote',
	'quotes',
	'open quote',
	'header',
	'header h1',
	'select all',
	'dot',
	'question',
	'space',
	'hyphen',
	'underline',
	'comma',
	'remove word',
	'delete word',
	'enter',
	'The File does not exist or is above the root of the connector',
	'bar',
	'Classe 1',
	'Classe 2',
	'Classe 3',
	'Classe 4',
	'Classe 5',
	'classSpan',
	'text3',
	'text2',
	'text1',
	'Class name',
	'https://',
	'http://',
	'rect',
	'empty',
	'adddate',
	'URL',
	'Hello',
	'Custom',
	'list_test',
	'OS System Font',
	'Courier New',
	'Trebuchet MS',
	'Lucida Sans Unicode',
	'insert Header 1',
	'insert Header 2',
	'Empty editor',
	'Helvetica,sans-serif',
	'Helvetica',
	'Arial,Helvetica,sans-serif',
	'Arial',
	'Georgia,serif',
	'Georgia',
	'Impact,Charcoal,sans-serif',
	'Impact',
	'Tahoma,Geneva,sans-serif',
	'Tahoma',
	"'Times New Roman',Times,serif",
	'Times New Roman',
	'Verdana,Geneva,sans-serif',
	'Verdana',
	'copyformat',
	'Lower Alpha',
	'Lower Greek',
	'Lower Roman',
	'Upper Alpha',
	'Upper Roman'
]);

Jodit.prototype.i18n = function (key) {
	!excludeI18nKeys.has(key) &&
		!i18nkeys.has(key) &&
		!key.includes('<svg') &&
		i18nkeys.add(key);

	return oldI18n.apply(this, arguments);
};

Jodit.defaultOptions.events.afterInit = function (editor) {
	editor &&
		editor.container.setAttribute('data-test-case', window.mochaTestName);
};

Jodit.defaultOptions.filebrowser.saveStateInStorage = false;
Jodit.defaultOptions.wrapNodes.emptyBlockAfterInit = false;
Jodit.defaultOptions.history.timeout = 0;
Jodit.defaultOptions.defaultTimeout = 0;
Jodit.defaultOptions.filebrowser.defaultTimeout = 0;
Jodit.modules.View.defaultOptions.defaultTimeout = 0;

if (Jodit.defaultOptions.cleanHTML) {
	Jodit.defaultOptions.cleanHTML.timeout = 0;
	Jodit.defaultOptions.cleanHTML.fillEmptyParagraph = false;
}

Jodit.defaultOptions.resizer.forImageChangeAttributes = false;

Jodit.defaultOptions.sourceEditor = 'area';
Jodit.defaultOptions.language = 'en';
Jodit.defaultOptions.iframeCSSLinks.push('/app.css');
Jodit.defaultOptions.iframeStyle +=
	'* {\
  -webkit-box-sizing: border-box;\
  -moz-box-sizing: border-box;\
  box-sizing: border-box;\
}\
td,th {\
  padding: 2px 5px;\
  vertical-align: top;\
}';

function flatten(obj) {
	var result = Object.create(obj);
	for (var key in result) {
		// eslint-disable-next-line no-self-assign
		result[key] = result[key];
	}
	return result;
}

function getBox() {
	return box;
}

function removeStuff() {
	Object.keys(Jodit.instances).forEach(function (key) {
		Jodit.instances[key].destruct();
	});

	staff.forEach(function (elm) {
		elm && elm.parentNode && elm.parentNode.removeChild(elm);
	});

	staff.length = 0;

	Array.from(
		document.querySelectorAll(
			'.jodit.jodit-dialog.jodit-dialog_active_true'
		)
	).forEach(function (dialog) {
		simulateEvent('close_dialog', 0, dialog);
	});

	Jodit.modules.Ajax.log.length = 0;

	getBox().removeAttribute('style');

	mockPromise();
	unmockTimers();
}

if (typeof afterEach === 'function') {
	afterEach(removeStuff);
}

if (typeof beforeEach === 'function') {
	beforeEach(function () {
		window.mochaTestName = this.test.ctx.currentTest.fullTitle();
	});
}

/**
 * Create and insert into DOM test textarea
 *
 * @param [id]
 * @param [noput]
 * @returns {HTMLTextAreaElement}
 */
function appendTestArea(id, noput) {
	const textarea = document.createElement('textarea');
	textarea.setAttribute('id', id || 'editor_' + new Date().getTime());
	box.appendChild(textarea);

	!noput && staff.push(textarea);
	return textarea;
}

/**
 * Jodit Factory
 *
 * @param {object} [options]
 * @param {HTMLElement|undefined} [element]
 * @return {IJodit}
 */
function getJodit(options, element) {
	const editor = Jodit.make(element || appendTestArea(), options);

	window.scrollTo({
		left: 0,
		top: Jodit.modules.Helpers.offset(editor.container, editor, editor.od)
			.top,
		behavior: 'instant'
	});

	editor.container &&
		editor.container.setAttribute('data-test-case', window.mochaTestName);

	return editor;
}

/**
 * Create empty DIV block and it inside Box
 *
 * @param [id]
 * @param [noput]
 * @returns {HTMLDivElement}
 */
function appendTestDiv(id, noput) {
	const textarea = document.createElement('div');
	textarea.setAttribute('id', id || 'editor_' + new Date().getTime());
	box.appendChild(textarea);
	!noput && staff.push(textarea);
	return textarea;
}

function trim(value) {
	return value.replace(/^[\s\r\t\n]+/g, '').replace(/[\s\r\t\n]+$/g, '');
}

function toFixedWithoutRounding(value, precision) {
	const factorError = Math.pow(10, 14);
	const factorTruncate = Math.pow(10, 14 - precision);
	const factorDecimal = Math.pow(10, precision);
	return (
		Math.floor(Math.floor(value * factorError + 1) / factorTruncate) /
		factorDecimal
	);
}

function sortStyles(matches) {
	let styles = matches
		.replace(/&quot;/g, "'")
		.replace(/"/g, "'")
		.split(';');

	styles = styles.map(trim).filter(function (elm) {
		return elm.length;
	});

	let border = null;

	styles = styles
		.map(function (elm) {
			const keyValue = elm.split(':').map(trim);

			if (keyValue[0] === 'border-image') {
				return null;
			}

			if (/rgb\(/.test(keyValue[1])) {
				keyValue[1] = keyValue[1].replace(
					/rgb\([^)]+\)/,
					function (match) {
						return Jodit.modules.Helpers.normalizeColor(match);
					}
				);
			}

			if (keyValue[0].match(/^border$/)) {
				keyValue[1] = keyValue[1].split(/[\s]+/);
			}

			if (keyValue[0].match(/^border-(style|width|color)/)) {
				if (border == null) {
					border = keyValue;
					keyValue[0] = 'border';
					keyValue[1] = [keyValue[1]];
				} else {
					border[1].push(keyValue[1]);
					return null;
				}
			}

			if (/font-family/i.test(keyValue[0])) {
				keyValue[1] = keyValue[1]
					.split(',')
					.map(Jodit.modules.Helpers.trim)
					.map(function (value) {
						return value.replace(/['"]/g, '');
					})
					.join(',');
			}

			if (/%$/.test(keyValue[1])) {
				const fl = parseFloat(keyValue[1]),
					nt = parseInt(keyValue[1], 10);
				if (fl - nt > 0) {
					keyValue[1] = toFixedWithoutRounding(fl, 2) + '%';
				}
			}

			return keyValue;
		})
		.filter(function (a) {
			return a != null;
		})
		.map(function (a) {
			return a
				.map(function (item) {
					return typeof item === 'string'
						? item
						: item.sort().join(' ');
				})
				.join(':');
		})
		.sort(function (a, b) {
			if (a < b) {
				return -1;
			}

			return a > b ? 1 : 0;
		});

	return styles.join(';');
}

function sortAttributes(html, excludeAttr = []) {
	const tag = /<([^>]+)>/g;
	const reg = /([a-z_-]+)[\s]*=[\s]*"([^"]*)"/i,
		tags = [];

	let matches, tagMatch;

	while ((tagMatch = tag.exec(html))) {
		const attrs = [];

		let newTag = tagMatch[0];

		do {
			matches = reg.exec(newTag);

			if (!matches) {
				break;
			}

			const attributeName = matches[1].toLowerCase();

			if (excludeAttr.includes(attributeName)) {
				newTag = newTag.replace(matches[0], '');
				continue;
			}

			if (attributeName === 'style') {
				matches[2] = sortStyles(matches[2]);
			}

			if (attributeName !== 'unselectable') {
				attrs.push({
					name: attributeName,
					value: matches[2]
				});

				newTag = newTag.replace(
					matches[0],
					'attribute:' + attrs.length
				);
			} else {
				newTag = newTag.replace(' ' + matches[0], '');
			}
		} while (matches);

		attrs.sort(function (a, b) {
			if (a.name < b.name) {
				return -1;
			}

			return a.name > b.name ? 1 : 0;
		});

		attrs.forEach(function (elm, i) {
			newTag = newTag
				.replace(
					'attribute:' + (i + 1),
					elm.name.trim() + '="' + elm.value + '"'
				)
				.replace(/[ ]{2,}/, ' ');
		});

		newTag = newTag.replace(/<([^>]+)\s+>/, '<$1>');

		tags.push({
			name: tagMatch[0],
			value: newTag
		});
	}

	tags.forEach(function (elm) {
		html = html.replace(elm.name, elm.value);
	});

	return html
		.replace(/&nbsp;/g, ' ')
		.replace(Jodit.INVISIBLE_SPACE_REG_EXP(), '');
}

/**
 * Fill the box some elements for space
 * @param count
 */
function fillBoxBr(count) {
	for (let i = 0; i < 100; i += 1) {
		const br = document.createElement('br');
		getBox().appendChild(br);
		staff.push(br);
	}
}

const codeKey = {
	8: 'Backspace',
	13: 'Enter',
	38: 'ArrowUp',
	40: 'ArrowDown',
	55: '7',
	56: '8',
	73: 'i',
	70: 'f',
	72: 'h',
	75: 'k',
	86: 'v',
	89: 'y',
	114: 'F3'
};

const keyCode = Object.keys(codeKey).reduce((res, code) => {
	res[codeKey[code]] = code;
	return res;
}, {});

/**
 *
 * @param {string|string[]} type
 * @param {string|number|HTMLElement|Jodit|Window} keyCodeOrElement
 * @param {HTMLElement|Jodit|undefined} [elementOrApplyOpt]
 * @param {Function} [applyOpt]
 *
 * @returns boolean
 */
function simulateEvent(type, keyCodeOrElement, elementOrApplyOpt, applyOpt) {
	if (Array.isArray(type)) {
		return type.forEach(function (event) {
			simulateEvent(event, keyCodeOrElement, elementOrApplyOpt, applyOpt);
		});
	}

	let element = elementOrApplyOpt;
	if (typeof keyCodeOrElement === 'object') {
		element = keyCodeOrElement;
		keyCodeOrElement = null;

		if (typeof elementOrApplyOpt === 'function') {
			applyOpt = elementOrApplyOpt;
		}
	}

	if (Array.isArray(element)) {
		return element.forEach(function (elm) {
			simulateEvent(type, keyCodeOrElement, elm, applyOpt);
		});
	}

	if (element instanceof Jodit) {
		element = element.editor;
	}

	const evt = (element.ownerDocument || document).createEvent('HTMLEvents');

	evt.initEvent(type, true, true);

	if (keyCodeOrElement) {
		if (typeof keyCodeOrElement === 'number') {
			evt.keyCode = keyCodeOrElement;
			evt.which = keyCodeOrElement;
			evt.key = codeKey[keyCodeOrElement];
		} else if (typeof keyCodeOrElement !== 'object') {
			evt.key = keyCodeOrElement;
			evt.which = keyCode[keyCodeOrElement];
		}
	}

	if (element.getBoundingClientRect && evt.clientX === undefined) {
		const pos = Jodit.modules.Helpers.position(element);
		evt.clientX = pos.left + 5;
		evt.clientY = pos.top + 5;
	}

	if (applyOpt) {
		const result = applyOpt(evt);
		if (result) {
			Object.assign(evt, result);
		}
	}

	if (type.match(/^mouse/)) {
		['pageX', 'pageY', 'clientX', 'clientY'].forEach(function (key) {
			if (evt[key] === undefined) {
				evt[key] = 0;
			}
		});
	}

	if (type.match(/^touch/) && !evt.changedTouches) {
		const changedTouches = {};

		['pageX', 'pageY', 'clientX', 'clientY'].forEach(function (key) {
			changedTouches[key] = evt[key];
		});

		evt.changedTouches = changedTouches;
	}

	return element.dispatchEvent(evt);
}

/**
 * @param {Jodit} editor
 * @return {HTMLElement|null}
 */
function getOpenedPopup(editor) {
	const root = (editor.o && editor.o.shadowRoot) || editor.ownerDocument;
	const popups = root.querySelectorAll(
		'[role="popup"][data-editor_id="' + editor.id + '"]:last-child'
	);
	return popups.length ? popups[popups.length - 1] : null;
}

/**
 * @param {Jodit} editor
 * @return {HTMLElement|null}
 */
function getOpenedDialog(editor) {
	const dlgs = editor.ownerDocument.querySelectorAll('.jodit-dialog');

	return dlgs.length ? dlgs[dlgs.length - 1] : null;
}

/**
 * Find button inside element
 *
 * @param {string} buttonName
 * @param {Jodit|Element} joditOrElement
 * @param {string} [role]
 * @param {boolean} [last]
 * @returns {HTMLElement|null}
 */
function getButton(buttonName, joditOrElement, role, last) {
	const elm = joditOrElement.container || joditOrElement;

	const classes = ['jodit-toolbar-button', 'jodit-ui-button'];
	const roleSelector = role ? `[role="${role}"]` : '[role]';
	let button;

	if (!/\s/.test(buttonName)) {
		for (const className of classes) {
			const prefix = `.${className}.${className}_${buttonName}${last ? ':last-child' : ''}`;
			button = elm.querySelector(`${prefix} ${roleSelector}`);

			if (button) {
				return button;
			}

			button = elm.querySelector(`${prefix}${roleSelector}`);

			if (button) {
				return button;
			}
		}

		if (button) {
			return button;
		}
	}

	if (!role) {
		button = getButton(buttonName, elm, 'button', last);

		if (button) {
			return button;
		}
	}

	return (
		Array.from(elm.querySelectorAll(roleSelector)).find(button => {
			if (
				button.textContent.trim().toLowerCase() ===
				buttonName.toLowerCase()
			) {
				return button;
			}
		}) || null
	);
}

/**
 * Click and trigger some button event
 *
 * @param {string} buttonName
 * @param {Jodit|HTMLElement} joditOrElement
 * @param {string} [role]
 * @param {boolean} [last]
 */
function clickButton(buttonName, joditOrElement, role, last) {
	simulateEvent(
		['mousedown', 'mouseup', 'click'],
		getButton(buttonName, joditOrElement, role, last)
	);
}

function clickTrigger(buttonName, joditOrElement) {
	clickButton(buttonName, joditOrElement, 'trigger');
}

/**
 * Select table cells
 * @param {Jodit} editor
 * @param {number[]} indexes
 */
function selectCells(editor, indexes) {
	const cells = editor.editor.querySelectorAll('td,th');
	indexes.forEach(index => {
		editor.getInstance('Table', editor.options).addSelection(cells[index]);
	});
}

/**
 * Set listener and remove it after the first call
 *
 * @param {string} event
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function one(event, element, callback) {
	const on = function () {
		element.removeEventListener(event, on);
		callback(element, ...arguments);
	};

	element.addEventListener(event, on);
}

/**
 * Set one handler for load image
 *
 * @param {HTMLImageElement} image
 * @param {Function} callback
 */
function onLoadImage(image, callback = () => {}) {
	return new naturalPromise(resolve => {
		if (!image.complete) {
			one('load', image, () => {
				callback.call(image);
				resolve();
			});
		} else {
			callback.call(image);
			resolve();
		}
	});
}

/**
 *
 * @param {HTMLElement} element
 * @param {string} pastedText
 * @param {string} type
 */
function simulatePaste(element, pastedText, type) {
	simulateEvent('paste', element, function (data) {
		data.clipboardData = {
			types: [type || 'text/html'],
			getData: function () {
				return pastedText;
			}
		};
	});
}

function setCursor(elm, inEnd) {
	const range = document.createRange();
	range.selectNodeContents(elm);
	range.collapse(!inEnd);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
}

/**
 * Set cursor inside the editor by some char
 *
 * @param {Jodit} editor
 * @param {string} [char]
 * @return boolean
 */
function setCursorToChar(editor, char = '|') {
	const r = editor.s.createRange();
	let foundEdges = [];

	Jodit.modules.Dom.each(editor.editor, function (node) {
		if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(char)) {
			let index = -1;
			do {
				index = node.nodeValue.indexOf(char, index + 1);

				if (index !== -1) {
					node.nodeValue = node.nodeValue.replace(char, '');
					foundEdges.push([node, index]);
				}
			} while (index !== -1);
		}

		return true;
	});

	if (foundEdges.length) {
		if (foundEdges[0]) {
			r.setStart(foundEdges[0][0], foundEdges[0][1]);
		}

		if (foundEdges[1]) {
			r.setEnd(foundEdges[1][0], foundEdges[1][1]);
		}

		editor.s.selectRange(r);

		return true;
	}

	return false;
}

/**
 * Set cursor inside the editor by some char
 *
 * @param {Jodit} editor
 * @param {string} [char]
 * @return boolean
 */
function replaceCursorToChar(editor, char = '|') {
	editor.s.fakes().forEach(m => {
		Jodit.modules.Dom.after(m, editor.createInside.text(char));
		Jodit.modules.Dom.safeRemove(m);
	});

	return false;
}

function createPoint(x, y, color, fixed = false) {
	const div = document.createElement('div');

	div.setAttribute(
		'style',
		'position: ' +
			(fixed ? 'fixed' : 'absolute') +
			'; z-index: 1000000000;width: 5px; height: 5px; background: ' +
			(color || 'red') +
			';'
	);

	div.style.left = parseInt(x, 10) + 'px';
	div.style.top = parseInt(y, 10) + 'px';

	document.body.appendChild(div);
	staff.push(div);
}

function offset(el) {
	const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft,
		width: rect.width,
		height: rect.height
	};
}

function fillXY(data, editor) {
	data.clientX = 50;
	data.clientY =
		20 +
		Jodit.modules.Helpers.position(editor.editor, editor, editor.od).top;
}

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in an SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in an HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * It Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */
(function () {
	const serializeXML = function (node, output) {
		const nodeType = node.nodeType;

		if (nodeType === 3) {
			output.push(
				node.textContent
					.replace(/&/, '&amp;')
					.replace(/</, '&lt;')
					.replace('>', '&gt;')
			);
		} else if (nodeType === 1) {
			output.push('<', node.tagName);

			if (node.hasAttributes()) {
				const attrMap = node.attributes;

				for (let i = 0, len = attrMap.length; i < len; ++i) {
					const attrNode = attrMap.item(i);
					output.push(' ', attrNode.name, "='", attrNode.value, "'");
				}
			}

			if (node.hasChildNodes()) {
				output.push('>');
				const childNodes = node.childNodes;

				for (let i = 0, len = childNodes.length; i < len; i += 1) {
					serializeXML(childNodes.item(i), output);
				}

				output.push('</', node.tagName, '>');
			} else {
				output.push('/>');
			}
		} else if (nodeType === 8) {
			output.push('<!--', node.nodeValue, '-->');
		} else {
			throw new Error(
				'Error serializing XML. Unhandled node of a type: ' + nodeType
			);
		}
	};

	// The innerHTML DOM property for SVGElement.
	Object.defineProperty(SVGElement.prototype, 'innerHTML', {
		get: function () {
			const output = [];
			let childNode = this.firstChild;

			while (childNode) {
				serializeXML(childNode, output);
				childNode = childNode.nextSibling;
			}

			return output.join('');
		},
		set: function (markupText) {
			// Wipe out the current contents of the element.
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}

			try {
				// Parse the markup into valid nodes.
				const dXML = new DOMParser();

				dXML.async = false;
				// Wrap the markup into an SVG node to ensure parsing works.
				const sXML =
					"<svg xmlns='http://www.w3.org/2000/svg'>" +
					markupText +
					'</svg>';
				const svgDocElement = dXML.parseFromString(
					sXML,
					'text/xml'
				).documentElement;

				// Now take each node, import it and append to this element.
				let childNode = svgDocElement.firstChild;

				while (childNode) {
					this.appendChild(
						this.ownerDocument.importNode(childNode, true)
					);

					childNode = childNode.nextSibling;
				}
			} catch (e) {
				throw new Error('Error parsing XML string' + e.toString());
			}
		}
	});

	// The innerSVG DOM property for SVGElement.
	Object.defineProperty(SVGElement.prototype, 'innerSVG', {
		get: function () {
			return this.innerHTML;
		},
		set: function (markupText) {
			this.innerHTML = markupText;
		}
	});
})();

// Files
function FileImage() {
	return {
		name: 'logo.gif',
		dataURI:
			'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
		type: 'image/gif'
	};
}

// Files
function FileXLS() {
	return {
		name: 'file.xls',
		type: 'application/xls'
	};
}

typeof before === 'function' &&
	before(() => {
		if (typeof window.expect !== 'undefined') {
			window.FileReader = function () {
				const self = this;
				self.result = null;
				/**
				 *
				 * @param {FileImage} file
				 */
				self.readAsDataURL = function (file) {
					self.result = file.dataURI;
					self.onloadend && self.onloadend();
				};
			};
		}

		Object.defineProperty(navigator, 'userAgent', {
			value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 YaBrowser/18.9.0.3363 Yowser/2.5 Safari/537.36'
		});
	});

/**
 *
 * @param {string} textA
 * @param {string} textB
 * @return {boolean}
 */
function strCompare(textA, textB, len = 30) {
	for (let i = 0; i < Math.max(textA.length, textB.length); i += 1) {
		if (textA[i] !== textB[i]) {
			// eslint-disable-next-line no-console
			console.log(
				`textA: ${textA.substring(i - len, i)}|${textA.substring(i, i + len)}`
			);
			// eslint-disable-next-line no-console
			console.log(
				`textB: ${textB.substring(i - len, i)}|${textB.substring(i, i + len)}`
			);

			return false;
		}
	}

	return true;
}

function decorate(decorators, target, key) {
	let r = Object.getOwnPropertyDescriptor(target, key);

	for (let i = decorators.length - 1; i >= 0; i--) {
		const d = decorators[i];

		if (d) {
			r = d(target, key, r) || r;
		}
	}

	r && Object.defineProperty(target, key, r);
}

function drawElement(element) {
	unmockPromise();

	return new Promise(resolve => {
		const draw = () => {
			html2canvas(element).then(canvas => {
				mockPromise();
				document.body.appendChild(canvas);
				resolve();
			});
		};

		if (typeof html2canvas === 'undefined') {
			const script = document.createElement('script');
			script.onload = draw;
			script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.js';
			document.body.appendChild(script);
		} else {
			draw();
		}
	});
}

const stylesList = [];
function applyGlobalStyle(styles) {
	const style = document.createElement('style');
	style.innerHTML = styles;
	document.head.appendChild(style);
	stylesList.push(style);
}

if (typeof afterEach === 'function') {
	afterEach(() => {
		stylesList.forEach(style => style.remove());
	});
}

if (typeof before === 'function') {
	// ignore ResizeObserver loop limit exceeded
	// this is ok in several scenarios according to
	// https://github.com/WICG/resize-observer/issues/38
	before(() => {
		// called before any tests are run
		const e = window.onerror;
		window.onerror = function (err, ...args) {
			if (err === 'ResizeObserver loop limit exceeded') {
				console.warn('Ignored: ResizeObserver loop limit exceeded');
				return true;
			} else {
				console.warn(new Error(err).stack);
				return e.call(window, err, ...args);
			}
		};
	});
}

function getFirstFBItem(fb, index = 0, file = false) {
	return (fb.browser || fb.container).querySelectorAll(
		[
			`.${fb.files.getFullElName('item')}[data-is-file="${file ? 1 : 0}"]`,
			`.jodit-ui-browser-item.jodit-ui-browser-item_is-file_${file}`
		].join(',')
	)[index];
}

function getFBItemByText(fb, text) {
	return Array.from(
		(fb.browser || fb.container).querySelectorAll(
			[
				`.${fb.files.getFullElName('item')}`,
				'.jodit-ui-browser-item'
			].join(',')
		)
	).find(item => item.textContent.trim().includes(text));
}
