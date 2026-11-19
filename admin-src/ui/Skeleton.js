import { createElement } from '@wordpress/element';

export function Skeleton({ className = '', width, height, circle }) {
	const style = {};
	if (width != null) style.width = typeof width === 'number' ? `${width}px` : width;
	if (height != null) style.height = typeof height === 'number' ? `${height}px` : height;
	return createElement('span', {
		className: ['nk-ui-skeleton', circle ? 'is-circle' : '', className].filter(Boolean).join(' '),
		style,
		'aria-hidden': true,
	});
}