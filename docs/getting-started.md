# Getting Started

## Installation

{% list tabs %}

- npm

  ```shell
  npm install jodit
  ```

- yarn

  ```shell
  yarn add jodit
  ```

{% endlist %}

## CDN

### jsdelivr

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.js"></script>
```

### unpkg

```html
<link
	rel="stylesheet"
	href="https://unpkg.com/jodit@latest/es2021/jodit.min.css"
/>
<script src="https://unpkg.com/jodit@latest/es2021/jodit.min.js"></script>
```

### cdnjs

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.7.6/es2021/jodit.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.7.6/es2021/jodit.min.js"></script>
```

## Download archive

You can use the [Jodit Builder](https://xdsoft.net/jodit/builder/) service to download a zip archive. Then, simply include the necessary files:

```html
<link rel="stylesheet" href="./archive/jodit.min.css" />
<script src="./archive/jodit.min.js"></script>
```

## Usage

Jodit Editor can be initialized by calling the `Jodit.make` method with the selector of the textarea element.

```html
<textarea id="editor"></textarea>
<script>
	const editor = Jodit.make('#editor', {
		buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol']
	});
</script>
```

## Using with React

The easiest way to use Jodit in React is with the official `jodit-react` wrapper.

### Installation

{% list tabs %}

- npm

  ```shell
  npm install jodit-react
  ```

- yarn

  ```shell
  yarn add jodit-react
  ```

{% endlist %}

### Basic Usage

```jsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import JoditEditor from 'jodit-react';

function App() {
	const editor = useRef(null);
	const [content, setContent] = useState('');

	const config = useMemo(
		() => ({
			readonly: false,
			placeholder: 'Start typing...'
		}),
		[]
	);

	const handleBlur = useCallback((newContent) => {
		setContent(newContent);
	}, []);

	const handleChange = useCallback((newContent) => {
		// You can handle onChange here if needed
	}, []);

	return (
		<JoditEditor
			ref={editor}
			value={content}
			config={config}
			onBlur={handleBlur}
			onChange={handleChange}
		/>
	);
}

export default App;
```

### Advanced Example

```jsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import JoditEditor from 'jodit-react';

function App() {
	const editor = useRef(null);
	const [content, setContent] = useState('<p>Initial content</p>');

	const config = useMemo(
		() => ({
			readonly: false,
			placeholder: 'Start typing...',
			buttons: [
				'bold',
				'italic',
				'underline',
				'|',
				'ul',
				'ol',
				'|',
				'font',
				'fontsize',
				'brush',
				'|',
				'image',
				'link',
				'|',
				'align',
				'undo',
				'redo'
			],
			height: 400,
			uploader: {
				insertImageAsBase64URI: true
			}
		}),
		[]
	);

	const handleBlur = useCallback((newContent) => {
		setContent(newContent);
	}, []);

	const handleChange = useCallback((newContent) => {
		// You can handle onChange here if needed
	}, []);

	return (
		<div>
			<h1>My React App with Jodit</h1>
			<JoditEditor
				ref={editor}
				value={content}
				config={config}
				tabIndex={1}
				onBlur={handleBlur}
				onChange={handleChange}
			/>
			<div>
				<h2>Content Preview:</h2>
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</div>
	);
}

export default App;
```

{% cut "Custom React wrapper without jodit-react" %}

If you prefer to create your own React wrapper without using `jodit-react`, you can integrate Jodit directly:

### Installation

First, install Jodit via npm or yarn as shown above.

### Basic React Component

```jsx
import React, { useRef, useEffect } from 'react';
import Jodit from 'jodit';
import 'jodit/es2021/jodit.min.css';

function JoditEditor({ value, onChange, config }) {
	const editorRef = useRef(null);
	const joditRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current) return;

		// Initialize Jodit
		joditRef.current = Jodit.make(editorRef.current, {
			...config,
			events: {
				change: (newValue) => {
					onChange?.(newValue);
				}
			}
		});

		// Set initial value
		if (value) {
			joditRef.current.value = value;
		}

		// Cleanup on unmount
		return () => {
			joditRef.current?.destruct();
		};
	}, []);

	// Update value when it changes externally
	useEffect(() => {
		if (joditRef.current && value !== joditRef.current.value) {
			joditRef.current.value = value;
		}
	}, [value]);

	return <textarea ref={editorRef} />;
}

export default JoditEditor;
```

### Usage Example

```jsx
import React, { useState } from 'react';
import JoditEditor from './JoditEditor';

function App() {
	const [content, setContent] = useState('<p>Initial content</p>');

	const config = {
		buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol'],
		height: 400
	};

	return (
		<div>
			<h1>My React App with Jodit</h1>
			<JoditEditor
				value={content}
				onChange={setContent}
				config={config}
			/>
		</div>
	);
}

export default App;
```

{% endcut %}

### Full example

You can use the following code to create a simple HTML page with Jodit Editor.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta
			name="viewport"
			name="viewport"
			content="width=device-width, height=device-height, initial-scale=1.0,
            maximum-scale=1.0"
		/>
		<link
			href="https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.css"
			rel="stylesheet"
			type="text/css"
		/>
	</head>
	<body>
		<div id="jodit-editor"></div>
		<script
			type="text/javascript"
			src="https://cdn.jsdelivr.net/npm/jodit@latest/es2021/jodit.fat.min.js"
		></script>
		<script>
			Jodit.make('#jodit-editor');
		</script>
	</body>
</html>
```

### Full example PRO version

Same as above, but with the PRO version.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta
			name="viewport"
			name="viewport"
			content="width=device-width, height=device-height, initial-scale=1.0,
            maximum-scale=1.0"
		/>
		<link
			href="https://cdn.jsdelivr.net/npm/jodit-pro@latest/es2021/jodit.fat.min.css"
			rel="stylesheet"
			type="text/css"
		/>
	</head>
	<body>
		<div id="jodit-editor"></div>
		<script
			type="text/javascript"
			src="https://cdn.jsdelivr.net/npm/jodit-pro@latest/es2021/jodit.fat.min.js"
		></script>
		<script>
			Jodit.make('#jodit-editor', {
				license: '%your license key%'
			});
		</script>
	</body>
</html>
```
