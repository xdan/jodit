# Voice recognition plugin

The plugin uses [JS Speech Recognize API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/)

> The API is currently only available in Chrome and Safari. [See](https://caniuse.com/speech-recognition)

## Connection

This plugin is not included in the main Jodit build. It must be connected separately.

```js
import 'jodit/build/plugins/speech-recognize/speech-recognize.js';
import 'jodit/build/plugins/speech-recognize/speech-recognize.css';
```

Or via CDN:

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/jodit.es2018.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/jodit.es2018.min.js"></script>
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/plugins/speech-recognize/speech-recognize.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/plugins/speech-recognize/speech-recognize.js"></script>
```

## Commands

When the button is clicked, the plugin activates the listener mode.
As you type, you can see what the browser has recognized.
Text commands are also available during typing.
By default, there is a set of commands -

-   `newline|enter` - Enter
-   `delete|remove word|delete word` - Delete word
-   `comma` - Insert comma
-   `underline` - Insert underscore
-   `hyphen` - Insert hyphen
-   `space` - Insert space
-   `question` - Insert question mark
-   `dot` - Insert point
-   `quote|quotes|open quote` - Insert single quote
-   `header|header h1` - Apply Formatting Heading 1
-   `select all` - Select all text

> Synonymous expressions are defined through the `|` sign

In the plugin settings it is presented like this

```js
Jodit.make('#editor', {
	speechRecognize: {
		commands: {
			'newline|enter': 'enter',
			'delete|remove word|delete word': 'backspaceWordButton',
			comma: 'inserthtml::,',
			underline: 'inserthtml::_',
			hyphen: 'inserthtml::-',
			space: 'inserthtml:: ',
			question: 'inserthtml::?',
			dot: 'inserthtml::.',
			'quote|quotes|open quote': "inserthtml::'",
			'header|header h1': 'formatblock::h1',
			'select all': 'selectall'
		}
	}
});
```

Those. the key is an expression in your language (or a set of expressions separated by `|`), and the value

```
COMMAND::VALUE
```

or just

```
COMMAND
```

Using this setting, you can create a command to insert some image:

```js
Jodit.make('#editor', {
	speechRecognize: {
		commands: {
			'insert a cat|insert cat image': 'inserthtml::<img src="cat.png">'
		}
	}
});
```

## Language

By default, the browser tries to recognize your voice in the language of your page. [Read more](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/lang)
However, you can choose which language you speak:

```js
Jodit.make('#editor', {
	speechRecognize: {
		lang: 'en-US'
	}
});
```

For other settings see [documentation](https://xdsoft.net/jodit/docs/modules/plugins_speech_speech_recognize.html)
