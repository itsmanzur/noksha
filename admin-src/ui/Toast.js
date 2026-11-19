import { createElement, createContext, useCallback, useContext, useMemo, useState } from '@wordpress/element';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
	const [items, setItems] = useState([]);

	const dismiss = useCallback((id) => {
		setItems((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const push = useCallback((toast) => {
		const id = ++toastId;
		const duration = toast.duration ?? 4000;
		setItems((prev) => [...prev, { id, variant: 'default', ...toast }]);
		if (duration > 0) {
			window.setTimeout(() => dismiss(id), duration);
		}
		return id;
	}, [dismiss]);

	const api = useMemo(
		() => ({
			toast: push,
			success: (message, opts) => push({ message, variant: 'success', ...opts }),
			error: (message, opts) => push({ message, variant: 'error', ...opts }),
			info: (message, opts) => push({ message, variant: 'info', ...opts }),
			dismiss,
		}),
		[push, dismiss],
	);

	return createElement(
		ToastContext.Provider,
		{ value: api },
		children,
		createElement(
			'div',
			{
				className: 'nk-ui-toast-region',
				'aria-live': 'polite',
				'aria-relevant': 'additions',
				role: 'status',
			},
			items.map((t) =>
				createElement(
					'div',
					{
						key: t.id,
						className: `nk-ui-toast is-${t.variant || 'default'}`,
						role: t.variant === 'error' ? 'alert' : 'status',
					},
					createElement('span', { className: 'nk-ui-toast-message' }, t.message),
					createElement(IconButton, {
						icon: X,
						size: 'sm',
						'aria-label': 'Dismiss notification',
						onClick: () => dismiss(t.id),
					}),
				),
			),
		),
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error('useToast must be used within ToastProvider');
	}
	return ctx;
}