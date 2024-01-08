# Getting Started

via npm

```shell
npm install jodit
```

via yarn

```shell
yarn add jodit
```

cdnjs

```html
<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.1/es2021/jodit.min.css"
/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jodit/4.0.1/es2021/jodit.min.js"></script>
```

unpkg

```html
<link
	rel="stylesheet"
	href="https://unpkg.com/jodit@4.0.1/es2021/jodit.min.css"
/>
<script src="https://unpkg.com/jodit@4.0.1/es2021/jodit.min.js"></script>
```

Self-hosted · Download files

```html
<link rel="stylesheet" href="build/es2021/jodit.min.css" />
<script src="build/es2021/jodit.min.js"></script>
```

Usage

```html
<textarea id="editor"></textarea>
<script>
	const editor = Jodit.make('#editor', {
		buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol']
	});
</script>
```
