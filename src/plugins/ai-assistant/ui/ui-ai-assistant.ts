/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/ai-assistant
 */

import type { IJodit, IUIButton } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import { watch } from 'jodit/core/decorators/watch/watch';
import { Dom } from 'jodit/core/dom/dom';
import { isString } from 'jodit/core/helpers/checker/is-string';
import { Button, UIBlock, UIForm, UITextArea } from 'jodit/core/ui';
import { UIElement } from 'jodit/core/ui/element';

import './ui-ai-assistant.less';

@component
export class UiAiAssistant extends UIElement<IJodit> {
	private __body: HTMLElement;
	private __buttons: HTMLElement;
	private __results: HTMLElement;
	private __spinner: HTMLElement;
	private __error: HTMLElement;

	promptInput: UITextArea;

	private __insertAfterButton: IUIButton;
	private __submitButton: IUIButton;
	private __tryAgainButton: IUIButton;
	private __insertButton: IUIButton;
	private __formAiAssistant: UIForm;

	className(): string {
		return 'UIAiAssistant';
	}

	constructor(
		jodit: IJodit,
		{
			onInsert,
			onInsertAfter
		}: {
			onInsert: (html: string) => void;
			onInsertAfter: (html: string) => void;
		}
	) {
		super(jodit);

		this.__error = this.getElm('error')!;
		this.__body = this.getElm('body')!;
		this.__buttons = this.getElm('buttons')!;
		this.__results = this.getElm('results')!;
		this.__spinner = this.getElm('spinner')!;

		this.__insertButton = Button(jodit, '', 'Insert', 'primary').onAction(
			() => onInsert(this.__aiResult)
		);

		this.__insertAfterButton = Button(
			jodit,
			'',
			'Insert After',
			'initial'
		).onAction(() => onInsertAfter(this.__aiResult));

		const onSubmit = (): void => {
			if (this.__formAiAssistant.validate()) {
				this.__formAiAssistant.submit();
				this.__toggleInsertButton(true);
				this.__toggleSubmitButton(true);
			}
		};

		this.__submitButton = Button(jodit, 'ai-assistant', '').onAction(
			onSubmit
		);

		this.__tryAgainButton = Button(jodit, 'update', '', 'initial').onAction(
			onSubmit
		);

		this.promptInput = new UITextArea(jodit, {
			name: 'prompt',
			required: true,
			label: 'Prompt',
			placeholder: 'Ask AI to improve generated text',
			className: this.getFullElName('prompt-row-input')
		});

		const buttonsBLock = new UIBlock(
			jodit,
			[
				this.__insertButton,
				this.__insertAfterButton,
				this.__tryAgainButton
			],
			{
				className: this.getFullElName('prompt-row')
			}
		);

		this.__formAiAssistant = new UIForm(jodit, [
			new UIBlock(jodit, [this.promptInput, this.__submitButton], {
				className: this.getFullElName('prompt-row')
			})
		]).onSubmit((data: Record<string, string>) => {
			this.__error.textContent = '';
			this.setMod('loading', true);

			jodit.e.fire('invokeAiAssistant', data.prompt);

			const hideMod = this.getFullElName('', 'hide', 'true');
			this.__results.classList.remove(hideMod);
			this.__buttons.classList.remove(hideMod);

			Dom.detach(this.__results);
			this.__results.appendChild(this.__spinner);
			this.__insertButton.focus();
		});

		this.__buttons.appendChild(buttonsBLock.container);
		this.__body.appendChild(this.__formAiAssistant.container);

		this.onChangePromptValue();
	}

	protected override render(): string {
		return `<div>
				<div class="&__container">
						<div class="&__error"></div>
						<div class="&__body"></div>
						<div class="&__buttons &_hide_true"></div>
						<div class="&__results &_hide_true">
								<div class="&__spinner"></div>
						</div>
				</div>
		</div>`;
	}

	setPrompt(prompt: string): void {
		if (prompt) {
			const { jodit } = this;
			const promptOpt =
				jodit.o.aiAssistant[prompt as keyof typeof jodit.o.aiAssistant];

			const { aiCommonPrefixPrompt, aiCommonSuffixPrompt } =
				jodit.o.aiAssistant;

			this.promptInput.value = [
				aiCommonPrefixPrompt,
				isString(promptOpt) ? promptOpt : '',
				aiCommonSuffixPrompt
			]
				.filter(Boolean)
				.join(' ');

			this.__toggleInsertButton(true);

			if (this.promptInput.value) {
				this.__formAiAssistant.submit();

				this.__toggleSubmitButton(true);
			}
		}

		this.promptInput.focus();
	}

	private __aiResult: string = '';

	@watch(':ai-assistant-response')
	protected onAiAssistentResponse(result: string): void {
		this.setMod('loading', false);
		Dom.detach(this.__results);
		this.__aiResult = result;
		this.__results.appendChild(this.jodit.c.fromHTML(result));

		this.__toggleSubmitButton(false);
		this.__toggleInsertButton(false);
	}

	@watch(':ai-assistant-error')
	protected onAiAssistentError(error: string): void {
		this.__aiResult = '';
		this.setMod('loading', false);
		this.__error.textContent = error;
		Dom.detach(this.__results);
		this.__toggleSubmitButton(false);
		const hideMod = this.getFullElName('', 'hide', 'true');
		this.__results.classList.add(hideMod);
		this.__toggleInsertButton(true);
	}

	@watch('promptInput:change')
	protected onChangePromptValue(): void {
		this.__toggleSubmitButton(!this.promptInput.value);
	}

	private __toggleSubmitButton(value: boolean): void {
		this.__submitButton.state.disabled = value;
		this.__tryAgainButton.state.disabled = value;
	}

	private __toggleInsertButton(value: boolean): void {
		this.__insertButton.state.disabled = value;
		this.__insertAfterButton.state.disabled = value;
	}
}
