/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ai-assistant
 */

import type { IControlType, IJodit } from 'jodit/types';
import type { AiAssistantSettings } from 'jodit/plugins/ai-assistant/interface';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import magicWandIcon from './ai-assistant.svg';
import chatBotIcon from './chat-bot.svg';

declare module 'jodit/config' {
	interface Config {
		aiAssistant: AiAssistantSettings;
	}
}

const aiAssistantDefaults: AiAssistantSettings = {
	aiCommonPrefixPrompt: '',
	aiCommonSuffixPrompt: '',
	aiImproveWritingPrompt:
		'It needs to be refined for better clarity, coherence, and overall quality. Please enhance the writing style while keeping the original meaning and language intact.',
	aiMakeShorterPrompt:
		'Please condense this content to make it more concise, while preserving the key messages, language and information.',
	aiMakeLongerPrompt:
		'Expand on this content to provide more detail, depth, and richness, without diverging from the original message and language.',
	aiSimplifyLanguagePrompt:
		'The language used here needs to be simplified for easier understanding, without altering the core information and the original language.',
	aiSummarizePrompt:
		'Provide a brief summary of this content, capturing the essential points in a concise manner. Preserve the original language and meaning.',
	aiContinuePrompt:
		'Continue the narrative or discussion from this content seamlessly, maintaining the same language, tone and style.',
	aiChangeToneProfessionalPrompt:
		'Adjust the tone to be professional, suitable for a formal business or academic setting, while retaining the original message and language.',
	aiChangeToneFriendlyPrompt:
		'It needs to be rewritten in a friendly tone while maintaining the original message and language. Please modify this content to be warm, approachable, and engaging.',
	aiChangeToneFormalPrompt:
		'Transform this content to have a formal tone, appropriate for official or serious contexts, without changing the main points and language.',
	aiChangeToneCasualPrompt:
		'Revise this content to have a casual, relaxed tone, making it feel more personal and less formal, without changing the original meaning and language.',
	aiChangeToneDirectPrompt:
		'Make the tone more direct, with straightforward language and a clear, assertive approach, without changing the original meaning and language.',
	aiChangeToneConfidentPrompt:
		'Infuse this content with a confident tone, showcasing assurance and decisiveness, without changing the original meaning and language.',
	aiChangeStyleBusinessPrompt:
		'Rewrite this content with a business-oriented style, focusing on clarity, efficiency, and professionalism, without changing the original meaning and language.',
	aiChangeStyleLegalPrompt:
		'Adapt this content to a legal style, incorporating appropriate terminology and formality typical of legal documents, without changing the original meaning and language.',
	aiChangeStyleJournalismPrompt:
		'Convert this content into a journalistic style, emphasizing factual accuracy, objectivity, and informative reporting, without changing the original meaning and language.',
	aiChangeStylePoeticPrompt:
		'Recreate this content with a poetic style, using expressive language, rhythm, and imagery to convey the message, without changing the original meaning and language.',
	aiTranslateToSpanishPrompt:
		'Translate this content into Spanish, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToFrenchPrompt:
		'Translate this content into French, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToGermanPrompt:
		'Translate this content into German, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToItalianPrompt:
		'Translate this content into Italian, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToPortuguesePrompt:
		'Translate this content into Portuguese, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToEnglishPrompt:
		'Translate this content into English, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToChinesePrompt:
		'Translate this content into Chinese, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToJapanesePrompt:
		'Translate this content into Japanese, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToKoreanPrompt:
		'Translate this content into Korean, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToRussianPrompt:
		'Translate this content into Russian, ensuring the translation is accurate and maintains the original meaning.',
	aiTranslateToArabicPrompt:
		'Translate this content into Arabic, ensuring the translation is accurate and maintains the original meaning.'
};

Config.prototype.aiAssistant = aiAssistantDefaults;

Icon.set('ai-assistant', chatBotIcon);
Icon.set('ai-commands', magicWandIcon);

Config.prototype.controls['ai-commands'] = {
	isDisabled(editor: IJodit): boolean {
		return !editor.o.aiAssistant.aiAssistantCallback;
	},
	tooltip: 'AI Commands',
	list: {
		aiImproveWritingPrompt: 'Improve writing',
		aiMakeShorterPrompt: 'Make shorter',
		aiMakeLongerPrompt: 'Make longer',
		aiSimplifyLanguagePrompt: 'Simplify language',
		aiSummarizePrompt: 'Summarize',
		aiContinuePrompt: 'Continue',
		aiChangeToneProfessionalPrompt: 'Change tone to professional',
		aiChangeToneFriendlyPrompt: 'Change tone to friendly',
		aiChangeToneFormalPrompt: 'Change tone to formal',
		aiChangeToneCasualPrompt: 'Change tone to casual',
		aiChangeToneDirectPrompt: 'Change tone to direct',
		aiChangeToneConfidentPrompt: 'Change tone to confident',
		aiChangeStyleBusinessPrompt: 'Change style to business',
		aiChangeStyleLegalPrompt: 'Change style to legal',
		aiChangeStyleJournalismPrompt: 'Change style of journalism',
		aiChangeStylePoeticPrompt: 'Change style to poetic',
		aiTranslateToSpanishPrompt: 'Translate to Spanish',
		aiTranslateToFrenchPrompt: 'Translate to French',
		aiTranslateToGermanPrompt: 'Translate to German',
		aiTranslateToItalianPrompt: 'Translate to Italian',
		aiTranslateToPortuguesePrompt: 'Translate to Portuguese',
		aiTranslateToEnglishPrompt: 'Translate to English',
		aiTranslateToChinesePrompt: 'Translate to Chinese',
		aiTranslateToJapanesePrompt: 'Translate to Japanese',
		aiTranslateToKoreanPrompt: 'Translate to Korean',
		aiTranslateToRussianPrompt: 'Translate to Russian',
		aiTranslateToArabicPrompt: 'Translate to Arabic'
	},
	exec: (editor, event, { control }): void | false => {
		editor.e.fire('generateAiAssistantForm.ai-assistant', control.name);
	}
} as IControlType<IJodit> as IControlType;

Config.prototype.controls['ai-assistant'] = {
	isDisabled(editor: IJodit): boolean {
		return !editor.o.aiAssistant.aiAssistantCallback;
	},
	hotkeys: ['ctrl+a+i', 'cmd+a+i'],
	tooltip: 'AI Assistant',
	exec: (editor: IJodit, current, close): any => {
		editor.e.fire('generateAiAssistantForm.ai-assistant');
	}
} as IControlType;
