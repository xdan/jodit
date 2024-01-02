/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/* eslint-disable */
const WORD_EXAMPLE =
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
	'<link rel=File-List href="file://///clip_filelist.xml">\n' +
	'<link rel=themeData\n' +
	'href="file:////UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_themedata.thmx">\n' +
	'<link rel=colorSchemeMapping\n' +
	'href="file:////UBF8T346G9.Office/TemporaryItems/msohtmlclip/clip_colorschememapping.xml">\n' +
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
	'  <w:LsdException Priority="0" QFormat="true" Name="Normal"/>\n' +
	'  <w:LsdException Priority="9" QFormat="true" Name="heading 1"/>\n' +
	'  <w:LsdException Priority="9" \n' +
	'    QFormat="true" Name="heading 2"/>\n' +
	'  <w:LsdException Priority="9" \n' +
	'    QFormat="true" Name="heading 3"/>\n' +
	'  <w:LsdException Priority="9" \n' +
	'    QFormat="true" Name="heading 7"/>\n' +
	'  <w:LsdException Priority="9" \n' +
	'    QFormat="true" Name="heading 8"/>\n' +
	'  <w:LsdException Priority="9" \n' +
	'    QFormat="true" Name="heading 9"/>\n' +
	'  <w:LsdException  Name="index 1"/>\n' +
	'  <w:LsdException  Name="index 2"/>\n' +
	'  <w:LsdException  Name="index 3"/>\n' +
	'  <w:LsdException  Name="index 4"/>\n' +
	'  <w:LsdException  Name="index 5"/>\n' +
	'  <w:LsdException  Name="index 6"/>\n' +
	'  <w:LsdException  Name="index 7"/>\n' +
	'  <w:LsdException  Name="index 8"/>\n' +
	'  <w:LsdException  Name="index 9"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 1"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 2"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 3"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 4"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 5"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 6"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 7"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 8"/>\n' +
	'  <w:LsdException Priority="39"  Name="toc 9"/>\n' +
	'  <w:LsdException  Name="Normal Indent"/>\n' +
	'  <w:LsdException  Name="footnote text"/>\n' +
	'  <w:LsdException  Name="annotation text"/>\n' +
	'  <w:LsdException  Name="header"/>\n' +
	'  <w:LsdException  Name="footer"/>\n' +
	'  <w:LsdException  Name="index heading"/>\n' +
	'  <w:LsdException Priority="35" \n' +
	'    QFormat="true" Name="caption"/>\n' +
	'  <w:LsdException  Name="table of figures"/>\n' +
	'  <w:LsdException  Name="envelope address"/>\n' +
	'  <w:LsdException  Name="envelope return"/>\n' +
	'  <w:LsdException  Name="footnote reference"/>\n' +
	'  <w:LsdException  Name="annotation reference"/>\n' +
	'  <w:LsdException  Name="line number"/>\n' +
	'  <w:LsdException  Name="page number"/>\n' +
	'  <w:LsdException  Name="endnote reference"/>\n' +
	'  <w:LsdException  Name="endnote text"/>\n' +
	'  <w:LsdException  Name="table of authorities"/>\n' +
	'  <w:LsdException  Name="macro"/>\n' +
	'  <w:LsdException  Name="toa heading"/>\n' +
	'  <w:LsdException  Name="List"/>\n' +
	'  <w:LsdException  Name="List Bullet"/>\n' +
	'  <w:LsdException  Name="List Number"/>\n' +
	'  <w:LsdException  Name="List 2"/>\n' +
	'  <w:LsdException  Name="List 3"/>\n' +
	'  <w:LsdException  Name="List 4"/>\n' +
	'  <w:LsdException  Name="List 5"/>\n' +
	'  <w:LsdException  Name="List Bullet 2"/>\n' +
	'  <w:LsdException  Name="List Bullet 3"/>\n' +
	'  <w:LsdException  Name="List Bullet 4"/>\n' +
	'  <w:LsdException  Name="List Bullet 5"/>\n' +
	'  <w:LsdException  Name="List Number 2"/>\n' +
	'  <w:LsdException  Name="List Number 3"/>\n' +
	'  <w:LsdException  Name="List Number 4"/>\n' +
	'  <w:LsdException  Name="List Number 5"/>\n' +
	'  <w:LsdException Priority="10" QFormat="true" Name="Title"/>\n' +
	'  <w:LsdException  Name="Closing"/>\n' +
	'  <w:LsdException  Name="Signature"/>\n' +
	'  <w:LsdException Priority="1"  Name="Default Paragraph Font"/>\n' +
	'  <w:LsdException  Name="Body Text"/>\n' +
	'  <w:LsdException  Name="Body Text Indent"/>\n' +
	'  <w:LsdException Priority="11" QFormat="true" Name="Subtitle"/>\n' +
	'  <w:LsdException  Name="Salutation"/>\n' +
	'  <w:LsdException  Name="Date"/>\n' +
	'  <w:LsdException  Name="Body Text First Indent"/>\n' +
	'  <w:LsdException  Name="Body Text First Indent 2"/>\n' +
	'  <w:LsdException  Name="Note Heading"/>\n' +
	'  <w:LsdException  Name="Body Text 2"/>\n' +
	'  <w:LsdException  Name="Body Text 3"/>\n' +
	'  <w:LsdException  Name="Body Text Indent 2"/>\n' +
	'  <w:LsdException  Name="Body Text Indent 3"/>\n' +
	'  <w:LsdException  Name="Block Text"/>\n' +
	'  <w:LsdException  Name="Hyperlink"/>\n' +
	'  <w:LsdException  Name="FollowedHyperlink"/>\n' +
	'  <w:LsdException Priority="22" QFormat="true" Name="Strong"/>\n' +
	'  <w:LsdException Priority="20" QFormat="true" Name="Emphasis"/>\n' +
	'  <w:LsdException  Name="Document Map"/>\n' +
	'  <w:LsdException  Name="Plain Text"/>\n' +
	'  <w:LsdException  Name="E-mail Signature"/>\n' +
	'  <w:LsdException  Name="HTML Top of Form"/>\n' +
	'  <w:LsdException  Name="HTML Bottom of Form"/>\n' +
	'  <w:LsdException  Name="Normal (Web)"/>\n' +
	'  <w:LsdException  Name="HTML Acronym"/>\n' +
	'  <w:LsdException  Name="HTML Address"/>\n' +
	'  <w:LsdException  Name="HTML Cite"/>\n' +
	'  <w:LsdException  Name="HTML Code"/>\n' +
	'  <w:LsdException  Name="HTML Definition"/>\n' +
	'  <w:LsdException  Name="HTML Keyboard"/>\n' +
	'  <w:LsdException  Name="HTML Preformatted"/>\n' +
	'  <w:LsdException  Name="HTML Sample"/>\n' +
	'  <w:LsdException  Name="HTML Typewriter"/>\n' +
	'  <w:LsdException  Name="HTML Variable"/>\n' +
	'  <w:LsdException  Name="Normal Table"/>\n' +
	'  <w:LsdException  Name="annotation subject"/>\n' +
	'  <w:LsdException  Name="No List"/>\n' +
	'  <w:LsdException  Name="Outline List 1"/>\n' +
	'  <w:LsdException  Name="Outline List 2"/>\n' +
	'  <w:LsdException  Name="Outline List 3"/>\n' +
	'  <w:LsdException  Name="Table Simple 1"/>\n' +
	'  <w:LsdException  Name="Table Simple 2"/>\n' +
	'  <w:LsdException  Name="Table Simple 3"/>\n' +
	'  <w:LsdException  Name="Table Classic 1"/>\n' +
	'  <w:LsdException  Name="Table Classic 2"/>\n' +
	'  <w:LsdException  Name="Table Classic 3"/>\n' +
	'  <w:LsdException  Name="Table Classic 4"/>\n' +
	'  <w:LsdException  Name="Table Colorful 1"/>\n' +
	'  <w:LsdException  Name="Table Colorful 2"/>\n' +
	'  <w:LsdException  Name="Table Colorful 3"/>\n' +
	'  <w:LsdException  Name="Table Columns 1"/>\n' +
	'  <w:LsdException  Name="Table Columns 2"/>\n' +
	'  <w:LsdException  Name="Table Columns 3"/>\n' +
	'  <w:LsdException  Name="Table Columns 4"/>\n' +
	'  <w:LsdException  Name="Table Columns 5"/>\n' +
	'  <w:LsdException  Name="Table Grid 1"/>\n' +
	'  <w:LsdException  Name="Table Grid 2"/>\n' +
	'  <w:LsdException  Name="Table Grid 3"/>\n' +
	'  <w:LsdException  Name="Table Grid 4"/>\n' +
	'  <w:LsdException  Name="Table Grid 5"/>\n' +
	'  <w:LsdException  Name="Table Grid 6"/>\n' +
	'  <w:LsdException  Name="Table Grid 7"/>\n' +
	'  <w:LsdException  Name="Table Grid 8"/>\n' +
	'  <w:LsdException  Name="Table List 1"/>\n' +
	'  <w:LsdException  Name="Table List 2"/>\n' +
	'  <w:LsdException  Name="Table List 3"/>\n' +
	'  <w:LsdException  Name="Table List 4"/>\n' +
	'  <w:LsdException  Name="Table List 5"/>\n' +
	'  <w:LsdException  Name="Table List 6"/>\n' +
	'  <w:LsdException  Name="Table List 7"/>\n' +
	'  <w:LsdException  Name="Table List 8"/>\n' +
	'  <w:LsdException  Name="Table 3D effects 1"/>\n' +
	'  <w:LsdException  Name="Table 3D effects 2"/>\n' +
	'  <w:LsdException  Name="Table 3D effects 3"/>\n' +
	'  <w:LsdException  Name="Table Contemporary"/>\n' +
	'  <w:LsdException  Name="Table Elegant"/>\n' +
	'  <w:LsdException  Name="Table Professional"/>\n' +
	'  <w:LsdException  Name="Table Subtle 1"/>\n' +
	'  <w:LsdException  Name="Table Subtle 2"/>\n' +
	'  <w:LsdException  Name="Table Web 1"/>\n' +
	'  <w:LsdException  Name="Table Web 2"/>\n' +
	'  <w:LsdException  Name="Table Web 3"/>\n' +
	'  <w:LsdException  Name="Balloon Text"/>\n' +
	'  <w:LsdException Priority="39" Name="Table Grid"/>\n' +
	'  <w:LsdException  Name="Table Theme"/>\n' +
	'  <w:LsdException Name="Placeholder Text"/>\n' +
	'  <w:LsdException Priority="1" QFormat="true" Name="No Spacing"/>\n' +
	'  <w:LsdException Priority="60" Name="Light Shading"/>\n' +
	'  <w:LsdException Priority="61" Name="Light List"/>\n' +
	'  <w:LsdException Priority="63" Name="Medium Shading 1 Accent 1"/>\n' +
	'  <w:LsdException Priority="64" Name="Medium Shading 2 Accent 1"/>\n' +
	'  <w:LsdException Priority="65" Name="Medium List 1 Accent 1"/>\n' +
	'  <w:LsdException Name="Revision"/>\n' +
	'  <w:LsdException Priority="34" QFormat="true" Name="List Paragraph"/>\n' +
	'  <w:LsdException Priority="29" QFormat="true" Name="Quote"/>\n' +
	'  <w:LsdException Priority="30" QFormat="true" Name="Intense Quote"/>\n' +
	'  <w:LsdException Priority="66" Name="Medium List 2 Accent 1"/>\n' +
	'  <w:LsdException Priority="67" Name="Medium Grid 1 Accent 1"/>\n' +
	'  <w:LsdException Priority="68" Name="Medium Grid 2 Accent 1"/>\n' +
	'  <w:LsdException Priority="69" Name="Medium Grid 3 Accent 1"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 1"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 1"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 1"/>\n' +
	'  <w:LsdException Priority="73" Name="Colorful Grid Accent 1"/>\n' +
	'  <w:LsdException Priority="60" Name="Light Shading Accent 2"/>\n' +
	'  <w:LsdException Priority="61" Name="Light List Accent 2"/>\n' +
	'  <w:LsdException Priority="62" Name="Light Grid Accent 2"/>\n' +
	'  <w:LsdException Priority="63" Name="Medium Shading 1 Accent 2"/>\n' +
	'  <w:LsdException Priority="64" Name="Medium Shading 2 Accent 2"/>\n' +
	'  <w:LsdException Priority="65" Name="Medium List 1 Accent 2"/>\n' +
	'  <w:LsdException Priority="66" Name="Medium List 2 Accent 2"/>\n' +
	'  <w:LsdException Priority="67" Name="Medium Grid 1 Accent 2"/>\n' +
	'  <w:LsdException Priority="68" Name="Medium Grid 2 Accent 2"/>\n' +
	'  <w:LsdException Priority="69" Name="Medium Grid 3 Accent 2"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 2"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 2"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 2"/>\n' +
	'  <w:LsdException Priority="73" Name="Colorful Grid Accent 2"/>\n' +
	'  <w:LsdException Priority="60" Name="Light Shading Accent 3"/>\n' +
	'  <w:LsdException Priority="61" Name="Light List Accent 3"/>\n' +
	'  <w:LsdException Priority="62" Name="Light Grid Accent 3"/>\n' +
	'  <w:LsdException Priority="63" Name="Medium Shading 1 Accent 3"/>\n' +
	'  <w:LsdException Priority="64" Name="Medium Shading 2 Accent 3"/>\n' +
	'  <w:LsdException Priority="65" Name="Medium List 1 Accent 3"/>\n' +
	'  <w:LsdException Priority="66" Name="Medium List 2 Accent 3"/>\n' +
	'  <w:LsdException Priority="67" Name="Medium Grid 1 Accent 3"/>\n' +
	'  <w:LsdException Priority="68" Name="Medium Grid 2 Accent 3"/>\n' +
	'  <w:LsdException Priority="69" Name="Medium Grid 3 Accent 3"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 3"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 3"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 3"/>\n' +
	'  <w:LsdException Priority="73" Name="Colorful Grid Accent 3"/>\n' +
	'  <w:LsdException Priority="60" Name="Light Shading Accent 4"/>\n' +
	'  <w:LsdException Priority="61" Name="Light List Accent 4"/>\n' +
	'  <w:LsdException Priority="62" Name="Light Grid Accent 4"/>\n' +
	'  <w:LsdException Priority="63" Name="Medium Shading 1 Accent 4"/>\n' +
	'  <w:LsdException Priority="64" Name="Medium Shading 2 Accent 4"/>\n' +
	'  <w:LsdException Priority="65" Name="Medium List 1 Accent 4"/>\n' +
	'  <w:LsdException Priority="66" Name="Medium List 2 Accent 4"/>\n' +
	'  <w:LsdException Priority="67" Name="Medium Grid 1 Accent 4"/>\n' +
	'  <w:LsdException Priority="68" Name="Medium Grid 2 Accent 4"/>\n' +
	'  <w:LsdException Priority="69" Name="Medium Grid 3 Accent 4"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 4"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 4"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 4"/>\n' +
	'  <w:LsdException Priority="73" Name="Colorful Grid Accent 4"/>\n' +
	'  <w:LsdException Priority="60" Name="Light Shading Accent 5"/>\n' +
	'  <w:LsdException Priority="61" Name="Light List Accent 5"/>\n' +
	'  <w:LsdException Priority="62" Name="Light Grid Accent 5"/>\n' +
	'  <w:LsdException Priority="63" Name="Medium Shading 1 Accent 5"/>\n' +
	'  <w:LsdException Priority="64" Name="Medium Shading 2 Accent 5"/>\n' +
	'  <w:LsdException Priority="65" Name="Medium List 1 Accent 5"/>\n' +
	'  <w:LsdException Priority="66" Name="Medium List 2 Accent 5"/>\n' +
	'  <w:LsdException Priority="67" Name="Medium Grid 1 Accent 5"/>\n' +
	'  <w:LsdException Priority="68" Name="Medium Grid 2 Accent 5"/>\n' +
	'  <w:LsdException Priority="69" Name="Medium Grid 3 Accent 5"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 5"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 5"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 5"/>\n' +
	'  <w:LsdException Priority="70" Name="Dark List Accent 6"/>\n' +
	'  <w:LsdException Priority="71" Name="Colorful Shading Accent 6"/>\n' +
	'  <w:LsdException Priority="72" Name="Colorful List Accent 6"/>\n' +
	'  <w:LsdException Priority="73" Name="Colorful Grid Accent 6"/>\n' +
	'  <w:LsdException Priority="19" QFormat="true" Name="Subtle Emphasis"/>\n' +
	'  <w:LsdException Priority="21" QFormat="true" Name="Intense Emphasis"/>\n' +
	'  <w:LsdException Priority="31" QFormat="true" Name="Subtle Reference"/>\n' +
	'  <w:LsdException Priority="32" QFormat="true" Name="Intense Reference"/>\n' +
	'  <w:LsdException Priority="33" QFormat="true" Name="Book Title"/>\n' +
	'  <w:LsdException Priority="37"  Name="Bibliography"/>\n' +
	'  <w:LsdException Priority="39" \n' +
	'    QFormat="true" Name="TOC Heading"/>\n' +
	'  <w:LsdException Priority="41" Name="Plain Table 1"/>\n' +
	'  <w:LsdException Priority="42" Name="Plain Table 2"/>\n' +
	'  <w:LsdException Priority="43" Name="Plain Table 3"/>\n' +
	'  <w:LsdException Priority="44" Name="Plain Table 4"/>\n' +
	'  <w:LsdException Priority="45" Name="Plain Table 5"/>\n' +
	'  <w:LsdException Priority="40" Name="Grid Table Light"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 1"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 1"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 1"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 1"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 1"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 1"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 1"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 2"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 2"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 2"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 2"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 2"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 2"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 2"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 3"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 3"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 3"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 3"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 3"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 3"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 3"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 4"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 4"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 4"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 4"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 4"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 4"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 4"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 5"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 5"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 5"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 5"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 5"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 5"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 5"/>\n' +
	'  <w:LsdException Priority="46" Name="Grid Table 1 Light Accent 6"/>\n' +
	'  <w:LsdException Priority="47" Name="Grid Table 2 Accent 6"/>\n' +
	'  <w:LsdException Priority="48" Name="Grid Table 3 Accent 6"/>\n' +
	'  <w:LsdException Priority="49" Name="Grid Table 4 Accent 6"/>\n' +
	'  <w:LsdException Priority="50" Name="Grid Table 5 Dark Accent 6"/>\n' +
	'  <w:LsdException Priority="51" Name="Grid Table 6 Colorful Accent 6"/>\n' +
	'  <w:LsdException Priority="52" Name="Grid Table 7 Colorful Accent 6"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3"/>\n' +
	'  <w:LsdException Priority="49" Name="List Table 4"/>\n' +
	'  <w:LsdException Priority="50" Name="List Table 5 Dark"/>\n' +
	'  <w:LsdException Priority="51" Name="List Table 6 Colorful"/>\n' +
	'  <w:LsdException Priority="52" Name="List Table 7 Colorful"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light Accent 1"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2 Accent 1"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3 Accent 1"/>\n' +
	'  <w:LsdException Priority="49" Name="List Table 4 Accent 1"/>\n' +
	'  <w:LsdException Priority="50" Name="List Table 5 Dark Accent 1"/>\n' +
	'  <w:LsdException Priority="51" Name="List Table 6 Colorful Accent 1"/>\n' +
	'  <w:LsdException Priority="52" Name="List Table 7 Colorful Accent 1"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light Accent 2"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2 Accent 2"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3 Accent 2"/>\n' +
	'  <w:LsdException Priority="49" Name="List Table 4 Accent 2"/>\n' +
	'  <w:LsdException Priority="50" Name="List Table 5 Dark Accent 2"/>\n' +
	'  <w:LsdException Priority="51" Name="List Table 6 Colorful Accent 2"/>\n' +
	'  <w:LsdException Priority="52" Name="List Table 7 Colorful Accent 2"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light Accent 3"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2 Accent 3"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3 Accent 3"/>\n' +
	'  <w:LsdException Priority="49" Name="List Table 4 Accent 3"/>\n' +
	'  <w:LsdException Priority="50" Name="List Table 5 Dark Accent 3"/>\n' +
	'  <w:LsdException Priority="51" Name="List Table 6 Colorful Accent 3"/>\n' +
	'  <w:LsdException Priority="52" Name="List Table 7 Colorful Accent 3"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light Accent 4"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2 Accent 4"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3 Accent 4"/>\n' +
	'  <w:LsdException Priority="49" Name="List Table 4 Accent 4"/>\n' +
	'  <w:LsdException Priority="50" Name="List Table 5 Dark Accent 4"/>\n' +
	'  <w:LsdException Priority="51" Name="List Table 6 Colorful Accent 4"/>\n' +
	'  <w:LsdException Priority="52" Name="List Table 7 Colorful Accent 4"/>\n' +
	'  <w:LsdException Priority="46" Name="List Table 1 Light Accent 5"/>\n' +
	'  <w:LsdException Priority="47" Name="List Table 2 Accent 5"/>\n' +
	'  <w:LsdException Priority="48" Name="List Table 3 Accent 5"/>\n' +
	'  <w:LsdException  Name="Mention"/>\n' +
	'  <w:LsdException  Name="Smart Hyperlink"/>\n' +
	'  <w:LsdException  Name="Hashtag"/>\n' +
	'  <w:LsdException  Name="Unresolved Mention"/>\n' +
	'  <w:LsdException  Name="Smart Link"/>\n' +
	' </w:LatentStyles>\n' +
	'</xml><![endif]-->\n' +
	'<style>\n' +
	'<!-' +
	'-\n \n' +
	' @font-face\n' +
	'\t{font-family:"Cambria Math";\n' +
	'\tpanose-1:2 4 5 3 5 4 6 3 2 4;\n' +
	'@font-face\n' +
	'\t{font-family:Calibri;\n' +
	'\tpanose-1:2 15 5 2 2 2 4 3 2 4;\n' +
	'@font-face\n' +
	'\t{font-family:"Calibri Light";\n' +
	'\tpanose-1:2 15 3 2 2 2 4 3 2 4;\n' +
	' /* Style Definitions */\n' +
	' p.MsoNormal, li.MsoNormal, div.MsoNormal\n' +
	'\tmargin-top:0cm;\n' +
	'\tmargin-right:0cm;\n' +
	'\tmargin-bottom:8.0pt;\n' +
	'\tmargin-left:0cm;\n' +
	'\tline-height:107%;\n' +
	'\tmso-pagination:widow-orphan;\n' +
	'\tfont-size:11.0pt;\n' +
	'\tfont-family:"Calibri",sans-serif;\n' +
	'h1\n' +
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
	'\tcolor:#2E74B5;\n' +
	'\tfont-weight:normal;}\n' +
	'span.Heading1Char\n' +
	'\t{mso-style-name:"Heading 1 Char";\n' +
	'\tfont-family:"Calibri Light",sans-serif;\n' +
	'\tcolor:#2E74B5;\n' +
	'\tmso-ansi-language:RU;\n' +
	'\tmso-fareast-language:EN-US;}\n' +
	'.MsoChpDefault\n' +
	'\tfont-size:10.0pt;\n' +
	'\tmso-ansi-font-size:10.0pt;\n' +
	'\tmso-bidi-font-size:10.0pt;\n' +
	'\tfont-family:"Calibri",sans-serif;\n' +
	'@page WordSection1\n' +
	'\t{size:612.0pt 792.0pt;\n' +
	'\tmargin:72.0pt 72.0pt 72.0pt 72.0pt;\n' +
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
	"<body lang=en-RU style='tab-interval:36.0pt'>\n" +
	'<!--StartFragment-->\n' +
	"<h1 align=center style='margin-top:0cm;text-align:center;line-height:normal'><span\n" +
	'lang=EN-US style=\'font-size:12.0pt;mso-bidi-font-size:10.0pt;font-family:"Arial",sans-serif;\n' +
	"color:#C45911;mso-ansi-language:EN-US'>LOREM IPSUM DOLOR SIT AMET<o:p></o:p></span></h1>\n" +
	'<!--EndFragment-->\n' +
	'</body>\n' +
	'</html>\n';
