export const keepNames = new Map<Function, string>();

export const getClassName = (obj: object): string => {
	if (keepNames.has(obj.constructor)) {
		return keepNames.get(obj.constructor) as string;
	}

	if (obj.constructor.name) {
		return obj.constructor.name;
	}

	const regex = new RegExp(/^\s*function\s*(\S*)\s*\(/);

	const res = obj.constructor.toString().match(regex);

	return res ? res[1] : '';
};
