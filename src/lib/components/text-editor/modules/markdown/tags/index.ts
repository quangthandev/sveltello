import Heading from './headings/index';
import Blockquote from './blockquote/index';
import BlockquoteFulltext from './blockquote/fulltext';
import Bold from './bold/index';
import CheckBoxChecked from './checkbox/fulltext-checked';
import CheckBoxUnchecked from './checkbox/fulltext-unchecked';
import InlineCode from './inlinecode/index';
import Italics from './italics/index';
import Link from './link/index';
import LinkFullText from './link/fulltext';
import ListOfNumberFulltext from './listn/fulltext';
import ListOfBulletFulltext from './listb/fulltext';
import Codeblock from './codeblock/index';
import CodeblockFullText from './codeblock/fulltext';
import Strikethrough from './strikethrough/index';
import type Quill from 'quill';
import type { Options, Tag } from '../types';

class TagsOperators {
	quillJS: Quill;
	supportInlineTags: Tag[];
	supportfullTextTags: Tag[];
	tags: Tag[];
	fullTextTags: Tag[];

	constructor(quillJS: Quill, options: Options = { tags: {} }) {
		this.quillJS = quillJS;
		this.getOperatorsAll.bind(this);
		this.supportInlineTags = [
			new Heading(this.quillJS, options).getAction(),
			new Blockquote(this.quillJS, options).getAction(),
			new Bold(this.quillJS, options).getAction(),
			new Codeblock(this.quillJS, options).getAction(),
			new InlineCode(this.quillJS, options).getAction(),
			new Strikethrough(this.quillJS, options).getAction(),
			new Italics(this.quillJS, options).getAction(),
			new Link(this.quillJS, options).getAction()
		];

		this.supportfullTextTags = [
			new Heading(this.quillJS, options).getAction(),
			new CheckBoxChecked(this.quillJS, options).getAction(),
			new CheckBoxUnchecked(this.quillJS, options).getAction(),
			new ListOfNumberFulltext(this.quillJS, options).getAction(),
			new ListOfBulletFulltext(this.quillJS, options).getAction(),
			new BlockquoteFulltext(this.quillJS, options).getAction(),
			new CodeblockFullText(this.quillJS, options).getAction(),
			new Bold(this.quillJS, options).getAction(),
			new LinkFullText(this.quillJS, options).getAction(),
			new InlineCode(this.quillJS, options).getAction(),
			new Strikethrough(this.quillJS, options).getAction(),
			new Italics(this.quillJS, options).getAction()
		];

		this.tags = [...this.supportInlineTags];
		this.fullTextTags = [...this.supportfullTextTags];
	}

	getOperatorsAll() {
		return this.tags;
	}

	getFullTextOperatorsAll() {
		return this.fullTextTags;
	}
}

export default TagsOperators;
