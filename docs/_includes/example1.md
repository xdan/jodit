<textarea id="example1"></textarea>
<script>
Jodit.make('#example1', {
  toolbarAdaptive: false,
  buttons: [
    {
      icon: 'source',
      mode: Jodit.constants.MODE_SPLIT,
      exec: editor => {
        editor.toggleMode();
      }
    }
  ]
});
</script>
