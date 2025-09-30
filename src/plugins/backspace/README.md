# Backspace Plugin

Handles proper behavior for Backspace and Delete keys with support for deleting characters, words, and sentences.

## Description

This plugin manages deletion operations in the editor, providing smart handling for various deletion scenarios including:
- Character-by-character deletion
- Word deletion
- Sentence deletion
- Handling of empty blocks
- Managing lists and nested structures
- Proper deletion across formatting boundaries

## Features

- **Character Deletion**: Standard backspace/delete behavior
- **Word Deletion**: Delete entire words with keyboard shortcuts
- **Sentence Deletion**: Delete entire sentences
- **Customizable Hotkeys**: Configure keyboard shortcuts for all deletion modes
- **Smart Merging**: Intelligently merges blocks when deleting at boundaries
- **List Handling**: Proper behavior when deleting in lists
- **Events**: Hooks for customizing deletion behavior

## Configuration

### `delete.hotkeys`

Configure keyboard shortcuts for different deletion modes.

```typescript
{
  delete: string[];        // Forward delete
  deleteWord: string[];    // Delete next word
  deleteSentence: string[]; // Delete next sentence
  backspace: string[];     // Backward delete
  backspaceWord: string[]; // Delete previous word
  backspaceSentence: string[]; // Delete previous sentence
}
```

**Default values:**

```javascript
const editor = Jodit.make('#editor', {
  delete: {
    hotkeys: {
      delete: ['delete', 'cmd+backspace'],
      deleteWord: ['ctrl+delete', 'cmd+alt+backspace', 'ctrl+alt+backspace'],
      deleteSentence: ['ctrl+shift+delete', 'cmd+shift+delete'],
      backspace: ['backspace'],
      backspaceWord: ['ctrl+backspace'],
      backspaceSentence: ['ctrl+shift+backspace', 'cmd+shift+backspace']
    }
  }
});
```

## Usage Examples

### Custom Hotkeys

```javascript
const editor = Jodit.make('#editor', {
  delete: {
    hotkeys: {
      backspace: ['backspace'],
      delete: ['delete'],
      backspaceWord: ['alt+backspace'],
      deleteWord: ['alt+delete']
    }
  }
});
```

### Programmatic Deletion

```javascript
const editor = Jodit.make('#editor');

// Delete forward (like pressing Delete key)
editor.execCommand('deleteButton');

// Delete backward (like pressing Backspace)
editor.execCommand('backspaceButton');

// Delete next word
editor.execCommand('deleteWordButton');

// Delete previous word
editor.execCommand('backspaceWordButton');

// Delete next sentence
editor.execCommand('deleteSentenceButton');

// Delete previous sentence
editor.execCommand('backspaceSentenceButton');
```

### Using Events

```javascript
const editor = Jodit.make('#editor');

// Hook before deletion
editor.events.on('backSpaceBeforeCases', (backspace, fakeNode) => {
  console.log('About to delete:', backspace ? 'backward' : 'forward');
  // Return true to prevent default deletion
});

// Hook after deletion
editor.events.on('backSpaceAfterDelete', (backspace, fakeNode) => {
  console.log('Deleted:', backspace ? 'backward' : 'forward');
});
```

## Events

### `backSpaceBeforeCases`

Fired before deletion logic is executed. Return `true` to override default behavior.

**Parameters:**
- `backspace: boolean` - True if backspace, false if delete
- `fakeNode: Node` - Temporary node used for deletion tracking

### `backSpaceAfterDelete`

Fired after deletion is complete.

**Parameters:**
- `backspace: boolean` - True if backspace, false if delete
- `fakeNode: Node` - Temporary node used for deletion tracking

## Notes

- This plugin is essential for proper editor functionality and should not be disabled
- Required plugin: `hotkeys`
- Handles complex cases like deleting across formatting, merging blocks, and managing lists
- Word/sentence deletion uses Unicode word boundaries for proper multilingual support
