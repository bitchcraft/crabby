// @flow
import { stringToCharArray } from 'utfstring';
import type { testFunction } from './createTargetCondition';

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

	let words = '';
	let slicedPartials = null;
	let half = 0;
	let reference = partials;

	if (partials.length !== 1) {
		half = Math.floor(partials.length / 2);
		slicedPartials = partials.slice(0, half);
		for (let i = 0; i < slicedPartials.length; i++) {
			words += slicedPartials[i];
		}
		reference = slicedPartials;
	} else {
		for (let i = 0; i < partials.length; i++) {
			words += partials[i];
		}
	}

	const prefixCandidate = (prefix || '') + words;
	const remainingHeight = test(prefixCandidate + suffix);

	// if candidate is too long
	if (remainingHeight < 0 || mode === 'trimming') {

		if (mode === 'sentences') {
			if (reference.length === 1) {
				mode = 'words';
				partials = reference[0].split(SplitPatterns.WORDS).filter(c => Boolean(c));
			} else {
				partials = reference;
			}
		} else if (mode === 'words') {
			if (reference.length === 1) {
				// split down to characters
				mode = 'characters';
				partials = stringToCharArray(reference[0]); // UTF safe character splitting
			} else {
				partials = reference;
			}
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
	return clamp(partials.slice(half), test, {
		mode,
		prefix: prefixCandidate,
		suffix,
	});
};

export default clamp;
