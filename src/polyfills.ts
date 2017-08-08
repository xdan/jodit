import 'classlist-polyfill';
// import 'promise-polyfill';


(function(e){
    e.matches || (e.matches = e['matchesSelector'] !== undefined ? e['matchesSelector'] : function (selector) {
            const matches = this.ownerDocument.querySelectorAll(selector), th = this;
            return Array.prototype.some.call(matches, (e) => {
                return e === th;
            });
        });

})(Element.prototype);