const storage = (<any>window);

storage.spyCols = {};

export function spy(context: any, fn: Function, key: string) {
	return (...attr: any[]) => {
		if (!storage.spyCols[key]) {
			storage.spyCols[key] = 0
		}

		storage.spyCols[key] += 1;
		return fn.call(context, ...attr);
	};
}
