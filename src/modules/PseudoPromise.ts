const REJECT = 0;
const RESOLVE = 1;

export default class PseudoPromise {


    private handlers = {};

    isFulfilled = null;

    private currentParameter = null;
    private currentContext = null;

    constructor(processCallback: Function) {
        this.handlers[REJECT] = [];
        this.handlers[RESOLVE] = [];

        let promise = this;

        let tempCallback = function (store, parameter) {
            if (promise.isFulfilled !== null) {
                return;
            }

            promise.isFulfilled = store;
            promise.currentParameter = parameter;
            promise.currentContext = this;

            promise.__fire_handlers(store);
        };

        try {
            processCallback(function (parameter) {
                tempCallback.call(this, RESOLVE, parameter);
            }, function (parameter) {
                tempCallback.call(this, REJECT, parameter);
            });
        } catch(e) {
            tempCallback.call(this, REJECT, e);
        }
    }

    private __fire_handlers(store) {
        if (store !== this.isFulfilled) {
            return;
        }

        this.handlers[store].forEach((handler) => {
            let tempResult = handler.call(this.currentContext, this.currentParameter);
            if (tempResult !== undefined) {
                this.currentParameter = tempResult;
            }
        })
    }

    then(onFulfilled: Function|null, onRejected?: Function){
        if (onFulfilled) {
            this.handlers[RESOLVE].push(onFulfilled);
        }

        if (onRejected) {
            this.catch(onRejected);
        }

        this.__fire_handlers(RESOLVE);
        return this;
    }

    catch(onRejected: Function) {
        this.handlers[REJECT].push(onRejected);

        this.__fire_handlers(REJECT);
        return this;
    }
}