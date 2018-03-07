chai.config.includeStack = true;

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


(function(e){
    e.matches || (e.matches = e['matchesSelector'] !== undefined ? e['matchesSelector'] : function (selector) {
        var matches = this.ownerDocument.querySelectorAll(selector), th = this;
        return Array.prototype.some.call(matches, function (e) {
            return e === th;
        });
    });

})(Element.prototype);

var expect = chai.expect;
var stuff = [];
var removeStuff = function () {
    stuff.forEach(function (elm) {
        elm && elm.parentNode && elm.parentNode.removeChild(elm);
        delete elm;
    });
    stuff.length = 0;
};
var box = document.createElement('div');
document.body.appendChild(box);
var getBox = function () {
    return box;
};
var appendTestArea = function (id, noput) {
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id', id || ('editor_' + (new Date()).getTime()));
    box.appendChild(textarea);
    !noput && stuff.push(textarea);
    return textarea;
};
var appendTestDiv = function (id, noput) {
    var textarea = document.createElement('div');
    textarea.setAttribute('id', id || ('editor_' + (new Date()).getTime()));
    box.appendChild(textarea);
    !noput && stuff.push(textarea);
    return textarea;
};

var trim = function (value) {
    return value.replace(/^[\s\r\t\n]+/g, '').replace(/[\s\r\t\n]+$/g, '')
};

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

var createPoint = function createPoint(x, y, color) {
    var div = document.createElement('div');
    div.setAttribute('style', 'position: absolute; z-index: 1000000000;width: 5px; height: 5px; background: ' + (color || 'red') + ';');
    div.style.left = parseInt(x, 10) + 'px'
    div.style.top = parseInt(y, 10) +'px'
    document.body.appendChild(div);
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft, width: rect.width, height: rect.height }
}

/**
 * innerHTML property for SVGElement
 * Copyright(c) 2010, Jeff Schiller
 *
 * Licensed under the Apache License, Version 2
 *
 * Works in a SVG document in Chrome 6+, Safari 5+, Firefox 4+ and IE9+.
 * Works in a HTML5 document in Chrome 7+, Firefox 4+ and IE9+.
 * Does not work in Opera since it doesn't support the SVGElement interface yet.
 *
 * I haven't decided on the best name for this property - thus the duplication.
 */

(function() {
    var serializeXML = function(node, output) {
        var nodeType = node.nodeType;
        if (nodeType == 3) { // TEXT nodes.
            // Replace special XML characters with their entities.
            output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'));
        } else if (nodeType == 1) { // ELEMENT nodes.
            // Serialize Element nodes.
            output.push('<', node.tagName);
            if (node.hasAttributes()) {
                var attrMap = node.attributes;
                for (var i = 0, len = attrMap.length; i < len; ++i) {
                    var attrNode = attrMap.item(i);
                    output.push(' ', attrNode.name, '=\'', attrNode.value, '\'');
                }
            }
            if (node.hasChildNodes()) {
                output.push('>');
                var childNodes = node.childNodes;
                for (var i = 0, len = childNodes.length; i < len; ++i) {
                    serializeXML(childNodes.item(i), output);
                }
                output.push('</', node.tagName, '>');
            } else {
                output.push('/>');
            }
        } else if (nodeType == 8) {
            // TODO(codedread): Replace special characters with XML entities?
            output.push('<!--', node.nodeValue, '-->');
        } else {
            // TODO: Handle CDATA nodes.
            // TODO: Handle ENTITY nodes.
            // TODO: Handle DOCUMENT nodes.
            throw 'Error serializing XML. Unhandled node of type: ' + nodeType;
        }
    }
// The innerHTML DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerHTML', {
        get: function() {
            var output = [];
            var childNode = this.firstChild;
            while (childNode) {
                serializeXML(childNode, output);
                childNode = childNode.nextSibling;
            }
            return output.join('');
        },
        set: function(markupText) {
            // Wipe out the current contents of the element.
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }

            try {
                // Parse the markup into valid nodes.
                var dXML = new DOMParser();
                dXML.async = false;
                // Wrap the markup into a SVG node to ensure parsing works.
                sXML = '<svg xmlns=\'http://www.w3.org/2000/svg\'>' + markupText + '</svg>';
                var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

                // Now take each node, import it and append to this element.
                var childNode = svgDocElement.firstChild;
                while(childNode) {
                    this.appendChild(this.ownerDocument.importNode(childNode, true));
                    childNode = childNode.nextSibling;
                }
            } catch(e) {
                throw new Error('Error parsing XML string');
            };
        }
    });

// The innerSVG DOM property for SVGElement.
    Object.defineProperty(SVGElement.prototype, 'innerSVG', {
        get: function() {
            return this.innerHTML;
        },
        set: function(markupText) {
            this.innerHTML = markupText;
        }
    });

})();
