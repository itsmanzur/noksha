import { createElement, useEffect } from '@wordpress/element';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export function Drawer({ open, onClose, title, children, width = 400, closeLabel = 'Close' }) {
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
		return () => document.removeEventListener('keydown', onKey);
	}, [open, onClose]);

	if (!open) {
		return null;
	}

	return createElement(
		'div',
		{ className: 'nk-ui-drawer-root' },
		createElement('button', {
			type: 'button',
			className: 'nk-ui-drawer-overlay',
			'aria-label': closeLabel,
			onClick: () => onClose?.(),
		}),
		createElement(
			'aside',
			{
				className: 'nk-ui-drawer',
				style: { '--nk-drawer-width': typeof width === 'number' ? `${width}px` : width },
				role: 'dialog',
				'aria-modal': true,
				'aria-label': title || 'Drawer',
			},
			createElement(
				'header',
				{ className: 'nk-ui-drawer-header' },
				title ? createElement('h2', { className: 'nk-ui-drawer-title' }, title) : null,
				createElement(IconButton, { icon: X, 'aria-label': closeLabel, onClick: () => onClose?.() }),
			),
			createElement('div', { className: 'nk-ui-drawer-body' }, children),
		),
	);
}