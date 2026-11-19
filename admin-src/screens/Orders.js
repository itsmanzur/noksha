import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { Check, HelpCircle } from 'lucide-react';
import { api } from '../api';
import { formatMoney, formatRelative, formatNumber } from '../format';
import { useToast } from '../providers';
import {
	Badge,
	Button,
	DateRangePicker,
	Drawer,
	Input,
	Select,
	StatusPill,
	Table,
} from '../ui';
import { OrderDetail } from './OrderDetail';
import '../styles/screens.css';

const STATUS_TABS = [
	{ id: 'all', status: '' },
	{ id: 'pending', status: 'pending' },
	{ id: 'confirmed', status: 'confirmed' },
	{ id: 'awaiting_payment', status: 'awaiting_payment' },
	{ id: 'shipped', status: 'shipped' },
	{ id: 'delivered', status: 'delivered' },
	{ id: 'returned', status: 'returned' },
	{ id: 'cancelled_fake', status: 'cancelled_fake' },
];

const BULK_STATUSES = [
	'pending',
	'awaiting_payment',
	'confirmed',
	'no_answer',
	'fake',
	'paid',
	'shipped',
	'delivered',
	'returned',
	'cancelled',
];

const PAYMENT_METHODS = ['', 'cod', 'manual_bkash', 'manual_nagad', 'sslcommerz'];

function toYmd(d) {
	if (!d) {
		return '';
	}
	const x = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(x.getTime())) {
		return '';
	}
	const p = (n) => String(n).padStart(2, '0');
	return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`;
}

function waMeUrl(phone) {
	const digits = String(phone || '').replace(/\D/g, '');
	let n = digits;
	if (n.startsWith('0')) {
		n = '880' + n.slice(1);
	} else if (!n.startsWith('880')) {
		n = '880' + n;
	}
	return `https://wa.me/${n}`;
}

function telUrl(phone) {
	const digits = String(phone || '').replace(/\D/g, '');
	return `tel:${digits || phone}`;
}

function buildListQuery({
	search,
	tab,
	page,
	perPage,
	from,
	to,
	paymentMethod,
	statusOverride,
}) {
	const query = new URLSearchParams();
	if (search) {
		query.set('search', search);
	}
	const status = statusOverride !== undefined ? statusOverride : (STATUS_TABS.find((t) => t.id === tab)?.status || '');
	if (status && status !== 'cancelled_fake') {
		query.set('status', status);
	}
	query.set('page', String(page));
	query.set('per_page', String(perPage));
	if (from) {
		query.set('from', from);
	}
	if (to) {
		query.set('to', to);
	}
	if (paymentMethod) {
		query.set('payment_method', paymentMethod);
	}
	return query;
}

