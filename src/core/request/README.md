# Request

The module is responsible for sending HTTP requests over the network.
It provides a promise-based wrapper around `XMLHttpRequest` with typed responses, progress tracking, automatic cleanup, and flexible configuration.

## Quick Start

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/data'
});

const resp = await ajax.send();
const text = await resp.text();
console.log(text);
ajax.destruct();
```

## API

### `Ajax<T>` Class

#### Constructor

```ts
new Ajax<T>(options: Partial<AjaxOptions>, defaultOptions?: AjaxOptions)
```

- `options` — request configuration (see [[AjaxOptions]] below)
- `defaultOptions` — fallback defaults; if omitted, uses `Config.prototype.defaultAjaxOptions`

#### Methods

| Method           | Returns                          | Description                                          |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| `send()`         | `RejectablePromise<IResponse<T>>` | Sends the request                                   |
| `stream()`       | `AsyncGenerator<string>`         | Sends and streams SSE events, yields `data:` strings |
| `abort()`        | `Ajax<T>`                        | Aborts an in-flight request                          |
| `prepareRequest()` | `IRequest`                     | Builds the `{ url, method, data }` request object    |
| `destruct()`     | `void`                           | Aborts (if needed) and cleans up all resources       |

#### Static Properties

| Property    | Type         | Description                                      |
| ----------- | ------------ | ------------------------------------------------ |
| `Ajax.log`  | `IRequest[]` | Ring buffer of the last 100 prepared requests    |

### `Response<T>` Class

Wraps the raw XMLHttpRequest result.

| Property / Method | Type              | Description                    |
| ----------------- | ----------------- | ------------------------------ |
| `status`          | `number`          | HTTP status code (e.g. `200`) |
| `statusText`      | `string`          | HTTP status text               |
| `url`             | `string`          | Requested URL                  |
| `request`         | `IRequest`        | Original request object        |
| `json()`          | `Promise<T>`      | Parse body as JSON             |
| `text()`          | `Promise<string>` | Get body as plain text         |
| `blob()`          | `Promise<Blob>`   | Get body as Blob               |

### `AjaxOptions`

```ts
interface AjaxOptions {
	successStatuses: number[];     // Default: [200, 201, 202]
	method?: string;               // Default: 'GET'
	url?: string;
	data: DataVariant;             // string | object | FormData | null
	contentType?: string | false;  // Default: 'application/x-www-form-urlencoded; charset=UTF-8'
	headers?: IDictionary<string> | null | (() => CanPromise<IDictionary<string> | null>);
	responseType?: XMLHttpRequestResponseType;
	withCredentials?: boolean;     // Default: false
	queryBuild?: (obj, prefix?) => string | FormData;
	xhr?: () => XMLHttpRequest;
	onProgress?: (percentage: number) => void;
}
```

Default headers: `{ 'X-REQUESTED-WITH': 'XMLHttpRequest' }`.

## Examples

### GET request with JSON response

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/users'
});

try {
	const resp = await ajax.send();
	const users = await resp.json();
	console.log(users);
} finally {
	ajax.destruct();
}
```

### GET request with query parameters

When `method` is `'GET'` and `data` is an object, parameters are appended to the URL automatically:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/search',
	data: { q: 'jodit', page: '1', limit: '10' }
});

// Requests: https://example.com/api/search?q=jodit&page=1&limit=10
const resp = await ajax.send();
const results = await resp.json();
ajax.destruct();
```

### POST request with form data

```js
const ajax = new Jodit.modules.Ajax({
	method: 'POST',
	url: 'https://example.com/api/users',
	data: { name: 'John', email: 'john@example.com' }
});

const resp = await ajax.send();
const result = await resp.json();
ajax.destruct();
```

### POST JSON

Set `contentType` to `application/json` — the object will be serialized with `JSON.stringify` automatically:

```js
const ajax = new Jodit.modules.Ajax({
	method: 'POST',
	url: 'https://example.com/api/articles',
	contentType: 'application/json',
	data: {
		title: 'Hello World',
		body: '<p>Content</p>',
		tags: ['editor', 'jodit']
	}
});

const resp = await ajax.send();
const article = await resp.json();
ajax.destruct();
```

### Upload file with FormData

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('path', '/uploads/');

const ajax = new Jodit.modules.Ajax({
	method: 'POST',
	url: 'https://example.com/api/upload',
	data: formData,
	contentType: false // let the browser set multipart boundary
});

const resp = await ajax.send();
const result = await resp.json();
ajax.destruct();
```

### Upload with progress tracking

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const ajax = new Jodit.modules.Ajax({
	method: 'POST',
	url: 'https://example.com/api/upload',
	data: formData,
	contentType: false,
	onProgress(percentage) {
		console.log(`Download progress: ${percentage}%`);
	},
	xhr() {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', evt => {
			if (evt.lengthComputable) {
				const percent = (evt.loaded / evt.total) * 100;
				console.log(`Upload progress: ${percent}%`);
			}
		});
		return xhr;
	}
});

