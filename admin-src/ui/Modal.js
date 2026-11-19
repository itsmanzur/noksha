import { createElement, useEffect, useRef } from '@wordpress/element';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export function Modal({ open, onClose, title, children, footer, size = 'md', closeLabel = 'Close' }) {
	const panelRef = useRef(null);

	useEffect(() => {
		if (!open) {
			return undefined;
		}
		function onKey(e) {
			if (e.key === 'Escape') {
				onClose?.();
			}
		}
		document.addEventListener('keydown', onKey);
		const prev = document.activeElement;
		panelRef.current?.focus();
		return () => {
			document.removeEventListener('keydown', onKey);
			prev?.focus?.();
		};
	}, [open, onClose]);

	if (!open) {
		return null;
	}

	return createElement(
		'div',
		{ className: 'nk-ui-modal-root' },
		createElement('button', {
			type: 'button',
			className: 'nk-ui-modal-overlay',
			'aria-label': closeLabel,
			onClick: () => onClose?.(),
		}),
		createElement(
			'div',
			{
				ref: panelRef,
				className: ['nk-ui-modal', `is-${size}`].join(' '),
				role: 'dialog',
				'aria-modal': true,
				'aria-labelledby': title ? 'nk-modal-title' : undefined,
				tabIndex: -1,
			},
			createElement(
				'header',
				{ className: 'nk-ui-modal-header' },
				title ? createElement('h2', { id: 'nk-modal-title', className: 'nk-ui-modal-title' }, title) : null,
				createElement(IconButton, { icon: X, 'aria-label': closeLabel, onClick: () => onClose?.() }),
			),
			createElement('div', { className: 'nk-ui-modal-body' }, children),
			footer ? createElement('footer', { className: 'nk-ui-modal-footer' }, footer) : null,
		),
	);
}