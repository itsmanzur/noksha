import { createElement, useId } from '@wordpress/element';
import { FieldWrap } from './FieldWrap';

export function Input({ label, help, error, id: idProp, className = '', required, ...rest }) {
	const autoId = useId();
	const id = idProp || `nk-input-${autoId}`;
	return createElement(FieldWrap, { id, label, help, error, required }, (describedBy) =>
		createElement('input', {
			id,
			className: ['nk-ui-input', className].filter(Boolean).join(' '),
			'aria-invalid': error ? true : undefined,
			'aria-describedby': describedBy,
			required,
			...rest,
		}),
	);
}