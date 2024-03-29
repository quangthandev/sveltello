import type { BlotConstructor } from 'parchment';
import Quill from 'quill';

const InlineBlot = Quill.import('blots/block') as BlotConstructor;

class LoadingImage extends InlineBlot {
	cache: object = {};

	static create(src: string) {
		const node = super.create(src);
		// if (src) return node;

		const image = document.createElement('img');
		image.setAttribute('src', src);
		node.appendChild(image);
		return node;
	}
	deleteAt(index: number, length: number) {
		super.deleteAt(index, length);
		this.cache = {};
	}
	static value(domNode: HTMLElement) {
		const { src, custom } = domNode.dataset;
		return { src, custom };
	}
}

LoadingImage.blotName = 'imageBlot';
LoadingImage.className = 'quill-image-uploading';
LoadingImage.tagName = 'span';
Quill.register({ 'formats/imageBlot': LoadingImage });

export default LoadingImage;
