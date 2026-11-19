import { createElement } from '@wordpress/element';

export function Badge({ children, variant = 'default', className = '' }) {
	const classes = ['nk-ui-badge', `is-${variant}`, className].filter(Boolean).join(' ');
	return createElement('span', { className: classes }, children);
}