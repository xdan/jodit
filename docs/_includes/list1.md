<textarea id="list1"></textarea>
<script>
Jodit.make('#list1', {
  toolbarAdaptive: false,
  buttons: [
		{
			name: 'list',
			list: ['One', 'Two', 'Three'],
			exec: (editor, current, btn) => {
				const value = btn.control.args[0];
				editor.selection.insertHTML(value);
			}
		}
	]
});
</script>
<br/>
