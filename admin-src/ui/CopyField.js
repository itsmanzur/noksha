import { createElement, useState } from '@wordpress/element';
import { Check, Copy } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export function CopyField({ label, help, value, readOnly = true, onCopy, copyLabel = 'Copy', copiedLabel = 'Copied' }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(String(value ?? ''));
			setCopied(true);
			onCopy?.();
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			/* ignore */
		}
	}

	return createElement(
		'div',
		{ className: 'nk-ui-copy-field' },
		createElement(Input, { label, help, value: value ?? '', readOnly }),
		createElement(
			Button,
			{
				variant: 'secondary',
				size: 'sm',
				className: 'nk-ui-copy-field-btn',
				onClick: copy,
				'aria-live': 'polite',
			},
			copied
				? createElement(Check, { size: 14, 'aria-hidden': true })
				: createElement(Copy, { size: 14, 'aria-hidden': true }),
			copied ? copiedLabel : copyLabel,
		),
	);
}