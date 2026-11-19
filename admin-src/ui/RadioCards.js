import { createElement, useId } from '@wordpress/element';

export function RadioCards({ name, value, onChange, options = [], legend, className = '' }) {
	const gid = useId();
	const groupName = name || `nk-radio-${gid}`;
	return createElement(
		'fieldset',
		{ className: ['nk-ui-radio-cards', className].filter(Boolean).join(' '), role: 'radiogroup' },
		legend ? createElement('legend', { className: 'nk-ui-radio-cards-legend' }, legend) : null,
		createElement(
			'div',
			{ className: 'nk-ui-radio-cards-grid' },
			options.map((opt) => {
				const id = `${groupName}-${opt.value}`;
				const checked = value === opt.value;
				return createElement(
					'label',
					{
						key: String(opt.value),
						htmlFor: id,
						className: 'nk-ui-radio-card' + (checked ? ' is-checked' : '') + (opt.disabled ? ' is-disabled' : ''),
					},
					createElement('input', {
						id,
						type: 'radio',
						name: groupName,
						value: opt.value,
						checked,
						disabled: opt.disabled,
						className: 'nk-ui-radio-card-input',
						onChange: () => onChange?.(opt.value, opt),
					}),
					opt.icon
						? createElement('span', { className: 'nk-ui-radio-card-icon', 'aria-hidden': true }, opt.icon)
						: null,
					createElement('span', { className: 'nk-ui-radio-card-title' }, opt.label),
					opt.description
						? createElement('span', { className: 'nk-ui-radio-card-desc' }, opt.description)
						: null,
				);
			}),
		),
	);
}