/* eslint-enable */

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

		describe('INSERT_AS_TEXT', () => {
			it('Should insert as text', () => {
				const editor = getJodit({
					disablePlugins: ['wrapNodes']
				});

				const pastedText =
					'<h1>Lorem ipsum <strong>dolor sit</strong> amet, <br><br>consetetur sadipscing elitr, sed <br><br></h1>';

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

				clickButton('insert_only_text', dialog);
				expect(getOpenedDialog(editor)).is.null;

				expect(editor.value).equals(
					'Lorem ipsum dolor sit amet, <br><br>consetetur sadipscing elitr, sed <br><br>'
				);
			});
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

		describe('Paste HTML from social services', function () {
			const twitter = {
				html: '<meta charset=\'utf-8\'><span style="color: rgb(136, 153, 166); font-family: &quot;Helvetica Neue&quot;, sans-serif; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: nowrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&lt;blockquote class="twitter-tweet"&gt;&lt;p lang="ru" dir="ltr"&gt;Нет слов, конечно &lt;a href="https://t.co/VEAi634acb"&gt;https://t.co/VEAi634acb&lt;/a&gt;&lt;/p&gt;&amp;mdash; Vasily Oblomov (@VS_Oblomov) &lt;a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw"&gt;July 4, 2020&lt;/a&gt;&lt;/blockquote&gt; &lt;script async src="https://platform.twitter.com/widgets.js" charset="utf-8"&gt;&lt;/script&gt;</span>',
				plain: '<blockquote class="twitter-tweet"><p lang="ru" dir="ltr">Нет слов, конечно <a href="https://t.co/VEAi634acb">https://t.co/VEAi634acb</a></p>— Vasily Oblomov (@VS_Oblomov) <a href="https://twitter.com/VS_Oblomov/status/1279467342213324801?ref_src=twsrc%5Etfw">July 4, 2020</a></blockquote> <script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
			};

			const instagram = {
				html: '<meta charset=\'utf-8\'><span style="color: rgb(0, 0, 0); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">&lt;blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"&gt;&lt;div style="padding:16px;"&gt; &lt;a href="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"&gt; &lt;div style=" display: flex; flex-direction: row; align-items: center;"&gt; &lt;div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"&gt;&lt;/div&gt; &lt;div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"&gt; &lt;div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"&gt;&lt;/div&gt; &lt;div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt;&lt;div style="padding: 19% 0;"&gt;&lt;/div&gt; &lt;div style="display:block; height:50px; margin:0 auto 12px; width:50px;"&gt;&lt;svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"&gt;&lt;g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"&gt;&lt;g transform="translate(-511.000000, -20.000000)" fill="#000000"&gt;&lt;g&gt;&lt;path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"&gt;&lt;/path&gt;&lt;/g&gt;&lt;/g&gt;&lt;/g&gt;&lt;/svg&gt;&lt;/div&gt;&lt;div style="padding-top: 8px;"&gt; &lt;div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"&gt;View this post on Instagram&lt;/div&gt;&lt;/div&gt;&lt;div style="padding: 12.5% 0;"&gt;&lt;/div&gt; &lt;div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"&gt;&lt;div&gt; &lt;div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"&gt;&lt;/div&gt; &lt;div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"&gt;&lt;/div&gt; &lt;div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"&gt;&lt;/div&gt;&lt;/div&gt;&lt;div style="margin-left: 8px;"&gt; &lt;div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"&gt;&lt;/div&gt; &lt;div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"&gt;&lt;/div&gt;&lt;/div&gt;&lt;div style="margin-left: auto;"&gt; &lt;div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"&gt;&lt;/div&gt; &lt;div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"&gt;&lt;/div&gt; &lt;div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/div&gt; &lt;div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"&gt; &lt;div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"&gt;&lt;/div&gt; &lt;div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"&gt;&lt;/div&gt;&lt;/div&gt;&lt;/a&gt;&lt;p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"&gt;&lt;a href="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank"&gt;A post shared by TOPTIPPERS Tipping Comp Game (@toptippers_game)&lt;/a&gt;&lt;/p&gt;&lt;/div&gt;&lt;/blockquote&gt; &lt;script async src="//www.instagram.com/embed.js"&gt;&lt;/script&gt;</span>',
				plain: '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/Cx2mM-oPIYa/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by TOPTIPPERS Tipping Comp Game (@toptippers_game)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>'
			};

			// eslint-disable-next-line no-unused-vars
			const emulatePasteEvent = cb => data => {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? cb.plain : cb.html;
					}
				};
			};

			describe('twitter', () => {
				it('Should paste as is', () => {
					const editor = getJodit({});
					simulateEvent(
						'paste',
						editor.editor,
						emulatePasteEvent(twitter, twitter)
					);
					clickButton('keep', getOpenedDialog(editor));
					expect(editor.value.startsWith('<blockquote')).is.true;
				});
			});

			describe('Instagram', () => {
				it('Should paste as is', () => {
					const editor = getJodit({});
					simulateEvent(
						'paste',
						editor.editor,
						emulatePasteEvent(twitter, instagram)
					);
					clickButton('keep', getOpenedDialog(editor));
					expect(editor.value.startsWith('<blockquote')).is.true;
				});
			});
		});

		describe('Paste HTML from Word', function () {
			const pastedText =
					'LOREM IPSUM DOLOR SIT AMET\n' +
					'\n' +
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ___________________________________________________\n' +
					'"',
				pastedHTML = WORD_EXAMPLE;

			const emulatePasteEvent = function (data) {
				data.clipboardData = {
					types: ['text/plain', 'text/html'],
					getData: function (type) {
						return type === 'text/plain' ? pastedText : pastedHTML;
					}
				};
			};

			describe('Keep format', () => {
				it('Should paste as is', () => {
					const editor = getJodit({
						disablePlugins: ['WrapNodes']
					});

					simulateEvent('paste', editor.editor, emulatePasteEvent);

					expect(editor.value).equals('');

					const dialog = getOpenedDialog(editor);
					simulateEvent('click', getButton('keep', dialog));

					expect(sortAttributes(editor.value)).equals(
						'<h1 align="center" style="line-height:normal;margin-top:0px;text-align:center"><span lang="EN-US" style="color:#C45911;font-family:Arial,sans-serif;font-size:16px">LOREM IPSUM DOLOR SIT AMET</span></h1>'
					);
				});
			});
		});

		describe('Prevent show dialog', function () {
			it('Should not show paste html dialog if beforeOpenPasteDialog returned false', function () {
				const editor = getJodit({
					events: {
						beforeOpenPasteDialog: function () {
							// msg,
							// title,
							// callback,
							// clearButton,
							// clear2Button
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

					expect(editor.value).equals('<p>test<br>test<br>test</p>');
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
			it('`Should Insert text with <br> instead of \\n', function () {
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

		describe('Scroll position', () => {
			it('should scroll editor to pasted content', () => {
				const editor = getJodit({
					defaultActionOnPaste: Jodit.INSERT_AS_HTML,
					height: 300
				});

				editor.value = '<p>test</p>\n'.repeat(20) + '<p>test|</p>';
				setCursorToChar(editor);

				const pastedText = '<p>pop</p>';

				const emulatePasteEvent = function (data) {
					data.clipboardData = {
						types: ['text/html'],
						getData: function () {
							return pastedText;
						}
					};
				};

				expect(editor.editor.scrollTop).eq(0);

				simulateEvent('paste', editor.editor, emulatePasteEvent);
				const dialog = getOpenedDialog(editor);
				clickButton('keep', dialog);

				replaceCursorToChar(editor);

				expect(editor.editor.scrollTop).above(500);
				expect(sortAttributes(editor.value)).eq(
					'<p>test</p>\n'.repeat(20) + '<p>test</p>' + '<p>pop|</p>'
				);
			});
		});
	});
});
