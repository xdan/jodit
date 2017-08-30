Jodit.defaultOptions.observer.timeout = 0;
Jodit.defaultOptions.useAceEditor = false;
Jodit.defaultOptions.language = 'en';
// Jodit.defaultOptions.iframe = true; // try uncomment sometime
Jodit.defaultOptions.iframeCSSLinks.push('/app.css');
Jodit.defaultOptions.iframeStyle += "* {\
    -webkit-box-sizing: border-box;\
    -moz-box-sizing: border-box;\
    box-sizing: border-box;\
}\
td,th {\
    padding: 2px 5px;\
    vertical-align: top;\
}";

if (String.prototype.repeat === undefined) {
    String.prototype.repeat = function (count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            result.push(this);
        }
        return result.join('');
    };
}


var expect = chai.expect;
var stuff = [];
var removeStuff = function () {
    stuff.forEach(function (elm) {
        elm && elm.parentNode && elm.parentNode.removeChild(elm);
        delete elm;
    })
    stuff.length = 0;
};
var box = document.createElement('div');
document.body.appendChild(box);
var getBox = function () {
    return box;
}
var appendTestArea = function (id, noput) {
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id', id || ('editor_' + (new Date()).getTime()));
    box.appendChild(textarea);
    !noput && stuff.push(textarea);
    return textarea;
}

var trim = function (value) {
    return value.replace(/^[\s\r\t\n]+/g, '').replace(/[\s\r\t\n]+$/g, '')
}

function toFixedWithoutRounding (value, precision) {
    var factorError = Math.pow(10, 14);
    var factorTruncate = Math.pow(10, 14 - precision);
    var factorDecimal = Math.pow(10, precision);
    return Math.floor(Math.floor(value * factorError + 1) / factorTruncate) / factorDecimal;
}
var sortAtrtibutes = function (html) {
    var tag = /<([^>]+)>/g;
    var reg = /([a-z_\-]+)[\s]*=[\s]*"([^"]*)"/i, matches, tags = [];

    while (tagmatch = tag.exec(html)) {
        attrs = [];

        var newtag = tagmatch[0];

        do {
            matches = reg.exec(newtag);
            if (!matches) {
                break;
            }

            if (matches[1].toLowerCase() === 'style') {
                var styles = matches[2].split(';');
                styles = styles.map(trim).filter(function (elm) {
                    return elm.length;
                }).sort(function (a, b) {
                    return  (a < b) ? -1 : (a > b) ? 1 : 0;
                });

                styles = styles.map(function (elm) {
                    var keyvalue = elm.split(':').map(trim);

                    if (/%$/.test(keyvalue[1])) {
                        var fl = parseFloat(keyvalue[1]),
                            nt = parseInt(keyvalue[1], 10);
                        if (fl - nt > 0) {
                            keyvalue[1] = toFixedWithoutRounding(fl, 2) + '%'
                        }
                    }
                    return keyvalue.join(':');
                })

                matches[2] = styles.join(';')
            }

            if (matches[1].toLowerCase() !== 'unselectable') {
                attrs.push({
                    name: matches[1].toLowerCase(),
                    value: matches[2],
                });

                newtag = newtag.replace(matches[0], 'attribute:'  + attrs.length);
            } else {
                newtag = newtag.replace(' ' + matches[0], '');
            }

        } while(matches);

        attrs.sort(function (a, b) {
            return  (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        })

        attrs.forEach(function (elm, i) {
            newtag = newtag.replace('attribute:'  + (i + 1), elm.name + '="' + elm.value + '"');
        });

        tags.push({
            name: tagmatch[0],
            value: newtag,
        });
    }

    tags.forEach(function (elm, i) {
        html = html.replace(elm.name, elm.value);
    });

    return html;
}

/**
 *
 * @param type
 * @param keyCodeArg
 * @param element
 * @param options
 */
var simulateEvent = function (type, keyCodeArg, element, options) {
    var evt = (element.ownerDocument || document).createEvent('HTMLEvents')
    evt.initEvent(type, true, true);
    evt.keyCode = keyCodeArg;
    evt.which = keyCodeArg;
    if (options) {
        options(evt);
    }

    if (type.match(/^mouse/)) {
        ['pageX', 'pageY', 'clientX', 'clientY'].forEach(function (key) {
            if (evt[key] === undefined) {
                evt[key] = 0;
            }
        })
    }

    element.dispatchEvent(evt);
}

var setCursor = function (elm, inEnd) {
    var range = document.createRange();
    range.selectNodeContents(elm);
    range.collapse(!inEnd);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

var createPoint = function createPoint(x, y) {
    var div = document.createElement('div');
    div.setAttribute('style', 'position: absolute; z-index: 100000;width: 5px; height: 5px; background: red;');
    div.style.left = x +'px'
    div.style.top = y +'px'
    document.body.appendChild(div);
}