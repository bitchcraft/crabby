// @flow
import { stringToCharArray } from 'utfstring';

export const SplitPatterns = {
	SENTENCES: /(.*?[.!?:;…]\s)/g,
	WORDS: /(\w*?\W+)/g,
};


/**
 * Clamps text to targetHeight using element for fitting
 *
 * @func clamp
 * @return {string} - clamped text
 */
const clamp = (partials: Array<string>, element: ?HTMLElement, {
	index = 1,
	mode = 'sentences',
	prefix,
	suffix,
	targetHeight,
}: {
	index?: number,
	mode?: string,
	prefix?: ?string,
	suffix?: ?string,
	targetHeight: number,
} = {}): ?string => {

	if (!element || !partials.length) return prefix;
	suffix = suffix || '';

	const textElement = element.firstChild;
	if (!textElement || !(textElement instanceof HTMLElement)) return prefix;

	const prefixCandidate = (prefix || '') + partials[0];
	textElement.innerHTML = prefixCandidate + suffix;

	const parentHeight = element.offsetHeight;

	// if candidate is too long
	if (parentHeight > targetHeight || index > 500) {
		if (mode === 'sentences') {
			// split down to word boundary
			mode = 'words';
			partials = partials[0].split(SplitPatterns.WORDS).filter(c => Boolean(c));
		} else if (mode === 'words') {
			// split down to characters
			mode = 'characters';
			partials = stringToCharArray(partials[0]); // UTF safe character splitting
		} else {
			// return the current prefix
			return typeof prefix === 'string' ? prefix + suffix : null;
		}

		return clamp(partials, element, {
			index: index + 1,
			mode,
			prefix,
			suffix,
			targetHeight,
		});
	}

	// if candidate is definitely not too long and potentially too short
	return clamp(partials.slice(1), element, {
		index: index + 1,
		mode,
		prefix: prefixCandidate,
		suffix,
		targetHeight,
	});
};

export default clamp;
