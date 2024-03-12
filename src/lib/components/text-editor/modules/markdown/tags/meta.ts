export default (tags: string[]) => {
	return {
		applyHtmlTags: tags.map((tag) => tag.toLowerCase())
	};
};
