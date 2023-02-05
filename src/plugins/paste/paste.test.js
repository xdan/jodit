/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

describe('Test paste plugin', () => {
	describe('Paste HTML', function () {
		it('Should show paste html dialog', function () {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = '<p>test</p>';

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function () {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', editor.editor, emulatePasteEvent);

			expect(editor.value).equals('');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.not.null;
		});

		describe('Two times', function () {
			const pastedText = '<p>test</p>';

			const emulatePasteEvent = data => {
				data.clipboardData = {
					types: ['text/html'],
					getData: () => {
						return pastedText;
					}
				};
			};

			describe('Enable memorizeChoiceWhenPasteFragment', () => {
				it('Should not show dialog again', function () {
					const editor = getJodit({
						memorizeChoiceWhenPasteFragment: true
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(getOpenedDialog(editor)).is.null;
				});
			});

			describe('Disable memorizeChoiceWhenPasteFragment', () => {
				it('Should not show dialog again', function () {
					const editor = getJodit({
						memorizeChoiceWhenPasteFragment: false
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					const dialog2 = getOpenedDialog(editor);
					expect(dialog2).is.not.null;

					clickButton('keep', dialog2);

					expect(getOpenedDialog(editor)).is.null;
				});
			});

			it('Should fire afterPaste two times', function () {
				const editor = getJodit({
					defaultActionOnPaste: Jodit.INSERT_AS_HTML
				});

				let counter = 0;
				editor.e.on('afterPaste', function () {
					counter += 1;
				});

				const pastedText = '<p>test</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				simulateEvent('paste', editor.editor, emulatePasteEvent);
				const dialog = getOpenedDialog(editor);
				clickButton('keep', dialog);

				simulateEvent('paste', editor.editor, emulatePasteEvent);

				expect(counter).equals(2);
			});

			describe('In one pasting', function () {
				it('Should open only one dialog', () => {
					const editor = getJodit();

					simulateEvent('paste', editor.editor, emulatePasteEvent);
					simulateEvent('paste', editor.editor, emulatePasteEvent);

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;

					clickButton('keep', dialog);

					expect(getOpenedDialog(editor)).is.null;
				});
			});
		});

		describe('Paste HTML from Twitter', function () {
			const pastedText =
					'<blockquote class="twitter-tweet"><p lang="ru" dir="ltr">Нет слов, конечно <a href="https://t.co/VEAi634acb">https://t.co/VEAi634acb</a></p>— Vasily Oblomov (@VS_Oblomov) <a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw">July 4, 2020</a></blockquote> <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
				pastedHTML =
					'<meta charset=\'utf-8\'><span style="color: rgb(136, 153, 166); font-family: &quot;Helvetica Neue&quot;, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: nowrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&lt;blockquote class="twitter-tweet"&gt;&lt;p lang="ru" dir="ltr"&gt;Нет слов, конечно &lt;a href="https://t.co/VEAi634acb"&gt;https://t.co/VEAi634acb&lt;/a&gt;&lt;/p&gt;&amp;mdash; Vasily Oblomov (@VS_Oblomov) &lt;a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw"&gt;July 4, 2020&lt;/a&gt;&lt;/blockquote&gt; &lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;</span>';

			// eslint-disable-next-line no-unused-vars
			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};
		});

		describe('Paste HTML from Word', function () {
			const pastedText =
					'LOREM IPSUM DOLOR SIT AMET\n' +
					'\n' +
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ___________________________________________________\n' +
					'"',
				pastedHTML =
					'<html xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
					'xmlns:w="urn:schemas-microsoft-com:office:word"\n' +
					'xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"\n' +
					'xmlns="http://www.w3.org/TR/REC-html40">\n' +
					'\n' +
					'<head>\n' +
					'<meta http-equiv=Content-Type content="text/html; charset=utf-8">\n' +
					'<meta name=ProgId content=Word.Document>\n' +
					'<meta name=Generator content="Microsoft Word 15">\n' +
					'<meta name=Originator content="Microsoft Word 15">\n' +
					'<link rel=File-List\n' +
					'href="file:////Users/v-chupurnov/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_filelist.xml">\n' +
					'<!--[if gte mso 9]><xml>\n' +
					' <o:OfficeDocumentSettings>\n' +
					'  <o:AllowPNG/>\n' +
					' </o:OfficeDocumentSettings>\n' +
					'</xml><![endif]-->\n' +
					'<link rel=themeData\n' +
					'href="file:////Users/v-chupurnov/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_themedata.thmx">\n' +
					'<link rel=colorSchemeMapping\n' +
					'href="file:////Users/v-chupurnov/Library/Group%20Containers/UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_colorschememapping.xml">\n' +
					'<!--[if gte mso 9]><xml>\n' +
					' <w:WordDocument>\n' +
					'  <w:View>Normal</w:View>\n' +
					'  <w:Zoom>0</w:Zoom>\n' +
					'  <w:TrackMoves/>\n' +
					'  <w:TrackFormatting/>\n' +
					'  <w:PunctuationKerning/>\n' +
					'  <w:ValidateAgainstSchemas/>\n' +
					'  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>\n' +
					'  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>\n' +
					'  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>\n' +
					'  <w:DoNotPromoteQF/>\n' +
					'  <w:LidThemeOther>en-RU</w:LidThemeOther>\n' +
					'  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>\n' +
					'  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>\n' +
					'  <w:Compatibility>\n' +
					'   <w:BreakWrappedTables/>\n' +
					'   <w:SnapToGridInCell/>\n' +
					'   <w:WrapTextWithPunct/>\n' +
					'   <w:UseAsianBreakRules/>\n' +
					'   <w:DontGrowAutofit/>\n' +
					'   <w:SplitPgBreakAndParaMark/>\n' +
					'   <w:EnableOpenTypeKerning/>\n' +
					'   <w:DontFlipMirrorIndents/>\n' +
					'   <w:OverrideTableStyleHps/>\n' +
					'  </w:Compatibility>\n' +
					'  <m:mathPr>\n' +
					'   <m:mathFont m:val="Cambria Math"/>\n' +
					'   <m:brkBin m:val="before"/>\n' +
					'   <m:brkBinSub m:val="&#45;-"/>\n' +
					'   <m:smallFrac m:val="off"/>\n' +
					'   <m:dispDef/>\n' +
					'   <m:lMargin m:val="0"/>\n' +
					'   <m:rMargin m:val="0"/>\n' +
					'   <m:defJc m:val="centerGroup"/>\n' +
					'   <m:wrapIndent m:val="1440"/>\n' +
					'   <m:intLim m:val="subSup"/>\n' +
					'   <m:naryLim m:val="undOvr"/>\n' +
					'  </m:mathPr></w:WordDocument>\n' +
					'</xml><![endif]--><!--[if gte mso 9]><xml>\n' +
					' <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"\n' +
					'  DefSemiHidden="false" DefQFormat="false" DefPriority="99"\n' +
					'  LatentStyleCount="376">\n' +
					'  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 7"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 8"/>\n' +
					'  <w:LsdException Locked="false" Priority="9" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="heading 9"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 6"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 7"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 8"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index 9"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 7"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 8"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="toc 9"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Normal Indent"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="footnote text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="annotation text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="header"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="footer"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="index heading"/>\n' +
					'  <w:LsdException Locked="false" Priority="35" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="caption"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="table of figures"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="envelope address"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="envelope return"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="footnote reference"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="annotation reference"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="line number"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="page number"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="endnote reference"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="endnote text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="table of authorities"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="macro"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="toa heading"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Bullet"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Number"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Bullet 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Bullet 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Bullet 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Bullet 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Number 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Number 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Number 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Number 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Closing"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Signature"/>\n' +
					'  <w:LsdException Locked="false" Priority="1" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="Default Paragraph Font"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text Indent"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Continue"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Continue 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Continue 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Continue 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="List Continue 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Message Header"/>\n' +
					'  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Salutation"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Date"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text First Indent"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text First Indent 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Note Heading"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text Indent 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Body Text Indent 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Block Text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Hyperlink"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="FollowedHyperlink"/>\n' +
					'  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"/>\n' +
					'  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Document Map"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Plain Text"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="E-mail Signature"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Top of Form"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Bottom of Form"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Normal (Web)"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Acronym"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Address"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Cite"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Code"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Definition"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Keyboard"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Preformatted"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Sample"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Typewriter"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="HTML Variable"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Normal Table"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="annotation subject"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="No List"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Outline List 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Outline List 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Outline List 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Simple 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Simple 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Simple 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Classic 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Classic 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Classic 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Classic 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Colorful 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Colorful 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Colorful 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Columns 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Columns 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Columns 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Columns 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Columns 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 6"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 7"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Grid 8"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 4"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 5"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 6"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 7"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table List 8"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table 3D effects 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table 3D effects 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table 3D effects 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Contemporary"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Elegant"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Professional"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Subtle 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Subtle 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Web 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Web 2"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Web 3"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Balloon Text"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" Name="Table Grid"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Table Theme"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"/>\n' +
					'  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"/>\n' +
					'  <w:LsdException Locked="false" Priority="34" QFormat="true"\n' +
					'   Name="List Paragraph"/>\n' +
					'  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"/>\n' +
					'  <w:LsdException Locked="false" Priority="30" QFormat="true"\n' +
					'   Name="Intense Quote"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="19" QFormat="true"\n' +
					'   Name="Subtle Emphasis"/>\n' +
					'  <w:LsdException Locked="false" Priority="21" QFormat="true"\n' +
					'   Name="Intense Emphasis"/>\n' +
					'  <w:LsdException Locked="false" Priority="31" QFormat="true"\n' +
					'   Name="Subtle Reference"/>\n' +
					'  <w:LsdException Locked="false" Priority="32" QFormat="true"\n' +
					'   Name="Intense Reference"/>\n' +
					'  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"/>\n' +
					'  <w:LsdException Locked="false" Priority="37" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" Name="Bibliography"/>\n' +
					'  <w:LsdException Locked="false" Priority="39" SemiHidden="true"\n' +
					'   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"/>\n' +
					'  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"/>\n' +
					'  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"/>\n' +
					'  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"/>\n' +
					'  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="Grid Table 1 Light Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="Grid Table 6 Colorful Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="Grid Table 7 Colorful Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"/>\n' +
					'  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"/>\n' +
					'  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 1"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 2"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 3"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 4"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 5"/>\n' +
					'  <w:LsdException Locked="false" Priority="46"\n' +
					'   Name="List Table 1 Light Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="51"\n' +
					'   Name="List Table 6 Colorful Accent 6"/>\n' +
					'  <w:LsdException Locked="false" Priority="52"\n' +
					'   Name="List Table 7 Colorful Accent 6"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Mention"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Smart Hyperlink"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Hashtag"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Unresolved Mention"/>\n' +
					'  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"\n' +
					'   Name="Smart Link"/>\n' +
					' </w:LatentStyles>\n' +
					'</xml><![endif]-->\n' +
					'<style>\n' +
					'<!--\n' +
					' /* Font Definitions */\n' +
					' @font-face\n' +
					'\t{font-family:"Cambria Math";\n' +
					'\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n' +
					'\tmso-font-charset:0;\n' +
					'\tmso-generic-font-family:roman;\n' +
					'\tmso-font-pitch:variable;\n' +
					'\tmso-font-signature:-536870145 1107305727 0 0 415 0;}\n' +
					'@font-face\n' +
					'\t{font-family:Calibri;\n' +
					'\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n' +
					'\tmso-font-charset:0;\n' +
					'\tmso-generic-font-family:swiss;\n' +
					'\tmso-font-pitch:variable;\n' +
					'\tmso-font-signature:-536859905 -1073732485 9 0 511 0;}\n' +
					'@font-face\n' +
					'\t{font-family:"Calibri Light";\n' +
					'\tpanose-1:2 15 3 2 2 2 4 3 2 4;\n' +
					'\tmso-font-charset:0;\n' +
					'\tmso-generic-font-family:swiss;\n' +
					'\tmso-font-pitch:variable;\n' +
					'\tmso-font-signature:-536859905 -1073732485 9 0 511 0;}\n' +
					' /* Style Definitions */\n' +
					' p.MsoNormal, li.MsoNormal, div.MsoNormal\n' +
					'\t{mso-style-unhide:no;\n' +
					'\tmso-style-qformat:yes;\n' +
					'\tmso-style-parent:"";\n' +
					'\tmargin-top:0cm;\n' +
					'\tmargin-right:0cm;\n' +
					'\tmargin-bottom:8.0pt;\n' +
					'\tmargin-left:0cm;\n' +
					'\tline-height:107%;\n' +
					'\tmso-pagination:widow-orphan;\n' +
					'\tfont-size:11.0pt;\n' +
					'\tfont-family:"Calibri",sans-serif;\n' +
					'\tmso-fareast-font-family:Calibri;\n' +
					'\tmso-bidi-font-family:"Times New Roman";\n' +
					'\tmso-ansi-language:RU;\n' +
					'\tmso-fareast-language:EN-US;}\n' +
					'h1\n' +
					'\t{mso-style-priority:9;\n' +
					'\tmso-style-unhide:no;\n' +
					'\tmso-style-qformat:yes;\n' +
					'\tmso-style-link:"Heading 1 Char";\n' +
					'\tmso-style-next:Normal;\n' +
					'\tmargin-top:12.0pt;\n' +
					'\tmargin-right:0cm;\n' +
					'\tmargin-bottom:0cm;\n' +
					'\tmargin-left:0cm;\n' +
					'\tline-height:107%;\n' +
					'\tmso-pagination:widow-orphan lines-together;\n' +
					'\tpage-break-after:avoid;\n' +
					'\tmso-outline-level:1;\n' +
					'\tfont-size:16.0pt;\n' +
					'\tfont-family:"Calibri Light",sans-serif;\n' +
					'\tmso-fareast-font-family:"Times New Roman";\n' +
					'\tmso-bidi-font-family:"Times New Roman";\n' +
					'\tcolor:#2E74B5;\n' +
					'\tmso-font-kerning:0pt;\n' +
					'\tmso-ansi-language:RU;\n' +
					'\tmso-fareast-language:EN-US;\n' +
					'\tfont-weight:normal;}\n' +
					'span.Heading1Char\n' +
					'\t{mso-style-name:"Heading 1 Char";\n' +
					'\tmso-style-priority:9;\n' +
					'\tmso-style-unhide:no;\n' +
					'\tmso-style-locked:yes;\n' +
					'\tmso-style-link:"Heading 1";\n' +
					'\tmso-ansi-font-size:16.0pt;\n' +
					'\tmso-bidi-font-size:16.0pt;\n' +
					'\tfont-family:"Calibri Light",sans-serif;\n' +
					'\tmso-ascii-font-family:"Calibri Light";\n' +
					'\tmso-fareast-font-family:"Times New Roman";\n' +
					'\tmso-hansi-font-family:"Calibri Light";\n' +
					'\tcolor:#2E74B5;\n' +
					'\tmso-ansi-language:RU;\n' +
					'\tmso-fareast-language:EN-US;}\n' +
					'.MsoChpDefault\n' +
					'\t{mso-style-type:export-only;\n' +
					'\tmso-default-props:yes;\n' +
					'\tfont-size:10.0pt;\n' +
					'\tmso-ansi-font-size:10.0pt;\n' +
					'\tmso-bidi-font-size:10.0pt;\n' +
					'\tfont-family:"Calibri",sans-serif;\n' +
					'\tmso-ascii-font-family:Calibri;\n' +
					'\tmso-fareast-font-family:Calibri;\n' +
					'\tmso-hansi-font-family:Calibri;}\n' +
					'@page WordSection1\n' +
					'\t{size:612.0pt 792.0pt;\n' +
					'\tmargin:72.0pt 72.0pt 72.0pt 72.0pt;\n' +
					'\tmso-header-margin:36.0pt;\n' +
					'\tmso-footer-margin:36.0pt;\n' +
					'\tmso-paper-source:0;}\n' +
					'div.WordSection1\n' +
					'\t{page:WordSection1;}\n' +
					'-->\n' +
					'</style>\n' +
					'<!--[if gte mso 10]>\n' +
					'<style>\n' +
					' /* Style Definitions */\n' +
					' table.MsoNormalTable\n' +
					'\t{mso-style-name:"Table Normal";\n' +
					'\tmso-tstyle-rowband-size:0;\n' +
					'\tmso-tstyle-colband-size:0;\n' +
					'\tmso-style-noshow:yes;\n' +
					'\tmso-style-priority:99;\n' +
					'\tmso-style-parent:"";\n' +
					'\tmso-padding-alt:0cm 5.4pt 0cm 5.4pt;\n' +
					'\tmso-para-margin:0cm;\n' +
					'\tmso-pagination:widow-orphan;\n' +
					'\tfont-size:10.0pt;\n' +
					'\tfont-family:"Calibri",sans-serif;\n' +
					'\tmso-bidi-font-family:"Times New Roman";}\n' +
					'</style>\n' +
					'<![endif]-->\n' +
					'</head>\n' +
					'\n' +
					"<body lang=en-RU style='tab-interval:36.0pt'>\n" +
					'<!--StartFragment-->\n' +
					'\n' +
					"<h1 align=center style='margin-top:0cm;text-align:center;line-height:normal'><span\n" +
					'lang=EN-US style=\'font-size:12.0pt;mso-bidi-font-size:10.0pt;font-family:"Arial",sans-serif;\n' +
					"color:#C45911;mso-ansi-language:EN-US'>LOREM IPSUM DOLOR SIT AMET<o:p></o:p></span></h1>\n" +
					'\n' +
					'<!--EndFragment-->\n' +
					'</body>\n' +
					'\n' +
					'</html>\n';

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};

			describe('Keep format', function () {
				it('Should paste as is', function () {
					const editor = getJodit({
						disablePlugins: ['WrapNodes']
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					simulateEvent('click', getButton('keep', dialog));

					expect(sortAttributes(editor.value)).equals(
						'<h1 align="center" style="break-after:avoid;color:#2E74B5;font-family:Calibri Light,sans-serif;font-size:21px;font-weight:normal;line-height:normal;margin:0px;text-align:center"><span lang="EN-US" style="color:#C45911;font-family:Arial,sans-serif;font-size:16px">LOREM IPSUM DOLOR SIT AMET</span></h1>'
					);
				});
			});
		});

		describe('Prevent show dialog', function () {
			it('Should not show paste html dialog if beforeOpenPasteDialog returned false', function () {
				const editor = getJodit({
					events: {
						beforeOpenPasteDialog: function () // msg,
						// title,
						// callback,
						// clearButton,
						// clear2Button
						{
							return false;
						}
					}
				});

				const pastedText = '<p>test</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

				expect(editor.value).equals('');
				const dialog = getOpenedDialog(editor);
				expect(dialog).is.null;
			});

			describe('Change dialog in afterOpenPasteDialog', function () {
				it('Should change dialog', function () {
					const editor = getJodit({
						events: {
							afterOpenPasteDialog: function (
								dialog
								// msg,
								// title,
								// callback,
								// clearButton,
								// clear2Button
							) {
								dialog.container.style.left = '10px';
							}
						}
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					expect(dialog).is.not.null;
					expect(parseInt(dialog.style.left, 10)).equals(10);
				});
			});
		});
	});

	describe('Paste simple text', function () {
		it('Should not show paste html dialog', function () {
			const editor = getJodit({
				defaultActionOnPaste: Jodit.INSERT_AS_HTML
			});

			const pastedText = 'test';

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/html'],
					getData: function () {
						return pastedText;
					}
				};
			};

			simulateEvent('paste', editor.editor, emulatePasteEvent);

			expect(editor.value).equals('<p>test</p>');

			const dialog = getOpenedDialog(editor);
			expect(dialog).is.null;
		});

		describe('nl2brInPlainText enable', function () {
			describe('Enable', function () {
				it('Should replace \n to BR element', function () {
					const editor = getJodit({
						nl2brInPlainText: true
					});

					const pastedText = 'test\ntest\ntest';

					simulateEvent('paste', editor.editor, function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					});

					expect(editor.value).equals(
						'<p>test<br>test<br>test<br></p>'
					);
				});
			});

			describe('Disable', function () {
				it('Should not replace all \n to <BR>', function () {
					const editor = getJodit({
						nl2brInPlainText: false
					});

					const pastedText = 'test\ntest\ntest';

					simulateEvent('paste', editor.editor, function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					});

					expect(editor.value).equals('<p>test\ntest\ntest</p>');
				});
			});
		});
	});

	describe('Paste', function () {
		describe('HTML text', function () {
			describe('Insert only text', function () {
				it('Should insert only text from pasted html', function () {
					const editor = getJodit({
							askBeforePasteHTML: false,
							askBeforePasteFromWord: false,
							defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT
						}),
						pastedText = '<p>test</p>',
						emulatePasteEvent = function (data) {
							data.clipboardData = {
								types: ['text/html'],
								getData: function () {
									return pastedText;
								}
							};
						};

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('<p>test</p>');
				});

				describe('For not empty editor', function () {
					it('Should insert text on the cursor place', function () {
						// https://github.com/xdan/jodit/issues/522
						const editor = getJodit({
								askBeforePasteHTML: false,
								askBeforePasteFromWord: false,
								defaultActionOnPaste: Jodit.INSERT_ONLY_TEXT
							}),
							pastedText = '<strong>editor</strong>',
							emulatePasteEvent = function (data) {
								data.clipboardData = {
									types: ['text/html'],
									getData: function () {
										return pastedText;
									}
								};
							};

						editor.value = '<p>Jodit is awesome |</p>';

						setCursorToChar(editor);
						simulateEvent(
							'paste',
							editor.editor,
							emulatePasteEvent
						);
						replaceCursorToChar(editor);

						expect(editor.value).equals(
							'<p>Jodit is awesome editor|</p>'
						);
					});
				});
			});

			describe('Insert as text', function () {
				it('Should insert only text from pasted html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_TEXT
					});
					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals(
						'<p>&lt;p&gt;test&lt;/p&gt;</p>'
					);
				});
			});

			describe('Insert as html', function () {
				it('Should insert pasted html like html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_AS_HTML
					});

					const pastedText = '<p>test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>test</p>');
				});
			});

			describe('Insert clear html', function () {
				it('Should insert pasted and cleared html', function () {
					const editor = getJodit({
						askBeforePasteHTML: false,
						askBeforePasteFromWord: false,
						defaultActionOnPaste: Jodit.INSERT_CLEAR_HTML
					});

					const pastedText =
						'<p style="color:red;" data-text="1">test</p>';

					const emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/html'],
							getData: function () {
								return pastedText;
							}
						};
					};

					simulateEvent('paste', 0, editor.editor, emulatePasteEvent);
					expect(editor.value).equals('<p>test</p>');
				});
			});
		});

		describe('plain text', function () {
			it('Should Insert text with <br> instead of \\n', function () {
				const editor = getJodit(),
					pastedText = 'test\r\ntest\ntest\ntest\ntest\n',
					emulatePasteEvent = function (data) {
						data.clipboardData = {
							types: ['text/plain'],
							getData: function () {
								return pastedText;
							}
						};
					};

				simulateEvent('paste', editor.editor, emulatePasteEvent);

				expect(editor.value).equals(
					'<p>test<br>test<br>test<br>test<br>test<br><br></p>'
				);
			});
		});
	});
});
