describe('Test editor indent plugin', function () {

  it(`should indent multi-line selection of various child elements only on 1st 2 lines`, function () {
    var editor = new Jodit(appendTestArea());
    editor.value = `
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. <i>Quonam, inquit, modo?</i> <span>prima quaeque bene</span>
    </p>
    <blockquote cite="http://loripsum.net">
      Nec enim absolvi beata vita sapientis neque ad exitum perduci poterit, si prima quaeque bene ab eo consulta atque facta ipsius oblivione obruentur.
    </blockquote>
    <pre>
      Tum ille: Tu autem cum ipse tantum librorum habeas, quos hic tandem requiris?
    </pre>
    `;
    
    const children = editor.container.querySelector('.jodit_wysiwyg').children;
    const el1 = children[0];
    const el1Child = el1.querySelector('i');
    const el2 = children[1];
    const el3 = children[2];

    var sel = editor.editorWindow.getSelection(),
        range = editor.editorDocument.createRange();

    range.setStart(el1Child, 0);
    range.setEnd(el2, 1);

    sel.removeAllRanges();
    sel.addRange(range);
    
    editor.execCommand('indent');
    
    expect(el1.style.marginLeft).to.be.equal('10px');
    expect(el2.style.marginLeft).to.be.equal('10px');
    expect(el3.style.marginLeft).to.be.equal('');
  });

  it(`should indent multi-line selection of "dd" and "dt" child elements only on 1st 2 dt/dd groups`, function () {
    
    var editor = new Jodit(appendTestArea());
    editor.value = `
    <dl>
      <dt><dfn>Falli igitur possumus.</dfn></dt>
      <dd>Quid enim ab antiquis ex eo genere, quod ad disserendum valet, praetermissum est?</dd>
      
      <dt><dfn>Scrupulum, inquam, abeunti;</dfn></dt>
      <dd>Scio enim esse quosdam, qui quavis lingua philosophari possint;</dd>
      
      <dt><dfn>Poterat autem inpune;</dfn></dt>
      <dd>Tum ille: Tu autem cum ipse tantum librorum habeas, quos hic tandem requiris?</dd>
    </dl>
    `;
    
    const children = editor.container.querySelectorAll('.jodit_wysiwyg dt,.jodit_wysiwyg dd');
    
    const el1 = children[0];
    const el2 = children[1];
    const el3 = children[2];
    const el4 = children[3];
    const el5 = children[4];
    const el6 = children[5];

    var sel = editor.editorWindow.getSelection(),
        range = editor.editorDocument.createRange();

    range.setStart(el1, 0);
    range.setEnd(el4, 1);

    sel.removeAllRanges();
    sel.addRange(range);
    
    editor.execCommand('indent');
    
    expect(el1.style.marginLeft).to.be.equal('10px');
    expect(el2.style.marginLeft).to.be.equal('10px');
    expect(el3.style.marginLeft).to.be.equal('10px');
    expect(el4.style.marginLeft).to.be.equal('10px');
    expect(el5.style.marginLeft).to.be.equal('');
    expect(el6.style.marginLeft).to.be.equal('');
    
  });
  
  afterEach(() => {
    // console.log(stuff)
    removeStuff();
  });

})