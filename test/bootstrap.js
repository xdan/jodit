(typeof window.chai !== 'undefined') && (chai.config.includeStack = true);

var oldI18n = Jodit.prototype.i18n;
var oldAjaxSender = Jodit.modules.Ajax.prototype.send;

function SyncPromise(workfunction) {
    var self = this, args, resolve = false;

    workfunction(function () {
        args = arguments;
        resolve = true;
    }, function () {
        args = arguments;
    });

    this.then = function (callback) {
        if (resolve) {
            callback.apply(self, args);
        }
        return self;
    };

    this.catch = function (callback) {
        if (!resolve) {
            callback.apply(self, args);
        }
        return self;
    };
}

SyncPromise.all = function (promises) {
    return new SyncPromise(function (resolve, reject) {
        var resolved = 0;

        promises.forEach(function (promise) {
            promise
                .then(function () {
                    resolved++;
                })
        });

        resolved === promises.length ? resolve() : reject();
    });
};

if ((typeof window.chai !== 'undefined')) {
    window.Promise = SyncPromise;
    window.FormData = function () {
        this.data = {};
        this.append = function (key, value) {
            this.data[key] = value;
        };
        this.get = function (key) {
            return this.data[key];
        };
    };
    Jodit.modules.Ajax.prototype.send = function (data) {
        var ajax = this, action = ajax.options.data.action;

        if (!action && ajax.options.data.get) {
            action = ajax.options.data.get('action');
        }

        if (action === undefined && this.options.url && this.options.url.match(/action=/)) {
            var actioExec = /action=([\w]+)/.exec(this.options.url)
            action = actioExec[1];
        }

        return new SyncPromise(function (resolve, reject) {
            switch (action) {
                case 'fileUpload':
                    var file = ajax.options.data.get('files[0]');
                    resolve({
                        "success": true,
                        "time": "2018-03-31 23:38:54",
                        "data": {
                            "baseurl": "https://xdsoft.net/jodit/files/",
                            "messages": [],
                            "files": [
                                file.name
                            ],
                            "isImages": [
                                /\.(png|jpg|gif)$/.test(file.name)
                            ],
                            "code": 220
                        }
                    });
                    break;
                case 'files':
                    resolve({
                        "success":true,
                        "time":"2018-03-15 12:49:49",
                        "data": {
                            "sources": {
                                "default": {
                                    "baseurl":"https:\/\/xdsoft.net\/jodit\/files\/",
                                    "path":"",
                                    "files":[
                                        {
                                            "file":"1966051_524428741092238_1051008806888563137_o.jpg",
                                            "thumb":"_thumbs\/1966051_524428741092238_1051008806888563137_o.jpg",
                                            "changed":"03\/15\/2018 12:40 PM",
                                            "size":"126.59kB",
                                            "isImage": true,
                                        },
                                        {
                                            "file":"images.jpg","thumb":"_thumbs\/images.jpg",
                                            "changed":"01\/15\/2018 12:40 PM",
                                            "size":"6.84kB",
                                            "isImage": true,
                                        },
                                        {
                                            "file":"ibanez-s520-443140.jpg",
                                            "thumb":"_thumbs\/ibanez-s520-443140.jpg",
                                            "changed":"04\/15\/2018 12:40 PM",
                                            "size":"18.72kB",
                                            "isImage": true,
                                        },
                                        {
                                            "file":"test.txt",
                                            "thumb":"_thumbs\/test.txt.png",
                                            "changed":"05\/15\/2018 12:40 PM",
                                            "size":"18.72kB",
                                            "isImage": false,
                                        },
                                    ]
                                }
                            },
                            "code":220
                        }
                    });
                    break;
                case 'folders':
                    resolve({"success":true,"time":"2018-03-15 12:49:49","data":{"sources":{"default":{"baseurl":"https:\/\/xdsoft.net\/jodit\/files\/","path":"","folders":[".","ceicom","test"]}},"code":220}});
                    break;
                case 'permissions':
                    resolve({"success":true,"time":"2018-03-15 12:49:49","data":{"permissions":{"allowFiles":true,"allowFileMove":true,"allowFileUpload":true,"allowFileUploadRemote":true,"allowFileRemove":true,"allowFileRename":true,"allowFolders":true,"allowFolderMove":true,"allowFolderCreate":true,"allowFolderRemove":true,"allowFolderRename":true,"allowImageResize":true,"allowImageCrop":true},"code":220}});
                    break;
                case 'fileUploadRemote':
                    resolve({"success":true,"time":"2018-03-15 12:45:03","data":{"newfilename":"artio.jpg","baseurl":"https:\/\/xdsoft.net\/jodit\/files\/","code":220}});
                    break;
                case 'getLocalFileByUrl':
                    switch (ajax.options.data.url) {
                        case location.protocol + '//' + location.host + '/tests/artio.jpg':
                        case location.protocol + '//' + location.host + '/test/tests/artio.jpg':
                        case location.protocol + '//' + location.host + '/jodit/test/tests/artio.jpg':
                        case 'https://xdsoft.net/jodit/files/th.jpg':
                            resolve({"success":true,"time":"2018-03-15 12:55:00","data":{"path":"","name":"th.jpg","source":"default","code":220}});
                            break;
                        default:
                            resolve({"success":false,"time":"2018-03-15 12:08:54","data":{"messages":["File does not exist or is above the root of the connector"],"code":424}});
                            break;
                    }
                    break;
                default:
                    break;
            }
        });
    };
}