const resp = await ajax.send();
ajax.destruct();
```

### Custom headers

Headers can be a static object:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/data',
	headers: {
		Authorization: 'Bearer my-token-123',
		'X-Custom-Header': 'value'
	}
});
```

Or an async function — useful when the token must be fetched dynamically:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/data',
	headers: async () => {
		const token = await refreshToken();
		return {
			Authorization: `Bearer ${token}`
		};
	}
});
```

### Aborting a request

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/long-operation'
});

const promise = ajax.send();

// Cancel after 5 seconds
setTimeout(() => ajax.abort(), 5000);

try {
	const resp = await promise;
} catch (e) {
	console.log('Request was aborted');
} finally {
	ajax.destruct();
}
```

### Handling errors

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/data'
});

try {
	const resp = await ajax.send();

	if (resp.status !== 200) {
		throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
	}

	const data = await resp.json();
	console.log(data);
} catch (e) {
	console.error('Request failed:', e.message);
} finally {
	ajax.destruct();
}
```

### Blob response (downloading a file)

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/export.pdf',
	responseType: 'blob'
});

const resp = await ajax.send();
const blob = await resp.blob();
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'export.pdf';
a.click();

URL.revokeObjectURL(url);
ajax.destruct();
```

### Cross-domain request with credentials

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://other-domain.com/api/data',
	withCredentials: true
});

const resp = await ajax.send();
ajax.destruct();
```

### Custom query builder

Override how data objects are serialized to query strings:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/data',
	data: { filters: { status: 'active', role: 'admin' } },
	queryBuild(obj) {
		// Custom serialization logic
		return new URLSearchParams(obj).toString();
	}
});
```

## Usage inside Jodit editor

### `jodit.fetch()` — editor-level convenience method

The editor instance provides a `fetch()` method that wraps `Ajax`, shows a progress bar, and auto-destructs the request on editor destroy:

```js
const editor = Jodit.make('#editor');

const resp = await editor.fetch('https://example.com/api/data', {
	method: 'POST',
	data: { key: 'value' }
});

const data = await resp.json();
```

### Overriding default Ajax options

All requests inherit from `defaultAjaxOptions`. You can override them globally:

```js
const editor = Jodit.make('#editor', {
	defaultAjaxOptions: {
		headers: {
			Authorization: 'Bearer my-token',
			'X-REQUESTED-WITH': 'XMLHttpRequest'
		},
		withCredentials: true
	}
});
```

### Using Ajax directly inside a plugin

```js
Jodit.plugins.add('myPlugin', function (editor) {
	editor.registerButton({
		name: 'loadTemplate',
		exec: async () => {
			const ajax = new Jodit.modules.Ajax({
				url: '/api/templates/default'
			});

			try {
				const resp = await ajax.send();
				const data = await resp.json();
				editor.value = data.html;
			} catch (e) {
				editor.message.error('Failed to load template');
			} finally {
				ajax.destruct();
			}
		}
	});
});
```

### FileBrowser integration

The FileBrowser uses Ajax internally via its data provider. Each operation (list items, create folder, rename, delete, etc.) creates a new `Ajax` instance, sends the request, and destructs it after completion:

```js
Jodit.make('#editor', {
	filebrowser: {
		ajax: {
			url: 'https://example.com/api/files',
			method: 'POST',
			headers: {
				Authorization: 'Bearer my-token'
			},
			process(resp) {
				return resp;
			}
		},
		items: {
			url: 'https://example.com/api/files/list',
			data: { path: '/', source: 'default' }
		},
		create: {
			url: 'https://example.com/api/files/folder',
			data: {}
		}
	}
});
```

### Uploader integration

The Uploader also uses Ajax under the hood. It creates a custom `XMLHttpRequest` factory to track upload progress:

```js
Jodit.make('#editor', {
	uploader: {
		url: 'https://example.com/api/upload',
		method: 'POST',
		headers: {
			Authorization: 'Bearer my-token'
		},
		contentType(requestData) {
			// false = let browser set Content-Type with boundary for FormData
			return false;
		},
		isSuccess(resp) {
			return resp.success;
		},
		process(resp) {
			return {
				files: resp.data.files || [],
				path: resp.data.path,
				baseurl: resp.data.baseurl
			};
		}
	}
});
```

## SSE Streaming

The `stream()` method enables Server-Sent Events (SSE) streaming over `XMLHttpRequest`.
It reads `xhr.responseText` incrementally via `onprogress`, parses SSE `data:` lines,
and yields each event's data as a string through an `AsyncGenerator`.

### Basic SSE stream

```js
const ajax = new Jodit.modules.Ajax({
	method: 'POST',
	url: 'https://example.com/api/chat/stream',
	contentType: 'application/json',
	data: { prompt: 'Hello' }
});

for await (const data of ajax.stream()) {
	const event = JSON.parse(data);
	console.log(event);
}

ajax.destruct();
```

