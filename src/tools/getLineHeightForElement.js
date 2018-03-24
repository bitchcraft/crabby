// @flow
import { StringConverters } from '@bitchcraft/ocake';

const getNumberFromPxValue = pxValue => parseInt(pxValue.replace('px', ''));
const getPropertyValue = (cs, prop) => (
	Object.prototype.hasOwnProperty.call(cs, prop)
		? cs[StringConverters.toKebabCase(prop)]
		: cs.getPropertyValue(StringConverters.toKebabCase(prop))
);


export default function getLineHeightForElement(element: HTMLElement) {
	const computedStyle = getComputedStyle(element);
	const lineHeight = getNumberFromPxValue(getPropertyValue(computedStyle, 'lineHeight'));

	if (Number.isNaN(lineHeight)) {
		const fontSize = getNumberFromPxValue(getPropertyValue(computedStyle, 'fontSize'));
		return fontSize * 1.2;
	}

	return lineHeight;
}