var i18nkeys = [];
Jodit.prototype.i18n = function (key) {
    i18nkeys.indexOf(key) === -1 && key.indexOf('<svg') === -1 && i18nkeys.push(key);
    return oldI18n.apply(this, arguments);
};

Jodit.defaultOptions.observer.timeout = 0;
if (Jodit.defaultOptions.cleanHTML) {
    Jodit.defaultOptions.cleanHTML.timeout = 0;
    Jodit.defaultOptions.cleanHTML.fillEmptyParagraph = false;
}
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

var expect = typeof chai !== 'undefined' ? chai.expect : function () {};
var stuff = [];
var removeStuff = function () {
    Object.keys(Jodit.instances).forEach(function (key) {
        Jodit.instances[key].destruct();
    });
    stuff.forEach(function (elm) {
        elm && elm.parentNode && elm.parentNode.removeChild(elm);
        delete elm;
    });
    stuff.length = 0;
    [].slice.call(document.querySelectorAll('.jodit.jodit_dialog_box.active')).forEach(function (dialog) {
        simulateEvent('close_dialog', 0, dialog)
    });
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
var sortStyles = function (matches) {
    var styles = matches
        .replace(/&quot;/g, "'")
        .replace(/"/g, "'")
        .split(';');

    styles = styles.map(trim).filter(function (elm) {
        return elm.length;
    })

    var border = null;
    styles = styles
        .map(function (elm) {
            var keyvalue = elm.split(':').map(trim);

            if (keyvalue[0] === 'border-image') {
                return null;
            }

            if (/rgb\(/.test(keyvalue[1])) {
                keyvalue[1] = keyvalue[1].replace(/rgb\([^\)]+\)/, function (match) {
                    return Jodit.modules.Helpers.normalizeColor(match)
                });
            }

            if (keyvalue[0].match(/^border$/)) {
                keyvalue[1] = keyvalue[1].split(/[\s]+/)
            }

            if (keyvalue[0].match(/^border-(style|width|color)/)) {
                if (border === null) {
                    border = keyvalue;
                    keyvalue[0] = 'border'
                    keyvalue[1] = [keyvalue[1]]
                } else {
                    border[1].push(keyvalue[1]);
                    return null;
                }
            }

            if (/font-family/i.test(keyvalue[0])) {
                keyvalue[1] = keyvalue[1].split(',').map(Jodit.modules.Helpers.trim).join(',');
            }

            if (/%$/.test(keyvalue[1])) {
                var fl = parseFloat(keyvalue[1]),
                    nt = parseInt(keyvalue[1], 10);
                if (fl - nt > 0) {
                    keyvalue[1] = toFixedWithoutRounding(fl, 2) + '%'
                }
            }

            return keyvalue;
        })
        .filter(function (a) {
            return a !== null
        })
        .map(function (a) {
            return  a.map(function (item) {
                return typeof item === 'string' ? item : item.sort().join(' ');
            }).join(':');
        })
        .sort(function (a, b) {
            return  (a < b) ? -1 : (a > b) ? 1 : 0;
        });

    return styles.join(';')
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
                matches[2] = sortStyles(matches[2])
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

    return html.replace(/&nbsp;/g, ' ');
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

// Files
var FileImage = function () {
    return {
        name: 'logo.gif',
        dataURI: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        type : 'image/gif'
    };
};
// Files
var FileXLS = function () {
    return {
        name: 'file.xls',
        type : 'application/xls'
    };
};
if ((typeof window.chai !== 'undefined')) {
    window.FileReader = function () {
        var self = this;
        self.result = null;
        /**
         *
         * @param {FileImage} file
         */
        self.readAsDataURL = function (file) {
            self.result = file.dataURI;
            self.onloadend && self.onloadend();
        }
    };
}

