/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ai-assistant
 */

export interface AiAssistantSettings {
	/** Callback function for AI assistant to process and return the result */
	aiAssistantCallback?: (
		prompt: string,
		htmlFragment: string
	) => Promise<string>;

	/** Prompt for common prefix */
	aiCommonPrefixPrompt: string;

	/** Prompt for common suffix */
	aiCommonSuffixPrompt: string;

	/** Prompt for improving writing quality */
	aiImproveWritingPrompt: string;

	/** Prompt for making text shorter */
	aiMakeShorterPrompt: string;

	/** Prompt for making text longer */
	aiMakeLongerPrompt: string;

	/** Prompt for simplifying language */
	aiSimplifyLanguagePrompt: string;

	/** Prompt for summarizing text */
	aiSummarizePrompt: string;

	/** Prompt for continuing text */
	aiContinuePrompt: string;

	/** Prompt for changing tone to professional */
	aiChangeToneProfessionalPrompt: string;

	/** Prompt for changing tone to friendly */
	aiChangeToneFriendlyPrompt: string;

	/** Prompt for changing tone to formal */
	aiChangeToneFormalPrompt: string;

	/** Prompt for changing tone to casual */
	aiChangeToneCasualPrompt: string;

	/** Prompt for changing tone to direct */
	aiChangeToneDirectPrompt: string;

	/** Prompt for changing tone to confident */
	aiChangeToneConfidentPrompt: string;

	/** Prompt for changing style to business */
	aiChangeStyleBusinessPrompt: string;

	/** Prompt for changing style to legal */
	aiChangeStyleLegalPrompt: string;

	/** Prompt for changing style to journalism */
	aiChangeStyleJournalismPrompt: string;

	/** Prompt for changing style to poetic */
	aiChangeStylePoeticPrompt: string;

	/** Prompt for translating text to Spanish */
	aiTranslateToSpanishPrompt: string;

	/** Prompt for translating text to French */
	aiTranslateToFrenchPrompt: string;

	/** Prompt for translating text to German */
	aiTranslateToGermanPrompt: string;

	/** Prompt for translating text to Italian */
	aiTranslateToItalianPrompt: string;

	/** Prompt for translating text to Portuguese */
	aiTranslateToPortuguesePrompt: string;

	/** Prompt for translating text to English */
	aiTranslateToEnglishPrompt: string;

	/** Prompt for translating text to Chinese */
	aiTranslateToChinesePrompt: string;

	/** Prompt for translating text to Japanese */
	aiTranslateToJapanesePrompt: string;

	/** Prompt for translating text to Korean */
	aiTranslateToKoreanPrompt: string;

	/** Prompt for translating text to Russian */
	aiTranslateToRussianPrompt: string;

	/** Prompt for translating text to Arabic */
	aiTranslateToArabicPrompt: string;

	[key: string]:
		| string
		| ((prompt: string, htmlFragment: string) => Promise<string>)
		| undefined;
}
