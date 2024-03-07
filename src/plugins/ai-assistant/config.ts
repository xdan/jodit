/**
 * @module plugins/ai-assistant
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Icon } from 'jodit/core/ui/icon';

import magicWandIcon from './ai-assistant.svg';
import chatBotIcon from './chat-bot.svg';
import './ai-assistant.less';

declare module 'jodit/config' {
    interface Config {
        aiAssistantCallback: (prompt: string, htmlFragment: string) => Promise<string>;
        aiImproveWritingPrompt: string;
        aiMakeShorterPrompt: string;
        aiMakeLongerPrompt: string;
        aiSimplifyLanguagePrompt: string;
        aiSummarizePrompt: string;
        aiContinuePrompt: string;
        aiChangeToneProfessionalPrompt: string;
        aiChangeToneFriendlyPrompt: string;
        aiChangeToneFormalPrompt: string;
        aiChangeToneCasualPrompt: string;
        aiChangeToneDirectPrompt: string;
        aiChangeToneConfidentPrompt: string;
        aiChangeStyleBusinessPrompt: string;
        aiChangeStyleLegalPrompt: string;
        aiChangeStyleJournalismPrompt: string;
        aiChangeStylePoeticPrompt: string;
        aiTranslateToSpanishPrompt: string;
        aiTranslateToFrenchPrompt: string;
        aiTranslateToGermanPrompt: string;
        aiTranslateToItalianPrompt: string;
        aiTranslateToPortuguesePrompt: string;
        aiTranslateToEnglishPrompt: string;
        aiTranslateToChinesePrompt: string;
        aiTranslateToJapanesePrompt: string;
        aiTranslateToKoreanPrompt: string;
        aiTranslateToRussianPrompt: string;
        aiTranslateToArabicPrompt: string;
    }
}

Config.prototype.aiImproveWritingPrompt = 'It needs to be refined for better clarity, coherence, and overall quality. Please enhance the writing style while keeping the original meaning and language intact.';
Config.prototype.aiMakeShorterPrompt = 'Please condense this content to make it more concise, while preserving the key messages, language and information.';
Config.prototype.aiMakeLongerPrompt = 'Expand on this content to provide more detail, depth, and richness, without diverging from the original message and language.';
Config.prototype.aiSimplifyLanguagePrompt = 'The language used here needs to be simplified for easier understanding, without altering the core information and the original language.';
Config.prototype.aiSummarizePrompt = 'Provide a brief summary of this content, capturing the essential points in a concise manner. Preserve the original language and meaning.';
Config.prototype.aiContinuePrompt = 'Continue the narrative or discussion from this content seamlessly, maintaining the same language, tone and style.';
Config.prototype.aiChangeToneProfessionalPrompt = 'Adjust the tone to be professional, suitable for a formal business or academic setting, while retaining the original message and language.';
Config.prototype.aiChangeToneFriendlyPrompt = 'It needs to be rewritten in a friendly tone while maintaining the original message and language. Please modify this content to be warm, approachable, and engaging.';
Config.prototype.aiChangeToneFormalPrompt = 'Transform this content to have a formal tone, appropriate for official or serious contexts, without changing the main points and language.';
Config.prototype.aiChangeToneCasualPrompt = 'Revise this content to have a casual, relaxed tone, making it feel more personal and less formal, without changing the original meaning and language.';
Config.prototype.aiChangeToneDirectPrompt = 'Make the tone more direct, with straightforward language and a clear, assertive approach, without changing the original meaning and language.';
Config.prototype.aiChangeToneConfidentPrompt = 'Infuse this content with a confident tone, showcasing assurance and decisiveness, without changing the original meaning and language.';
Config.prototype.aiChangeStyleBusinessPrompt = 'Rewrite this content with a business-oriented style, focusing on clarity, efficiency, and professionalism, without changing the original meaning and language.';
Config.prototype.aiChangeStyleLegalPrompt = 'Adapt this content to a legal style, incorporating appropriate terminology and formality typical of legal documents, without changing the original meaning and language.';
Config.prototype.aiChangeStyleJournalismPrompt = 'Convert this content into a journalistic style, emphasizing factual accuracy, objectivity, and informative reporting, without changing the original meaning and language.';
Config.prototype.aiChangeStylePoeticPrompt = 'Recreate this content with a poetic style, using expressive language, rhythm, and imagery to convey the message, without changing the original meaning and language.';
Config.prototype.aiTranslateToSpanishPrompt = 'Translate this content into Spanish, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToFrenchPrompt = 'Translate this content into French, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToGermanPrompt = 'Translate this content into German, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToItalianPrompt = 'Translate this content into Italian, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToPortuguesePrompt = 'Translate this content into Portuguese, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToEnglishPrompt = 'Translate this content into English, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToChinesePrompt = 'Translate this content into Chinese, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToJapanesePrompt = 'Translate this content into Japanese, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToKoreanPrompt = 'Translate this content into Korean, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToRussianPrompt = 'Translate this content into Russian, ensuring the translation is accurate and maintains the original meaning.';
Config.prototype.aiTranslateToArabicPrompt = 'Translate this content into Arabic, ensuring the translation is accurate and maintains the original meaning.';

Icon.set('ai-assistant', chatBotIcon);
Icon.set('ai-commands', magicWandIcon);

Config.prototype.controls['ai-commands'] = {
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
        aiChangeStyleJournalismPrompt: 'Change style to journalism',
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
        editor.e.fire(
			'generateAiAssistantForm.ai-assistant',
            control.name
		);
    }
} as IControlType<IJodit> as IControlType;

Config.prototype.controls['ai-assistant'] = {
    hotkeys: ['ctrl+a+i', 'cmd+a+i'],
    tooltip: 'AI Assistant',
    popup: (editor: IJodit, current, close): any => {
        editor.e.fire(
			'generateAiAssistantForm.ai-assistant'
		);
    }
} as IControlType