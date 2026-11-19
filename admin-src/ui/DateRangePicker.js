import { createElement, useEffect, useMemo, useState } from '@wordpress/element';
import { Button } from './Button';
import { Input } from './Input';

const PRESETS = [
	{ id: 'today', label: 'Today' },
	{ id: '7d', label: '7 days' },
	{ id: '30d', label: '30 days' },
	{ id: 'month', label: 'This month' },
	{ id: 'custom', label: 'Custom' },
];

function startOfDay(d) {
	const x = new Date(d);
	x.setHours(0, 0, 0, 0);
	return x;
}

function endOfDay(d) {
	const x = new Date(d);
	x.setHours(23, 59, 59, 999);
	return x;
}

function resolvePreset(preset) {
	const now = new Date();
	const todayStart = startOfDay(now);
	if (preset === 'all') {
		return { from: null, to: null };
	}
	if (preset === 'today') {
		return { from: todayStart, to: endOfDay(now) };
	}
	if (preset === '7d') {
		const from = new Date(todayStart);
		from.setDate(from.getDate() - 6);
		return { from, to: endOfDay(now) };
	}
	if (preset === '30d') {
		const from = new Date(todayStart);
		from.setDate(from.getDate() - 29);
		return { from, to: endOfDay(now) };
	}
	if (preset === 'month') {
		const from = new Date(now.getFullYear(), now.getMonth(), 1);
		return { from, to: endOfDay(now) };
	}
	return null;
}

function toInputDate(d) {
	if (!d) {
		return '';
	}
	const x = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(x.getTime())) {
		return '';
	}
	const p = (n) => String(n).padStart(2, '0');
	return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

function formatShort(d) {
	if (!d) {
		return '';
	}
	const x = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(x.getTime())) {
		return '';
	}
	return x.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function DateRangePicker({ value, onChange, presets = PRESETS, className = '' }) {
	const hasCustom = presets.some((p) => p.id === 'custom');
	const [mode, setMode] = useState(value?.preset || presets[0]?.id || '7d');

	useEffect(() => {
		if (value?.preset && value.preset !== mode) {
			setMode(value.preset);
		}
	}, [value?.preset]); // eslint-disable-line react-hooks/exhaustive-deps -- sync external preset only

	const range = useMemo(() => {
		if (mode === 'all') {
			return { from: null, to: null };
		}
		if (value?.from && value?.to) {
			return value;
		}
		const resolved = resolvePreset(mode === 'custom' ? '7d' : mode);
		return resolved || { from: null, to: null };
	}, [value, mode]);

	const showInputs = hasCustom && mode === 'custom';
	const summary =
		!showInputs && mode !== 'all' && range.from && range.to
			? `${formatShort(range.from)} – ${formatShort(range.to)}`
			: '';

	function applyPreset(id) {
		setMode(id);
		if (id === 'custom') {
			const fallback = resolvePreset('7d') || range;
			onChange?.({
				preset: 'custom',
				from: range.from || fallback.from,
				to: range.to || fallback.to,
			});
			return;
		}
		if (id === 'all') {
			onChange?.({ preset: 'all', from: null, to: null });
			return;
		}
		const next = resolvePreset(id);
		onChange?.({ preset: id, ...next });
	}

	function setFrom(v) {
		const from = v ? startOfDay(v) : null;
		onChange?.({ preset: 'custom', from, to: range.to });
		setMode('custom');
	}

	function setTo(v) {
		const to = v ? endOfDay(v) : null;
		onChange?.({ preset: 'custom', from: range.from, to });
		setMode('custom');
	}

	return createElement(
		'div',
		{ className: ['nk-ui-date-range', className].filter(Boolean).join(' ') },
		createElement(
			'div',
			{ className: 'nk-ui-date-range-presets', role: 'group', 'aria-label': 'Date presets' },
			presets.map((p) =>
				createElement(
					Button,
					{
						key: p.id,
						size: 'sm',
						variant: mode === p.id ? 'primary' : 'ghost',
						className: mode === p.id ? 'is-active' : '',
						onClick: () => applyPreset(p.id),
					},
					p.label,
				),
			),
		),
		summary
			? createElement('span', { className: 'nk-ui-date-range-summary' }, summary)
			: null,
		showInputs
			? createElement(
					'div',
					{ className: 'nk-ui-date-range-inputs' },
					createElement(Input, {
						label: 'From',
						type: 'date',
						value: toInputDate(value?.from ?? range.from),
						onChange: (e) => setFrom(e.target.value),
					}),
					createElement(Input, {
						label: 'To',
						type: 'date',
						value: toInputDate(value?.to ?? range.to),
						onChange: (e) => setTo(e.target.value),
					}),
				)
			: null,
	);
}
