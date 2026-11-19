import { createElement, useState } from '@wordpress/element';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Input } from './Input';

export function SecretField({
	label,
	help,
	value,
	onChange,
	onSave,
	onReplace,
	onRemove,
	saved = false,
	lockedByConstant = false,
	placeholder,
	saveLabel = 'Save',
	replaceLabel = 'Replace',
	removeLabel = 'Remove',
	savedLabel = 'Saved',
}) {
	const [visible, setVisible] = useState(false);
	const [draft, setDraft] = useState('');

	const masked = saved && !draft && !visible;
	const displayValue = lockedByConstant ? '••••••••' : masked ? '••••••••' : draft || value || '';

	if (lockedByConstant) {
		return createElement(
			'div',
			{ className: 'nk-ui-secret-field is-locked' },
			createElement(Input, {
				label,
				help: help || 'Defined in wp-config.php and cannot be changed here.',
				value: displayValue,
				readOnly: true,
			}),
			createElement('span', { className: 'nk-ui-secret-saved' }, savedLabel),
		);
	}

	return createElement(
		'div',
		{ className: 'nk-ui-secret-field' },
		createElement(Input, {
			label,
			help,
			type: visible ? 'text' : 'password',
			value: displayValue,
			placeholder,
			onChange: (e) => {
				setDraft(e.target.value);
				onChange?.(e.target.value);
			},
			readOnly: saved && !draft,
		}),
		createElement(
			'div',
			{ className: 'nk-ui-secret-actions' },
			createElement(IconButton, {
				icon: visible ? EyeOff : Eye,
				'aria-label': visible ? 'Hide secret' : 'Show secret',
				onClick: () => setVisible((v) => !v),
			}),
			saved && !draft
				? createElement(
						'div',
						{ className: 'nk-ui-secret-saved-row' },
						createElement('span', { className: 'nk-ui-secret-saved' }, savedLabel),
						createElement(
							Button,
							{
								variant: 'secondary',
								size: 'sm',
								onClick: () => {
									onReplace?.();
									setDraft('');
									setVisible(true);
								},
							},
							replaceLabel,
						),
						createElement(Button, { variant: 'ghost', size: 'sm', onClick: () => onRemove?.() }, removeLabel),
					)
				: createElement(
						Button,
						{
							variant: 'primary',
							size: 'sm',
							onClick: () => onSave?.(draft || value),
							disabled: !draft && !value,
						},
						saveLabel,
					),
		),
	);
}