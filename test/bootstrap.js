typeof window.chai !== 'undefined' &&
	(function() {
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
		Jodit.modules.Ajax.prototype.send = function() {
			const ajax = this;

			const request = this.prepareRequest();

			let action = request.data.action;

			if (!action && request.data.get) {
				action = request.data.get('action');
			}

			if (
				action === undefined &&
				request.url &&
				request.url.match(/action=/)
			) {
				const actioExec = /action=([\w]+)/.exec(request.url);
				action = actioExec[1];
			}

			return new Promise(function(resolve) {
				switch (action) {
					case 'fileUpload':
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
					case 'files':
						resolve({
							success: true,
							time: '2018-03-15 12:49:49',
							data: {
								sources: {
									default: {
										baseurl:
											'https://xdsoft.net/jodit/files/',
										path: '',
										files: [
											{
												file:
													'1966051_524428741092238_1051008806888563137_o.jpg',
												thumb:
													'_thumbs/1966051_524428741092238_1051008806888563137_o.jpg',
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
												thumb:
													'_thumbs/ibanez-s520-443140.jpg',
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
										]
									}
								},
								code: 220
							}
						});
						break;
					case 'folders':
						resolve({
							success: true,
							time: '2018-03-15 12:49:49',
							data: {
								sources: {
									default: {
										baseurl:
											'https://xdsoft.net/jodit/files/',
										path: '',
										folders: ['.', 'ceicom', 'test']
									}
								},
								code: 220
							}
						});
						break;
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
	window.FormData = function() {
		this.data = {};
		this.append = function(key, value) {
			this.data[key] = value;
		};
		this.get = function(key) {
			return this.data[key];
		};
	};
}

const i18nkeys = [];
const excludeI18nKeys = ['adddate'];

Jodit.prototype.i18n = function(key) {
	excludeI18nKeys.indexOf(key) === -1 &&
		i18nkeys.indexOf(key) === -1 &&
		key.indexOf('<svg') === -1 &&
		i18nkeys.push(key);

	return oldI18n.apply(this, arguments);
};

Jodit.defaultOptions.filebrowser.saveStateInStorage = false;
Jodit.defaultOptions.observer.timeout = 0;

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
	String.prototype.repeat = function(count) {
		const result = [];

		for (let i = 0; i < count; i++) {
			result.push(this);
		}

		return result.join('');
	};
}

(function(e) {
	e.matches ||
		(e.matches =
			e['matchesSelector'] !== undefined
				? e['matchesSelector']
				: function(selector) {
						const matches = this.ownerDocument.querySelectorAll(
								selector
							),
							th = this;
						return Array.prototype.some.call(matches, function(e) {
							return e === th;
						});
				  });
})(Element.prototype);

const expect = typeof chai !== 'undefined' ? chai.expect : function() {},
	stuff = [];

const box = document.createElement('div');

document.body.appendChild(box);

function getBox() {
	return box;
}

function removeStuff() {
	Object.keys(Jodit.instances).forEach(function(key) {
		Jodit.instances[key].destruct();
	});

	stuff.forEach(function(elm) {
		elm && elm.parentNode && elm.parentNode.removeChild(elm);
	});

	stuff.length = 0;

	Array.from(
		document.querySelectorAll('.jodit.jodit_dialog_box.active')
	).forEach(function(dialog) {
		simulateEvent('close_dialog', 0, dialog);
	});

	Jodit.modules.Ajax.log.length = 0;

	getBox().removeAttribute('style');

	mockPromise();
}

if (typeof afterEach === 'function') {
	afterEach(removeStuff);
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

	styles = styles.map(trim).filter(function(elm) {
		return elm.length;
	});

	let border = null;

	styles = styles
		.map(function(elm) {
			const keyValue = elm.split(':').map(trim);

			if (keyValue[0] === 'border-image') {
				return null;
			}

			if (/rgb\(/.test(keyValue[1])) {
				keyValue[1] = keyValue[1].replace(/rgb\([^)]+\)/, function(
					match
				) {
					return Jodit.modules.Helpers.normalizeColor(match);
				});
			}

			if (keyValue[0].match(/^border$/)) {
				keyValue[1] = keyValue[1].split(/[\s]+/);
			}

			if (keyValue[0].match(/^border-(style|width|color)/)) {
				if (border === null) {
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
		.filter(function(a) {
			return a !== null;
		})
		.map(function(a) {
			return a
				.map(function(item) {
					return typeof item === 'string'
						? item
						: item.sort().join(' ');
				})
				.join(':');
		})
		.sort(function(a, b) {
			if (a < b) {
				return - 1;
			}

			return a > b ? 1 : 0;
		});

	return styles.join(';');
}

function sortAttributes(html) {
	const tag = /<([^>]+)>/g;
	const reg = /([a-z_\-]+)[\s]*=[\s]*"([^"]*)"/i,
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

		attrs.sort(function(a, b) {
			if (a.name < b.name) {
				return -1;
			}

			return a.name > b.name ? 1 : 0;
		});

		attrs.forEach(function(elm, i) {
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

	tags.forEach(function(elm) {
		html = html.replace(elm.name, elm.value);
	});

	return html.replace(/&nbsp;/g, ' ');
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

/**
 *
 * @param type
 * @param keyCodeArg
 * @param element
 * @param options
 */
function simulateEvent(type, keyCodeArg, element, options) {
	if (Array.isArray(type)) {
		return type.forEach(function (event) {
			simulateEvent(event, keyCodeArg, element, options);
		});
	}

	if (Array.isArray(element)) {
		return element.forEach(function (elm) {
			simulateEvent(type, keyCodeArg, elm, options);
		});
	}

	const evt = (element.ownerDocument || document).createEvent('HTMLEvents');

	evt.initEvent(type, true, true);
	evt.keyCode = keyCodeArg;
	evt.which = keyCodeArg;

	if (options) {
		options(evt);
	}

	if (type.match(/^mouse/)) {
		['pageX', 'pageY', 'clientX', 'clientY'].forEach(function(key) {
			if (evt[key] === undefined) {
				evt[key] = 0;
			}
		});
	}

	if (type.match(/^touch/) && !evt.changedTouches) {
		const changedTouches = {};

		['pageX', 'pageY', 'clientX', 'clientY'].forEach(function(key) {
			changedTouches[key] = evt[key];
		});

		evt.changedTouches = changedTouches;
	}

	element.dispatchEvent(evt);
}

/**
 * Click and trigger some button event
 *
 * @param {string} buttonName
 * @param {Jodit|HTMLElement} joditOrElement
 */
function clickButton(buttonName, joditOrElement) {
	simulateEvent(
		'mousedown',
		0,
		(joditOrElement.isJodit ? joditOrElement.container : joditOrElement).querySelector(
			'.jodit_toolbar_btn.jodit_toolbar_btn-' + buttonName
		)
	);
}

/**
 * Set listener and remove it after first call
 *
 * @param {string} event
 * @param {HTMLElement} element
 * @param {Function} callback
 */
function one(event, element, callback) {
	const on = function() {
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
 * @param element
 * @param pastedText
 */
function simulatePaste(element, pastedText) {
	simulateEvent('paste', 0, element, function(data) {
		data.clipboardData = {
			types: ['text/html'],
			getData: function() {
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

function createPoint(x, y, color, fixed = false) {
	const div = document.createElement('div');

	div.setAttribute(
		'style',
		'position: ' + (fixed ? 'fixed': 'absolute') + '; z-index: 1000000000;width: 5px; height: 5px; background: ' +
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

(function() {
	const serializeXML = function(node, output) {
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
			throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
		}
	};

	// The innerHTML DOM property for SVGElement.
	Object.defineProperty(SVGElement.prototype, 'innerHTML', {
		get: function() {
			const output = [];
			let childNode = this.firstChild;

			while (childNode) {
				serializeXML(childNode, output);
				childNode = childNode.nextSibling;
			}

			return output.join('');
		},
		set: function(markupText) {
			// Wipe out the current contents of the element.
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}

			try {
				// Parse the markup into valid nodes.
				const dXML = new DOMParser();

				dXML.async = false;
				// Wrap the markup into a SVG node to ensure parsing works.
				sXML =
					"<svg xmlns='http://www.w3.org/2000/svg'>" +
					markupText +
					'</svg>';
				const svgDocElement = dXML.parseFromString(sXML, 'text/xml')
					.documentElement;

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
		get: function() {
			return this.innerHTML;
		},
		set: function(markupText) {
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
	window.FileReader = function() {
		const self = this;
		self.result = null;
		/**
		 *
		 * @param {FileImage} file
		 */
		self.readAsDataURL = function(file) {
			self.result = file.dataURI;
			self.onloadend && self.onloadend();
		};
	};
}

Object.defineProperty(navigator, 'userAgent', {
	value:
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 YaBrowser/18.9.0.3363 Yowser/2.5 Safari/537.36'
});
