import { createElement } from '@wordpress/element';

export function Card({ title, actions, footer, children, className = '', padding = true }) {
	return createElement(
		'section',
		{ className: ['nk-ui-card', padding ? 'has-padding' : '', className].filter(Boolean).join(' ') },
		title || actions
			? createElement(
					'header',
					{ className: 'nk-ui-card-header' },
					title ? createElement('h3', { className: 'nk-ui-card-title' }, title) : createElement('span'),
					actions ? createElement('div', { className: 'nk-ui-card-actions' }, actions) : null,
				)
			: null,
		createElement('div', { className: 'nk-ui-card-body' }, children),
		footer ? createElement('footer', { className: 'nk-ui-card-footer' }, footer) : null,
	);
}