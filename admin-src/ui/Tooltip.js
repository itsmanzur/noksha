import { createElement, useId, useState } from '@wordpress/element';

export function Tooltip({ content, children, placement = 'top' }) {
	const id = useId();
	const [open, setOpen] = useState(false);
	return createElement(
		'span',
		{
			className: 'nk-ui-tooltip-wrap',
			onMouseEnter: () => setOpen(true),
			onMouseLeave: () => setOpen(false),
			onFocus: () => setOpen(true),
			onBlur: () => setOpen(false),
		},
		children,
		open && content
			? createElement(
					'span',
					{
						id,
						role: 'tooltip',
						className: `nk-ui-tooltip is-${placement}`,
					},
					content,
				)
			: null,
	);
}