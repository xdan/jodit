<textarea id="example2"></textarea>
<script>
Jodit.make('#example2', {
  toolbarAdaptive: false,
  buttons: [
    {
     	name: 'button',
			iconURL: 'https://xdsoft.net/favicon.png',
			popup: jodit => {
				const div = jodit.create.element('div');
				div.textContent = 'Hello world';
				return div;
			}
    }
  ]
});
</script>
<br/>
