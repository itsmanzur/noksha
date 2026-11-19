import { createElement } from '@wordpress/element';

export function FieldWrap({ id, label, help, error, required, children }) {
	const helpId = help ? `${id}-help` : undefined;
	const errId = error ? `${id}-error` : undefined;
	const describedBy = [errId, helpId].filter(Boolean).join(' ') || undefined;

	return createElement(
		'div',
		{ className: 'nk-ui-field' + (error ? ' is-error' : '') },
		label
			? createElement(
					'label',
					{ className: 'nk-ui-label', htmlFor: id },
					label,
					required ? createElement('span', { className: 'nk-ui-required', 'aria-hidden': true }, ' *') : null,
				)
			: null,
		describedBy ? createElement('div', { className: 'nk-ui-field-control' }, children(describedBy)) : children(undefined),
		error
			? createElement('p', { id: errId, className: 'nk-ui-field-error', role: 'alert' }, error)
			: null,
		help && !error
			? createElement('p', { id: helpId, className: 'nk-ui-field-help' }, help)
			: null,
	);
}