export function Orders({ t, go, orderId, locale }) {
	const { success, error: toastError } = useToast();
	const [listStatus, setListStatus] = useState('loading');
	const [listError, setListError] = useState('');
	const [rows, setRows] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [tab, setTab] = useState('all');
	const [tabCounts, setTabCounts] = useState({});
	const [search, setSearch] = useState('');
	const [searchDraft, setSearchDraft] = useState('');
	const [dateRange, setDateRange] = useState({ preset: 'all' });
	const [paymentMethod, setPaymentMethod] = useState('');
	const [riskFilter, setRiskFilter] = useState('');
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(25);
	const [selected, setSelected] = useState([]);
	const [bulkStatus, setBulkStatus] = useState('confirmed');
	const [drawerId, setDrawerId] = useState(0);

	const from = dateRange?.preset === 'all' || !dateRange?.from ? '' : toYmd(dateRange.from);
	const to = dateRange?.preset === 'all' || !dateRange?.to ? '' : toYmd(dateRange.to);

	const filteredRows = useMemo(() => {
		if (!riskFilter) {
			return rows;
		}
		return rows.filter((row) => row.risk === riskFilter);
	}, [rows, riskFilter]);

	const datePresets = useMemo(
		() => [
			{ id: 'all', label: t('orders.allTime') },
			{ id: 'today', label: t('home.rangeToday') },
			{ id: '7d', label: t('home.range7d') },
			{ id: '30d', label: t('home.range30d') },
			{ id: 'custom', label: t('orders.customRange') || 'Custom' },
		],
		[t],
	);

	const loadCounts = useCallback(() => {
		const q = new URLSearchParams();
		if (search) {
			q.set('search', search);
		}
		if (from) {
			q.set('from', from);
		}
		if (to) {
			q.set('to', to);
		}
		if (paymentMethod) {
			q.set('payment_method', paymentMethod);
		}
		api('orders/counts?' + q.toString())
			.then((data) => {
				const next = { ...(data || {}) };
				next.cancelled_fake = (next.cancelled || 0) + (next.fake || 0);
				setTabCounts(next);
			})
			.catch(() => {});
	}, [search, from, to, paymentMethod]);

	const loadList = useCallback(() => {
		setListStatus('loading');
		setListError('');

		if (tab === 'cancelled_fake') {
			const q = buildListQuery({ search, tab, page, perPage, from, to, paymentMethod });
			const qCancel = new URLSearchParams(q.toString());
			qCancel.set('status', 'cancelled');
			const qFake = new URLSearchParams(q.toString());
			qFake.set('status', 'fake');
			Promise.all([api('orders?' + qCancel.toString()), api('orders?' + qFake.toString())])
				.then(([a, b]) => {
					const merged = [...(a.orders || []), ...(b.orders || [])].sort((x, y) => y.id - x.id);
					const slice = merged.slice(0, perPage);
					const combTotal = (a.total || 0) + (b.total || 0);
					setRows(slice);
					setTotal(combTotal);
					setTotalPages(Math.max(1, Math.ceil(combTotal / perPage)));
					setSelected([]);
					setListStatus('ready');
				})
				.catch((err) => {
					setListError(err.message);
					setListStatus('error');
				});
			return;
		}

		const q = buildListQuery({ search, tab, page, perPage, from, to, paymentMethod });
		api('orders?' + q.toString())
			.then((data) => {
				setRows(data.orders || []);
				setTotal(data.total || 0);
				setTotalPages(data.totalPages || 1);
				setSelected([]);
				setListStatus('ready');
			})
			.catch((err) => {
				setListError(err.message);
				setListStatus('error');
			});
	}, [search, tab, page, perPage, from, to, paymentMethod]);

	useEffect(() => {
		loadCounts();
	}, [loadCounts]);

	useEffect(() => {
		loadList();
	}, [loadList]);

	useEffect(() => {
		setPage(1);
	}, [tab, search, from, to, paymentMethod, perPage]);

	function applySearch(event) {
		event?.preventDefault?.();
		setSearch(searchDraft.trim());
	}

	function exportCsv() {
		const q = buildListQuery({ search, tab, page: 1, perPage: 25, from, to, paymentMethod });
		if (tab === 'cancelled_fake') {
			q.delete('status');
		}
		api('orders/export?' + q.toString())
			.then((data) => {
				const blob = new window.Blob([data.csv || ''], { type: 'text/csv;charset=utf-8' });
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = data.filename || 'noksha-orders.csv';
				link.click();
				window.URL.revokeObjectURL(url);
				success(t('orders.exportDone'));
			})
			.catch((err) => toastError(err.message));
	}

	function runBulk(status) {
		if (selected.length === 0) {
			return;
		}
		api('orders/bulk', { method: 'POST', body: { ids: selected, status } })
			.then(() => {
				success(t('orders.bulkDone').replace('{n}', String(selected.length)));
				loadList();
				loadCounts();
			})
			.catch((err) => toastError(err.message));
	}

	function openRow(order) {
		setDrawerId(order.id);
	}

	const columns = useMemo(
		() => [
			{
				key: 'number',
				label: t('orders.orderNumber'),
				render: (order) => (
					<strong>{order.number}</strong>
				),
			},
			{
				key: 'customer',
				label: t('orders.customer'),
				render: (order) => (
					<div onClick={(e) => e.stopPropagation()} role="presentation">
						<div>{order.name || '—'}</div>
						<div className="nk-phone-actions" style={{ marginTop: 4 }}>
							<a href={telUrl(order.phone)} className="nk-ui-btn is-ghost is-sm">{order.phone}</a>
							<a href={waMeUrl(order.phone)} target="_blank" rel="noopener noreferrer" className="nk-ui-btn is-ghost is-sm" aria-label="WhatsApp">WA</a>
						</div>
					</div>
				),
			},
			{
				key: 'total',
				label: t('orders.total'),
				render: (order) => formatMoney(order.total, locale),
			},
			{
				key: 'payment',
				label: t('orders.payment'),
				render: (order) => (
					<div>
						<Badge>{t('pay.' + order.method)}</Badge>
						{order.trxId ? (
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
								<span className="nk-muted" style={{ fontSize: 'var(--nk-text-sm)' }}>{order.trxId}</span>
								{order.trxVerified ? (
									<Check size={14} className="nk-ui-text-success" aria-label={t('orders.trxVerified')} />
								) : (
									<HelpCircle size={14} aria-label="?" />
								)}
							</span>
						) : null}
					</div>
				),
			},
			{
				key: 'status',
				label: t('pages.status'),
				render: (order) => (
					<StatusPill status={order.status} label={t('status.' + order.status)} />
				),
			},
			{
				key: 'risk',
				label: t('orders.risk'),
				render: (order) => (
					<Badge variant={order.risk === 'review' ? 'warning' : 'success'}>
						{order.risk === 'review' ? t('orders.riskReview') : t('orders.riskOk')}
					</Badge>
				),
			},
			{
				key: 'courier',
				label: t('orders.courier'),
				render: (order) => (
					order.trackingCode ? (
						<span>
							{order.courier ? t('courier.' + order.courier) || order.courier : '—'}
							<br />
							<small className="nk-muted">{order.trackingCode}</small>
						</span>
					) : (
						<span className="nk-muted">—</span>
					)
				),
			},
			{
				key: 'createdAt',
				label: t('orders.when'),
				render: (order) => formatRelative(order.createdAt, locale),
			},
		],
		[t, locale],
	);

	if (orderId) {
		return (
			<OrderDetail
				t={t}
				locale={locale}
				go={go}
				orderId={orderId}
				variant="page"
				onMutate={loadCounts}
			/>
		);
	}

	const tabLabel = (id) => {
		if (id === 'all') {
			return t('orders.tab.all');
		}
		if (id === 'pending') {
			return t('orders.tab.needsCall');
		}
		if (id === 'cancelled_fake') {
			return t('orders.tab.cancelledFake');
		}
		return t('status.' + id);
	};

	return (
		<div className="nk-screen">
			<header className="nk-screen-header">
				<h1>{t('orders.title')}</h1>
				<div className="nk-screen-actions">
					<Button variant="secondary" onClick={exportCsv}>
						{t('orders.export')}
					</Button>
				</div>
			</header>

			<div className="nk-ui-tabs">
				<div role="tablist" className="nk-ui-tabs-list" aria-label={t('orders.title')}>
					{STATUS_TABS.map((item) => {
						const active = tab === item.id;
						const count = tabCounts[item.id === 'all' ? 'all' : item.id === 'cancelled_fake' ? 'cancelled_fake' : item.status];
						return (
							<button
								key={item.id}
								type="button"
								role="tab"
								aria-selected={active}
								className={'nk-ui-tab' + (active ? ' is-active' : '')}
								onClick={() => setTab(item.id)}
							>
								{tabLabel(item.id)}
								{count != null ? (
									<Badge variant={active ? 'default' : 'default'} style={{ marginInlineStart: 6 }}>
										{formatNumber(count, locale)}
									</Badge>
								) : null}
							</button>
						);
					})}
				</div>
			</div>

			<form className="nk-filters nk-orders-filters" onSubmit={applySearch}>
				<div className="nk-orders-search">
					<Input
						aria-label={t('orders.search')}
						placeholder={t('orders.search')}
						value={searchDraft}
						onChange={(e) => setSearchDraft(e.target.value)}
					/>
					<Button type="submit" variant="secondary">
						{t('orders.searchAction')}
					</Button>
				</div>
				<DateRangePicker
					value={dateRange}
					onChange={(next) => setDateRange(next?.preset === 'all' ? { preset: 'all' } : next)}
					presets={datePresets}
				/>
				<Select
					aria-label={t('orders.method')}
					value={paymentMethod}
					onChange={(e) => setPaymentMethod(e.target.value)}
				>
					<option value="">{t('orders.filterPaymentAll')}</option>
					{PAYMENT_METHODS.filter(Boolean).map((m) => (
						<option key={m} value={m}>
							{t('pay.' + m)}
						</option>
					))}
				</Select>
				<Select
					aria-label={t('orders.filterRisk')}
					value={riskFilter}
					onChange={(e) => setRiskFilter(e.target.value)}
				>
					<option value="">{t('orders.filterRiskAll')}</option>
					<option value="ok">{t('orders.riskOk')}</option>
					<option value="review">{t('orders.riskReview')}</option>
				</Select>
			</form>

			{listStatus === 'error' ? (
				<div className="nk-banner" role="alert">
					<p>{listError || t('common.error')}</p>
					<Button onClick={loadList}>{t('common.retry')}</Button>
				</div>
			) : (
				<Table
					columns={columns}
					rows={filteredRows}
					rowKey={(row) => row.id}
					loading={listStatus === 'loading'}
					emptyTitle={t('orders.empty')}
					selectable
					selectedKeys={selected}
					onSelectionChange={setSelected}
					onRowClick={openRow}
				/>
			)}

			{listStatus === 'ready' && total > 0 ? (
				<div className="nk-pager">
					<span className="nk-muted">
						{t('orders.pageOf')
							.replace('{page}', formatNumber(page, locale))
							.replace('{total}', formatNumber(totalPages, locale))
							.replace('{count}', formatNumber(total, locale))}
					</span>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
						<Select
							label={t('orders.perPage')}
							value={String(perPage)}
							onChange={(e) => setPerPage(Number(e.target.value))}
						>
							<option value="25">25</option>
							<option value="50">50</option>
							<option value="100">100</option>
						</Select>
						<Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
							{t('orders.prev')}
						</Button>
						<Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
							{t('orders.next')}
						</Button>
					</div>
				</div>
			) : null}

			{selected.length > 0 ? (
				<div className="nk-bulk-bar" role="region" aria-label={t('orders.bulkBar')}>
					<strong>{t('orders.selected').replace('{n}', formatNumber(selected.length, locale))}</strong>
					<Button size="sm" onClick={() => runBulk('confirmed')}>
						{t('orders.bulkConfirm')}
					</Button>
					<Button size="sm" variant="secondary" onClick={() => runBulk('fake')}>
						{t('orders.markFake')}
					</Button>
					<Select
						aria-label={t('orders.bulkStatus')}
						value={bulkStatus}
						onChange={(e) => setBulkStatus(e.target.value)}
					>
						{BULK_STATUSES.map((s) => (
							<option key={s} value={s}>
								{t('status.' + s)}
							</option>
						))}
					</Select>
					<Button size="sm" variant="secondary" onClick={() => runBulk(bulkStatus)}>
						{t('orders.bulk').replace('{n}', String(selected.length))}
					</Button>
					<Button size="sm" variant="ghost" onClick={exportCsv}>
						{t('orders.export')}
					</Button>
				</div>
			) : null}

			<Drawer
				open={drawerId > 0}
				onClose={() => setDrawerId(0)}
				title={t('orders.viewOrder')}
				width={560}
				closeLabel={t('common.close')}
			>
				{drawerId > 0 ? (
					<OrderDetail
						t={t}
						locale={locale}
						go={go}
						orderId={drawerId}
						variant="drawer"
						onClose={() => setDrawerId(0)}
						onMutate={() => {
							loadList();
							loadCounts();
						}}
					/>
				) : null}
			</Drawer>
		</div>
	);
}