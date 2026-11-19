import { createElement, useState } from '@wordpress/element';

export function Tabs({ tabs = [], value, onChange, defaultValue, className = '' }) {
	const [internal, setInternal] = useState(defaultValue ?? tabs[0]?.value);
	const active = value !== undefined ? value : internal;
	const setActive = (v) => {
		if (value === undefined) {
			setInternal(v);
		}
		onChange?.(v);
	};

	return createElement(
		'div',
		{ className: ['nk-ui-tabs', className].filter(Boolean).join(' ') },
		createElement(
			'div',
			{ role: 'tablist', className: 'nk-ui-tabs-list' },
			tabs.map((tab) => {
				const selected = tab.value === active;
				return createElement(
					'button',
					{
						key: String(tab.value),
						type: 'button',
						role: 'tab',
						id: `tab-${tab.value}`,
						'aria-selected': selected,
						'aria-controls': `panel-${tab.value}`,
						tabIndex: selected ? 0 : -1,
						className: 'nk-ui-tab' + (selected ? ' is-active' : ''),
						disabled: tab.disabled,
						onClick: () => setActive(tab.value),
					},
					tab.label,
				);
			}),
		),
		tabs.map((tab) => {
			const selected = tab.value === active;
			if (!selected) {
				return null;
			}
			return createElement(
				'div',
				{
					key: String(tab.value),
					role: 'tabpanel',
					id: `panel-${tab.value}`,
					'aria-labelledby': `tab-${tab.value}`,
					className: 'nk-ui-tab-panel',
					tabIndex: 0,
				},
				tab.content,
			);
		}),
	);
}