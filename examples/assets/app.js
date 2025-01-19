/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const examples = document.getElementById('examples');
const main_container = document.getElementById('main_container');

const links = {
	'index.html': 'All options',
	'arabic.lang.html': 'Arabic Language',
	'custom-toolbar.html': 'Custom toolbar',
	'fullsize.html': 'Fullsize mode',
	'inline-mode.html': 'Inline mode',
	'custom-icons.html': 'Custom Icons / Font Awesome',
	'oneinstance.html': 'One Instance',
	'color-picker.html': 'Color Picker',
	'theme.html': 'Dark theme'
};

if (examples) {
	Object.keys(links).forEach(function (page) {
		const child = document.createElement('li');
		const a = document.createElement('a');
		child.appendChild(a);

		a.setAttribute('href', page);
		a.innerHTML = links[page];

		examples.appendChild(child);
	});
}

Array.from(document.getElementsByTagName('pre')).forEach(function (pre) {
	if (pre.firstChild.nodeName === 'CODE') {
		pre = pre.firstChild;
	}

	const lines = pre.innerHTML.split('\n');
	const first = lines[1].length - lines[1].replace(/^[\s]+/, '').length;

	pre.innerHTML = lines
		.map(function (line) {
			var newline = line.substr(first);
			return newline.match(/[^\s]/) ? newline : null;
		})
		.filter(function (a) {
			return a;
		})
		.join('\n');
});

if (!document.getElementsByTagName('h1').length && main_container) {
	const h1 = document.createElement('h1');
	h1.innerHTML = document.title;
	main_container.insertBefore(h1, main_container.firstChild);
}
