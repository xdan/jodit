/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */
describe('Link HTML security before insertion', () => {
	const submitHTML = (html, config = {}) => {
		let inserted;
		const editor = getJodit({
			...config,
			link: { contentMode: 'html' },
			events: {
				applyLink: (_editor, anchor) => {
					inserted = anchor.cloneNode(true);
				}
			}
		});
		editor.value = '<p><a href="/old">Old</a></p>';
		const anchor = editor.editor.querySelector('a');
		editor.s.setCursorIn(anchor);
		const form = editor.e.fire('generateLinkForm.link', anchor, () => {});
		document.body.appendChild(form.container);
		form.container.querySelector('[ref=content_input]').value = html;
		simulateEvent('submit', 0, form.container);
		return inserted;
	};
	it('removes active document elements before applyLink runs', () => {
		const anchor = submitHTML(
			'<strong>Safe</strong><script>window.__linkSecurityExecuted=true</script><style>body{display:none}</style><iframe src="/document"></iframe><object data="/document"></object><embed src="/document"><meta http-equiv="refresh" content="0;url=/document"><base href="/elsewhere"><link rel="stylesheet" href="/sheet.css"><template><img src=x onerror="window.__linkSecurityExecuted=true"></template>'
		);
		expect(anchor.innerHTML).equals('<strong>Safe</strong>');
		expect(window.__linkSecurityExecuted).is.undefined;
	});
	it('applies configured tag, attribute and style restrictions before insertion', () => {
		const anchor = submitHTML(
			'<em class="bad">Delete</em><strong onclick="alert(1)" class="bad" style="color:red;position:fixed">Keep</strong>',
			{
				cleanHTML: {
					denyTags: 'script,iframe,object,embed,em',
					allowTags: 'strong[style]',
					allowedStyles: { '*': ['color'] }
				}
			}
		);
		expect(anchor.querySelector('em')).is.null;
		expect(anchor.querySelector('[class],[onclick]')).is.null;
		expect(anchor.querySelector('strong').style.position).equals('');
		expect(anchor.querySelector('strong').style.color).equals('red');
	});
	it('honors custom denied tags before insertion', () => {
		const anchor = submitHTML('<em>Delete</em><strong>Keep</strong>', {
			cleanHTML: { denyTags: 'em' }
		});
		expect(anchor.innerHTML).equals('<strong>Keep</strong>');
	});
	it('keeps its security floor even when cleaning is disabled', () => {
		const anchor = submitHTML(
			'<strong onclick="alert(1)">Safe</strong><img src="javascript:alert(1)" onerror="alert(1)"><svg onload="alert(1)"><use href="javascript:alert(1)"></use></svg><iframe srcdoc="unsafe"></iframe>',
			{ disablePlugins: ['clean-html'] }
		);
		expect(
			anchor.querySelector('[onclick],[onerror],[onload],[srcdoc],iframe')
		).is.null;
		expect(anchor.querySelector('img').hasAttribute('src')).is.false;
		expect(
			anchor.querySelector('use').getAttribute('href') || ''
		).does.not.match(/^javascript:/i);
	});
	it('cleans unsafe markup returned by a custom sanitizer', () => {
		const anchor = submitHTML('<strong>Safe</strong>', {
			cleanHTML: {
				sanitizer: html =>
					html +
					'<style>body{display:none}</style><iframe src="/document"></iframe><img src=x onerror="alert(1)">'
			}
		});
		expect(anchor.querySelector('style,iframe,[onerror]')).is.null;
	});
});
