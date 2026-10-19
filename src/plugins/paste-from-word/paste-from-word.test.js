/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Paste from Word', () => {
	describe('Lists (#1657)', () => {
		const { applyStyles, cleanFromWord } = Jodit.modules.Helpers;

		const spacer =
			'<span style=\'font:7.0pt "Times New Roman"\'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>';

		const item = (cls, list, level, marker, text, font) =>
			`<p class=${cls} style='margin-left:${level * 36}.0pt;text-indent:-18.0pt;mso-list:${list} level${level} lfo1'>` +
			'<![if !supportLists]>' +
			(font
				? `<span style='font-family:${font}'>`
				: '<span lang=EN-NZ>') +
			`<span style='mso-list:Ignore'>${marker}${spacer}</span></span>` +
			'<![endif]>' +
			`<span lang=EN-NZ>${text}<o:p></o:p></span></p>`;

		const para = text =>
			`<p class=MsoNormal><span lang=EN-NZ>${text}<o:p></o:p></span></p>`;

		const word = body =>
			'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
			'<head><meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 15">' +
			'<style><!-- p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst {margin-left:36.0pt;font-size:12.0pt;} --></style>' +
			`</head><body lang=EN-NZ><!--StartFragment-->${body}<!--EndFragment--></body></html>`;

		const bulletsAndNumbers = word(
			para('Bring:') +
				item(
					'MsoListParagraphCxSpFirst',
					'l0',
					1,
					'·',
					'A hat',
					'Symbol'
				) +
				item(
					'MsoListParagraphCxSpMiddle',
					'l0',
					1,
					'·',
					'Water bottle',
					'Symbol'
				) +
				item(
					'MsoListParagraphCxSpLast',
					'l0',
					1,
					'·',
					'Sunscreen',
					'Symbol'
				) +
				para('Steps:') +
				item(
					'MsoListParagraphCxSpFirst',
					'l1',
					1,
					'1.',
					'Sign the form'
				) +
				item(
					'MsoListParagraphCxSpLast',
					'l1',
					1,
					'2.',
					'Return it by Friday'
				)
		);

		const nested = word(
			item('MsoListParagraphCxSpFirst', 'l0', 1, '1.', 'One') +
				item('MsoListParagraphCxSpMiddle', 'l0', 2, 'a.', 'One A') +
				item('MsoListParagraphCxSpMiddle', 'l0', 3, 'i.', 'One A i') +
				item('MsoListParagraphCxSpMiddle', 'l0', 3, 'ii.', 'One A ii') +
				item('MsoListParagraphCxSpMiddle', 'l0', 2, 'b.', 'One B') +
				item('MsoListParagraphCxSpMiddle', 'l0', 1, '2.', 'Two') +
				item(
					'MsoListParagraphCxSpMiddle',
					'l0',
					2,
					'o',
					'Two bullet',
					'"Courier New"'
				) +
				item(
					'MsoListParagraphCxSpLast',
					'l0',
					3,
					'§',
					'Two square',
					'Wingdings'
				)
		);

		describe('Clean', () => {
			it('Should turn bulleted and numbered paragraphs into lists', () => {
				expect(cleanFromWord(bulletsAndNumbers)).equals(
					'<p><span>Bring:</span></p>' +
						'<ul><li><span>A hat</span></li><li><span>Water bottle</span></li><li><span>Sunscreen</span></li></ul>' +
						'<p><span>Steps:</span></p>' +
						'<ol><li><span>Sign the form</span></li><li><span>Return it by Friday</span></li></ol>'
				);
			});

			it('Should nest the levels and keep lettered and roman numbering', () => {
				expect(cleanFromWord(nested)).equals(
					'<ol><li><span>One</span>' +
						'<ol style="list-style-type: lower-alpha;"><li><span>One A</span>' +
						'<ol style="list-style-type: lower-roman;"><li><span>One A i</span></li><li><span>One A ii</span></li></ol>' +
						'</li><li><span>One B</span></li></ol>' +
						'</li><li><span>Two</span>' +
						'<ul><li><span>Two bullet</span><ul><li><span>Two square</span></li></ul></li></ul>' +
						'</li></ol>'
				);
			});

			it('Should continue the numbering of a list split by a paragraph', () => {
				expect(
					cleanFromWord(
						word(
							item(
								'MsoListParagraphCxSpFirst',
								'l0',
								1,
								'1.',
								'One'
							) +
								para('Note') +
								item(
									'MsoListParagraphCxSpLast',
									'l0',
									1,
									'2.',
									'Two'
								)
						)
					)
				).equals(
					'<ol><li><span>One</span></li></ol>' +
						'<p><span>Note</span></p>' +
						'<ol start="2"><li><span>Two</span></li></ol>'
				);
			});
		});

		describe('Keep', () => {
			it('Should turn the paragraphs into lists without the hanging indent', () => {
				expect(applyStyles(bulletsAndNumbers)).equals(
					'<p class="MsoNormal"><span lang="EN-NZ">Bring:</span></p>' +
						'<ul><li style="font-size: 16px;"><span lang="EN-NZ">A hat</span></li>' +
						'<li><span lang="EN-NZ">Water bottle</span></li>' +
						'<li><span lang="EN-NZ">Sunscreen</span></li></ul>' +
						'<p class="MsoNormal"><span lang="EN-NZ">Steps:</span></p>' +
						'<ol><li style="font-size: 16px;"><span lang="EN-NZ">Sign the form</span></li>' +
						'<li><span lang="EN-NZ">Return it by Friday</span></li></ol>'
				);
			});

			it('Should nest the levels and keep lettered and roman numbering', () => {
				const div = document.createElement('div');
				div.innerHTML = applyStyles(nested);

				expect(div.querySelectorAll('li').length).equals(8);
				expect(
					Array.from(div.querySelectorAll('ol, ul')).map(
						list =>
							list.nodeName.toLowerCase() +
							(list.style.listStyleType
								? ':' + list.style.listStyleType
								: '')
					)
				).deep.equals([
					'ol',
					'ol:lower-alpha',
					'ol:lower-roman',
					'ul',
					'ul'
				]);
				expect(div.querySelector('[style*="indent"]')).is.null;
			});
		});

		[
			[Jodit.INSERT_AS_HTML, 'Keep'],
			[Jodit.INSERT_AS_TEXT, 'Clean']
		].forEach(([action, name]) => {
			it('Should paste a list with ' + name, async () => {
				const editor = getJodit({
					askBeforePasteFromWord: false,
					defaultActionOnPasteFromWord: action
				});

				editor.value = '<p>|</p>';
				setCursorToChar(editor);

				simulateEvent('paste', editor.editor, data => {
					data.clipboardData = {
						types: ['text/html'],
						getData: () => bulletsAndNumbers
					};
				});

				await delay(300);

				const div = document.createElement('div');
				div.innerHTML = editor.value;

				expect(
					Array.from(div.querySelectorAll('li')).map(
						li => li.parentNode.nodeName + ' ' + li.textContent
					)
				).deep.equals([
					'UL A hat',
					'UL Water bottle',
					'UL Sunscreen',
					'OL Sign the form',
					'OL Return it by Friday'
				]);
			});
		});

		[
			[
				'flat',
				() => bulletsAndNumbers,
				'<p>Bring:<br>A hat<br>Water bottle<br>Sunscreen<br>Steps:<br>Sign the form<br>Return it by Friday</p>'
			],
			[
				'nested',
				() => nested,
				'<p>One<br>One A<br>One A i<br>One A ii<br>One B<br>Two<br>Two bullet<br>Two square</p>'
			]
		].forEach(([name, clipboard, result]) => {
			it(
				'Should put each item of a ' +
					name +
					' list on its own line with Insert only Text',
				async () => {
					const editor = getJodit({
						askBeforePasteFromWord: false,
						defaultActionOnPasteFromWord: Jodit.INSERT_ONLY_TEXT
					});

					simulateEvent('paste', editor.editor, data => {
						data.clipboardData = {
							types: ['text/html'],
							getData: clipboard
						};
					});

					await delay(300);

					expect(editor.value).equals(result);
				}
			);
		});
	});

	// Word 16.113 for Windows and for Mac, copying the same document. Edge,
	// Chrome and Firefox get Word's HTML as it is, so one copy stands for
	// them. Safari rewrites it: no ProgId, comments for the conditional
	// blocks, double quotes, inline styles. Trimmed to the paragraphs below
	// and to the paragraph styles' layout rules.
	describe('Lists from real Word clipboards (#1657)', () => {
		const { applyStyles, cleanFromWord } = Jodit.modules.Helpers;

		const clipboards = {
			'Word for Windows, in Edge': `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 15"><meta name=Originator content="Microsoft Word 15"><style><!--
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
--></style></head><body lang=EN-NZ link="#467886" vlink="#96607D" style='tab-interval:36.0pt;word-wrap:break-word'><!--StartFragment--><p class=MsoNormal><span lang=EN-GB>Bring:<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol;mso-ansi-language:EN-NZ'><span style='mso-list:Ignore'>·<span
style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span
style='mso-ansi-language:EN-NZ'>A hat<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
lang=EN-GB style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Water bottle<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1'><![if !supportLists]><span
lang=EN-GB style='font-family:"Courier New";mso-fareast-font-family:"Courier New"'><span
style='mso-list:Ignore'>o<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Named<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:108.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l0 level3 lfo1'><![if !supportLists]><span
lang=EN-GB style='font-family:Wingdings;mso-fareast-font-family:Wingdings;
mso-bidi-font-family:Wingdings'><span style='mso-list:Ignore'>§<span
style='font:7.0pt "Times New Roman"'>&nbsp; </span></span></span><![endif]><span
lang=EN-GB>In the front pocket<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
lang=EN-GB style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Sunscreen<o:p></o:p></span></p>
<p class=MsoNormal><span lang=EN-GB>Steps<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;mso-list:l4 level1 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Sign the form<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l4 level2 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>a.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Both parents<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:108.0pt;mso-add-space:
auto;text-indent:-108.0pt;mso-text-indent-alt:-9.0pt;mso-list:l4 level3 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span>i.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Or a caregiver<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l4 level2 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>b.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Date it<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;mso-list:l4 level1 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>2.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Return it by Friday<o:p></o:p></span></p>
<p class=MsoNormal><span lang=EN-GB>A note between the steps.<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpFirst style='text-indent:-18.0pt;mso-list:l4 level1 lfo2'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>3.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Bring it to the office<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpLast style='text-indent:-18.0pt;mso-list:l2 level1 lfo3'><![if !supportLists]><span
lang=EN-GB style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'>1.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>A new list straight after<o:p></o:p></span></p>
<p class=MsoNormal><span lang=EN-GB>Terms:<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpFirst style='text-indent:-36.0pt;mso-text-indent-alt:
-18.0pt;mso-list:l1 level1 lfo5'><![if !supportLists]><span lang=EN-GB
style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span>I.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Term one<o:p></o:p></span></p>
<p class=MsoListParagraphCxSpMiddle style='text-indent:-36.0pt;mso-text-indent-alt:
-18.0pt;mso-list:l1 level1 lfo5'><![if !supportLists]><span lang=EN-GB
style='mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin'><span
style='mso-list:Ignore'><span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span>II.<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Term two<o:p></o:p></span></p>
<table class=MsoTableGrid border=1 cellspacing=0 cellpadding=0
 style='border-collapse:collapse;border:none;mso-border-alt:solid windowtext .5pt;
 mso-yfti-tbllook:1184;mso-padding-alt:0cm 5.4pt 0cm 5.4pt'>
 <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes;mso-yfti-lastrow:yes'>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;
  mso-border-alt:solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoNormal><span lang=EN-GB>Cell<o:p></o:p></span></p>
  </td>
  <td width=301 valign=top style='width:225.4pt;border:solid windowtext 1.0pt;
  border-left:none;mso-border-left-alt:solid windowtext .5pt;mso-border-alt:
  solid windowtext .5pt;padding:0cm 5.4pt 0cm 5.4pt'>
  <p class=MsoListParagraphCxSpFirst style='margin-left:18.0pt;mso-add-space:
  auto;text-indent:-18.0pt;mso-list:l6 level1 lfo7'><![if !supportLists]><span
  lang=EN-GB style='font-family:Symbol;mso-fareast-font-family:Symbol;
  mso-bidi-font-family:Symbol'><span style='mso-list:Ignore'>·<span
  style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span
  lang=EN-GB>One<o:p></o:p></span></p>
  <p class=MsoListParagraphCxSpLast style='margin-left:18.0pt;mso-add-space:
  auto;text-indent:-18.0pt;mso-list:l6 level1 lfo7'><![if !supportLists]><span
  lang=EN-GB style='font-family:Symbol;mso-fareast-font-family:Symbol;
  mso-bidi-font-family:Symbol'><span style='mso-list:Ignore'>·<span
  style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></span></span><![endif]><span
  lang=EN-GB>Two<o:p></o:p></span></p>
  </td>
 </tr>
</table><!--EndFragment--></body></html>`,
			'Word for Mac, in Safari': `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><head><style>
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
</style></head><p class="MsoNormal" style="margin: 0cm; font-size: 12pt; font-family: Aptos, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><span lang="EN-GB">Bring:<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol;mso-ansi-language:EN-NZ"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span>A hat<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Water bottle<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l0 level2 lfo1"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:&quot;Courier New&quot;;mso-fareast-font-family:&quot;Courier New&quot;"><span style="mso-list:Ignore">o<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Named<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:108.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l0 level3 lfo1"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:Wingdings;mso-fareast-font-family:Wingdings;
mso-bidi-font-family:Wingdings"><span style="mso-list:Ignore">§<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">In the front pocket<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Sunscreen<o:p></o:p></span></p>
<p class="MsoNormal" style="margin: 0cm; font-size: 12pt; font-family: Aptos, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><span lang="EN-GB">Steps<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l4 level1 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Sign the form<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l4 level2 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">a.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Both parents<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:108.0pt;mso-add-space:
auto;text-indent:-108.0pt;mso-text-indent-alt:-9.0pt;mso-list:l4 level3 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span>i.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Or a caregiver<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="margin-left:72.0pt;mso-add-space:
auto;text-indent:-18.0pt;mso-list:l4 level2 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">b.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Date it<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l4 level1 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">2.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Return it by Friday<o:p></o:p></span></p>
<p class="MsoNormal" style="margin: 0cm; font-size: 12pt; font-family: Aptos, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><span lang="EN-GB">A note between the steps.<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpFirst" style="text-indent:-18.0pt;mso-list:l4 level1 lfo2"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">3.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Bring it to the office<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpLast" style="text-indent:-18.0pt;mso-list:l2 level1 lfo3"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore">1.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">A new list straight after<o:p></o:p></span></p>
<p class="MsoNormal" style="margin: 0cm; font-size: 12pt; font-family: Aptos, sans-serif; caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none;"><span lang="EN-GB">Terms:<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpFirst" style="text-indent:-36.0pt;mso-text-indent-alt:
-18.0pt;mso-list:l1 level1 lfo5"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span>I.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Term one<o:p></o:p></span></p>
<p class="MsoListParagraphCxSpMiddle" style="text-indent:-36.0pt;mso-text-indent-alt:
-18.0pt;mso-list:l1 level1 lfo5"><!--[if !supportLists]--><span lang="EN-GB" style="mso-bidi-font-family:Aptos;mso-bidi-theme-font:minor-latin"><span style="mso-list:Ignore"><span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span>II.<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Term two<o:p></o:p></span></p>
<table class="MsoTableGrid" border="1" cellspacing="0" cellpadding="0" style="caret-color: rgb(0, 0, 0); color: rgb(0, 0, 0); font-size: medium; font-style: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration: none; border-collapse: collapse; border: medium;"><tbody><tr><td width="301" valign="top" style="width: 225.4pt; border: 1pt solid windowtext; padding: 0cm 5.4pt;"><p class="MsoNormal" style="margin: 0cm; font-size: 12pt; font-family: Aptos, sans-serif;"><span lang="EN-GB">Cell<o:p></o:p></span></p></td><td width="301" valign="top" style="width: 225.4pt; border-width: 1pt 1pt 1pt medium; border-style: solid solid solid none; border-color: windowtext windowtext windowtext currentcolor; border-image: none; padding: 0cm 5.4pt;"><p class="MsoListParagraphCxSpFirst" style="margin-left:18.0pt;mso-add-space:
  auto;text-indent:-18.0pt;mso-list:l6 level1 lfo7"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:Symbol;mso-fareast-font-family:Symbol;
  mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">One<o:p></o:p></span></p><p class="MsoListParagraphCxSpLast" style="margin-left:18.0pt;mso-add-space:
  auto;text-indent:-18.0pt;mso-list:l6 level1 lfo7"><!--[if !supportLists]--><span lang="EN-GB" style="font-family:Symbol;mso-fareast-font-family:Symbol;
  mso-bidi-font-family:Symbol"><span style="mso-list:Ignore">·<span style="font:7.0pt &quot;Times New Roman&quot;">\u00a0\u00a0\u00a0\u00a0\u00a0<span class="Apple-converted-space">\u00a0</span></span></span></span><!--[endif]--><span lang="EN-GB">Two<o:p></o:p></span></p></td></tr></tbody></table></html>`
		};

		// The lists, their items and the text around them
		const outline = html => {
			const box = document.createElement('div');
			box.innerHTML = html;

			const text = elm =>
				Array.from(elm.childNodes)
					.filter(node => !/^(UL|OL)$/.test(node.nodeName))
					.map(node => node.textContent)
					.join('')
					.replace(/\s+/g, ' ')
					.trim();

			const walk = node =>
				Array.from(node.children)
					.map(elm => {
						const tag = elm.nodeName.toLowerCase();

						if (tag === 'ul' || tag === 'ol') {
							const type = elm.style.listStyleType;
							const start = elm.getAttribute('start');

							return (
								tag +
								(type ? '.' + type : '') +
								(start ? '@' + start : '') +
								'(' +
								walk(elm).join('; ') +
								')'
							);
						}

						if (tag === 'li') {
							return [
								text(elm),
								...walk(elm).filter(s => /^(ul|ol)/.test(s))
							].join(' ');
						}

						if (/^(table|tbody|tr|td)$/.test(tag)) {
							return tag + '(' + walk(elm).join('; ') + ')';
						}

						return elm.textContent.replace(/\s+/g, ' ').trim();
					})
					.filter(Boolean);

			return walk(box).join(' | ');
		};

		const lists =
			'Bring: | ul(A hat; Water bottle ul(Named ul(In the front pocket)); Sunscreen) | ' +
			'Steps | ol(Sign the form ol.lower-alpha(Both parents ol.lower-roman(Or a caregiver); Date it); Return it by Friday) | ' +
			'A note between the steps. | ol@3(Bring it to the office) | ' +
			// Restart at 1: its own list in Word
			'ol(A new list straight after) | ' +
			'Terms: | ol.upper-roman(Term one; Term two) | ' +
			// The cell's list carries on Word's list from before the table
			'table(tbody(tr(td(Cell); td(ul(One; Two)))))';

		Object.keys(clipboards).forEach(source => {
			describe(source, () => {
				it('Should build the lists with Clean', () => {
					expect(outline(cleanFromWord(clipboards[source]))).equals(
						lists
					);
				});

				it('Should build the lists with Keep', () => {
					expect(outline(applyStyles(clipboards[source]))).equals(
						lists
					);
				});
			});
		});

		// One item copied with the end of its line, so Word sends the whole
		// list paragraph
		const oneItem = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv=Content-Type content="text/html; charset=utf-8"><meta name=ProgId content=Word.Document><meta name=Generator content="Microsoft Word 15"><meta name=Originator content="Microsoft Word 15"><style><!--
p.MsoNormal, li.MsoNormal, div.MsoNormal
	{margin:0cm;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
	{margin-top:0cm;margin-right:0cm;margin-bottom:0cm;margin-left:36.0pt;font-size:12.0pt;font-family:"Aptos",sans-serif;}
--></style></head><body lang=EN-NZ link="#467886" vlink="#96607D" style='tab-interval:36.0pt;word-wrap:break-word'><!--StartFragment--><p class=MsoListParagraph style='text-indent:-18.0pt;mso-list:l0 level1 lfo1'><![if !supportLists]><span
lang=EN-GB style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>·<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]><span lang=EN-GB>Water bottle<o:p></o:p></span></p><!--EndFragment--></body></html>`;

		it('Should give one whole copied item a list of its own', () => {
			expect(outline(cleanFromWord(oneItem))).equals('ul(Water bottle)');
			expect(outline(applyStyles(oneItem))).equals('ul(Water bottle)');
		});
	});
});
