# Getting Started

## via npm

```shell
npm install jodit
```

## via yarn

```shell
yarn add jodit
```

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
