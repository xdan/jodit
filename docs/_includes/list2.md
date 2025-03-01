<textarea id="list2"></textarea>
<script>
Jodit.defaultOptions.controls.myBtn1 = {
	icon: 'source',
	exec: editor => {
		editor.toggleMode();
	}
};

Jodit.defaultOptions.controls.myBtn2 = {
	icon: 'brush',
	popup: editor => {
		const div = editor.create.element('div');
		const input = editor.create.element('input');
		input.type = 'color';
		input.value = '#ff0000';
		input.onblur = () => {
			editor.selection.applyStyle({ color: input.value });
		};
		div.appendChild(input);
		return div;
	}
};

Jodit.make('#list2', {
	buttons: [
		{
			name: 'list',
			list: ['myBtn1', 'myBtn2']
		}
	]
});
</script>
<br/>
