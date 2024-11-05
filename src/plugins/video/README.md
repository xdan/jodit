# Video Insertion

Allows embedding YouTube videos inside the editor.

## How to Use

1. Click the video button.
2. Paste the YouTube URL, e.g., `https://www.youtube.com/watch?v=9bZkp7q19f0&ab_channel=officialpsy`.
3. Click the insert button.
4. The video will be embedded in the editor as an `iframe` tag.

## Configuration

```js
Jodit.make('#editor', {
	buttons: 'video',
	video: {
		defaultWidth: 560, // Default: 400
		defaultHeight: 315, // Default: 345
		parseUrlToVideoEmbed: (url, size) => {
			// Add your own video provider
			if (/https:\/\/sitename\.com/.test(url)) {
				return `<iframe width="${size.width}" height="${size.height}" src="${url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
			}

			return Jodit.modules.Helpers.convertMediaUrlToVideoEmbed(url, size);
		}
	},
	controls: {
		video: {
			tooltip: 'Insert video'
		}
	}
});
```
