# Speech Recognize Plugin

Provides voice dictation and voice command support using the browser's [Web Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition/). Users can dictate text and execute commands using voice instead of typing.

> **Browser Support**: This plugin only works in browsers that support the Web Speech Recognition API (Chrome, Safari, Edge). [See browser compatibility](https://caniuse.com/speech-recognition)

## Plugin Installation

**Important**: This plugin is **not included** in the main Jodit build and must be connected separately.

**ES6 Module:**
```javascript
import 'jodit/build/plugins/speech-recognize/speech-recognize.js';
import 'jodit/build/plugins/speech-recognize/speech-recognize.css';

const editor = Jodit.make('#editor');
```

**CDN:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/jodit.es2021.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/jodit.es2021.min.js"></script>

<!-- Speech Recognize Plugin -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/plugins/speech-recognize/speech-recognize.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/3.18.2/plugins/speech-recognize/speech-recognize.js"></script>
```

## Features

- Voice dictation to text
- Voice commands (e.g., "newline", "select all", "delete word")
- Custom command definitions
- Multi-language support
- Visual feedback popup during recognition
- Interim results display
- Continuous recognition mode
- Sound on error
- Translatable command phrases
- Command synonyms (e.g., "comma" or "insert comma")
- Dropdown menu with settings (sound, interim results)
- Active state visual indicator
- Auto-insert spacing between sentences

## Configuration Options

### `speechRecognize.api`

**Type:** `ISpeechRecognizeConstructor | null`

**Default:** `typeof SpeechRecognition !== 'undefined' ? SpeechRecognition : null`

The Web Speech Recognition API constructor. Automatically detected from browser. Set to `null` if API not supported.

**Example:**
```typescript
// Usually auto-detected, but you can override
const editor = Jodit.make('#editor', {
    speechRecognize: {
        api: window.webkitSpeechRecognition || window.SpeechRecognition
    }
});
```

### `speechRecognize.lang`

**Type:** `string | undefined`

**Default:** `undefined` (uses HTML lang attribute or browser language)

BCP 47 language tag specifying the language for speech recognition. If not specified, defaults to the HTML `lang` attribute or the user agent's language setting.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        lang: 'en-US'      // American English
    }
});

// Other examples:
// 'en-GB' - British English
// 'es-ES' - Spanish (Spain)
// 'fr-FR' - French
// 'de-DE' - German
// 'ru-RU' - Russian
// 'ja-JP' - Japanese
// 'zh-CN' - Chinese (Simplified)
```

### `speechRecognize.continuous`

**Type:** `boolean`

**Default:** `false`

Controls whether continuous results are returned for each recognition, or only a single result. When `true`, recognition continues until explicitly stopped.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        continuous: false  // Stop after single phrase
    }
});

// Continuous mode
const editor2 = Jodit.make('#editor2', {
    speechRecognize: {
        continuous: true   // Keep listening until stopped
    }
});
```

### `speechRecognize.interimResults`

**Type:** `boolean`

**Default:** `true`

Controls whether interim results should be returned (`true`) or not (`false`). Interim results are preliminary results that are not yet final (e.g., the `isFinal` property is `false`).

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        interimResults: true  // Show partial results while speaking
    }
});

// Disable interim results
const editor2 = Jodit.make('#editor2', {
    speechRecognize: {
        interimResults: false  // Only show final results
    }
});
```

### `speechRecognize.sound`

**Type:** `boolean`

**Default:** `true`

When `true`, plays an error sound when speech recognition encounters an error.

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        sound: true  // Play sound on errors
    }
});

