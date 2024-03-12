import type { Options, TagPattern } from '../types';

class AbstractTag {
	_getCustomPatternOrDefault(
		options: Options,
		tagName: string,
		defaultPattern: TagPattern
	): TagPattern {
		return options.tags && options.tags[tagName] && options.tags[tagName].pattern
			? options.tags[tagName].pattern
			: defaultPattern;
	}

	_getActiveTagsWithoutIgnore(tags: string[], ignoreTags: string[]) {
		if (Array.isArray(ignoreTags)) {
			return tags.reduce<string[]>((allowTags, tag) => {
				if (!ignoreTags.includes(tag)) {
					allowTags.push(tag.toLowerCase());
				}
				return allowTags;
			}, []);
		}
		return tags;
	}
}

export default AbstractTag;
