import { CallbackFunction, IDictionary } from '../../../types';

export class Collection<T> {
    private __list: T[] = [];

    get length(): number {
        return this.__list.length;
    }

    forEach(callback: (item: T, index: number) => void) {
        this.__list.forEach(callback);
    }

    all(): T[] {
        return this.__list;
    }

    add(item: T) {
        if (!this.__list.includes(item)) {
            this.__list.push(item);
            this.fire('add', item);
            this.fire('change');
        }
    }

    remove(item: T) {
        const index = this.__list.indexOf(item);

        if (index !== -1) {
            this.__list.splice(index, 1);
            this.fire('remove', item);
            this.fire('change');
        }
    }

    clear() {
        this.fire('beforeClear');
        this.__list.length = 0;
        this.fire('change');
    }

    private __onEvents: IDictionary<CallbackFunction[]> = {};

    on(event: string | string[], callback: CallbackFunction): Collection<T> {
        if (Array.isArray(event)) {
            event.map((e) => this.on(e, callback));
            return this;
        }

        if (!this.__onEvents[event]) {
            this.__onEvents[event] = [];
        }

        this.__onEvents[event].push(callback);

        return this;
    }

    private __lockEvent: IDictionary<boolean> = {};

    private fire(event: string, ...attr: any[]) {
			try {
				if (!this.__lockEvent[event] && this.__onEvents[event]) {
					this.__lockEvent[event] = true;
					this.__onEvents[event].forEach(clb => clb.call(this, ...attr));
				}
			} catch {} finally {
				this.__lockEvent[event] = false;
			}
		}
}
