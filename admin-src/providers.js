import { createElement, createContext, useCallback, useContext, useRef, useState } from '@wordpress/element';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { ToastProvider, useToast } from './ui/Toast';

const ConfirmContext = createContext(null);

function ConfirmProviderInner({ children }) {
	const [state, setState] = useState(null);
	const resolver = useRef(null);

	const confirm = useCallback((options) => {
		return new Promise((resolve) => {
			resolver.current = resolve;
			setState({
				title: options?.title ?? 'Confirm',
				message: options?.message,
				confirmLabel: options?.confirmLabel ?? 'Confirm',
				cancelLabel: options?.cancelLabel ?? 'Cancel',
				danger: Boolean(options?.danger),
			});
		});
	}, []);

	function finish(value) {
		resolver.current?.(value);
		resolver.current = null;
		setState(null);
	}

	return createElement(
		ConfirmContext.Provider,
		{ value: confirm },
		children,
		createElement(ConfirmDialog, {
			open: !!state,
			title: state?.title,
			message: state?.message,
			confirmLabel: state?.confirmLabel,
			cancelLabel: state?.cancelLabel,
			danger: state?.danger,
			onConfirm: () => finish(true),
			onCancel: () => finish(false),
		}),
	);
}

export function useConfirm() {
	const ctx = useContext(ConfirmContext);
	if (!ctx) {
		throw new Error('useConfirm must be used within ConfirmProvider');
	}
	return ctx;
}

export function ConfirmProvider({ children }) {
	return createElement(ConfirmProviderInner, null, children);
}

export function AppProviders({ children }) {
	return createElement(
		ToastProvider,
		null,
		createElement(ConfirmProvider, null, children),
	);
}

export { ToastProvider, useToast };