import { createElement } from '@wordpress/element';
import { Check } from 'lucide-react';

export function Stepper({ steps = [], current = 0, className = '' }) {
	return createElement(
		'ol',
		{ className: ['nk-ui-stepper', className].filter(Boolean).join(' '), 'aria-label': 'Progress' },
		steps.map((step, index) => {
			const done = index < current;
			const active = index === current;
			return createElement(
				'li',
				{
					key: String(step.id ?? index),
					className: 'nk-ui-step' + (done ? ' is-done' : '') + (active ? ' is-active' : ''),
					'aria-current': active ? 'step' : undefined,
				},
				createElement(
					'span',
					{ className: 'nk-ui-step-marker', 'aria-hidden': true },
					done ? createElement(Check, { size: 14 }) : index + 1,
				),
				createElement('span', { className: 'nk-ui-step-label' }, step.label),
			);
		}),
	);
}