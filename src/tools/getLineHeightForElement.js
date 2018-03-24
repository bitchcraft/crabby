// @flow
import { convertKeys, StringConverters } from '@bitchcraft/ocake';

const toCamelCase = payload => convertKeys(payload, StringConverters.toCamelCase);
const getNumberFromPxValue = pxValue => parseInt(pxValue.replace('px', ''));


export default function getLineHeightForElement(element: HTMLElement) {
	const textElementStyles = toCamelCase(getComputedStyle(element));
	const lineHeight = getNumberFromPxValue(textElementStyles.lineHeight);

	if (Number.isNaN(lineHeight)) {
		const fontSize = getNumberFromPxValue(textElementStyles.fontSize);
		return fontSize * 1.2;
	}

	return lineHeight;
}