// Disable error sounds
const editor2 = Jodit.make('#editor2', {
    speechRecognize: {
        sound: false
    }
});
```

### `speechRecognize.commands`

**Type:** `IDictionary<string>`

**Default:**
```typescript
{
    'newline|enter': 'enter',
    'delete|remove word|delete word': 'backspaceWordButton',
    'comma': 'inserthtml::,',
    'underline': 'inserthtml::_',
    'hyphen': 'inserthtml::-',
    'space': 'inserthtml:: ',
    'question': 'inserthtml::?',
    'dot': 'inserthtml::.',
    'quote|quotes|open quote': "inserthtml::'",
    'header|header h1': 'formatblock::h1',
    'select all': 'selectall'
}
```

Dictionary mapping voice command phrases to editor commands. The key is a command phrase (or multiple synonyms separated by `|`), and the value is a command in the format:
- `COMMAND` - Simple command (e.g., `'selectall'`)
- `COMMAND::VALUE` - Command with value (e.g., `'inserthtml::<b>bold</b>'`)

**Example:**
```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        commands: {
            // Insert characters/symbols
            'comma': 'inserthtml::,',
            'period|dot': 'inserthtml::.',
            'exclamation|exclamation mark': 'inserthtml::!',

            // Formatting
            'bold': 'bold',
            'italic': 'italic',
            'underline': 'underline',
            'header one|heading 1': 'formatblock::h1',
            'header two|heading 2': 'formatblock::h2',

            // Actions
            'new line|line break|enter': 'enter',
            'delete word|remove word': 'backspaceWordButton',
            'select all|select everything': 'selectall',

            // Custom HTML insertion
            'insert cat|insert cat image': 'inserthtml::<img src="cat.png" alt="cat">',
            'insert table|create table': 'inserthtml::<table><tr><td>cell</td></tr></table>',
            'insert link': 'inserthtml::<a href="#">link</a>'
        }
    }
});
```

## Controls

### `speechRecognize` Control

**Icon:** `'speech-recognize'`

**Tooltip:** `'Speech Recognize'`

**Group:** `'state'`

**Command:** `'toggleSpeechRecognize'`

**Dropdown List:**
- `sound`: "Sound" - Toggle error sound on/off
- `interimResults`: "Interim Results" - Toggle interim results display

Toggles speech recognition on/off. Shows active state with pulse animation when listening.

## Usage Examples

### Basic Voice Dictation

```typescript
import 'jodit/build/plugins/speech-recognize/speech-recognize.js';
import 'jodit/build/plugins/speech-recognize/speech-recognize.css';

const editor = Jodit.make('#editor');

// Click Speech Recognize button in toolbar
// Start speaking - text appears in editor
// Say "newline" to insert line break
// Say "comma" to insert comma
```

### Specify Language

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        lang: 'es-ES'  // Spanish
    }
});

// Now recognition works in Spanish
// Commands should be in Spanish
```

### Custom Commands

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        commands: {
            'paragraph|new paragraph': 'inserthtml::<p><br></p>',
            'bold text': 'bold',
            'make link': 'link',
            'insert signature': 'inserthtml::<p>Best regards,<br>John Doe</p>',
            'insert date': 'inserthtml::' + new Date().toLocaleDateString()
        }
    }
});

// Say "paragraph" to insert new paragraph
// Say "bold text" to toggle bold
// Say "insert signature" to add signature
```

### Continuous Mode

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        continuous: true,      // Keep listening
        interimResults: true   // Show partial results
    }
});

// Recognition continues until you click button again
// Great for long dictation sessions
```

### Disable Interim Results

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        interimResults: false
    }
});

// Only final results inserted into editor
// No progress popup shown while speaking
```

### Custom Language with Translated Commands

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        lang: 'ru-RU',
        commands: {
            'новая строка|энтер': 'enter',
            'запятая': 'inserthtml::,',
            'точка': 'inserthtml::.',
            'жирный': 'bold',
            'курсив': 'italic',
            'выделить всё': 'selectall'
        }
    }
});

// Russian voice commands
// Say "новая строка" for newline
// Say "жирный" for bold
```

### Listen to Recognition Events

```typescript
const editor = Jodit.make('#editor');

// Final result inserted
editor.e.on('speechRecognizeResult', (text) => {
    console.log('Recognized:', text);
});

// Progress during recognition
editor.e.on('speechRecognizeProgressResult', (text) => {
    console.log('Progress:', text);
});
```

### Toggle Recognition Programmatically

```typescript
const editor = Jodit.make('#editor');

// Start recognition
editor.execCommand('toggleSpeechRecognize');

// Stop recognition
editor.execCommand('toggleSpeechRecognize');
```

