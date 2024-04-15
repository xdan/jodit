/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

[
	'Insert After',
	'Ask AI to improve generated text',
	'Prompt',
	'AI Assistant',
	'AI Commands',
	'ai-commands',
	'ai-assistant',
	...Object.values(Jodit.defaultOptions.controls['ai-commands'].list)
].forEach(key => {
	excludeI18nKeys.add(key);
});

describe('AI Assistant', () => {
	let editor, callTimes;
	beforeEach(() => {
		unmockPromise();
		callTimes = 0;
		editor = getJodit({
			aiAssistant: {
				aiAssistantCallback: async (text, html) => {
					callTimes++;
					await Promise.resolve().then(() => {});
					if (text === 'throw Error') {
						throw new Error('Test error');
					}
					return callTimes === 1
						? `AI: ${text} HTML: ${html} answer`
						: `AI: ${text} HTML: ${html} answer2`;
				},
				aiMakeLongerPrompt: 'Make longer to 1000 symbols'
			}
		});
		editor.focus();
	});

	it('Should have an ai-assistant button', () => {
		const button = getButton('ai_assistant', editor);
		expect(button).to.be.not.null;
	});

	it('Should have an ai-commands button', () => {
		const button = getButton('ai_commands', editor);
		expect(button).to.be.not.null;
	});

	describe('Click on ai-assistant button', () => {
		it('Should open ai-assistant dialog', () => {
			clickButton('ai_assistant', editor);
			expect(getOpenedDialog(editor)).to.be.not.null;
		});

		it('Should cache ai-assistant dialog', () => {
			clickButton('ai_assistant', editor);
			const dialog = getOpenedDialog(editor);
			expect(dialog).to.be.not.null;
			clickButton('close', dialog);
			expect(getOpenedDialog(editor)).to.be.null;
			clickButton('ai_assistant', editor);
			expect(getOpenedDialog(editor)).to.be.equal(dialog);
		});

		describe('Main button in this dialog', () => {
			it('Should be disabled before enter text', () => {
				clickButton('ai_assistant', editor);
				expect(getOpenedDialog(editor)).to.be.not.null;
				const ui = getOpenedDialog(editor).querySelector(
					'.jodit-ui-ai-assistant'
				).component;
				expect(getButton('ai_assistant', ui).disabled).to.be.true;
				ui.promptInput.value = 'Hello';
				expect(getButton('ai_assistant', ui).disabled).to.be.false;
			});
		});

		describe('Enter text and press main button', () => {
			describe('Success result', () => {
				let ui;
				beforeEach(async () => {
					editor.value = '<p>|test|</p>';
					setCursorToChar(editor, '|');
					clickButton('ai_assistant', editor);
					ui = getOpenedDialog(editor).querySelector(
						'.jodit-ui-ai-assistant'
					).component;

					ui.promptInput.value = 'Hello';
					clickButton('ai_assistant', ui);
					expect(ui.getMod('loading')).to.be.true;
					expect(ui.getElm('results').contains(ui.getElm('spinner')))
						.to.be.true;
					await editor.async.requestIdlePromise();
					expect(ui.getMod('loading')).to.be.false;
					expect(ui.getElm('results').innerHTML).equals(
						'AI: Hello HTML: test answer'
					);
				});

				describe('Call Insert', () => {
					it('Should call aiCallback and show result', async () => {
						clickButton('Insert', ui);
						await editor.async.requestIdlePromise();
						expect(editor.value).equals(
							'<p>AI: Hello HTML: test answer</p>'
						);
					});
				});

				describe('Call Insert After', () => {
					it('Should call aiCallback and show result', async () => {
						clickButton('Insert After', ui);
						await editor.async.requestIdlePromise();
						expect(editor.value).equals(
							'<p>testAI: Hello HTML: test answer</p>'
						);
					});
				});

				describe('Call Update', () => {
					it('Should second time call aiCallback and show result', async () => {
						clickButton('update', ui);
						expect(ui.getMod('loading')).to.be.true;
						expect(getButton('Insert', ui).disabled).to.be.true;
						await editor.async.requestIdlePromise();
						expect(ui.getMod('loading')).to.be.false;
						expect(getButton('Insert', ui).disabled).to.be.false;
						expect(ui.getElm('results').innerHTML).equals(
							'AI: Hello HTML: test answer2'
						);
					});
				});

				describe('Call Main button', () => {
					it('Should work same way', async () => {
						clickButton('ai_assistant', ui);
						expect(ui.getMod('loading')).to.be.true;
						expect(getButton('Insert', ui).disabled).to.be.true;
						await editor.async.requestIdlePromise();
						expect(ui.getMod('loading')).to.be.false;
						expect(getButton('Insert', ui).disabled).to.be.false;
						expect(ui.getElm('results').innerHTML).equals(
							'AI: Hello HTML: test answer2'
						);
					});
				});
			});

			describe('When aiCallback throw error', () => {
				it('Should show it', async () => {
					clickButton('ai_assistant', editor);
					const ui = getOpenedDialog(editor).querySelector(
						'.jodit-ui-ai-assistant'
					).component;

					ui.promptInput.value = 'throw Error';
					clickButton('ai_assistant', ui);
					expect(ui.getMod('loading')).to.be.true;
					await editor.async.requestIdlePromise();
					expect(ui.getMod('loading')).to.be.false;
					expect(ui.getElm('results').innerHTML).equals('');
					expect(ui.getElm('error').innerHTML).equals('Test error');
					expect(getButton('Insert', ui).disabled).to.be.true;
					expect(getButton('Insert after', ui).disabled).to.be.true;
				});
			});
		});
	});

	describe('Click on ai-command', () => {
		describe('Click button', () => {
			it('Should open dialog', () => {
				clickButton('ai_commands', editor);
				expect(getOpenedDialog(editor)).to.be.not.null;
				const ui = getOpenedDialog(editor).querySelector(
					'.jodit-ui-ai-assistant'
				).component;

				expect(ui.promptInput.value).equals('');
			});
		});

		describe('Click trigger and click command', () => {
			it('Should automatically call aiCallback and show result', async () => {
				editor.value = '<p>|test|</p>';
				setCursorToChar(editor, '|');
				clickTrigger('ai_commands', editor);

				clickButton('Make longer', getOpenedPopup(editor));

				const ui = getOpenedDialog(editor).querySelector(
					'.jodit-ui-ai-assistant'
				).component;

				expect(ui.promptInput.value).equals(
					'Make longer to 1000 symbols'
				);

				expect(ui.getMod('loading')).to.be.true;
				expect(ui.getElm('results').contains(ui.getElm('spinner'))).to
					.be.true;
				await editor.async.requestIdlePromise();
				expect(ui.getMod('loading')).to.be.false;
				expect(ui.getElm('results').innerHTML).equals(
					'AI: Make longer to 1000 symbols HTML: test answer'
				);
				clickButton('Insert', ui);
				await editor.async.requestIdlePromise();
				expect(editor.value).equals(
					'<p>AI: Make longer to 1000 symbols HTML: test answer</p>'
				);
			});
		});
	});
});
