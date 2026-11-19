import { createElement } from '@wordpress/element';
import { Button } from './Button';
import { Modal } from './Modal';

export function ConfirmDialog({
	open,
	title = 'Confirm',
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	danger = false,
	onConfirm,
	onCancel,
}) {
	return createElement(
		Modal,
		{
			open,
			onClose: onCancel,
			title,
			size: 'sm',
			footer: createElement(
				'div',
				{ className: 'nk-ui-confirm-actions' },
				createElement(Button, { variant: 'secondary', onClick: onCancel }, cancelLabel),
				createElement(Button, { variant: danger ? 'danger' : 'primary', onClick: onConfirm }, confirmLabel),
			),
		},
		message ? createElement('p', { className: 'nk-ui-confirm-message' }, message) : null,
	);
}