### Disable Sound on Errors

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        sound: false  // Silent on errors
    }
});
```

### Complex Command Example

```typescript
const editor = Jodit.make('#editor', {
    speechRecognize: {
        lang: 'en-US',
        commands: {
            // Simple text insertion
            'dash|hyphen': 'inserthtml::-',
            'space': 'inserthtml:: ',

            // Formatting commands
            'start bold|bold on': 'bold',
            'stop bold|bold off': 'bold',
            'heading one': 'formatblock::h1',
            'heading two': 'formatblock::h2',
            'normal text|paragraph': 'formatblock::p',

            // Deletion commands
            'delete|backspace': 'delete',
            'delete word': 'backspaceWordButton',
            'delete line': 'backspaceSentenceButton',

            // Navigation/selection
            'select all': 'selectall',
            'new line|line break': 'enter',

            // Custom snippets
            'email': 'inserthtml::user@example.com',
            'phone': 'inserthtml::+1-555-0100',
            'address': 'inserthtml::123 Main St, City, State 12345'
        }
    }
});
```

## How It Works

### Initialization

On plugin `afterInit`:
1. Reads `speechRecognize.commands` from options
2. Extends language files with command translations
3. For each command key (phrase or synonyms):
   - Splits on `|` to get individual phrases
   - Stores lowercase phrase → command mapping in `_commandToWord`
   - Checks for translations via `jodit.i18n(key)`
   - If translation exists, adds translated phrases to mapping
4. Result: All command phrases (original + translated) mapped to commands

### Button Click

When user clicks Speech Recognize button:
1. Checks if `speechRecognize.api` available
2. If not: shows alert "Speech recognize API unsupported in your browser"
3. Gets or creates `RecognizeManager` instance (stored via `dataBind`)
4. On first creation:
   - Creates native `SpeechRecognition` instance
   - Wraps in `RecognizeManager` with async support
   - Sets `lang`, `continuous`, `interimResults`, `sound` from options
   - Registers event handlers:
     - `pulse`: Sets button pulse mod (visual pulsing effect)
     - `result`: Fires `speechRecognizeResult` event with final text
     - `progress`: Fires `speechRecognizeProgressResult` event with interim text
     - `error`: Shows error message
   - Stores manager via `dataBind(jodit, 'speech', api)`
5. If `control.args` provided (dropdown item clicked):
   - Toggles `sound` or `interimResults` setting
   - Restarts recognition if active
6. Otherwise: calls `api.toggle()` to start/stop recognition
7. Sets button active state and pulse mod

### Recognition Progress

When user speaks and browser provides interim results:
1. `RecognizeManager` fires `progress` event with interim text
2. Plugin fires `speechRecognizeProgressResult` event
3. `onSpeechRecognizeProgressResult()` handler:
   - Creates popup div `.jodit-speech-recognize__popup` if not exists
   - Appends popup to workplace
   - Clears previous hide timeout
   - Sets timeout to hide popup after 1 second
   - Shows interim text with `|` cursor: `"Hello wo|"`

### Recognition Result

When user finishes speaking and browser provides final result:
1. `RecognizeManager` fires `result` event with final text
2. Plugin fires `speechRecognizeResult` event
3. `onSpeechRecognizeResult()` handler:
   - Clears hide timeout
   - Removes progress popup
   - Calls `_checkCommand(text)` to check if text is voice command

**If text is command** (e.g., "newline", "comma"):
- `_checkCommand()` returns `true`
- Converts text to lowercase, removes periods
- Looks up command in `_commandToWord` dictionary
- Calls `execSpellCommand()` to execute command
- Command format: `COMMAND::VALUE` or just `COMMAND`
- Splits on `::` to get command and value
- Calls `jodit.execCommand(command, null, value)`

**If text is not command** (regular dictation):
- `_checkCommand()` returns `false`
- Gets current selection node
- If selection collapsed and in text node:
  - Appends text to existing text node
  - Adds space if node doesn't end with space/nbsp
  - Moves cursor to end
  - Synchronizes editor values
- Otherwise: calls `s.insertHTML(text)` to insert as HTML

### Command Execution

The `execSpellCommand()` helper:
1. Splits command sentence on `::`
2. Gets `command` (before `::`) and `value` (after `::`)
3. Calls `jodit.execCommand(command, null, value)`

**Examples:**
- `"selectall"` → `execCommand('selectall', null, undefined)`
- `"inserthtml::,"` → `execCommand('inserthtml', null, ',')`
- `"formatblock::h1"` → `execCommand('formatblock', null, 'h1')`

### Translation System

Commands support internationalization:
1. Each command key (e.g., "comma") can be translated
2. Plugin calls `jodit.i18n(key)` for each command phrase
3. If translation found (different from key):
   - Splits translation on `|` for synonyms
   - Adds each translated phrase to `_commandToWord` mapping
4. Example: English "comma" → Russian "запятая" both execute same command

### Dropdown Menu

Button has dropdown with checkboxes:
- **Sound**: Toggle error sound on/off
- **Interim Results**: Toggle interim results display

When checkbox clicked:
- `control.args[0]` contains key (`'sound'` or `'interimResults'`)
- Plugin toggles boolean property on `RecognizeManager`
- If recognition active, calls `api.restart()` to apply change

### Active State

Button shows active state when recognition running:
- `button.state.activated = api.isEnabled`
- Pulse mod applied: `button.setMod('pulse', true)`
- Visual pulsing animation indicates listening

### Cleanup

On `beforeDestruct`:
- Safely removes progress popup from DOM
- RecognizeManager cleaned up via button's `beforeDestruct` hook

## Events

### `speechRecognizeResult`

Fired when final speech recognition result received.

**Parameters:**
- `text` (string): The recognized text

**Example:**
```typescript
editor.e.on('speechRecognizeResult', (text) => {
    console.log('Final result:', text);
});
```

### `speechRecognizeProgressResult`

Fired when interim speech recognition result received (while user still speaking).

**Parameters:**
- `text` (string): The interim recognized text

**Example:**
```typescript
editor.e.on('speechRecognizeProgressResult', (text) => {
    console.log('Interim result:', text);
});
```

## Commands

### `toggleSpeechRecognize`

Toggles speech recognition on/off.

**Example:**
```typescript
// Start recognition
editor.execCommand('toggleSpeechRecognize');

