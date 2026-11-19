import { createElement, useMemo } from '@wordpress/element';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

function SortIcon({ direction }) {
	if (direction === 'asc') {
		return createElement(ArrowUp, { size: 14, 'aria-hidden': true });
	}
	if (direction === 'desc') {
		return createElement(ArrowDown, { size: 14, 'aria-hidden': true });
	}
	return createElement(ArrowUpDown, { size: 14, 'aria-hidden': true });
}

export function Table({
	columns = [],
	rows = [],
	rowKey = (row) => row.id,
	loading = false,
	emptyTitle = 'No data',
	emptyDescription,
	emptyAction,
	sort,
	onSort,
	selectable = false,
	selectedKeys,
	onSelectionChange,
	getRowSelectable = () => true,
	onRowClick,
}) {
	const selected = selectedKeys ?? [];
	const allKeys = useMemo(
		() => rows.filter(getRowSelectable).map((r) => rowKey(r)),
		[rows, getRowSelectable, rowKey],
	);
	const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.includes(k));
	const someSelected = allKeys.some((k) => selected.includes(k)) && !allSelected;

	function toggleAll(next) {
		onSelectionChange?.(next ? [...allKeys] : []);
	}

	function toggleOne(key, next) {
		if (next) {
			onSelectionChange?.([...new Set([...selected, key])]);
		} else {
			onSelectionChange?.(selected.filter((k) => k !== key));
		}
	}

	function handleSort(col) {
		if (!col.sortable || !onSort) {
			return;
		}
		const key = col.key;
		if (!sort || sort.key !== key) {
			onSort({ key, direction: 'asc' });
			return;
		}
		onSort({ key, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
	}

	if (loading) {
		return createElement(
			'div',
			{ className: 'nk-ui-table-wrap is-loading' },
			createElement(
				'table',
				{ className: 'nk-ui-table' },
				createElement(
					'thead',
					null,
					createElement(
						'tr',
						null,
						columns.map((col) =>
							createElement('th', { key: col.key, scope: 'col' }, createElement(Skeleton, { height: 14, width: '60%' })),
						),
					),
				),
				createElement(
					'tbody',
					null,
					Array.from({ length: 5 }).map((_, i) =>
						createElement(
							'tr',
							{ key: i },
							columns.map((col) =>
								createElement(
									'td',
									{ key: col.key },
									createElement(Skeleton, { height: 12, width: col.key === columns[0]?.key ? '80%' : '50%' }),
								),
							),
						),
					),
				),
			),
		);
	}

	if (!rows.length) {
		return createElement(
			'div',
			{ className: 'nk-ui-table-empty' },
			createElement(EmptyState, { title: emptyTitle, description: emptyDescription, action: emptyAction }),
		);
	}

	return createElement(
		'div',
		{ className: 'nk-ui-table-wrap' },
		createElement(
			'table',
			{ className: 'nk-ui-table' },
			createElement(
				'thead',
				null,
				createElement(
					'tr',
					null,
					selectable
						? createElement(
								'th',
								{ scope: 'col', className: 'nk-ui-table-check' },
								createElement(Checkbox, {
									'aria-label': 'Select all rows',
									checked: allSelected,
									indeterminate: someSelected,
									onChange: toggleAll,
								}),
							)
						: null,
					columns.map((col) => {
						const active = sort?.key === col.key;
						const dir = active ? sort.direction : null;
						return createElement(
							'th',
							{
								key: col.key,
								scope: 'col',
								className: col.sortable ? 'is-sortable' : undefined,
								'aria-sort': active ? (dir === 'asc' ? 'ascending' : 'descending') : col.sortable ? 'none' : undefined,
							},
							col.sortable
								? createElement(
										'button',
										{
											type: 'button',
											className: 'nk-ui-table-sort',
											onClick: () => handleSort(col),
										},
										col.label,
										createElement(SortIcon, { direction: active ? dir : null }),
									)
								: col.label,
						);
					}),
				),
			),
			createElement(
				'tbody',
				null,
				rows.map((row) => {
					const key = rowKey(row);
					const canSelect = selectable && getRowSelectable(row);
					const isSelected = selected.includes(key);
					return createElement(
						'tr',
						{
							key: String(key),
							className: isSelected ? 'is-selected' : undefined,
							'data-label-map': columns.map((c) => c.label).join('|'),
							onClick: onRowClick ? () => onRowClick(row) : undefined,
							style: onRowClick ? { cursor: 'pointer' } : undefined,
						},
						selectable
							? createElement(
									'td',
									{
										className: 'nk-ui-table-check',
										'data-label': '',
										onClick: onRowClick ? (e) => e.stopPropagation() : undefined,
									},
									canSelect
										? createElement(Checkbox, {
												'aria-label': `Select row ${key}`,
												checked: isSelected,
												onChange: (v) => toggleOne(key, v),
											})
										: null,
								)
							: null,
						columns.map((col) =>
							createElement(
								'td',
								{
									key: col.key,
									'data-label': col.label,
								},
								col.render ? col.render(row, col) : row[col.key],
							),
						),
					);
				}),
			),
		),
		rows.map((row) => {
			const key = rowKey(row);
			return createElement(
				'article',
				{
					key: `card-${key}`,
					className: 'nk-ui-table-card',
					onClick: onRowClick ? () => onRowClick(row) : undefined,
					role: onRowClick ? 'button' : undefined,
					tabIndex: onRowClick ? 0 : undefined,
					onKeyDown: onRowClick
						? (e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									onRowClick(row);
								}
							}
						: undefined,
				},
				selectable && getRowSelectable(row)
					? createElement(
							'div',
							{ className: 'nk-ui-table-card-check' },
							createElement(Checkbox, {
								'aria-label': `Select row ${key}`,
								checked: selected.includes(key),
								onChange: (v) => toggleOne(key, v),
							}),
						)
					: null,
				columns.map((col) =>
					createElement(
						'div',
						{ key: col.key, className: 'nk-ui-table-card-row' },
						createElement('span', { className: 'nk-ui-table-card-label' }, col.label),
						createElement(
							'span',
							{ className: 'nk-ui-table-card-value' },
							col.render ? col.render(row, col) : row[col.key],
						),
					),
				),
			);
		}),
	);
}