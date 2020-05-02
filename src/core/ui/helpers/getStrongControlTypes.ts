import {
	Buttons,
	Controls,
	IControlTypeStrong,
	IDictionary
} from '../../../types';
import { getControlType } from './getControlType';
import { Config } from '../../../config';
import { isArray } from '../../helpers/checker';

export function getStrongControlTypes(
	items: Buttons | IDictionary<string>,
	controls?: Controls
): IControlTypeStrong[] {
	const elements = isArray(items)
		? items
		: Object.keys(items).map(key => {
				const value = items[key] || {};

				return {
					name: key,
					...value
				} as IControlTypeStrong;
		  });

	return elements.map(item =>
		getControlType(item, controls || Config.defaultOptions.controls)
	);
}
