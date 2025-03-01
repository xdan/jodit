<textarea id="example1"></textarea>
<script>
Jodit.make('#example1', {
  toolbarAdaptive: false,
  buttons: [
    {
      icon: 'source',
      exec: editor => {
        editor.toggleMode();
      }
    }
  ]
});
</script>
