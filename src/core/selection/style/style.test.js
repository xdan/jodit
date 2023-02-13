/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const { Dom } = Jodit.modules;

describe('Apply style', () => {
	describe('Test Style module', function () {
		let editor;

		const Style = Jodit.ns.CommitStyle;

		beforeEach(function () {
			editor = getJodit();
			editor.value = '<p>test</p>';
			editor.execCommand('selectall');
		});

		describe('Base apply', () => {
			[
				[
					'<p><a href="https://xdsoft.net/jodit/">|https://xdsoft.net/jodit/|</a></p>',
					{
						attributes: {
							style: { color: '#000000' }
						}
					},
					// https://github.com/xdan/jodit/issues/936
					'<p><a href="https://xdsoft.net/jodit/">|https://xdsoft.net/jodit/|</a></p>'
				],
				[
					'<p><a href="https://xdsoft.net/jodit/" style="color:#000001">|https://xdsoft.net/jodit/|</a></p>',
					{
						attributes: {
							style: { color: '#000001' }
						}
					},
					'<p><a href="https://xdsoft.net/jodit/">|https://xdsoft.net/jodit/|</a></p>'
				],
				[
					'<p><a href="https://xdsoft.net/jodit/">|https://xdsoft.net/jodit/|</a></p>',
					{
						attributes: {
							style: { color: '#000001' }
						}
					},
					'<p><a href="https://xdsoft.net/jodit/" style="color:#000001">|https://xdsoft.net/jodit/|</a></p>'
				],
				[
					'<p><strong>|test</strong> pop <strong>test|</strong></p>',
					{
						element: 'strong'
					},
					'<p>|test pop test|</p>'
				],
				[
					'<p><strong>|test</strong> pop <strong>test|</strong></p>',
					{
						element: 'strong',
						attributes: { style: { fontWeight: 700 } }
					},
					'<p>|test pop test|</p>'
				],
				[
					'<p>|test|</p>',
					{ element: 'strong' },
					'<p>|<strong>test</strong>|</p>'
				],
				[
					'<p>|test|</p>',
					{
						element: 'sub'
					},
					'<p>|<sub>test</sub>|</p>'
				],
				[
					'<p><sub>|test|</sub></p>',
					{
						element: 'sub'
					},
					'<p>|test|</p>'
				],
				[
					'<p>|test|</p>',
					{
						element: 'a',
						attributes: {
							href: 'https://xdsoft.net'
						}
					},
					'<p>|<a href="https://xdsoft.net">test</a>|</p>'
				],
				[
					'<p>|test|</p>',
					{
						element: 'h1',
						attributes: {
							class: 'header'
						}
					},
					'<h1 class="header">|test|</h1>'
				],
				[
					'<p><a href="https://xdsoft.net">|test|</a></p>',
					{
						element: 'a',
						attributes: {
							href: 'https://xdsoft.net'
						}
					},
					'<p>|test|</p>'
				],
				[
					'<p><a href="https://xdsoft.net">|test|</a></p>',
					{
						element: 'a',
						attributes: {
							title: 'book',
							href: 'https://sitename.net'
						}
					},
					'<p><a href="https://sitename.net" title="book">|test|</a></p>'
				],
				[
					'<p><span>|test|</span></p>',
					{
						element: 'a',
						attributes: {
							title: 'book',
							href: 'https://sitename.net'
						}
					},
					'<p><span>|<a href="https://sitename.net" title="book">test</a>|</span></p>'
				],
				[
					'<p><a href="https://xdsoft.net">|test|</a></p>',
					{
						element: 'a',
						attributes: {
							href: 'https://sitename.net'
						}
					},
					'<p><a href="https://sitename.net">|test|</a></p>'
				],
				[
					'<p><strong style="font-family: Impact, Charcoal, sans-serif;"><em>|test|</em></strong></p>',
					{
						element: 'strong'
					},
					'<p><span style="font-family:Impact,Charcoal,sans-serif"><em>|test|</em></span></p>'
				],
				[
					'<p><strong>|test|</strong></p>',
					{
						className: 'class1'
					},
					'<p><strong class="class1">|test|</strong></p>'
				],
				[
					'<p><strong>|test|</strong></p>',
					{
						attributes: {
							class: 'class1'
						}
					},
					'<p><strong class="class1">|test|</strong></p>'
				],
				[
					'<p><strong class="class2">|test|</strong></p>',
					{
						attributes: {
							class: 'class1'
						}
					},
					'<p><strong class="class2 class1">|test|</strong></p>'
				],
				[
					'<p><strong class="class1">|test|</strong></p>',
					{
						attributes: {
							class: 'class1'
						}
					},
					'<p><strong>|test|</strong></p>'
				],
				[
					'<p><strong class="class1 class2">|test|</strong></p>',
					{
						attributes: {
							class: 'class1'
						}
					},
					'<p><strong class="class2">|test|</strong></p>'
				],
				[
					'<p><strong>|test|</strong></p>',
					{
						element: 'em',
						style: {
							fontStyle: 'italic'
						}
					},
					'<p><strong>|<em>test</em>|</strong></p>'
				],

				[
					'<p>t|es|t</p>',
					{
						style: {
							fontSize: 24
						}
					},
					'<p>t|<span style="font-size:24px">es</span>|t</p>'
				],
				[
					'<p><span style="font-weight:700;font-size:24px;">|test|</span></p>',
					{
						element: 'strong',
						style: {
							fontWeight: 700
						}
					},
					'<p><span style="font-size:24px">|test|</span></p>'
				],
				[
					'<p><span style="font-weight:700">|test|</span></p>',
					{
						element: 'strong',
						style: {
							fontWeight: 700
						}
					},
					'<p>|test|</p>'
				],
				[
					// (st) => getClosestWrapper -> extractSelectedPart -> toggleICommitStyles -> unwrap -> toggleCSS
					// (so) => ----
					'<p><strong>te|st</strong> so|me</p>',
					{
						element: 'strong',
						style: {
							fontWeight: 700
						}
					},
					'<p><strong>te</strong>|st so|me</p>'
				],
				[
					'<p><span style="color:#FF0000">|test|</span></p>',
					{ style: { color: '#FF0000' } },
					'<p>|test|</p>'
				],
				[
					'<p>test<span style="background-color:yellow">|stop|</span></p>',
					{ style: { color: 'yellow' } },
					'<p>test<span style="background-color:yellow;color:yellow">|stop|</span></p>'
				],
				[
					'<p>|test <span style="color: red; font-size: 12px;">test</span> test|</p>\n',
					{ style: { fontSize: '8px' } },
					'<p>|<span style="font-size:8px">test <span style="color:red">test</span> test</span>|</p>'
				],
				[
					'<p>|test <strong><span style="color: red; font-size: 12px;">test</span></strong> test|</p>\n',
					{ style: { fontSize: '8px' } },
					'<p>|<span style="font-size:8px">test <strong><span style="color:red">test</span></strong> test</span>|</p>'
				],
				[
					'<p>|test</p><style>.a {color: red}</style><p>stop|</p>',
					{ style: { fontFamily: 'Helvetica,sans-serif' } },
					'<p>|<span style="font-family:Helvetica,sans-serif">test</span></p><style>.a {color: red}</style><p><span style="font-family:Helvetica,sans-serif">stop</span>|</p>'
				],
				[
					'<p>test|<u>test</u>|test</p>',
					{ style: { color: '#FFF000' } },
					'<p>test|<u style="color:#FFF000">test</u>|test</p>'
				],
				[
					'<p><u>|test|</u></p>',
					{ style: { color: '#FFF000' } },
					'<p><u style="color:#FFF000">|test|</u></p>'
				],
				[
					'<p>|<u>test</u>|</p>',
					{ style: { color: '#FFF000' } },
					'<p>|<u style="color:#FFF000">test</u>|</p>'
				],
				[
					'<p><u>|tes|t</u></p>',
					{ style: { color: '#FFF000' } },
					'<p><u>|<span style="color:#FFF000">tes</span>|t</u></p>'
				],
				[
					'<p><strong>|test|</strong></p>',
					{ style: { color: '#FFF000' } },
					'<p><strong style="color:#FFF000">|test|</strong></p>'
				],
				[
					'<p>test|</p>',
					{ element: 'strong' },
					'<p>test<strong>|</strong></p>'
				],
				[
					'<p><strong>|test|</strong></p>',
					{ element: 'strong' },
					'<p>|test|</p>'
				],
				[
					'<p><strong>te|s|t</strong></p>',
					{ element: 'strong' },
					'<p><strong>te</strong>|s|<strong>t</strong></p>'
				],
				[
					'<p>te|s|t</p>',
					{
						style: {
							color: '#fff'
						}
					},
					'<p>te|<span style="color:#FFFFFF">s</span>|t</p>'
				],
				[
					'<p>te|st</p>',
					{
						style: {
							color: '#fff'
						}
					},
					'<p>te<span style="color:#FFFFFF">|</span>st</p>'
				],
				[
					'<p>|test|</p>',
					{
						style: {
							color: 'red',
							backgroundColor: 'yellow'
						}
					},
					'<p>|<span style="background-color:yellow;color:red">test</span>|</p>'
				],
				[
					'<p>|test <span style="color:#FFFFFF">test</span> test|</p>',
					{
						style: {
							color: '#00FF00'
						}
					},
					'<p>|<span style="color:#00FF00">test test test</span>|</p>'
				],
				[
					'<p>|test <strong>test</strong> test|</p>',
					{
						element: 'strong'
					},
					'<p>|<strong>test test test</strong>|</p>'
				],
				[
					'<p>|<strong>test test</strong> test|</p>',
					{
						element: 'strong'
					},
					'<p>|test test test|</p>'
				],
				[
					'<p>|pop <strong>test test</strong> test|</p>',
					{
						element: 'strong'
					},
					'<p>|<strong>pop test test test</strong>|</p>'
				],
				[
					'<h3><span style="color:#00FF00">|pop test test test|</span></h3>',
					{
						element: 'p'
					},
					'<p><span style="color:#00FF00">|pop test test test|</span></p>'
				],
				[
					'test|<br>test<br>test<br>test',
					{ element: 'h1' },
					'<h1>test|</h1><br>test<br>test<br>test',
					{ enter: 'BR' }
				],
				// Lists
				[
					'<ol><li>ordered</li><li>|list</li><li>pop</li></ol>',
					{ element: 'ul' },
					'<ol><li>ordered</li></ol><ul><li>|list</li></ul><ol><li>pop</li></ol>'
				],
				[
					'<ol><li>|ordered</li><li>list</li></ol><p>test|</p>',
					{ element: 'ol' },
					'<p>|ordered</p><p>list</p><p>test|</p>'
				],
				[
					'<p>|test</p><ol><li>ordered</li><li>list|</li></ol>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<ol><li>ordered</li></ol><p>|test</p><ol><li>list</li><li>pop</li></ol>',
					{ element: 'ol' },
					'<ol><li>ordered</li><li>|test</li><li>list</li><li>pop</li></ol>'
				],
				[
					'<ul><li>ordered</li></ul><p>|test</p><ol><li>list</li><li>pop</li></ol>',
					{ element: 'ol' },
					'<ul><li>ordered</li></ul><ol><li>|test</li><li>list</li><li>pop</li></ol>'
				],
				[
					'<ul><li>ordered</li></ul><p>|test</p><ol><li>list</li><li>pop</li></ol>',
					{ element: 'ul' },
					'<ul><li>ordered</li><li>|test</li></ul><ol><li>list</li><li>pop</li></ol>'
				],
				[
					'<ol class="p"><li>ordered</li></ol><p>|test</p><ol><li>list</li><li>pop</li></ol>',
					{ element: 'ol' },
					'<ol class="p"><li>ordered</li><li>|test</li></ol><ol><li>list</li><li>pop</li></ol>'
				],
				[
					'<ol><li>ordered</li><li>list</li></ol><p>|test</p><p>pop|</p>',
					{ element: 'ol' },
					'<ol><li>ordered</li><li>list</li><li>|test</li><li>pop|</li></ol>'
				],
				[
					'<p>|test</p><p>pop|</p><ol><li>ordered</li><li>list</li></ol>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>pop|</li><li>ordered</li><li>list</li></ol>'
				],
				[
					'<p>|test</p><ol><li>ordered</li><li>list</li></ol>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list</li></ol>'
				],
				[
					'<p>|Hello world|</p>',
					{
						element: 'ul',
						style: {
							listStyleType: 'circle'
						}
					},
					'<ul style="list-style-type:circle"><li>|Hello world|</li></ul>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list|</p>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list|</p>',
					{ element: 'ol', attributes: { class: 'test' } },
					'<ol class="test"><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list</p><p>a few</p><p>leafs|</p>',
					{ element: 'ol', attributes: { class: 'test' } },
					'<ol class="test"><li>|test</li><li>ordered</li><li>list</li><li>a few</li><li>leafs|</li></ol>'
				],
				[
					'<p>|text</p><p>pop</p><p>oup</p><p>test|</p>',
					{
						element: 'ul',
						attributes: {
							class: 'todo-list2'
						}
					},
					'<ul class="todo-list2"><li>|text</li><li>pop</li><li>oup</li><li>test|</li></ul>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list</p><p>a few</p><p>leafs|</p>',
					{ element: 'ul', attributes: { class: 'test' } },
					'<ul class="test"><li>|test</li><li>ordered</li><li>list</li><li>a few</li><li>leafs|</li></ul>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list|</p>',
					{ element: 'ol', style: { listStyleType: null } },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test1</p>\n\n<p>ordered</p>\n\n<p>list1|</p>',
					{ element: 'ol' },
					'<ol><li>|test1</li><li>ordered</li><li>list1|</li></ol>'
				],
				[
					'<h1>|test</h1><p>ordered</p><p>list|</p>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test</p><ol><li>ordered</li><li>list</li></ol>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list</li></ol>'
				],
				[
					'<ol><li>|test</li><li>ordered</li><li>list</li></ol>',
					{ element: 'ol' },
					'<p>|test</p><ol><li>ordered</li><li>list</li></ol>'
				],
				[
					'<ol><li>|1</li><li>2</li><li>3</li></ol><ul><li>4</li><li>5</li><li>6|</li></ul>',
					{ element: 'ol' },
					'<p>|1</p><p>2</p><p>3</p><p>4</p><p>5</p><p>6|</p>'
				],
				[
					'<ol><li>|1</li><li>2</li><li>3</li></ol><ul><li>4</li><li>5</li><li>6|</li></ul>',
					{ element: 'ul' },
					'<ul><li>|1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6|</li></ul>'
				],
				[
					'<ol><li>|1</li><li>2</li><li>3</li></ol><ul><li>4</li><li>5</li></ul><p>6|</p>',
					{ element: 'ul' },
					'<ul><li>|1</li><li>2</li><li>3</li><li>4</li><li>5</li><li>6|</li></ul>'
				],
				[
					'<ol><li>|1</li><li>2</li><li>3</li></ol><ul><li>3.5</li></ul><ul><li>4</li><li>5</li></ul><p>6|</p>',
					{ element: 'ul' },
					'<ul><li>|1</li><li>2</li><li>3</li><li>3.5</li><li>4</li><li>5</li><li>6|</li></ul>'
				],
				[
					'<ol><li>|1</li><li>2</li><li>3</li></ol><ol><li>3.5</li></ol><ul><li>4</li><li>5</li></ul><p>6|</p>',
					{ element: 'ul' },
					'<ul><li>|1</li><li>2</li><li>3</li><li>3.5</li><li>4</li><li>5</li><li>6|</li></ul>'
				],
				[
					'<ol><li>test</li><li>ord|ered</li><li>list</li></ol>',
					{ element: 'ol' },
					'<ol><li>test</li></ol><p>ord|ered</p><ol><li>list</li></ol>'
				],
				[
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>',
					{ element: 'ol' },
					'<p>|test</p><p>ordered</p><p>list|</p>'
				],
				[
					'<ul><li>|test</li><li>unordered</li><li>list|</li></ul>',
					{ element: 'ul' },
					'<p>|test</p><p>unordered</p><p>list|</p>'
				],
				[
					'<ul><li>|test</li><li>unordered</li><li>list|</li></ul>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>unordered</li><li>list|</li></ol>'
				],
				[
					'<ul><li>test</li><li>unordered|</li><li>list</li></ul>',
					{ element: 'ul' },
					'<ul><li>test</li></ul><p>unordered|</p><ul><li>list</li></ul>'
				],
				[
					'<ul><li>test</li></ul><p>unordered|</p><ul><li>list</li></ul>',
					{ element: 'ul' },
					'<ul><li>test</li><li>unordered|</li><li>list</li></ul>'
				],
				[
					'<ul class="test"><li>test</li></ul><p>unordered|</p><ul class="test"><li>list</li></ul>',
					{ element: 'ul', attributes: { class: 'test' } },
					'<ul class="test"><li>test</li><li>unordered|</li><li>list</li></ul>'
				],
				[
					'<ul><li>test</li><li>unor|der|ed</li><li>list</li></ul>',
					{ element: 'ul' },
					'<ul><li>test</li></ul><p>unor|der|ed</p><ul><li>list</li></ul>'
				],
				[
					'<ul><li>test</li><li>unor|der|ed</li><li>list</li></ul>',
					{ element: 'ul', attributes: { class: 'test' } },
					'<ul><li>test</li></ul><ul class="test"><li>unor|der|ed</li></ul><ul><li>list</li></ul>'
				],
				[
					'<ul><li>|test</li><li>unordered</li><li>list|</li></ul>',
					{
						element: 'ol',
						style: { 'list-style-type': 'lower-roman' }
					},
					'<ol style="list-style-type:lower-roman"><li>|test</li><li>unordered</li><li>list|</li></ol>'
				],
				[
					'<ol><li>|test</li><li>unordered</li><li>list|</li></ol>',
					{
						element: 'ol',
						style: { 'list-style-type': 'lower-roman' }
					},
					'<ol style="list-style-type:lower-roman"><li>|test</li><li>unordered</li><li>list|</li></ol>'
				],
				[
					'<ol style="list-style-type:lower-roman"><li>|test</li><li>ordered</li><li>list|</li></ol>',
					{
						element: 'ol',
						style: { 'list-style-type': 'lower-roman' }
					},
					'<p>|test</p><p>ordered</p><p>list|</p>'
				],
				[
					'<ol style="list-style-type:lower-alpha"><li>|test</li><li>unordered</li><li>list|</li></ol>',
					{
						element: 'ol',
						style: { 'list-style-type': 'lower-roman' }
					},
					'<ol style="list-style-type:lower-roman"><li>|test</li><li>unordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list|</p>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>|test</p><p>ordered</p><p>list</p>',
					{ element: 'ol' },
					'<ol><li>|test</li></ol><p>ordered</p><p>list</p>'
				],
				[
					'<h1>|test</h1><p>ordered</p><p>list|</p>',
					{ element: 'ol' },
					'<ol><li>|test</li><li>ordered</li><li>list|</li></ol>'
				],
				[
					'<p>te|st</p><p>ordered</p><p>li|st</p>',
					{ element: 'ol' },
					'<ol><li>te|st</li><li>ordered</li><li>li|st</li></ol>'
				],
				[
					'<p>|test</p><p>unordered</p><p>list|</p>',
					{ element: 'ul' },
					'<ul><li>|test</li><li>unordered</li><li>list|</li></ul>'
				],
				[
					'<ul><li>|1</li><li>2</li><li>3|</li></ul>',
					{ element: 'h1' },
					'<ul><li>|<h1>1</h1></li><li><h1>2</h1></li><li><h1>3</h1>|</li></ul>'
				],
				[
					'<ul><li><h1>|1</h1></li><li><h1>2</h1></li><li><h1>3|</h1></li></ul>',
					{ element: 'h1' },
					'<ul><li>|1</li><li>2</li><li>3|</li></ul>'
				],
				[
					'<ul class="todo-list"><li>test|</li></ul>',
					{
						element: 'ul',
						hooks: {
							beforeToggleList(mode, style, list) {
								Dom.replace(
									list,
									style.element,
									editor.createInside
								);
								return 'replace';
							}
						}
					},
					'<ul><li>test|</li></ul>'
				],
				[
					'<ul class="todo-list"><li>test|</li></ul>',
					{
						element: 'ul',
						hooks: {
							afterToggleList(mode, li) {
								if (mode === 'unwrap') {
									li.setAttribute('replaced', true);
								}
							}
						}
					},
					'<p replaced="true">test|</p>',
					{
						disablePlugins: ['todo-list']
					}
				],
				[
					'<ul class="todo-list"><li>test|</li></ul>',
					{
						element: 'ol'
					},
					'<ol><li>test|</li></ol>'
				],
				[
					'<p>|test|</p>',
					{
						element: 'ul',
						hooks: {
							beforeWrapList(_, wrapper) {
								const li = Dom.replace(
									wrapper,
									'li',
									editor.createInside
								);

								const label = editor.createInside.element(
									'label',
									{ class: 'jodit_todo_label' }
								);

								const input = editor.createInside.element(
									'input',
									{
										type: 'checkbox'
									}
								);
								label.appendChild(input);
								Dom.prepend(li, label);

								return li;
							}
						},
						attributes: {
							class: 'todo-list'
						}
					},
					'<ul class="todo-list"><li><label class="jodit_todo_label"><input type="checkbox"></label>|test|</li></ul>'
				],
				[
					'<p>|pop|</p>',
					{
						element: 'ul',
						hooks: {
							afterWrapList(_, wrapper, style) {
								wrapper.querySelectorAll('li').forEach(li => {
									li.className =
										'test ' +
										style.options.attributes.class;
								});
							}
						},
						attributes: {
							class: 'todo-list'
						}
					},
					'<ul class="todo-list"><li class="test todo-list">|pop|</li></ul>'
				]
			].forEach(([input, opt, output, jSettings]) => {
				describe(`For selection ${input} apply style ${JSON.stringify(
					opt
				)}`, () => {
					it(`Should get ${output}`, function () {
						if (jSettings) {
							editor.destruct();
							editor = getJodit(jSettings);
						}

						editor.value = input;
						setCursorToChar(editor);

						const style = new Style(opt);

						style.apply(editor);
						replaceCursorToChar(editor);

						expect(sortAttributes(editor.value).trim()).equals(
							output
						);
					});
				});
			});
		});

		describe('Apply style', function () {
			describe('For STYLE element', function () {
				it('Should not apply styles to STYLE element', function () {
					editor.value =
						'<p>test</p><style>.a {color: red}</style><p>stop</p>';
					editor.execCommand('selectall');

					const style = new Style({
						style: {
							fontFamily: 'Helvetica,sans-serif'
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="font-family:Helvetica,sans-serif">test</span></p>' +
							'<style>.a {color: red}</style>' +
							'<p><span style="font-family:Helvetica,sans-serif">stop</span></p>'
					);
				});
			});

			describe('For all content', function () {
				it('Should apply style to all elements', function () {
					editor.value = '<p><br></p><p>test</p>';
					editor.execCommand('selectall');

					const style = new Style({
						style: {
							color: 'yellow'
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="color:yellow"><br></span></p>' +
							'<p><span style="color:yellow">test</span></p>'
					);
				});

				describe('Select all content by edges', function () {
					it('Should apply style to all elements', function () {
						editor.value = '<p><br></p><p>test</p>';
						const range = editor.s.createRange(true);

						range.setStart(editor.editor.firstChild, 0);
						range.setEnd(editor.editor.lastChild.firstChild, 4);
						editor.s.selectRange(range);

						const style = new Style({
							style: {
								color: 'yellow'
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p><span style="color:yellow"><br></span></p>' +
								'<p><span style="color:yellow">test</span></p>'
						);
					});
				});
			});

			describe('Two times', function () {
				it('Should do nothing', function () {
					const style = function () {
						return new Style({
							style: {
								color: '#FF0000'
							}
						});
					};

					style().apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="color:#FF0000">test</span></p>'
					);

					style().apply(editor);

					expect(sortAttributes(editor.value)).equals('<p>test</p>');
				});
			});

			describe('For collapsed selection', function () {
				it('Should create SPAN element with this style', function () {
					editor.s.setCursorAfter(
						editor.editor.firstChild.firstChild
					);

					const style = new Style({
						style: {
							fontSize: 12
						}
					});

					style.apply(editor);

					editor.s.insertHTML('stop');

					expect(sortAttributes(editor.value)).equals(
						'<p>test<span style="font-size:12px">stop</span></p>'
					);
				});

				describe('Double times', function () {
					it('Should create new SPAN inside first', function () {
						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							style: {
								fontSize: 12
							}
						});

						style.apply(editor);

						editor.s.insertHTML('stop');

						const style2 = new Style({
							style: {
								color: '#ff00ff'
							}
						});

						style2.apply(editor);

						editor.s.insertHTML('elem');

						expect(sortAttributes(editor.value)).equals(
							'<p>test<span style="font-size:12px">stop<span style="color:#FF00FF">elem</span></span></p>'
						);
					});

					describe('With same style', function () {
						it('Should break first SPAN', function () {
							editor.value = '<p>test|</p>';
							setCursorToChar(editor);

							const style = new Style({
								style: {
									fontSize: 12
								}
							});

							style.apply(editor);

							editor.s.insertHTML('stop');

							expect(sortAttributes(editor.value)).equals(
								'<p>test<span style="font-size:12px">stop</span></p>'
							);

							const style2 = new Style({
								style: {
									fontSize: 12
								}
							});
							style2.apply(editor);

							editor.s.insertHTML('elem');

							replaceCursorToChar(editor);

							expect(sortAttributes(editor.value)).equals(
								'<p>test<span style="font-size:12px">stop</span>elem|</p>'
							);
						});

						describe('Without editing', function () {
							it('Should unwrap empty SPAN', function () {
								editor.value = '<p>test|</p>';
								setCursorToChar(editor);

								const style = new Style({
									style: {
										fontSize: 12
									}
								});

								style.apply(editor);

								const style2 = new Style({
									style: {
										fontSize: 12
									}
								});
								style2.apply(editor);

								editor.s.insertHTML('elem');

								expect(sortAttributes(editor.value)).equals(
									'<p>testelem</p>'
								);
							});
						});
					});

					describe('Apply different styles', function () {
						it('Should combine all of it', function () {
							editor.value = '<p>test|</p>';
							setCursorToChar(editor);

							const style = new Style({
								style: {
									backgroundColor: 'yellow'
								}
							});

							style.apply(editor);

							const style2 = new Style({
								style: {
									fontSize: '12px'
								}
							});

							style2.apply(editor);

							editor.s.insertHTML('stop');

							expect(sortAttributes(editor.value)).equals(
								'<p>test<span style="background-color:yellow;font-size:12px">stop</span></p>'
							);
						});
					});
				});
			});

			describe('Apply different styles', function () {
				it('Should combine all of it', function () {
					const style = new Style({
						style: {
							backgroundColor: 'yellow'
						}
					});

					style.apply(editor);

					const style2 = new Style({
						style: {
							fontSize: '12px'
						}
					});

					style2.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><span style="background-color:yellow;font-size:12px">test</span></p>'
					);
				});
			});

			describe('For text inside some SPAN', function () {
				describe('Select SPAN', function () {
					it('Should apply style to this SPAN', function () {
						editor.value = '<span>test</span>';
						editor.s.select(editor.editor.firstChild.firstChild);

						const style = new Style({
							style: {
								fontSize: 11
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p><span style="font-size:11px">test</span></p>'
						);
					});
				});

				describe('Select SPAN content', function () {
					it('Should apply style to this SPAN', function () {
						editor.value = '<span>test</span>';
						editor.s.select(editor.editor.firstChild.firstChild);

						const style = new Style({
							style: {
								fontSize: 11
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p><span style="font-size:11px">test</span></p>'
						);
					});
				});
			});
		});

		describe('Apply element', function () {
			it('Should wrap selection in element', function () {
				const style = new Style({
					element: 'h1'
				});

				style.apply(editor);

				expect(sortAttributes(editor.value)).equals('<h1>test</h1>');
			});

			describe('Block or inline element', function () {
				describe('Block element', function () {
					it('Should wrap whole text for selection part', function () {
						const range = editor.s.createRange();
						range.setStart(editor.editor.firstChild.firstChild, 2);
						range.setEndAfter(editor.editor.firstChild.firstChild);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h1>test</h1>'
						);
					});

					describe('Selected part inside inline element', function () {
						it('Should wrap whole text with this part', function () {
							editor.value = 'test<strong>stop</strong>left';
							const range = editor.s.createRange();
							range.setStart(
								editor.editor.querySelector('strong')
									.firstChild,
								2
							);
							range.setEnd(
								editor.editor.querySelector('strong')
									.firstChild,
								3
							);
							editor.s.selectRange(range);

							const style = new Style({
								element: 'h1'
							});

							style.apply(editor);

							expect(sortAttributes(editor.value)).equals(
								'<h1>test<strong>stop</strong>left</h1>'
							);
						});
					});

					describe('In empty editor', function () {
						it('Should insert this new block element with BR', function () {
							editor.value = '';

							const style = new Style({
								element: 'h1'
							});

							style.apply(editor);

							expect(sortAttributes(editor.value)).equals(
								'<h1><br></h1>'
							);

							editor.s.insertHTML('test');

							expect(sortAttributes(editor.value)).equals(
								'<h1>test</h1>'
							);
						});
					});
				});

				describe('inline element', function () {
					it('Should wrap only selection part', function () {
						const range = editor.s.createRange();
						range.setStart(editor.editor.firstChild.firstChild, 2);
						range.setEndAfter(editor.editor.firstChild.firstChild);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'strong'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p>te<strong>st</strong></p>'
						);
					});
				});
			});

			describe('For collapsed selection', function () {
				describe('Block element', function () {
					it('Should wrap whole text in element', function () {
						editor.s.setCursorAfter(
							editor.editor.firstChild.firstChild
						);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h1>test</h1>'
						);
					});

					describe('Double time', function () {
						it('Should unwrap element', function () {
							editor.value = '<h1>test</h1>';

							editor.s.setCursorAfter(
								editor.editor.firstChild.firstChild
							);

							const style = new Style({
								element: 'h1'
							});

							style.apply(editor);

							expect(sortAttributes(editor.value)).equals('test');
						});
					});

					describe('Selected Block element', function () {
						it('Should replace this element to new style', function () {
							editor.value = '<p>test</p>';

							editor.s.setCursorAfter(
								editor.editor.firstChild.firstChild
							);

							const style = new Style({
								element: 'h1'
							});

							style.apply(editor);

							expect(sortAttributes(editor.value)).equals(
								'<h1>test</h1>'
							);
						});
					});
				});
			});

			describe('For suitable element', function () {
				it('Should replace it to new element', function () {
					editor.value = '<h2>test</h2>';
					editor.execCommand('selectall');

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<h1>test</h1>'
					);
				});

				describe('With style', function () {
					it('Should wrap contents again', function () {
						editor.value = '<p><strong>|test|</strong></p>';
						setCursorToChar(editor);

						const style = new Style({
							element: 'em',
							style: {
								fontStyle: 'italic'
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p><strong><em>test</em></strong></p>'
						);
					});

					describe('For collapsed selection', function () {
						it('Should add several tags', function () {
							editor.s.setCursorAfter(
								editor.editor.firstChild.firstChild
							);

							const strong = new Style({
								element: 'strong',
								style: {
									fontWeight: 700
								}
							});

							strong.apply(editor);

							editor.s.insertHTML('stop');

							expect(sortAttributes(editor.value)).equals(
								'<p>test<strong>stop</strong></p>'
							);

							const em = new Style({
								element: 'em',
								style: {
									fontStyle: 'italic'
								}
							});

							em.apply(editor);

							editor.s.insertHTML('last');

							expect(sortAttributes(editor.value)).equals(
								'<p>test<strong>stop<em>last</em></strong></p>'
							);
						});

						describe('Double times', function () {
							it('Should create new SPAN inside first', function () {
								editor.value = '<p>test|</p>';
								setCursorToChar(editor);

								const style = new Style({
									style: {
										fontSize: 12
									}
								});

								style.apply(editor);

								editor.s.insertHTML('stop');

								const style2 = new Style({
									style: {
										color: '#ff00ff'
									}
								});

								style2.apply(editor);

								editor.s.insertHTML('elem');

								expect(sortAttributes(editor.value)).equals(
									'<p>test<span style="font-size:12px">stop<span style="color:#FF00FF">elem</span></span></p>'
								);
							});

							describe('With same style 1', function () {
								it('Should break first SPAN', function () {
									editor.value = '<p>test|</p>';
									setCursorToChar(editor);

									const style = new Style({
										style: {
											fontSize: 12
										}
									});

									style.apply(editor);

									editor.s.insertHTML('stop');

									style.apply(editor);

									editor.s.insertHTML('elem');

									expect(sortAttributes(editor.value)).equals(
										'<p>test<span style="font-size:12px">stop</span>elem</p>'
									);
								});
							});
						});
					});
				});

				describe('For several block elements', function () {
					it('Should replace all these element to new', function () {
						editor.value = '<p>test</p>\n<p>test2</p>';

						const range = editor.s.createRange();
						range.setStartBefore(editor.editor.firstChild);
						range.setEndAfter(editor.editor.lastChild);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'h5'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<h5>test</h5>\n<h5>test2</h5>'
						);
					});
				});
			});

			describe('For same element', function () {
				it('Should unwrap selection', function () {
					editor.value = '<h1>test</h1>';
					editor.execCommand('selectall');

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals('test');
				});
			});

			describe('For part of same element', function () {
				it('Should unwrap selection', function () {
					editor.value = '<strong>test</strong> some';

					const range = editor.s.createRange();
					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						2
					);
					range.setEnd(editor.editor.firstChild.lastChild, 3);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'strong',
						style: {
							fontWeight: 700
						}
					});

					style.apply(editor);

					expect(sortAttributes(editor.value)).equals(
						'<p><strong>te</strong>st some</p>'
					);
				});
			});

			describe('Apply UL/OL', function () {
				describe('UL', function () {
					it('Should create LI inside new element', function () {
						const style = new Style({
							element: 'ul'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<ul><li>test</li></ul>'
						);
					});
				});

				describe('OL', function () {
					it('Should create LI inside new element', function () {
						const style = new Style({
							element: 'ol'
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<ol><li>test</li></ol>'
						);
					});
				});
			});

			describe('Apply H1 inside LI', function () {
				it('Should create H1 inside LI', function () {
					editor.value =
						'<ul>' +
						'<li>1</li>' +
						'<li>2</li>' +
						'<li>3</li>' +
						'</ul> test';

					const range = editor.s.createRange();
					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.lastChild.firstChild,
						1
					);
					editor.s.selectRange(range);

					const style = new Style({
						element: 'h1'
					});

					style.apply(editor);

					expect(editor.value).equals(
						'<ul>' +
							'<li><h1>1</h1></li>' +
							'<li><h1>2</h1></li>' +
							'<li><h1>3</h1></li>' +
							'</ul><p> test</p>'
					);
				});

				describe('Apply H1 for whole UL', function () {
					it('Should create H1 inside every LI inside UL', function () {
						editor.value =
							'<ul>' +
							'<li>1</li>' +
							'<li>2</li>' +
							'<li>3</li>' +
							'</ul>';

						const range = editor.s.createRange();
						range.selectNodeContents(editor.editor);
						editor.s.selectRange(range);

						const style = new Style({
							element: 'h1'
						});

						style.apply(editor);

						expect(editor.value).equals(
							'<ul>' +
								'<li><h1>1</h1></li>' +
								'<li><h1>2</h1></li>' +
								'<li><h1>3</h1></li>' +
								'</ul>'
						);
					});

					describe('Apply H1 for whole UL with text', function () {
						it('Should create H1 inside every LI inside UL and wrap text', function () {
							editor.value =
								'<ul>' +
								'<li>1</li>' +
								'<li>2</li>' +
								'<li>3</li>' +
								'</ul> test';

							const range = editor.s.createRange();
							range.selectNodeContents(editor.editor);
							editor.s.selectRange(range);

							const style = new Style({
								element: 'h1'
							});

							style.apply(editor);

							expect(editor.value).equals(
								'<ul>' +
									'<li><h1>1</h1></li>' +
									'<li><h1>2</h1></li>' +
									'<li><h1>3</h1></li>' +
									'</ul><h1> test</h1>'
							);
						});
					});
				});
			});
		});

		describe('Combine style or element', function () {
			describe('For Styled element with style equaled STRONG', function () {
				describe('Apply STRONG', function () {
					it('Should unwrap this element', function () {
						editor.value =
							'<span style="font-weight:700">test</span>';
						editor.execCommand('selectall');

						const style = new Style({
							element: 'strong',
							style: {
								fontWeight: 700
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p>test</p>'
						);
					});
				});
			});

			describe('For Styled element with style contains STRONG', function () {
				describe('Apply STRONG', function () {
					it('Should remove STRONG from element', function () {
						editor.value =
							'<span style="font-weight:700;font-size:24px;">test</span>';
						editor.execCommand('selectall');

						const style = new Style({
							element: 'strong',
							style: {
								fontWeight: 700
							}
						});

						style.apply(editor);

						expect(sortAttributes(editor.value)).equals(
							'<p><span style="font-size:24px">test</span></p>'
						);
					});
				});
			});
		});
	});

	describe('Test Selection.applyStyle method', function () {
		describe('Bold command', function () {
			describe('For box with style="font-weight:bold"', function () {
				it('should wrap selected text in STRONG element without questions', function () {
					const editor = getJodit(),
						style = document.createElement('style');

					editor.value = '<p>test</p>';
					style.innerHTML = 'p {font-weight: bold !important};';
					document.body.appendChild(style);

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 0);
					range.setEnd(editor.editor.firstChild.firstChild, 4);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					style.parentNode.removeChild(style);
					expect(editor.value).equals('<p><strong>test</strong></p>');
				});
			});

			it('Should insert a few chars and again exec bold. Bold mode should be switch off', function () {
				const editor = getJodit();
				editor.value = 'test';

				const range = editor.s.createRange(true);

				range.selectNodeContents(editor.editor.firstChild);
				range.collapse(false);

				editor.execCommand('bold');

				editor.s.insertNode(editor.createInside.text('abc'));

				editor.execCommand('bold');

				editor.s.insertNode(editor.createInside.text('def'));

				expect(editor.value).equals(
					'<p>test<strong>abc</strong>def</p>'
				);
			});

			describe('for some text', function () {
				it('should wrap this text in STRONG element', function () {
					const editor = getJodit();
					editor.value = 'test';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<p><strong>test</strong></p>');
				});

				describe('inside STRONG element ', function () {
					it('from start of this element, should unwrap this text', function () {
						const editor = getJodit();
						editor.value = '<strong>test</strong>';

						const range = editor.s.createRange();

						range.setStart(
							editor.editor.firstChild.firstChild.firstChild,
							0
						);
						range.setEnd(
							editor.editor.firstChild.firstChild.firstChild,
							2
						);

						editor.s.selectRange(range);

						editor.execCommand('bold');

						expect(editor.value).equals(
							'<p>te<strong>st</strong></p>'
						);
					});

					it('near end of this element, should unwrap this text', function () {
						const editor = getJodit();
						editor.value = '<strong>test</strong>';

						const range = editor.s.createRange();

						range.setStart(
							editor.editor.firstChild.firstChild.firstChild,
							2
						);
						range.setEnd(
							editor.editor.firstChild.firstChild.firstChild,
							4
						);

						editor.s.selectRange(range);

						editor.execCommand('bold');

						expect(editor.value).equals(
							'<p><strong>te</strong>st</p>'
						);
					});

					it('in the middle of this element, should unwrap this text', function () {
						const editor = getJodit();
						editor.value = '<strong>test</strong>';

						const range = editor.s.createRange();

						range.setStart(
							editor.editor.firstChild.firstChild.firstChild,
							1
						);
						range.setEnd(
							editor.editor.firstChild.firstChild.firstChild,
							3
						);
						editor.s.selectRange(range);

						editor.execCommand('bold');

						expect(editor.value).equals(
							'<p><strong>t</strong>es<strong>t</strong></p>'
						);
					});

					it('should unwrap this part and after exec "bold" again it should create 3 STRONG elements', function () {
						const editor = getJodit();
						editor.value = '<strong>1 2 3</strong>';

						const range = editor.s.createRange();

						range.setStart(
							editor.editor.firstChild.firstChild.firstChild,
							1
						);
						range.setEnd(
							editor.editor.firstChild.firstChild.firstChild,
							4
						);
						editor.s.selectRange(range);

						editor.execCommand('bold');
						editor.execCommand('bold');

						expect(editor.value).equals(
							'<p><strong>1</strong><strong> 2 </strong><strong>3</strong></p>'
						);
					});

					describe('For collapsed selection', function () {
						it('should split this element and set cursor between two parts', function () {
							const editor = getJodit();
							editor.value = '<strong>test</strong>';

							const range = editor.s.createRange();

							range.setStart(
								editor.editor.firstChild.firstChild.firstChild,
								2
							);
							range.collapse(true);
							editor.s.selectRange(range);

							editor.execCommand('bold');
							editor.s.insertHTML('stop');

							expect(editor.value).equals(
								'<p><strong>te</strong>stop<strong>st</strong></p>'
							);
						});
					});
				});

				it('that contains a few STRONG elements, should unwrap all of these', function () {
					const editor = getJodit();
					editor.value =
						'<p><strong>|test</strong> test <strong>test|</strong></p>';

					setCursorToChar(editor);

					editor.execCommand('bold');

					expect(editor.value).equals('<p>test test test</p>');
				});
			});

			describe('Try exec the command "bold"', function () {
				it('Should wrap selected text in STRONG element', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<p><strong>test</strong></p>');
				});
				describe('Try exec the command "bold" twice', function () {
					it('Should unwrap strong elements', function () {
						const editor = getJodit();
						editor.value = '<p>test</p>';

						const sel = editor.s.sel,
							range = editor.s.createRange();

						range.selectNodeContents(editor.editor.firstChild);
						sel.removeAllRanges();
						sel.addRange(range);

						editor.execCommand('bold');
						editor.execCommand('bold');

						expect(editor.value).equals('<p>test</p>');
					});
				});
			});

			describe('Try exec the command "bold" for font-weight: 700 Element', function () {
				it('should ubnwrap selected srtong element', function () {
					const editor = getJodit();
					editor.value = '<span style="font-weight: 700">test</span>';

					const range = editor.s.createRange();

					range.selectNodeContents(editor.editor.firstChild);
					editor.s.selectRange(range);

					editor.execCommand('bold');

					expect(editor.value).equals('<p>test</p>');
				});
			});

			describe('Exec bold for collapsed range and move cursor in another place', function () {
				it('Should remove STRONG element', function (done) {
					const editor = getJodit({
						cleanHTML: {
							timeout: 0
						}
					});

					editor.value = 'test|test';

					setCursorToChar(editor);

					editor.execCommand('bold');
					expect(editor.value).equals(
						'<p>test<strong></strong>test</p>'
					);

					const range = editor.ed.createRange();
					range.setStart(editor.editor.firstChild.lastChild, 2);
					range.collapse(true);
					editor.s.selectRange(range);
					simulateEvent('mousedown', editor.editor);
					editor.async.requestIdleCallback(() => {
						expect(editor.value).equals('<p>testtest</p>');
						done();
					});
				});
			});

			describe('Exec bold command for SPAN with font-size', function () {
				it('Should leave both font-size and font-weight rules', function () {
					const editor = getJodit();
					editor.value =
						'<span style="font-size: 36px;">asdasd</span>';

					const range = editor.s.createRange();

					range.setStart(
						editor.editor.firstChild.firstChild.firstChild,
						0
					);
					range.setEnd(
						editor.editor.firstChild.firstChild.firstChild,
						6
					);

					editor.s.selectRange(range);

					editor.execCommand('bold');

					expect(sortAttributes(editor.value)).equals(
						sortAttributes(
							'<p><span style="font-size: 36px;"><strong>asdasd</strong></span></p>'
						)
					);
				});
			});
		});

		describe('Fonts', function () {
			describe('Set font size', function () {
				it('should create attribute style="font-size:value"', function () {
					const editor = getJodit();
					editor.value = '<p> testy oprst <span>lets go</span></p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.selectNode(editor.editor.querySelector('span'));

					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('fontSize', false, 12);

					expect(editor.value).equals(
						'<p> testy oprst <span style="font-size: 12px;">lets go</span></p>'
					);

					editor.execCommand('fontSize', false, '12%');
					expect(editor.value).equals(
						'<p> testy oprst <span style="font-size: 12%;">lets go</span></p>'
					);
				});

				describe('For box with style="font-size:12px"', function () {
					it('should wrap selected text in SPAN with style="font-size:12px" element without questions', function () {
						const editor = getJodit();
						editor.value = 'test';

						const sel = editor.s.sel,
							range = editor.s.createRange();

						range.selectNodeContents(
							editor.editor.firstChild.firstChild
						);
						sel.removeAllRanges();
						sel.addRange(range);

						editor.editor.style.fontSize = '12px';

						editor.execCommand('fontSize', false, 12);

						expect(editor.value).equals(
							'<p><span style="font-size: 12px;">test</span></p>'
						);
					});
				});
			});

			describe('Set font family', function () {
				describe('For box with style="font-name:Arial"', function () {
					it('should wrap selected text in SPAN with style="font-family:Arial" element without questions', function () {
						const editor = getJodit();
						editor.value = '<p>te|st|</p>';

						setCursorToChar(editor);

						editor.editor.style.fontFamily = 'Arial';

						editor.execCommand('fontName', false, 'Arial');

						expect(sortAttributes(editor.value)).equals(
							'<p>te<span style="font-family:Arial">st</span></p>'
						);
					});
				});
				it('should create attribute style="font-family:value"', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);

					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('fontName', false, 'Arial');

					expect(editor.value).equals(
						'<p>te<span style="font-family: Arial;">st</span></p>'
					);
				});
			});

			describe('Set font size and family', function () {
				it('should create attribute style="font-family:value;font-size:value"', function () {
					const editor = getJodit();
					editor.value = '<p>test</p>';

					const sel = editor.s.sel,
						range = editor.s.createRange();

					range.setStart(editor.editor.firstChild.firstChild, 2);
					range.setEnd(editor.editor.firstChild.firstChild, 4);

					sel.removeAllRanges();
					sel.addRange(range);

					editor.execCommand('fontName', false, 'Arial');
					editor.execCommand('fontSize', false, 12);

					expect(sortAttributes(editor.value)).equals(
						'<p>te<span style="font-family:Arial;font-size:12px">st</span></p>'
					);
				});
			});
		});
	});
});
