// @flow
import { stringToCharArray } from 'utfstring';
import type { testFunction } from './targetCondition';

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
const clamp = (partials: Array<string>, test: ?testFunction, {
	mode = 'sentences',
	prefix,
	suffix,
}: {
	mode?: string,
	prefix?: ?string,
	suffix?: ?string,
} = {}): ?string => {

	if (!test || !partials.length) return prefix;
	suffix = suffix || '';

	const prefixCandidate = (prefix || '') + partials[0];
	const remainingHeight = test(prefixCandidate + suffix);

	// if candidate is too long
	if (remainingHeight < 0 || mode === 'trimming') {
		if (mode === 'sentences') {
			// split down to word boundary
			mode = 'words';
			partials = partials[0].split(SplitPatterns.WORDS).filter(c => Boolean(c));
		} else if (mode === 'words') {
			// split down to characters
			mode = 'characters';
			partials = stringToCharArray(partials[0]); // UTF safe character splitting
		} else if (prefix && remainingHeight < 0) {
			// delete last character in prefix
			const utfSafePrefix = stringToCharArray(prefix);
			utfSafePrefix.splice(-1);
			prefix = utfSafePrefix.join('');
			mode = 'trimming';
		} else {
			// return the current prefix
			return typeof prefix === 'string' ? prefix + suffix : null;
		}

		return clamp(partials, test, {
			mode,
			prefix,
			suffix,
		});
	}

	// if candidate is definitely not too long and potentially too short
	return clamp(partials.slice(1), test, {
		mode,
		prefix: prefixCandidate,
		suffix,
	});
};

export default clamp;
