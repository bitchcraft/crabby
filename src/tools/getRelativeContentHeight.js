// @flow
import getLineHeightForElement from './getLineHeightForElement';
import memoize from 'lodash.memoize';

memoize.Cache = WeakMap;
const getLineHeight = memoize(getLineHeightForElement);


/**
 * gets relative content height for element
 *
 * @param  {HTMLElement} element - element with height
 * @param  {lines}       number  - number of lines (target)
 * @return {number}              - parent height - content height
 */
export default function getRelativeContentHeight(element: HTMLElement, lines: number) {
	const lineHeight = getLineHeight(element);
	const targetHeight = lineHeight * lines;
	return targetHeight - element.offsetHeight;
}
