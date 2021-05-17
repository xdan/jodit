/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/* eslint no-unused-vars: 0 */

typeof window.chai !== 'undefined' &&
	(function () {
		chai.config.includeStack = true;
		chai.config.showDiff = true;
	})();

typeof window.mocha !== 'undefined' && mocha.timeout(15000);

const oldI18n = Jodit.prototype.i18n,
	oldAjaxSender = Jodit.modules.Ajax.prototype.send,
	naturalPromise = window.Promise;

function mockPromise() {
	window.Promise = SynchronousPromise;
}

function unmockPromise() {
	window.Promise = naturalPromise;
}

/**
 *
 * @param {number} timeout
 * @return {*}
 */
function delay(timeout) {
	return new naturalPromise(resolve => {
		setTimeout(resolve, timeout);
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
	if (typeof window.chai !== 'undefined') {
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

			return new Promise(function (resolve) {
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
						const file = ajax.options.data.get('files[0]');
						resolve({
							success: true,
							time: '2018-03-31 23:38:54',
							data: {
								baseurl: 'https://xdsoft.net/jodit/files/',
								messages: [],
								files: [file.name],
								isImages: [/\.(png|jpg|gif)$/.test(file.name)],
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

						resolve({
							success: true,
							time: '2018-03-15 12:49:49',
							data: {
								sources: [
									{
										name: 'default',
										title: 'Some files',
										baseurl:
											'https://xdsoft.net/jodit/files/',
										path: '',
										folders:
											path === ''
												? ['.', folderName, 'test']
												: []
									}
								],
								code: 220
							}
						});
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
											'File does not exist or is above the root of the connector'
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
			});
		};
	}
}

function unmockAjax() {
	Jodit.modules.Ajax.prototype.send = oldAjaxSender;
}

if (typeof window.chai !== 'undefined') {
	mockPromise();
	mockAjax();
	window.FormData = function () {
		this.data = {};
		this.append = function (key, value) {
			this.data[key] = value;
		};
		this.get = function (key) {
			return this.data[key];
		};
	};
}

const i18nkeys = [];
const excludeI18nKeys = [
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
	'Custom',
	'list_test',
	'OS System Font',
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
	'Lower Alpha',
	'Lower Greek',
	'Lower Roman',
	'Upper Alpha',
	'Upper Roman'
];

Jodit.prototype.i18n = function (key) {
	!excludeI18nKeys.includes(key) &&
		!i18nkeys.includes(key) &&
		!key.includes('<svg') &&
		i18nkeys.push(key);

	return oldI18n.apply(this, arguments);
};

Jodit.defaultOptions.events.afterInit = function (editor) {
	editor &&
		editor.container.setAttribute('data-test-case', window.mochaTestName);
};
Jodit.defaultOptions.filebrowser.saveStateInStorage = false;
Jodit.defaultOptions.observer.timeout = 0;
Jodit.defaultOptions.filebrowser.defaultTimeout = 0;
Jodit.modules.View.defaultOptions.defaultTimeout = 0;

if (Jodit.defaultOptions.cleanHTML) {
	Jodit.defaultOptions.cleanHTML.timeout = 0;
	Jodit.defaultOptions.cleanHTML.fillEmptyParagraph = false;
}

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

if (String.prototype.repeat === undefined) {
	String.prototype.repeat = function (count) {
		const result = [];

		for (let i = 0; i < count; i++) {
			result.push(this);
		}

		return result.join('');
	};
}

var expect = typeof chai !== 'undefined' ? chai.expect : function () {},
	stuff = [];

var stringify = Jodit.ns.Helpers.stringify;
var box = document.createElement('div');

document.body.appendChild(box);

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

	stuff.forEach(function (elm) {
		elm && elm.parentNode && elm.parentNode.removeChild(elm);
	});

	stuff.length = 0;

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

	!noput && stuff.push(textarea);
	return textarea;
}

/**
 * Jodit Factory
 *
 * @param {object} [options]
 * @param {HTMLElement|undefined} [element]
 * @return {Jodit}
 */
function getJodit(options, element) {
	const editor = new Jodit(element || appendTestArea(), options);

	window.scrollTo(
		0,
		Jodit.modules.Helpers.offset(editor.container, editor, editor.od).top
	);

	editor.container &&
		editor.container.setAttribute('data-test-case', window.mochaTestName);

	return editor;
}

/**
 * Create empty DIV block and but it inside Box
 *
 * @param [id]
 * @param [noput]
 * @returns {HTMLDivElement}
 */
function appendTestDiv(id, noput) {
	const textarea = document.createElement('div');
	textarea.setAttribute('id', id || 'editor_' + new Date().getTime());
	box.appendChild(textarea);
	!noput && stuff.push(textarea);
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

function sortAttributes(html) {
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

			if (matches[1].toLowerCase() === 'style') {
				matches[2] = sortStyles(matches[2]);
			}

			if (matches[1].toLowerCase() !== 'unselectable') {
				attrs.push({
					name: matches[1].toLowerCase(),
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
			newTag = newTag.replace(
				'attribute:' + (i + 1),
				elm.name + '="' + elm.value + '"'
			);
		});

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
		stuff.push(br);
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
 * @param {string|number|HTMLElement|Jodit} keyCodeOrElement
 * @param {HTMLElement|Jodit} [element]
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

	if (applyOpt) {
		applyOpt(evt);
	} else if (element.getBoundingClientRect) {
		const pos = Jodit.modules.Helpers.position(element);
		evt.clientX = pos.left + 5;
		evt.clientY = pos.top + 5;
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
	const popups = editor.ownerDocument.querySelectorAll(
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

	return (
		elm.querySelector(
			'.jodit-toolbar-button.jodit-toolbar-button_' +
				buttonName +
				(last ? ':last-child' : '') +
				' [role="' +
				(role || 'button') +
				'"]'
		) ||
		elm.querySelector(
			'.jodit-ui-button.jodit-ui-button_' +
				buttonName +
				(last ? ':last-child' : '') +
				'[role="' +
				(role || 'button') +
				'"]'
		)
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
		'click',
		0,
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
 * Set listener and remove it after first call
 *
 * @param {string} event
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function one(event, element, callback) {
	const on = function () {
		element.removeEventListener(event, on);
		callback.apply(element, arguments);
	};

	element.addEventListener(event, on);
}

/**
 * Set one handler for load image
 *
 * @param {HTMLImageElement} image
 * @param {Function} callback
 */
function onLoadImage(image, callback) {
	if (!image.complete) {
		one('load', image, callback);
	} else {
		callback.apply(image);
	}
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
 * Set cursor inside editor by some char
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
	stuff.push(div);
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

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
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
				'Error serializing XML. Unhandled node of type: ' + nodeType
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
				// Wrap the markup into a SVG node to ensure parsing works.
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

if (typeof window.chai !== 'undefined') {
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
