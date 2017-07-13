import 'classlist-polyfill';
import 'promise-polyfill';


(function(e){
    e.matches || (e.matches = e['matchesSelector'] !== undefined ? e['matchesSelector'] : function (selector) {
            let matches = document.querySelectorAll(selector), th = this;
            return Array.prototype.some.call(matches, (e) => {
                return e === th;
            });
        });

})(Element.prototype);