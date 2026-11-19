import { createElement } from '@wordpress/element';

export function IconButton({ icon: Icon, 'aria-label': ariaLabel, size = 'md', className = '', disabled, ...rest }) {
	if (!ariaLabel) {
		throw new Error('IconButton requires aria-label');
	}
	const classes = ['nk-ui-icon-btn', `is-${size}`, className].filter(Boolean).join(' ');
	return createElement(
		'button',
		{ type: 'button', className: classes, 'aria-label': ariaLabel, disabled, ...rest },
		createElement(Icon, { size: size === 'sm' ? 16 : size === 'lg' ? 22 : 18, 'aria-hidden': true }),
	);
}