// Stop recognition (call again)
editor.execCommand('toggleSpeechRecognize');
```

## Default Voice Commands

The plugin includes these default voice commands (English):

| Voice Command | Action | Notes |
|---------------|--------|-------|
| "newline" or "enter" | Insert line break | `enter` command |
| "delete", "remove word", or "delete word" | Delete previous word | `backspaceWordButton` |
| "comma" | Insert `,` | HTML insertion |
| "underline" | Insert `_` | HTML insertion (underscore char) |
| "hyphen" | Insert `-` | HTML insertion |
| "space" | Insert space | HTML insertion |
| "question" | Insert `?` | HTML insertion |
| "dot" | Insert `.` | HTML insertion |
| "quote", "quotes", or "open quote" | Insert `'` | HTML insertion (single quote) |
| "header" or "header h1" | Apply Heading 1 | `formatblock::h1` |
| "select all" | Select all text | `selectall` command |

## Command Format

Commands use this format:

**Simple Command:**
```javascript
'voice phrase': 'commandName'
```

**Command with Value:**
```javascript
'voice phrase': 'commandName::value'
```

**Multiple Synonyms:**
```javascript
'phrase one|phrase two|phrase three': 'commandName::value'
```

**Examples:**
```javascript
{
    'bold': 'bold',                           // Toggle bold
    'heading 1': 'formatblock::h1',           // Apply H1
    'insert comma': 'inserthtml::,',          // Insert comma
    'new line|line break': 'enter',           // Multiple synonyms
    'insert logo': 'inserthtml::<img src="logo.png">'  // Insert HTML
}
```

## Edge Cases

1. **Browser Support**: Button only visible if `speechRecognize.api` available
2. **Unsupported Browser**: Shows alert if API not available when clicked
3. **Language Fallback**: Uses HTML lang attribute or browser language if not specified
4. **Command Normalization**: Commands converted to lowercase, periods removed
5. **Spacing**: Automatically adds space between sentences if missing
6. **Collapsed Selection**: Appends to current text node if selection collapsed
7. **Expanded Selection**: Uses `insertHTML` if selection not collapsed
8. **Progress Timeout**: Popup hides 1 second after last interim result
9. **Dropdown Toggle**: Can toggle sound/interim results while recognition active
10. **Translation**: Supports translated command phrases via i18n system

## Notes

- Plugin is class-based, extends `Plugin` base class
- Uses `@watch` decorator for event handling
- Button in 'state' toolbar group
- External plugin - not in main build
- Separate CSS file required
- Uses Web Speech Recognition API (Chrome, Safari, Edge)
- Visual popup shows progress during recognition
- Pulse animation on button when active
- Commands case-insensitive and period-insensitive
- Synonym support via `|` separator
- Translation support via `jodit.i18n()`
- The `RecognizeManager` wraps native SpeechRecognition API
- The `execSpellCommand()` helper executes command strings
- Manager instance stored via `dataBind(jodit, 'speech')`
- Button hooked to manager lifecycle for cleanup
- Dropdown rendered with checkbox custom template
- Command mapping built in `afterInit` from config
- Progress popup class: `.jodit-speech-recognize__popup`
- Popup shows text with `|` cursor indicator
- Space regex: `/[\u00A0 ]\uFEFF*$/` checks for nbsp/space at end
- Command check removes periods: `.replace(/\./g, '')`
- The `_commandToWord` dictionary maps phrases to commands
- Interim results controlled by `interimResults` option
- Error sound controlled by `sound` option
- Continuous mode controlled by `continuous` option
- The plugin properly cleans up popup on destruction
- API constructor check: `typeof SpeechRecognition !== 'undefined'`
- Language defaults to document lang or browser lang

## Typical Use Case

Users need hands-free text input for dictation, accessibility, or convenience. The speech-recognize plugin provides this by:

1. Adding Speech Recognize button to toolbar
2. Using browser's native speech recognition API
3. Converting voice to text in real-time
4. Supporting voice commands for common actions
5. Showing visual feedback during recognition

This improves user experience by:
- Enabling hands-free operation
- Faster input than typing for some users
- Accessibility for users with mobility impairments
- Natural voice command interface
- Visual progress feedback during recognition
- Multi-language support for international users