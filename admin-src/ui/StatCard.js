import { createElement, useMemo } from '@wordpress/element';

function Sparkline({ data = [], width = 72, height = 24 }) {
	const points = useMemo(() => {
		if (!data.length) {
			return '';
		}
		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min || 1;
		return data
			.map((v, i) => {
				const x = (i / Math.max(data.length - 1, 1)) * width;
				const y = height - ((v - min) / span) * height;
				return `${x},${y}`;
			})
			.join(' ');
	}, [data, width, height]);

	if (!data.length) {
		return null;
	}

	return createElement(
		'svg',
		{
			className: 'nk-ui-stat-sparkline',
			width,
			height,
			viewBox: `0 0 ${width} ${height}`,
			'aria-hidden': true,
		},
		createElement('polyline', { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, points }),
	);
}

export function StatCard({ label, value, delta, sparkline, className = '' }) {
	const deltaNum = delta != null ? Number(delta) : null;
	const deltaClass =
		deltaNum == null ? '' : deltaNum > 0 ? 'is-up' : deltaNum < 0 ? 'is-down' : 'is-flat';
	return createElement(
		'div',
		{ className: ['nk-ui-stat-card', className].filter(Boolean).join(' ') },
		createElement(
			'div',
			{ className: 'nk-ui-stat-top' },
			createElement('span', { className: 'nk-ui-stat-label' }, label),
			sparkline ? createElement(Sparkline, { data: sparkline }) : null,
		),
		createElement('div', { className: 'nk-ui-stat-value' }, value),
		deltaNum != null
			? createElement(
					'span',
					{ className: ['nk-ui-stat-delta', deltaClass].filter(Boolean).join(' ') },
					deltaNum > 0 ? '+' : '',
					deltaNum,
					'%',
				)
			: null,
	);
}