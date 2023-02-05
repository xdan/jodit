/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test Dom module', function () {
	const Dom = Jodit.modules.Dom;
	const LazyWalker = Jodit.modules.LazyWalker;
	const Async = Jodit.modules.Async;

	describe('Iterate over', function () {
		const names = [],
			iterate = function (elm) {
				names.push(Dom.isText(elm) ? elm.nodeValue : elm.nodeName);
			};

		beforeEach(() => {
			names.length = 0;
		});

		describe('Method each', function () {
			describe('Left to right', function () {
				it('Should pass through all child nodes', function () {
					const node = document.createElement('div');

					node.innerHTML =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li><img> test</li>' +
						'</ul>' +
						'<p>lena</p>';

					Dom.each(node, iterate);

					expect(names.toString()).equals(
						'UL,LI,1,LI,2,LI,IMG, test,P,lena'
					);
				});

				describe('Break', function () {
					it('Should stop iterate nodes', () => {
						const node = document.createElement('div');

						node.innerHTML =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li><img> test</li>' +
							'</ul>' +
							'<p>lena</p>';

						Dom.each(node, node => {
							iterate(node);
							if (node.nodeName === 'IMG') {
								return false;
							}
						});

						expect(names.toString()).equals('UL,LI,1,LI,2,LI,IMG');
					});
				});
			});

			describe('Right to right', function () {
				it('Should pass through all child nodes', function () {
					const div = document.createElement('div');

					div.innerHTML =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li><img> test</li>' +
						'</ul>' +
						'<p>lena</p>';

					Dom.each(div, iterate, false);

					expect(names.toString()).equals(
						'P,lena,UL,LI, test,IMG,LI,2,LI,1'
					);
				});
			});
		});

		describe('Method find', function () {
			describe('Left to right', function () {
				it('Should pass through all child nodes after node', () => {
					const node = document.createElement('div');

					node.innerHTML =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li><img> test</li>' +
						'</ul>' +
						'<p>lena</p>';

					Dom.find(node.querySelector('img'), iterate, node);

					expect(names.toString()).equals(' test,P,lena');
				});

				describe('Break', function () {
					it('Should stop iterate nodes', () => {
						const node = document.createElement('div');

						node.innerHTML =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li><img> test</li>' +
							'</ul>' +
							'<p>lena</p>';

						expect(
							Dom.find(
								node.querySelector('li'),
								node => {
									iterate(node);
									if (node.nodeName === 'IMG') {
										return true;
									}
								},
								node
							)
						).eq(node.querySelector('img'));

						expect(names.toString()).equals('LI,2,LI,IMG');
					});
				});
			});

			describe('Right to left', function () {
				it('Should pass through all child nodes before node', () => {
					const node = document.createElement('div');

					node.innerHTML =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li><img> test</li>' +
						'</ul>' +
						'<p>lena</p>';

					Dom.find(node.querySelector('img'), iterate, node, false);

					expect(names.toString()).equals('LI,2,LI,1');
				});
			});
		});
	});

	describe('Method isBlock', function () {
		it('Should return true then it gets BLOCK element', function () {
			expect(true).equals(Dom.isBlock(document.documentElement, window));
			expect(true).equals(
				Dom.isBlock(document.createElement('div'), window)
			);
			expect(true).equals(
				Dom.isBlock(document.createElement('table'), window)
			);
			expect(true).equals(
				Dom.isBlock(document.createElement('dt'), window)
			);
			expect(true).equals(
				Dom.isBlock(document.createElement('dd'), window)
			);
		});
		it('Should return false then it gets not BLOCK element', function () {
			expect(false).equals(
				Dom.isBlock(document.createTextNode('test'), window)
			);
			expect(false).equals(
				Dom.isBlock(document.createElement('span'), window)
			);
		});
	});

	describe('Method isInlineBlock', function () {
		it('Should return true then it gets inline or inline-block element', function () {
			const box = document.createElement('div');
			box.innerHTML =
				'<p>' +
				'<span>test</span>' +
				'<strong>test</strong>' +
				'<span style="display: block">test</span>' +
				'</p>';
			document.body.appendChild(box);

			expect(true).equals(
				Dom.isInlineBlock(box.firstChild.childNodes[0])
			);
			expect(true).equals(
				Dom.isInlineBlock(box.firstChild.childNodes[1])
			);
			expect(false).equals(
				Dom.isInlineBlock(box.firstChild.childNodes[2])
			);
			expect(false).equals(Dom.isInlineBlock(box.firstChild));

			document.body.removeChild(box);
		});
	});

	describe('Method isNode', function () {
		[
			[null, false],
			[document.createElement('br'), true],
			[document.createElement('div'), true],
			[document.createTextNode('test'), true],
			[document.createTextNode(''), true],
			[false, false],
			[document, true],
			[document.body, true],
			['', false],
			[{}, false]
		].forEach(([value, result], i) => {
			it(`Should return true then it gets node element for index: ${i}`, function () {
				expect(Dom.isNode(value)).to.eq(result);
			});
		});
	});

	describe('Method isTag', () => {
		it('Should return true then element is same tag', () => {
			for (const tag of ['div', 'span', 'p', 'img']) {
				const div = document.createElement(tag);
				expect(Dom.isTag(div, new Set([tag]))).is.true;
				expect(Dom.isTag(div, new Set([tag.toUpperCase()]))).is.true;
				expect(Dom.isTag(div, [tag])).is.true;
				expect(Dom.isTag(div, tag)).is.true;
				expect(Dom.isTag(div, tag.toUpperCase())).is.true;
				expect(Dom.isTag(div, 'br')).is.false;
				expect(Dom.isTag(div, ['br'])).is.false;
			}
		});
	});

	describe('Method isEmpty', function () {
		it('Should return true then element is empty', function () {
			expect(true).equals(Dom.isEmpty(document.createElement('div')));
			expect(true).equals(Dom.isEmpty(document.createElement('table')));
			expect(true).equals(Dom.isEmpty(document.createTextNode('\uFEFF')));
			expect(true).equals(Dom.isEmpty(document.createTextNode(' ')));

			const node = document.createElement('div');
			node.innerHTML =
				'<ul>' + '<li></li>' + '<li></li>' + '<li></li>' + '</ul>';

			expect(true).equals(Dom.isEmpty(node));
		});

		it('Should return false then element is not empty', function () {
			expect(false).equals(Dom.isEmpty(document.documentElement));
			expect(false).equals(Dom.isEmpty(document.createTextNode('test')));

			const node = document.createElement('div');
			node.innerHTML =
				'<ul>' +
				'<li>1</li>' +
				'<li>2</li>' +
				'<li><img> text</li>' +
				'</ul>';

			expect(false).equals(Dom.isEmpty(node));
		});

		describe('Own second argument', function () {
			it('Should return true then element is empty', () => {
				const node = document.createElement('div');
				node.innerHTML = '<ul>' + '<li><img></li>' + '</ul>';

				expect(Dom.isEmpty(node, new Set([]))).is.true;
			});
		});
	});

	describe('Method isOrContains', function () {
		it('Should return true if element inside root', function () {
			const node = document.createElement('div');
			const node2 = document.createElement('div');
			const node3 = document.createElement('div');
			const node4 = document.createElement('div');
			const text = document.createTextNode('div');
			const text2 = document.createTextNode('div');

			node.appendChild(node2);
			node2.appendChild(node3);
			node3.appendChild(node4);
			node4.appendChild(text);

			document.body.appendChild(text2);

			expect(true).equals(Dom.isOrContains(node, node));
			expect(true).equals(Dom.isOrContains(node, node2));
			expect(true).equals(Dom.isOrContains(node, node3));
			expect(true).equals(Dom.isOrContains(node, node4));
			expect(true).equals(Dom.isOrContains(node, text));

			expect(false).equals(Dom.isOrContains(node, node, true));
			expect(false).equals(Dom.isOrContains(node, text2));

			document.body.removeChild(text2);
		});
	});

	describe('Method up', function () {
		it('Should return node if element inside root', function () {
			const node0 = document.createElement('div');
			const node = document.createElement('div');
			const node2 = document.createElement('div');
			const node3 = document.createElement('div');
			const node4 = document.createElement('div');
			const text = document.createTextNode('div');
			const text2 = document.createTextNode('div');

			node0.appendChild(node);
			node.appendChild(node2);
			node2.appendChild(node3);
			node3.appendChild(node4);
			node4.appendChild(text);

			document.body.appendChild(text2);

			expect(node2).equals(
				Dom.up(
					text,
					function (nd) {
						return nd === node2;
					},
					node
				)
			);

			expect(text).equals(
				Dom.up(
					text,
					function (nd) {
						return nd === text;
					},
					node
				)
			);

			expect(null).equals(
				Dom.up(
					text,
					function (nd) {
						return nd === text2;
					},
					node
				)
			);

			expect(null).equals(
				Dom.up(
					text,
					function (nd) {
						return nd === node;
					},
					node
				)
			);

			expect(node).equals(
				Dom.up(
					text,
					function (nd) {
						return nd === node;
					},
					node,
					true
				)
			);

			document.body.removeChild(text2);
		});
	});

	describe('last', () => {
		it('should return last matched element', () => {
			const editor = getJodit();

			const variants = {
					'<p>test <em><i>t</i></em>one <span><strong>strong</strong></span></p>':
						[
							node => node && node.nodeValue === 't',
							elm =>
								elm.firstChild.nextSibling.firstChild.firstChild
						],
					'<p><em><i>t</i></em>one <span><strong>strong</strong></span></p>':
						[
							node => node && node.nodeValue === 't',
							elm => elm.firstChild.firstChild.firstChild
						],
					'<p>test<span><strong>strong</strong></span></p>': [
						node => node && node.nodeType === Node.TEXT_NODE,
						elm => elm.lastChild.lastChild.firstChild
					],
					'<p>1test<span><strong>strong</strong></span></p>': [
						node => node && node.nodeName === 'STRONG',
						elm => elm.lastChild.lastChild
					],
					'<p>one <span><strong>strong</strong></span></p>': [
						node => node && node.nodeValue === 'one ',
						elm => elm.firstChild
					],
					'<p><em>t</em>one <span><strong>strong</strong></span></p>':
						[
							node => node && node.nodeValue === 't',
							elm => elm.firstChild.firstChild
						],
					'<p>two <span><strong>strong</strong></span></p>': [
						node => node && node.nodeValue === 'one ',
						() => null
					]
				},
				keys = Object.keys(variants);

			keys.forEach(str => {
				const html = editor.createInside.fromHTML(str);
				editor.s.insertNode(html);

				expect(Dom.last(html, variants[str][0])).eq(
					variants[str][1](html)
				);
			});
		});
	});

	describe('Lazy walk', () => {
		it('should run through the element tree in the correct order', done => {
			const walker = new LazyWalker(new Async());
			const names = [];

			walker
				.on('visit', node => {
					names.push(node.nodeName.toLowerCase());
				})
				.on('end', () => {
					expect(names).deep.eq([
						'ul',
						'li',
						'strong',
						'#text',
						'span',
						'#text',
						'u',
						'#text',
						'li',
						'i',
						'#text',
						'b',
						'#text',
						'u',
						'#text',
						'img'
					]);
					done();
				});

			const div = document.createElement('div');
			div.innerHTML =
				"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>";
			walker.setWork(div);
		});

		describe('Fast work', () => {
			it('should work fast', done => {
				const walker = new LazyWalker(new Async());
				const names = [];
				const ls = [
					'ul',
					'li',
					'strong',
					'#text',
					'span',
					'#text',
					'u',
					'#text',
					'li',
					'i',
					'#text',
					'b',
					'#text',
					'u',
					'#text',
					'img'
				];
				walker
					.on('visit', node => {
						names.push(node.nodeName.toLowerCase());
					})
					.on('end', () => {
						for (let i = 0; i < 8000; i += 1) {
							if (names[i] !== ls[i % 16]) {
								console.log(i, ls[i % 16], names[i]);
								break;
							}
						}
						expect(names.length).eq(8000);
						done();
					});

				const div = document.createElement('div');
				div.innerHTML =
					"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>".repeat(
						500
					);
				walker.setWork(div);
			});
		});

		describe('In reverse order', () => {
			it('should run through the element tree in the correct order', done => {
				const walker = new LazyWalker(new Async(), {
					reverse: true,
					whatToShow: Node.ELEMENT_NODE
				});
				const names = [];

				walker
					.on('visit', node => {
						names.push(node.nodeName.toLowerCase());
					})
					.on('end', () => {
						expect(names).deep.eq([
							'ul',
							'li',
							'img',
							'u',
							'b',
							'i',
							'li',
							'u',
							'span',
							'strong'
						]);
						done();
					});

				const div = document.createElement('div');
				div.innerHTML =
					"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>";
				walker.setWork(div);
			});
		});

		describe('With filter', () => {
			it('should visit only defined node types', done => {
				const walker = new LazyWalker(new Async(), {
					timeout: 100,
					whatToShow: Node.ELEMENT_NODE
				});
				const names = [];

				walker
					.on('visit', node => {
						names.push(node.nodeName.toLowerCase());
					})
					.on('end', () => {
						expect(names).deep.eq([
							'ul',
							'li',
							'strong',
							'span',
							'u',
							'li',
							'i',
							'b',
							'u',
							'img'
						]);
						done();
					});

				const div = document.createElement('div');
				div.innerHTML =
					"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>";
				walker.setWork(div);
			});
		});

		describe('After remove element', () => {
			it('should walk normal', done => {
				const walker = new LazyWalker(new Async(), {
					timeout: 100,
					whatToShow: Node.ELEMENT_NODE
				});
				const names = [];

				walker
					.on('visit', node => {
						const name = node.nodeName.toLowerCase();
						if (name === 'span' || name === 'i') {
							Dom.safeRemove(node);
						} else {
							names.push(name);
						}
					})
					.on('end', () => {
						expect(names).deep.eq([
							'ul',
							'li',
							'strong',
							'u',
							'li',
							'b',
							'u',
							'img'
						]);
						done();
					});

				const div = document.createElement('div');
				div.innerHTML =
					"<ul><li><strong>test</strong><span>test</span><u>test</u></li><li><i>test</i><b>test</b><u>test</u><img src='' alt=''></li></ul>";
				walker.setWork(div);
			});
		});

		describe('After unwrap element', () => {
			it('should walk normal in his children', done => {
				const walker = new LazyWalker(new Async(), {
					timeout: 100
				});
				const names = [];

				walker
					.on('visit', node => {
						const name = node.nodeName.toLowerCase();
						if (name === 'span' || name === 'i') {
							Dom.unwrap(node);
						} else {
							names.push(
								Dom.isText(node) ? node.nodeValue : name
							);
						}
					})
					.on('end', () => {
						expect(names).deep.eq([
							'ul',
							'li',
							'strong',
							'str',
							'sp',
							'u',
							'unn',
							'li',
							'ill',
							'b',
							'bit',
							'u',
							'ula',
							'img'
						]);
						done();
					});

				const div = document.createElement('div');
				div.innerHTML =
					"<ul><li><strong>str</strong><span>sp</span><u>unn</u></li><li><i>ill</i><b>bit</b><u>ula</u><img src='' alt=''></li></ul>";
				walker.setWork(div);
			});
		});
	});
});
