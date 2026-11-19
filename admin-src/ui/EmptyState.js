import { createElement } from '@wordpress/element';

export function EmptyState({ icon: Icon, title, description, action }) {
	return createElement(
		'div',
		{ className: 'nk-ui-empty' },
		Icon ? createElement(Icon, { className: 'nk-ui-empty-icon', size: 40, 'aria-hidden': true }) : null,
		title ? createElement('h3', { className: 'nk-ui-empty-title' }, title) : null,
		description ? createElement('p', { className: 'nk-ui-empty-desc' }, description) : null,
		action ? createElement('div', { className: 'nk-ui-empty-action' }, action) : null,
	);
}