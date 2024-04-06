/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, IUIButton } from 'jodit/types';
import { component } from 'jodit/core/decorators/component/component';
import watch from 'jodit/core/decorators/watch/watch';
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

	constructor(jodit: IJodit, { onClose }: { onClose: () => void }) {
		super(jodit);

		this.__error = this.getElm('error')!;
		this.__body = this.getElm('body')!;
		this.__buttons = this.getElm('buttons')!;
		this.__results = this.getElm('results')!;
		this.__spinner = this.getElm('spinner')!;

		this.__insertAfterButton = Button(
			jodit,
			'',
			'Insert After',
			'initial'
		).onAction(() => {
			jodit.s.focus();
			jodit.s.setCursorAfter(jodit.s.current()!);
			jodit.s.insertHTML(this.__aiResult);
			onClose();
		});

		this.__submitButton = Button(jodit, 'ai-assistant', '').onAction(() => {
			if (this.__formAiAssistant.validate()) {
				this.__formAiAssistant.submit();

				this.__submitButton.state.disabled = true;
				this.__tryAgainButton.state.disabled = true;
			}
		});

		this.__tryAgainButton = Button(
			jodit,
			'',
			'Try Again',
			'initial'
		).onAction(() => {
			if (this.__formAiAssistant.validate()) {
				this.__formAiAssistant.submit();
				this.__submitButton.setState({ disabled: true });
				this.__tryAgainButton.setState({ disabled: true });
			}
		});

		this.promptInput = new UITextArea(jodit, {
			name: 'prompt',
			required: true,
			label: 'Prompt',
			placeholder: 'Ask AI to improve generated text',
			className: this.getFullElName('prompt-row-input')
		});

		this.__insertButton = Button(jodit, '', 'Insert', 'primary').onAction(
			() => {
				if (this.__aiResult) {
					jodit.s.focus();
					jodit.s.insertHTML(this.__aiResult);
				}
				onClose();
			}
		);

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

			this.promptInput.value = isString(promptOpt) ? promptOpt : prompt;
			this.__formAiAssistant.submit();

			this.__submitButton.state.disabled = true;
			this.__tryAgainButton.state.disabled = true;
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

		this.__submitButton.state.disabled = false;
		this.__tryAgainButton.state.disabled = false;
	}

	@watch(':ai-assistant-error')
	protected onAiAssistentError(error: string): void {
		this.__aiResult = '';
		this.setMod('loading', false);
		this.__error.textContent = error;

		this.__submitButton.state.disabled = false;
		this.__tryAgainButton.state.disabled = false;
	}

	@watch('promptInput.nativeInput:input')
	protected onChangePromptValue(): void {
		this.__submitButton.state.disabled = !this.promptInput.value;
		this.__tryAgainButton.state.disabled = !this.promptInput.value;
	}
}
