import { createElement, useEffect, useId, useMemo, useRef, useState } from '@wordpress/element';
import { ChevronDown } from 'lucide-react';
import { FieldWrap } from './FieldWrap';

export function Combobox({
	options = [],
	value,
	onChange,
	placeholder = '',
	label,
	help,
	error,
	getOptionLabel = (o) => o?.label ?? String(o),
	getOptionValue = (o) => o?.value ?? o,
}) {
	const autoId = useId();
	const listId = `${autoId}-listbox`;
	const inputId = `nk-combobox-${autoId}`;
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const rootRef = useRef(null);

	const selected = useMemo(
		() => options.find((o) => getOptionValue(o) === value),
		[options, value, getOptionValue],
	);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) {
			return options;
		}
		return options.filter((o) => getOptionLabel(o).toLowerCase().includes(q));
	}, [options, query, getOptionLabel]);

	useEffect(() => {
		function onDoc(e) {
			if (rootRef.current && !rootRef.current.contains(e.target)) {
				setOpen(false);
			}
		}
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, []);

	function pick(option) {
		onChange?.(getOptionValue(option), option);
		setQuery('');
		setOpen(false);
	}

	return createElement(
		FieldWrap,
		{ id: inputId, label, help, error },
		(describedBy) =>
			createElement(
				'div',
				{
					ref: rootRef,
					className: 'nk-ui-combobox' + (open ? ' is-open' : '') + (error ? ' is-error' : ''),
				},
				createElement(
					'div',
					{ className: 'nk-ui-combobox-control' },
					createElement('input', {
						id: inputId,
						type: 'text',
						className: 'nk-ui-input nk-ui-combobox-input',
						role: 'combobox',
						'aria-autocomplete': 'list',
						'aria-expanded': open,
						'aria-controls': listId,
						'aria-activedescendant': undefined,
						'aria-invalid': error ? true : undefined,
						'aria-describedby': describedBy,
						placeholder: selected && !open ? getOptionLabel(selected) : placeholder,
						value: open ? query : selected ? getOptionLabel(selected) : query,
						onChange: (e) => {
							setQuery(e.target.value);
							if (!open) {
								setOpen(true);
							}
						},
						onFocus: () => setOpen(true),
						onKeyDown: (e) => {
							if (e.key === 'Escape') {
								setOpen(false);
								setQuery('');
							}
						},
					}),
					createElement(ChevronDown, { className: 'nk-ui-combobox-chevron', size: 16, 'aria-hidden': true }),
				),
				open
					? createElement(
							'ul',
							{
								id: listId,
								role: 'listbox',
								className: 'nk-ui-combobox-list',
							},
							filtered.length
								? filtered.map((opt) => {
										const val = getOptionValue(opt);
										const active = val === value;
										return createElement(
											'li',
											{
												key: String(val),
												role: 'option',
												'aria-selected': active,
												className: 'nk-ui-combobox-option' + (active ? ' is-active' : ''),
												onMouseDown: (e) => {
													e.preventDefault();
													pick(opt);
												},
											},
											getOptionLabel(opt),
										);
									})
								: createElement('li', { className: 'nk-ui-combobox-empty', role: 'presentation' }, 'No results'),
						)
					: null,
			),
	);
}