/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

const REJECT = 0;
const RESOLVE = 1;

export class PseudoPromise {


    private handlers: {'0': Function[], '1': Function[]} = {'0': [], '1': []};

    isFulfilled = null;

    private currentParameter = null;
    private currentContext = null;

    constructor(processCallback: Function) {

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

    private __fire_handlers(store: number) {
        if (store !== this.isFulfilled || !this.handlers[store].length) {
            return;
        }

        do {
            const handler: Function = this.handlers[store].shift();
            let tempResult;

            try {
                tempResult = handler.call(this.currentContext, this.currentParameter);
            } catch(e) {
                tempResult = e;
                return this.__fire_handlers(REJECT);
            }

            if (tempResult !== undefined) {
                this.currentParameter = tempResult;
            }

        } while(this.handlers[store].length);
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