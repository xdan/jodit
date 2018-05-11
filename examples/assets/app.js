var examples = document.getElementById('examples');
var main_container = document.getElementById('main_container');
var links = {
    'index.html': 'All options',
    'arabic.lang.html': 'Arabic Language',
    'custom-toolbar.html': 'Custom toolbar',
    'fullsize.html': 'Fullsize mode',
    'inline-mode.html': 'Inline mode',
    'custom-icons.html': 'Custom Icons / Font Awesome',
    'oneinstance.html': 'One Instance',
};

if (examples) {
    Object.keys(links).forEach(function (page) {
        var child = document.createElement('li');
        var a = document.createElement('a');
        child.appendChild(a);

        a.setAttribute('href', page);
        a.innerHTML = links[page];

        examples.appendChild(child);
    });
}

[].slice.call(document.getElementsByTagName('pre')).forEach(function (pre) {
    if (pre.firstChild.nodeName === 'CODE') {
        pre = pre.firstChild;
    }

    var lines = pre.innerHTML.split('\n');
    var first =  lines[1].length - lines[1].replace(/^[\s]+/, '').length;

    pre.innerHTML = lines
        .map(function (line) {
            var newline = line.substr(first);
            return newline.match(/[^\s]/) ? newline : null;
        })
        .filter(function (a) {
            return a;
        })
        .join('\n');
});

if (!document.getElementsByTagName('h1').length && main_container) {
    var h1 = document.createElement('h1');
    h1.innerHTML = document.title;
    main_container.insertBefore(h1, main_container.firstChild)
}