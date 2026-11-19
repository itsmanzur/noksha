import { createElement } from '@wordpress/element';

const STATUS_VAR = {
	pending: '--nk-status-pending',
	awaiting_payment: '--nk-status-awaiting',
	confirmed: '--nk-status-confirmed',
	no_answer: '--nk-status-no-answer',
	fake: '--nk-status-fake',
	paid: '--nk-status-paid',
	shipped: '--nk-status-shipped',
	delivered: '--nk-status-delivered',
	returned: '--nk-status-returned',
	cancelled: '--nk-status-cancelled',
};

export function StatusPill({ status, label, className = '' }) {
	const token = STATUS_VAR[status] || '--nk-status-pending';
	const text = label ?? status?.replace(/_/g, ' ');
	return createElement(
		'span',
		{
			className: ['nk-ui-status-pill', className].filter(Boolean).join(' '),
			style: { '--nk-status-color': `var(${token})` },
		},
		text,
	);
}