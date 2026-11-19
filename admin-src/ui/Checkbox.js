import { createElement, useId } from '@wordpress/element';
import { Check } from 'lucide-react';
import { FieldWrap } from './FieldWrap';

export function Checkbox({ label, help, error, checked, onChange, disabled, id: idProp, indeterminate }) {
	const autoId = useId();
	const id = idProp || `nk-checkbox-${autoId}`;
	return createElement(
		'div',
		{ className: 'nk-ui-checkbox-wrap' + (error ? ' is-error' : '') },
		createElement(
			'label',
			{ className: 'nk-ui-checkbox-label', htmlFor: id },
			createElement(
				'span',
				{ className: 'nk-ui-checkbox-box' + (checked ? ' is-checked' : '') + (indeterminate ? ' is-indeterminate' : '') },
				checked || indeterminate
					? createElement(Check, { size: 14, className: 'nk-ui-checkbox-icon', 'aria-hidden': true })
					: null,
				createElement('input', {
					id,
					type: 'checkbox',
					className: 'nk-ui-checkbox-input',
					checked: !!checked,
					disabled,
					ref: (el) => {
						if (el) {
							el.indeterminate = !!indeterminate;
						}
					},
					onChange: (e) => onChange?.(e.target.checked, e),
					'aria-invalid': error ? true : undefined,
				}),
			),
			label ? createElement('span', { className: 'nk-ui-checkbox-text' }, label) : null,
		),
		error ? createElement('p', { className: 'nk-ui-field-error', role: 'alert' }, error) : null,
		help && !error ? createElement('p', { className: 'nk-ui-field-help' }, help) : null,
	);
}