### Streaming AI responses into the editor

```js
Jodit.plugins.add('aiAssist', function (editor) {
	editor.registerButton({
		name: 'ai-generate',
		exec: async () => {
			const ajax = new Jodit.modules.Ajax({
				method: 'POST',
				url: '/api/ai/generate',
				contentType: 'application/json',
				data: { prompt: editor.getEditorValue() },
				headers: { Authorization: 'Bearer my-token' }
			});

			try {
				for await (const data of ajax.stream()) {
					const event = JSON.parse(data);

					if (event.type === 'token') {
						editor.s.insertHTML(event.text);
					}
				}
			} catch (e) {
				editor.message.error('Stream failed: ' + e.message);
			} finally {
				ajax.destruct();
			}
		}
	});
});
```

### Collecting all events then processing

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/stream',
	headers: { Authorization: 'Bearer token' }
});

const events = [];

for await (const data of ajax.stream()) {
	events.push(JSON.parse(data));
}

console.log('Received', events.length, 'events');
ajax.destruct();
```

### Early termination (break)

Breaking out of the `for await` loop automatically aborts the underlying XHR:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/stream'
});

for await (const data of ajax.stream()) {
	const event = JSON.parse(data);

	if (event.type === 'done') {
		break; // XHR is aborted automatically
	}
}

ajax.destruct();
```

### Aborting a stream externally

Call `destruct()` or `abort()` from outside to stop the stream — the generator will throw an error that can be caught:

```js
const ajax = new Jodit.modules.Ajax({
	url: 'https://example.com/api/stream'
});

// Abort after 10 seconds
const timer = setTimeout(() => ajax.destruct(), 10000);

try {
	for await (const data of ajax.stream()) {
		console.log(JSON.parse(data));
	}
} catch (e) {
	console.log('Stream stopped:', e.message);
} finally {
	clearTimeout(timer);
	ajax.destruct();
}
```

### Integration with AbortController

`AbortController` is a standard browser API for cancelling async operations. Ajax doesn't support it natively, but bridging them is straightforward — listen for the `abort` signal and call `ajax.abort()`:

```js
const { abort, isAbortError } = Jodit.modules.Helpers;

function createAjax(url, options, signal) {
	const ajax = new Jodit.modules.Ajax({ url, ...options });

	if (signal) {
		if (signal.aborted) {
			ajax.destruct();
			throw abort('Aborted');
		}

		signal.addEventListener('abort', () => ajax.abort(), { once: true });
	}

	return ajax;
}
```

Usage with a shared controller — e.g. cancel all pending streams from a "Stop" button:

```js
let controller = new AbortController();
let ajax;

try {
	ajax = createAjax(
		'/api/ai/generate',
		{
			method: 'POST',
			contentType: 'application/json',
			data: { prompt: 'Hello' }
		},
		controller.signal
	);

	for await (const data of ajax.stream()) {
		console.log(JSON.parse(data));
	}
} catch (e) {
	if (isAbortError(e)) {
		console.log('Stream was cancelled');
	} else {
		throw e;
	}
} finally {
	ajax?.destruct();
}
```

```js
// Cancel from anywhere
document.getElementById('stop-btn').addEventListener('click', () => {
	controller.abort();
	controller = new AbortController(); // reset for next use
});
```

The same approach works with `send()`:

```js
const { abort, isAbortError } = Jodit.modules.Helpers;

const controller = new AbortController();
let ajax;

try {
	ajax = createAjax('/api/data', {}, controller.signal);
	const resp = await ajax.send();
	const data = await resp.json();
	console.log(data);
} catch (e) {
	if (!isAbortError(e)) {
		throw e;
	}
} finally {
	ajax?.destruct();
}

// Cancel from anywhere:
controller.abort();
```

### SSE format details

The parser handles standard SSE protocol fields:

```
data: {"type":"start"}\n\n          → yields '{"type":"start"}'
data: line1\ndata: line2\n\n        → yields 'line1\nline2' (multi-line data joined with \n)
data:no-space\n\n                   → yields 'no-space' (space after colon is optional)
: this is a comment\n\n             → ignored
event: message\ndata: hello\n\n     → yields 'hello' (event/id/retry fields are ignored)
```

## Lifecycle and cleanup

Always call `destruct()` after the request completes (or when you no longer need it). This aborts any in-flight request and frees internal resources:

```js
const ajax = new Jodit.modules.Ajax({ url: '/api/data' });

try {
	const resp = await ajax.send();
	// ... use resp
} finally {
	ajax.destruct(); // always clean up
}
```

When using `jodit.fetch()`, cleanup is automatic — the Ajax instance is destructed when the promise settles or the editor is destroyed.

## Request log

`Ajax.log` keeps a ring buffer of the last 100 prepared requests. Useful for debugging:

```js
console.log(Jodit.modules.Ajax.log);
// [{ url: '...', method: 'get', data: {...} }, ...]
```
