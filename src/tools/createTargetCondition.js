// @flow
import getRelativeContentHeight from './getRelativeContentHeight';

export type testFunction = (candidate: string) => number;

const MAX_ITERATIONS = 500;
const iterations = new WeakMap();


/**
 * provides test function
 *
 * @param  {HTMLElement} element -
 * @param  {number}      lines   - number of target lines
 * @return {number}              - remaining vertical space in pixels
 */
export default function createTargetCondition(element: HTMLElement, lines: number): ?testFunction {
	const textElement = element.firstChild;
	if (!textElement || !(textElement instanceof HTMLElement)) return null;
	iterations.set(element, 0);

	return (candidate: string) => {
		const operations = iterations.get(element) || 0;
		if (operations >= MAX_ITERATIONS) return 0;
		iterations.set(element, operations + 1);
		textElement.innerHTML = candidate;
		return getRelativeContentHeight(element, lines);
	};
}
