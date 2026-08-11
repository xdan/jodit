/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/* eslint-disable max-classes-per-file -- the "Virtual DOM contract" suite defines a fake VNode implementation */

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

			describe('Many siblings', function () {
				it('Should iterate wide sibling lists in proper order', () => {
					const node = document.createElement('div');

					node.innerHTML = new Array(10)
						.fill(0)
						.map((_, i) => `<span>${i}</span>`)
						.join('');

					const values = [];

					Dom.find(
						node.firstChild,
						n => {
							if (Dom.isText(n)) {
								values.push(n.nodeValue);
							}
						},
						node
					);

					expect(values.join('')).equals('123456789');

					values.length = 0;

					Dom.find(
						node.lastChild,
						n => {
							if (Dom.isText(n)) {
								values.push(n.nodeValue);
							}
						},
						node,
						false
					);

					expect(values.join('')).equals('876543210');
				});
			});
		});

		describe('Method between', function () {
			it('Should call callback for all nodes between start and end', () => {
				const node = document.createElement('div');

				node.innerHTML =
					'<p>1<span id="s"></span>2</p><p>3</p><p>4<span id="e"></span>5</p>';

				Dom.between(
					node.querySelector('#s'),
					node.querySelector('#e'),
					iterate
				);

				expect(names.toString()).equals('2,P,3,P,4');
			});

			it('Should stop iterating when callback returns true', () => {
				const node = document.createElement('div');

				node.innerHTML =
					'<p>1<span id="s"></span>2</p><p>3</p><p>4<span id="e"></span>5</p>';

				Dom.between(
					node.querySelector('#s'),
					node.querySelector('#e'),
					elm => {
						iterate(elm);
						return Dom.isText(elm) && elm.nodeValue === '3';
					}
				);

				expect(names.toString()).equals('2,P,3');
			});

			it('Should not iterate outside when end is an ancestor of start', () => {
				const node = document.createElement('div');

				node.innerHTML = '<p>1<span id="s"></span></p><p>2</p>';

				Dom.between(node.querySelector('#s'), node.firstChild, iterate);

				expect(names.toString()).equals('');
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
				expect(Dom.isTag(div, new Set([tag]))).is.true;
				expect(Dom.isTag(div, tag)).is.true;
				expect(Dom.isTag(div, tag.toUpperCase())).is.true;
				expect(Dom.isTag(div, 'br')).is.false;
				expect(Dom.isTag(div, new Set(['br']))).is.false;
				expect(() => {
					Dom.isTag(div, ['br']);
				}).to.throw();
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

	describe('Method isFragment', function () {
		it('Should return true for document fragments', function () {
			expect(Dom.isFragment(document.createDocumentFragment())).is.true;

			// fragment inside an inert document
			const template = document.createElement('template');
			template.innerHTML = '<p>test</p>';
			expect(Dom.isFragment(template.content)).is.true;
		});

		it('Should return false for other values', function () {
			expect(Dom.isFragment(document.createElement('div'))).is.false;
			expect(Dom.isFragment(document.createTextNode('test'))).is.false;
			expect(Dom.isFragment(document)).is.false;
			expect(Dom.isFragment(null)).is.false;
			expect(Dom.isFragment('')).is.false;
		});
	});

	describe('Method replace', function () {
		it('Should replace one tag with another keeping content and attributes', function () {
			const editor = getJodit();
			const div = document.createElement('div');
			div.innerHTML = '<span data-x="1">content</span>';

			const strong = Dom.replace(
				div.firstChild,
				'strong',
				editor.createInside,
				true
			);

			expect(div.innerHTML).equals('<strong data-x="1">content</strong>');
			expect(strong.tagName).equals('STRONG');
		});

		it('Should replace tag with ready element', function () {
			const div = document.createElement('div');
			div.innerHTML = '<span>content</span>';

			const em = document.createElement('em');
			const result = Dom.replace(div.firstChild, em);

			expect(result).equals(em);
			expect(div.innerHTML).equals('<em>content</em>');
		});
	});

	describe('Method replaceTemporaryFromString', function () {
		it('Should remove temporary wrappers and keep their content', function () {
			expect(
				Dom.replaceTemporaryFromString(
					'<p>a <span data-jodit-temp="true">b</span> c</p>'
				)
			).equals('<p>a b c</p>');
		});

		it('Should support the attribute without a value', function () {
			expect(
				Dom.replaceTemporaryFromString(
					'<p><span data-jodit-temp>b</span></p>'
				)
			).equals('<p>b</p>');
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
		const variants = {
				'<p>test <em><i>t</i></em>one <span><strong>strong</strong></span></p>':
					[
						node => node && node.nodeValue === 't',
						elm => elm.firstChild.nextSibling.firstChild.firstChild
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
				'<p><em>t</em>one <span><strong>strong</strong></span></p>': [
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
			it(`should return last matched element for str: ${str}`, () => {
				const editor = getJodit();
				editor.value = str;

				expect(Dom.last(editor.editor.firstChild, variants[str][0])).eq(
					variants[str][1](editor.editor.firstChild)
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

		describe('Repeated setWork', () => {
			it('should process only the last tree and emit end once', done => {
				const walker = new LazyWalker(new Async());
				const names = [];
				let endCount = 0;

				walker
					.on('visit', node => {
						names.push(node.nodeName.toLowerCase());
					})
					.on('end', () => {
						endCount += 1;
						expect(endCount).eq(1);
						expect(names).deep.eq(['p', '#text']);
						done();
					});

				const div1 = document.createElement('div');
				div1.innerHTML = '<span>a</span>';

				const div2 = document.createElement('div');
				div2.innerHTML = '<p>b</p>';

				walker.setWork(div1);
				walker.setWork(div2);
			});
		});

		describe('Restart after break', () => {
			it('should reset the affect flag between passes', done => {
				const asyncM = new Async();
				const walker = new LazyWalker(asyncM, {
					timeoutChunkSize: 1,
					timeout: 100
				});

				const div = document.createElement('div');
				div.innerHTML = '<b>1</b><i>2</i><u>3</u>';

				let pass = 1;

				// the first pass "affects" nodes, the second one - does not
				walker.on('visit', () => pass === 1);

				walker.on('break', () => {
					asyncM.setTimeout(() => {
						pass = 2;
						walker.setWork(div);
					}, 10);
				});

				walker.on('end', affect => {
					expect(pass).eq(2);
					expect(affect).is.false;
					done();
				});

				walker.setWork(div);

				// break the first pass in the middle, between two chunks
				asyncM.setTimeout(() => walker.break(), 150);
			});
		});
	});

	describe('Virtual DOM contract', function () {
		// A minimal hand-rolled implementation of the VNode interfaces from
		// src/types/vdom.d.ts — NOT a browser node. Dom must work with it,
		// this pins the "Dom relies only on the VNode subset" contract.
		let vDocument;

		class TestVNode {
			constructor(nodeName, nodeType) {
				this.nodeName = nodeName;
				this.nodeType = nodeType;
				this.nodeValue = null;
				this.parentNode = null;
				this.childNodes = [];
				this.ownerDocument = null;
			}

			get parentElement() {
				return this.parentNode && this.parentNode.nodeType === 1
					? this.parentNode
					: null;
			}

			get firstChild() {
				return this.childNodes[0] || null;
			}

			get lastChild() {
				return this.childNodes[this.childNodes.length - 1] || null;
			}

			get previousSibling() {
				const p = this.parentNode;
				return p
					? p.childNodes[p.childNodes.indexOf(this) - 1] || null
					: null;
			}

			get nextSibling() {
				const p = this.parentNode;
				return p
					? p.childNodes[p.childNodes.indexOf(this) + 1] || null
					: null;
			}

			get isConnected() {
				return Boolean(this.parentNode);
			}

			get textContent() {
				if (this.nodeType === 3) {
					return this.nodeValue;
				}

				return this.childNodes.map(c => c.textContent).join('');
			}

			appendChild(node) {
				return this.insertBefore(node, null);
			}

			insertBefore(node, child) {
				if (node.nodeType === 11) {
					node.childNodes
						.slice()
						.forEach(c => this.insertBefore(c, child));
					return node;
				}

				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}

				const index = child ? this.childNodes.indexOf(child) : -1;
				if (index === -1) {
					this.childNodes.push(node);
				} else {
					this.childNodes.splice(index, 0, node);
				}
				node.parentNode = this;
				return node;
			}

			removeChild(child) {
				const index = this.childNodes.indexOf(child);
				if (index !== -1) {
					this.childNodes.splice(index, 1);
					child.parentNode = null;
				}
				return child;
			}

			replaceChild(node, child) {
				this.insertBefore(node, child);
				this.removeChild(child);
				return child;
			}

			cloneNode(deep) {
				const clone = new this.constructor(
					this.nodeName,
					this.nodeType
				);
				clone.nodeValue = this.nodeValue;
				clone.ownerDocument = this.ownerDocument;
				if (deep) {
					this.childNodes.forEach(c =>
						clone.appendChild(c.cloneNode(true))
					);
				}
				return clone;
			}

			contains(other) {
				while (other) {
					if (other === this) {
						return true;
					}
					other = other.parentNode;
				}
				return false;
			}
		}

		class TestVText extends TestVNode {
			constructor(data) {
				super('#text', 3);
				this.nodeValue = data;
			}

			get data() {
				return this.nodeValue;
			}
		}

		class TestVElement extends TestVNode {
			constructor(tagName) {
				super(tagName.toUpperCase(), 1);
				this.__attributes = new Map();
				const styleProps = new Map();
				this.style = {
					get cssText() {
						return [...styleProps]
							.map(([k, v]) => `${k}: ${v};`)
							.join(' ');
					},
					getPropertyValue: p => styleProps.get(p) || '',
					setProperty: (p, v) =>
						v == null
							? styleProps.delete(p)
							: styleProps.set(p, String(v)),
					removeProperty: p => {
						const old = styleProps.get(p) || '';
						styleProps.delete(p);
						return old;
					}
				};
				this.classList = {
					add: (...tokens) =>
						tokens.forEach(t => this.__classes.add(t)),
					remove: (...tokens) =>
						tokens.forEach(t => this.__classes.delete(t)),
					contains: t => this.__classes.has(t),
					toggle: t => {
						if (this.__classes.has(t)) {
							this.__classes.delete(t);
							return false;
						}
						this.__classes.add(t);
						return true;
					}
				};
				this.__classes = new Set();
			}

			get tagName() {
				return this.nodeName;
			}

			get className() {
				return [...this.__classes].join(' ');
			}

			get attributes() {
				return [...this.__attributes].map(([name, value]) => ({
					name,
					value
				}));
			}

			getAttribute(name) {
				return this.__attributes.has(name)
					? this.__attributes.get(name)
					: null;
			}

			setAttribute(name, value) {
				this.__attributes.set(name, String(value));
			}

			removeAttribute(name) {
				this.__attributes.delete(name);
			}

			hasAttribute(name) {
				return this.__attributes.has(name);
			}
		}

		beforeEach(() => {
			vDocument = {
				createElement: tag => {
					const elm = new TestVElement(tag);
					elm.ownerDocument = vDocument;
					return elm;
				},
				createTextNode: data => {
					const text = new TestVText(data);
					text.ownerDocument = vDocument;
					return text;
				},
				createDocumentFragment: () => {
					const fragment = new TestVNode('#document-fragment', 11);
					fragment.ownerDocument = vDocument;
					return fragment;
				}
			};
		});

		const tree = () => {
			// <div><p>one</p><p>two</p></div>
			const root = vDocument.createElement('div');
			const p1 = vDocument.createElement('p');
			const p2 = vDocument.createElement('p');
			p1.appendChild(vDocument.createTextNode('one'));
			p2.appendChild(vDocument.createTextNode('two'));
			root.appendChild(p1);
			root.appendChild(p2);
			return { root, p1, p2 };
		};

		it('Dom.append/prepend/after/before/appendChildFirst should work on a non-browser VNode', function () {
			const { root, p1, p2 } = tree();

			const a = vDocument.createElement('a');
			Dom.append(root, a);
			expect(root.lastChild).eq(a);

			const b = vDocument.createElement('b');
			Dom.prepend(root, b);
			expect(root.firstChild).eq(b);

			const i = vDocument.createElement('i');
			Dom.after(p1, i);
			expect(p1.nextSibling).eq(i);

			const u = vDocument.createElement('u');
			Dom.before(p2, u);
			expect(p2.previousSibling).eq(u);

			const s = vDocument.createElement('s');
			Dom.appendChildFirst(root, s);
			expect(root.firstChild).eq(s);
			Dom.appendChildFirst(root, s);
			expect(root.firstChild).eq(s);

			expect(root.childNodes.map(n => n.nodeName)).deep.eq([
				'S',
				'B',
				'P',
				'I',
				'U',
				'P',
				'A'
			]);
		});

		it('Dom.detach/unwrap/safeRemove should work on a non-browser VNode', function () {
			const { root, p1, p2 } = tree();

			Dom.unwrap(p1);
			expect(root.childNodes[0].nodeValue).eq('one');

			Dom.safeRemove(p2);
			expect(p2.parentNode).is.null;
			expect(root.childNodes.length).eq(1);

			Dom.detach(root);
			expect(root.childNodes.length).eq(0);
		});

		it('Dom.moveContent should work on a non-browser VNode', function () {
			const { root, p1, p2 } = tree();
			const target = vDocument.createElement('div');
			target.appendChild(vDocument.createTextNode('base'));

			Dom.moveContent(root, target, true);
			expect(root.childNodes.length).eq(0);
			expect(target.childNodes.map(n => n.nodeName)).deep.eq([
				'P',
				'P',
				'#text'
			]);
			expect(target.firstChild).eq(p1);
			expect(target.childNodes[1]).eq(p2);
		});

		it('Dom.first/last/each/sibling traversal should work on a non-browser VNode', function () {
			const { root, p1, p2 } = tree();

			expect(Dom.first(root, Dom.isText).nodeValue).eq('one');
			expect(Dom.last(root, Dom.isText).nodeValue).eq('two');
			expect(Dom.sibling(p1)).eq(p2);
			expect(Dom.sibling(p2, true)).eq(p1);

			const names = [];
			Dom.each(root, n => {
				names.push(n.nodeName);
			});
			expect(names).deep.eq(['P', '#text', 'P', '#text']);
		});

		it('Dom.isTag/isElement/isText/isEmpty should work on a non-browser VNode', function () {
			const { root, p1 } = tree();

			expect(Dom.isElement(p1)).is.true;
			expect(Dom.isTag(p1, 'p')).is.true;
			expect(Dom.isTag(root, 'div')).is.true;
			expect(Dom.isText(p1.firstChild)).is.true;
			expect(Dom.isEmpty(root)).is.false;
			expect(Dom.isEmpty(vDocument.createElement('span'))).is.true;
		});

		it('Dom.hide/show should work on a non-browser VNode', function () {
			const elm = vDocument.createElement('div');
			elm.style.setProperty('display', 'flex');

			Dom.hide(elm);
			expect(elm.style.getPropertyValue('display')).eq('none');

			Dom.show(elm);
			expect(elm.style.getPropertyValue('display')).eq('flex');
		});
	});
});
