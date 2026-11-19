import { createElement, useId } from '@wordpress/element';
import { FieldWrap } from './FieldWrap';

export function Textarea({ label, help, error, id: idProp, className = '', required, rows = 4, ...rest }) {
	const autoId = useId();
	const id = idProp || `nk-textarea-${autoId}`;
	return createElement(FieldWrap, { id, label, help, error, required }, (describedBy) =>
		createElement('textarea', {
			id,
			rows,
			className: ['nk-ui-textarea', className].filter(Boolean).join(' '),
			'aria-invalid': error ? true : undefined,
			'aria-describedby': describedBy,
			required,
			...rest,
		}),
	);
}