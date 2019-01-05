/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */


/**
 * Controll caches lifetime.
 */
class Cache {
    compare = (a: any[], b: any[]) => a.length === b.length && a.every((v, i) => v === b[i]);

    public set(val: any, args: any[], context: any, key: symbol): any {
        if (context[key]) {
            const result = context[key].filter(([value, cachedArgs]: any[]) => this.compare(cachedArgs, args));

            if (!result.length) {
                context[key].push([val, args])
            }
        } else {
            context[key] = [[val, args]];
        }

        return val;
    }


    public get(context: any, key: symbol, args: any[]): any {
        const caches = context[key] || [];
        return caches.filter(([value, cachedArgs]: any[]) => this.compare(cachedArgs, args))[0];
    }
}

/**
 * Cache decorator
 */
export function cache<T>() {
    const store: Cache = new Cache();

    return (target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
        const symbolKey = Symbol(`__cache_key__${typeof target === 'function'? '__static:': ''}${propertyKey}`);

        if (propertyDescriptor.set) {
            throw new Error('Setter function can\'t be memozied.');
        }

        const memoizedFn = (context: any, callback: () => any, args: any): T => {
            const cachedValue = store.get(context, symbolKey, args);

            if (cachedValue && cachedValue.length) {
                return cachedValue[0];
            }

            return store.set(callback.apply(context, args), args, context, symbolKey);
        };

        if (propertyDescriptor.get) {
            const oldCallback = propertyDescriptor.get;

            propertyDescriptor.get = function () {
                return memoizedFn(this, oldCallback, []);
            };

            return;
        }

        if (typeof propertyDescriptor.value !== 'function') {
            throw new Error(`Cacheable only a function.`);
        }

        const oldCallback = propertyDescriptor.value;

        propertyDescriptor.value = function (args: any) {
            return memoizedFn(this, oldCallback, args);
        };
    };
};