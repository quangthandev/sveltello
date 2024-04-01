// Reference: https://github.com/NoelOConnell/quill-image-uploader

import type Quill from 'quill';
import type { Range } from 'quill/core/selection';
import type { Op } from 'quill/core';
import type Toolbar from 'quill/modules/toolbar';

type Options = {
	upload: (file: File) => Promise<string>;
	blotName: string;
};

class ImageUploader {
	private range: Range | null;
	private placeholderDelta: {
		ops: Op[];
	} | null;
	private fileHolder: HTMLInputElement | null = null;

	constructor(
		public quill: Quill,
		private options: Options
	) {
		this.quill = quill;
		this.options = options;
		this.range = null;
		this.placeholderDelta = null;

		if (typeof this.options.upload !== 'function')
			console.warn('[Missing config] upload function that returns a promise is required');

		const toolbar = this.quill.getModule('toolbar') as Toolbar | null;
		if (toolbar) {
			toolbar.addHandler('image', this.selectLocalImage.bind(this));
		}

		this.handleDrop = this.handleDrop.bind(this);
		this.handlePaste = this.handlePaste.bind(this);

		this.quill.root.addEventListener('drop', this.handleDrop, false);
		this.quill.root.addEventListener('paste', this.handlePaste, false);
	}

	selectLocalImage() {
		this.quill.focus();
		this.range = this.quill.getSelection();
		this.fileHolder = document.createElement('input');
		this.fileHolder.setAttribute('type', 'file');
		this.fileHolder.setAttribute('accept', 'image/*');
		this.fileHolder.setAttribute('style', 'visibility:hidden');

		this.fileHolder.onchange = this.fileChanged.bind(this);

		document.body.appendChild(this.fileHolder);

		this.fileHolder.click();

		window.requestAnimationFrame(() => {
			this.fileHolder && document.body.removeChild(this.fileHolder);
		});
	}

	handleDrop(event: DragEvent) {
		if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
			event.stopPropagation();
			event.preventDefault();
			if (document.caretRangeFromPoint) {
				const selection = document.getSelection();
				const range = document.caretRangeFromPoint(event.clientX, event.clientY);
				if (selection && range) {
					selection.setBaseAndExtent(
						range.startContainer,
						range.startOffset,
						range.startContainer,
						range.startOffset
					);
				}
			} else {
				const selection = document.getSelection();
				// @ts-expect-error
				const range = document.caretPositionFromPoint(event.clientX, event.clientY);
				if (selection && range) {
					selection.setBaseAndExtent(
						range.offsetNode,
						range.offset,
						range.offsetNode,
						range.offset
					);
				}
			}

			this.quill.focus();
			this.range = this.quill.getSelection();
			const file = event.dataTransfer.files[0];

			setTimeout(() => {
				this.quill.focus();
				this.range = this.quill.getSelection();
				this.readAndUploadFile(file);
			}, 0);
		}
	}

	handlePaste(event: ClipboardEvent) {
		// @ts-expect-error
		const clipboard = event.clipboardData || window.clipboardData;

		// IE 11 is .files other browsers are .items
		if (clipboard && (clipboard.items || clipboard.files)) {
			const items = clipboard.items || clipboard.files;
			const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;

			for (let i = 0; i < items.length; i++) {
				if (IMAGE_MIME_REGEX.test(items[i].type)) {
					const file = items[i].getAsFile ? items[i].getAsFile() : items[i];

					if (file) {
						this.quill.focus();
						this.range = this.quill.getSelection();
						event.preventDefault();
						setTimeout(() => {
							this.quill.focus();
							this.range = this.quill.getSelection();
							this.readAndUploadFile(file);
						}, 0);
					}
				}
			}
		}
	}

	readAndUploadFile(file: File) {
		let isUploadReject = false;

		const fileReader = new FileReader();

		fileReader.addEventListener(
			'load',
			() => {
				if (!isUploadReject) {
					const base64ImageSrc = fileReader.result;
					this.insertBase64Image(base64ImageSrc as string);
				}
			},
			false
		);

		if (file) {
			fileReader.readAsDataURL(file);
		}

		this.options.upload(file).then(
			(imageUrl) => {
				this.insertToEditor(imageUrl);
			},
			(error) => {
				isUploadReject = true;
				this.removeBase64Image();
				console.warn(error);
			}
		);
	}

	fileChanged() {
		if (!this.fileHolder?.files) return;

		const file = this.fileHolder.files[0];
		this.readAndUploadFile(file);
	}

	insertBase64Image(url: string) {
		const range = this.range;

		if (!range) return;

		this.placeholderDelta = this.quill.insertEmbed(range.index, this.options.blotName, url, 'user');
	}

	insertToEditor(url: string) {
		const range = this.range;
		const lengthToDelete = this.calculatePlaceholderInsertLength();
		if (!range || !lengthToDelete) return;

		// Delete the placeholder image
		this.quill.deleteText(range.index, lengthToDelete, 'user');
		// Insert the server saved image
		this.quill.insertEmbed(range.index, 'image', url, 'user');

		range.index++;
		this.quill.setSelection(range, 'user');
	}

	// The length of the insert delta from insertBase64Image can vary depending on what part of the line the insert occurs
	calculatePlaceholderInsertLength() {
		return this.placeholderDelta?.ops.reduce((accumulator, deltaOperation) => {
			if (Object.prototype.hasOwnProperty.call(deltaOperation, 'insert')) accumulator++;

			return accumulator;
		}, 0);
	}

	removeBase64Image() {
		const range = this.range;
		const lengthToDelete = this.calculatePlaceholderInsertLength();

		if (!range || !lengthToDelete) return;

		this.quill.deleteText(range.index, lengthToDelete, 'user');
	}
}

export default ImageUploader;
