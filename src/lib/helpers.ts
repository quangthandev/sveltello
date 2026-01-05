// Reference: https://github.com/bramus/view-transitions-demos/blob/main/src/pagination/shared/util.js

export function transitionHelper({
	skipTransition = false,
	types = [],
	update
}: {
	skipTransition?: boolean;
	types?: StartViewTransitionOptions['types'];
	update: ViewTransitionUpdateCallback;
}) {
	const unsupported = (error: string) => {
		const updateCallbackDone = Promise.resolve(update()).then(() => {});

		return {
			ready: Promise.reject(Error(error)),
			updateCallbackDone,
			finished: updateCallbackDone,
			skipTransition: () => {},
			types
		};
	};

	if (skipTransition) {
		return unsupported('skipTransition was set to true');
	}

	if (!document.startViewTransition) {
		return unsupported('Same-Document View Transitions are not supported in this browser');
	}

	if (!ViewTransition || !('types' in ViewTransition.prototype)) {
		return unsupported('View Transitions with types are not supported in this browser');
	}

	const transition = document.startViewTransition({
		update,
		types
	});

	return transition;
}
