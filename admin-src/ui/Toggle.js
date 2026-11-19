import { createElement, useId } from '@wordpress/element';
import { FieldWrap } from './FieldWrap';

export function Toggle({ label, help, error, checked, onChange, disabled, id: idProp }) {
	const autoId = useId();
	const id = idProp || `nk-toggle-${autoId}`;
	return createElement(
		FieldWrap,
		{ id, label, help, error },
		() =>
			createElement(
				'button',
				{
					id,
					type: 'button',
					role: 'switch',
					className: 'nk-ui-toggle' + (checked ? ' is-on' : ''),
					'aria-checked': !!checked,
					disabled,
					onClick: () => onChange?.(!checked),
				},
				createElement('span', { className: 'nk-ui-toggle-thumb', 'aria-hidden': true }),
			),
	);
}