import { createElement, useId } from '@wordpress/element';
import { FieldWrap } from './FieldWrap';

export function Select({ label, help, error, id: idProp, className = '', required, children, ...rest }) {
	const autoId = useId();
	const id = idProp || `nk-select-${autoId}`;
	return createElement(FieldWrap, { id, label, help, error, required }, (describedBy) =>
		createElement(
			'select',
			{
				id,
				className: ['nk-ui-select', className].filter(Boolean).join(' '),
				'aria-invalid': error ? true : undefined,
				'aria-describedby': describedBy,
				required,
				...rest,
			},
			children,
		),
	);
}