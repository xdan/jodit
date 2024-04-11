# Jodit AI Assistant Plugin

The Jodit AI Assistant plugin is a powerful tool that enhances your text editing capabilities with the help of AI. It provides various features like improving writing quality, making text shorter or longer, simplifying language, summarizing text, changing tone and style, and translating text to different languages.

## Installation

To use the AI Assistant plugin, you need to include it in your Jodit editor configuration:

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiAssistantCallback(propmt, htmlFragment) {
			return Promise.resolve('AI Assistant is not configured');
		}
	}
});
```

In the `aiAssistantCallback` function, you can define how the AI assistant processes and returns the result.

## Usage

The AI Assistant plugin provides many prompts for different operations.
Each prompt is a string that instructs the AI on what to do.
Here is an example of how to use the `aiImproveWritingPrompt`:

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiImproveWritingPrompt: 'Improve this text'
	}
});
```

You can set similar prompts for other operations as per your requirements.

## OpenAI API Example

To use the OpenAI API with the AI Assistant plugin, you need to make API calls within the `aiAssistantCallback` function. Here is an example:

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiAssistantCallback(prompt, htmlFragment) {
			// Make API call to OpenAI
			return fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + Jodit.constants.TOKENS.TOKEN_GPT
				},
				body: JSON.stringify({
					model: 'gpt-3.5-turbo',
					messages: [
						{
							role: 'system',
							content: prompt
						},
						{
							role: 'user',
							content: htmlFragment
						}
					]
				})
			})
				.then(response => response.json())
				.then(data => {
					if (data.error) {
						throw new Error(data.error.message);
					}

					return (
						Jodit.modules.Helpers.get(
							'choices.0.message.content',
							data
						) ?? ''
					);
				});
		}
	}
});
```

In this example, replace `Bearer YOUR_OPENAI_API_KEY` with your actual OpenAI API key.

Please note that you need to handle errors and edge cases as per your application's requirements.

Here are some examples of using different prompts:

### Making Text Shorter

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiShortenTextPrompt: 'Shorten this text'
	}
});
```

### Simplifying Language

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiSimplifyLanguagePrompt: 'Simplify this text'
	}
});
```

### Summarizing Text

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiSummarizePrompt: 'Summarize this text'
	}
});
```

### Changing Tone to Professional

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiChangeToneProfessionalPrompt: 'Change tone to professional'
	}
});
```

### Translating Text to Spanish

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiTranslateToSpanishPrompt: 'Translate to Spanish'
	}
});
```

Remember to replace the string values with your own prompts as per your requirements.

Here is the table with all the prompts and their default values:

| Prompt                         | Default Value                                                                                                                                                               |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aiCommonPrefixPrompt           | ''                                                                                                                                                                          |
| aiCommonSuffixPrompt           | ''                                                                                                                                                                          |
| aiImproveWritingPrompt         | 'It needs to be refined for better clarity, coherence, and overall quality. Please enhance the writing style while keeping the original meaning and language intact.'       |
| aiMakeShorterPrompt            | 'Please condense this content to make it more concise, while preserving the key messages, language and information.'                                                        |
| aiMakeLongerPrompt             | 'Expand on this content to provide more detail, depth, and richness, without diverging from the original message and language.'                                             |
| aiSimplifyLanguagePrompt       | 'The language used here needs to be simplified for easier understanding, without altering the core information and the original language.'                                  |
| aiSummarizePrompt              | 'Provide a brief summary of this content, capturing the essential points in a concise manner. Preserve the original language and meaning.'                                  |
| aiContinuePrompt               | 'Continue the narrative or discussion from this content seamlessly, maintaining the same language, tone and style.'                                                         |
| aiChangeToneProfessionalPrompt | 'Adjust the tone to be professional, suitable for a formal business or academic setting, while retaining the original message and language.'                                |
| aiChangeToneFriendlyPrompt     | 'It needs to be rewritten in a friendly tone while maintaining the original message and language. Please modify this content to be warm, approachable, and engaging.'       |
| aiChangeToneFormalPrompt       | 'Transform this content to have a formal tone, appropriate for official or serious contexts, without changing the main points and language.'                                |
| aiChangeToneCasualPrompt       | 'Revise this content to have a casual, relaxed tone, making it feel more personal and less formal, without changing the original meaning and language.'                     |
| aiChangeToneDirectPrompt       | 'Make the tone more direct, with straightforward language and a clear, assertive approach, without changing the original meaning and language.'                             |
| aiChangeToneConfidentPrompt    | 'Infuse this content with a confident tone, showcasing assurance and decisiveness, without changing the original meaning and language.'                                     |
| aiChangeStyleBusinessPrompt    | 'Rewrite this content with a business-oriented style, focusing on clarity, efficiency, and professionalism, without changing the original meaning and language.'            |
| aiChangeStyleLegalPrompt       | 'Adapt this content to a legal style, incorporating appropriate terminology and formality typical of legal documents, without changing the original meaning and language.'  |
| aiChangeStyleJournalismPrompt  | 'Convert this content into a journalistic style, emphasizing factual accuracy, objectivity, and informative reporting, without changing the original meaning and language.' |
| aiChangeStylePoeticPrompt      | 'Recreate this content with a poetic style, using expressive language, rhythm, and imagery to convey the message, without changing the original meaning and language.'      |
| aiTranslateToSpanishPrompt     | 'Translate this content into Spanish, ensuring the translation is accurate and maintains the original meaning.'                                                             |
| aiTranslateToFrenchPrompt      | 'Translate this content into French, ensuring the translation is accurate and maintains the original meaning.'                                                              |
| aiTranslateToGermanPrompt      | 'Translate this content into German, ensuring the translation is accurate and maintains the original meaning.'                                                              |
| aiTranslateToItalianPrompt     | 'Translate this content into Italian, ensuring the translation is accurate and maintains the original meaning.'                                                             |
| aiTranslateToPortuguesePrompt  | 'Translate this content into Portuguese, ensuring the translation is accurate and maintains the original meaning.'                                                          |
| aiTranslateToEnglishPrompt     | 'Translate this content into English, ensuring the translation is accurate and maintains the original meaning.'                                                             |
| aiTranslateToChinesePrompt     | 'Translate this content into Chinese, ensuring the translation is accurate and maintains the original meaning.'                                                             |
| aiTranslateToJapanesePrompt    | 'Translate this content into Japanese, ensuring the translation is accurate and maintains the original meaning.'                                                            |
| aiTranslateToKoreanPrompt      | 'Translate this content into Korean, ensuring the translation is accurate and maintains the original meaning.'                                                              |
| aiTranslateToRussianPrompt     | 'Translate this content into Russian, ensuring the translation is accurate and maintains the original meaning.'                                                             |
| aiTranslateToArabicPrompt      | 'Translate this content into Arabic, ensuring the translation is accurate and maintains the original meaning.'                                                              |

You can customize these prompts as per your requirements.

## Common prefixes and suffixes

The AI Assistant plugin also provides common prefixes and suffixes that can be used to enhance the AI's understanding of the text. You can set these values in the configuration:

```javascript
const editor = Jodit.make('#editor', {
	aiAssistant: {
		aiCommonPrefixPrompt: 'Result should be on Spanish',
		aiCommonSuffixPrompt:
			'Please make the necessary changes to enhance the quality of the content. Text should be clear, concise, and engaging.'
	}
});
```
