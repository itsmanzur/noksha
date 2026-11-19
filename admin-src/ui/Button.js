import { createElement } from '@wordpress/element';
import { Loader2 } from 'lucide-react';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'];

export function Button({
	children,
	variant = 'primary',
	size = 'md',
	loading = false,
	disabled = false,
	type = 'button',
	className = '',
	...rest
}) {
	const v = VARIANTS.includes(variant) ? variant : 'primary';
	const isDisabled = disabled || loading;
	const classes = ['nk-ui-btn', `is-${v}`, `is-${size}`, className].filter(Boolean).join(' ');

	return createElement(
		'button',
		{
			type,
			className: classes,
			disabled: isDisabled,
			'aria-busy': loading || undefined,
			...rest,
		},
		loading
			? createElement(Loader2, { className: 'nk-ui-btn-spinner', size: size === 'sm' ? 14 : 16, 'aria-hidden': true })
			: null,
		createElement('span', { className: loading ? 'nk-ui-btn-label is-loading' : 'nk-ui-btn-label' }, children),
	);
}