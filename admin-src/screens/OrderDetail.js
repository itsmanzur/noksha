import { useCallback, useEffect, useState } from '@wordpress/element';
import { ExternalLink } from 'lucide-react';
import { api } from '../api';
import { formatMoney, formatRelative, formatNumber } from '../format';
import { useConfirm, useToast } from '../providers';
import {
	Badge,
	Button,
	Card,
	CopyField,
	Input,
	Select,
	StatusPill,
	Textarea,
} from '../ui';

const WALLET_METHODS = ['manual_bkash', 'manual_nagad'];

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

export function OrderDetail({ t, locale, go, orderId, variant = 'page', onClose, onMutate }) {
	const confirm = useConfirm();
	const { success, error: toastError } = useToast();
	const [status, setStatus] = useState('loading');
	const [error, setError] = useState('');
	const [detail, setDetail] = useState(null);
	const [shipping, setShipping] = useState(null);
	const [courier, setCourier] = useState('steadfast');
	const [collect, setCollect] = useState('');
	const [noteDraft, setNoteDraft] = useState('');
	const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
	const [address, setAddress] = useState('');
	const [savingCustomer, setSavingCustomer] = useState(false);
	const [savingAddress, setSavingAddress] = useState(false);
	const [busy, setBusy] = useState(false);

	const reload = useCallback(() => {
		if (!orderId) {
			return;
		}
		setStatus('loading');
		setError('');
		api('orders/' + orderId)
			.then((data) => {
				setDetail(data);
				setCollect(String(data.collectAmount != null ? data.collectAmount : data.total));
				setCustomer({
					name: data.name || '',
					phone: data.phone || '',
					email: data.email || '',
				});
				setAddress(data.address || '');
				setStatus('ready');
			})
			.catch((err) => {
				setError(err.message);
				setStatus('error');
			});
	}, [orderId]);

	useEffect(() => {
		reload();
	}, [reload]);

	useEffect(() => {
		api('settings')
			.then((data) => {
				setShipping(data.shipping || null);
				const first = (data.shipping?.available || [])[0];
				if (first) {
					setCourier(first);
				}
			})
			.catch(() => {});
	}, []);

	function afterMutation(data, message) {
		setDetail(data);
		setCollect(String(data.collectAmount != null ? data.collectAmount : data.total));
		if (message) {
			success(message);
		}
		onMutate?.();
	}

	function updateStatus(next) {
		setBusy(true);
		api('orders/' + detail.id, { method: 'PUT', body: { status: next } })
			.then((data) => afterMutation(data, t('orders.statusUpdated')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function saveCollect() {
		setBusy(true);
		api('orders/' + detail.id, { method: 'PUT', body: { collect_amount: Number(collect) } })
			.then((data) => afterMutation(data, t('orders.collectSaved')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function saveCustomer(event) {
		event?.preventDefault?.();
		setSavingCustomer(true);
		api('orders/' + detail.id, {
			method: 'PUT',
			body: { name: customer.name, phone: customer.phone, email: customer.email },
		})
			.then((data) => afterMutation(data, t('orders.customerSaved')))
			.catch((err) => toastError(err.message))
			.finally(() => setSavingCustomer(false));
	}

	function saveAddress(event) {
		event?.preventDefault?.();
		setSavingAddress(true);
		api('orders/' + detail.id, { method: 'PUT', body: { address } })
			.then((data) => afterMutation(data, t('orders.addressSaved')))
			.catch((err) => toastError(err.message))
			.finally(() => setSavingAddress(false));
	}

	function addNote(event) {
		event?.preventDefault?.();
		const text = noteDraft.trim();
		if (!text) {
			return;
		}
		setBusy(true);
		api('orders/' + detail.id, { method: 'PUT', body: { note: text } })
			.then((data) => {
				setNoteDraft('');
				afterMutation(data, t('orders.noteSaved'));
			})
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function confirmTrx() {
		setBusy(true);
		api('orders/' + detail.id + '/confirm-trx', {
			method: 'POST',
			body: { collect_amount: Number(collect) },
		})
			.then((data) => afterMutation(data, t('orders.confirmed')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	async function rejectTrx() {
		const ok = await confirm({
			title: t('common.confirm'),
			message: t('orders.rejectConfirm'),
			confirmLabel: t('common.confirm'),
			cancelLabel: t('common.cancel'),
			danger: true,
		});
		if (!ok) {
			return;
		}
		setBusy(true);
		api('orders/' + detail.id + '/reject-trx', { method: 'POST', body: {} })
			.then((data) => afterMutation(data, t('orders.rejected')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function shipOrder() {
		setBusy(true);
		api('orders/' + detail.id + '/ship', { method: 'POST', body: { courier } })
			.then((data) => afterMutation(data, t('orders.shipped')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function printSlip() {
		api('orders/' + detail.id + '/print')
			.then((data) => {
				const win = window.open('', '_blank');
				if (!win) {
					return;
				}
				win.document.write(data.html || '');
				win.document.close();
			})
			.catch((err) => toastError(err.message));
	}

	async function blacklistPhone() {
		const ok = await confirm({
			title: t('common.confirm'),
			message: t('orders.blacklistConfirm'),
			confirmLabel: t('common.confirm'),
			cancelLabel: t('common.cancel'),
			danger: true,
		});
		if (!ok) {
			return;
		}
		api('blacklist', { method: 'POST', body: { phone: detail.phone, note: detail.number } })
			.then(() => success(t('orders.blacklisted')))
			.catch((err) => toastError(err.message));
	}

	function settleCod() {
		setBusy(true);
		api('orders/' + detail.id + '/settle-cod', {
			method: 'POST',
			body: { received: Number(collect) },
		})
			.then((data) => afterMutation(data, t('orders.codSettled')))
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	function verifyTrx() {
		setBusy(true);
		api('orders/' + detail.id + '/verify-trx', { method: 'POST', body: {} })
			.then((data) => {
				setDetail(data);
				onMutate?.();
				if (data.verify?.verified) {
					success(t('orders.verifyOk'));
					setCollect(String(data.collectAmount != null ? data.collectAmount : collect));
				} else {
					toastError(data.verify?.message || t('orders.verifyPending'));
				}
			})
			.catch((err) => toastError(err.message))
			.finally(() => setBusy(false));
	}

	async function cancelOrder() {
		const ok = await confirm({
			title: t('common.confirm'),
			message: t('orders.cancelConfirm'),
			confirmLabel: t('orders.cancelOrder'),
			cancelLabel: t('common.cancel'),
			danger: true,
		});
		if (!ok) {
			return;
		}
		updateStatus('cancelled');
	}

	if (status === 'loading') {
		return (
			<div className="nk-detail-stack" aria-busy="true">
				<p className="nk-muted">{t('common.loading')}</p>
			</div>
		);
	}

	if (status === 'error' || !detail) {
		return (
			<div className="nk-detail-stack" role="alert">
				<p>{error || t('common.error')}</p>
				<Button variant="secondary" onClick={reload}>
					{t('common.retry')}
				</Button>
			</div>
		);
	}

	const attr = detail.attribution || {};
	const attrBits = [
		attr.utm_source && `utm_source=${attr.utm_source}`,
		attr.utm_medium && `utm_medium=${attr.utm_medium}`,
		attr.utm_campaign && `utm_campaign=${attr.utm_campaign}`,
		attr.fbclid && 'fbclid',
		attr.ttclid && 'ttclid',
		attr.gclid && 'gclid',
	].filter(Boolean);

	const isWallet = WALLET_METHODS.includes(detail.method);
	const hasTrx = Boolean(detail.trxId);
	const walletPending = isWallet && hasTrx && !detail.trxVerified;
	const canShip =
		(shipping?.available || []).length > 0
		&& !['shipped', 'delivered', 'cancelled'].includes(detail.status);

	const statusLabel = (key) => t('status.' + key);

	return (
		<div className={['nk-detail-stack', variant === 'page' ? 'nk-screen' : ''].filter(Boolean).join(' ')}>
			<header className="nk-screen-header">
				<div>
					{variant === 'page' ? (
						<Button variant="ghost" size="sm" onClick={() => go('orders')}>
							{t('orders.back')}
						</Button>
					) : null}
					<h1 style={{ margin: variant === 'page' ? '8px 0 0' : 0 }}>{detail.number}</h1>
					<p className="nk-muted" style={{ margin: '4px 0 0', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
						<StatusPill status={detail.status} label={statusLabel(detail.status)} />
						<span>{formatRelative(detail.createdAt, locale)}</span>
						{detail.risk === 'review' ? (
							<Badge variant="warning">{t('orders.riskReview')}</Badge>
						) : (
							<Badge variant="success">{t('orders.riskOk')}</Badge>
						)}
						{detail.variant ? <Badge>A/B {String(detail.variant).toUpperCase()}</Badge> : null}
						{detail.otpVerified ? <Badge variant="success">{t('orders.otpOk')}</Badge> : null}
					</p>
				</div>
				<div className="nk-screen-actions">
					{variant === 'drawer' ? (
						<>
							<Button variant="ghost" size="sm" onClick={() => go('orders/' + detail.id)}>
								{t('orders.openFull')}
								<ExternalLink size={14} style={{ marginInlineStart: 4 }} aria-hidden />
							</Button>
							{onClose ? (
								<Button variant="secondary" size="sm" onClick={onClose}>
									{t('common.close')}
								</Button>
							) : null}
						</>
					) : null}
					<Button variant="ghost" size="sm" onClick={printSlip} disabled={busy}>
						{t('orders.print')}
					</Button>
					<Button variant="ghost" size="sm" onClick={blacklistPhone} disabled={busy}>
						{t('orders.blacklist')}
					</Button>
					<Button variant="danger" size="sm" onClick={cancelOrder} disabled={busy || detail.status === 'cancelled'}>
						{t('orders.cancelOrder')}
					</Button>
				</div>
			</header>

			<div className="nk-action-needed">
				{detail.status === 'pending' ? (
					<>
						<Button loading={busy} onClick={() => updateStatus('confirmed')}>
							{t('orders.confirmOrder')}
						</Button>
						<Button variant="secondary" loading={busy} onClick={() => updateStatus('no_answer')}>
							{t('orders.noAnswer')}
						</Button>
						<Button variant="secondary" loading={busy} onClick={() => updateStatus('fake')}>
							{t('orders.markFake')}
						</Button>
					</>
				) : null}
				{walletPending ? (
					<>
						<Button loading={busy} onClick={verifyTrx}>
							{t('orders.verifyTrx')}
						</Button>
						<Button variant="secondary" loading={busy} onClick={confirmTrx}>
							{t('orders.confirmTrx')}
						</Button>
						<Button variant="ghost" loading={busy} onClick={rejectTrx}>
							{t('orders.rejectTrx')}
						</Button>
					</>
				) : null}
				{detail.status === 'confirmed' && canShip ? (
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end', gridColumn: '1 / -1' }}>
						<Select
							label={t('orders.courier')}
							value={courier}
							onChange={(e) => setCourier(e.target.value)}
						>
							{(shipping?.available || []).map((id) => (
								<option key={id} value={id}>
									{t('courier.' + id)}
								</option>
							))}
						</Select>
						<Button loading={busy} onClick={shipOrder}>
							{t('orders.bookCourier')}
						</Button>
					</div>
				) : null}
				{detail.status === 'shipped' && detail.trackingCode ? (
					<p className="nk-muted" style={{ gridColumn: '1 / -1', margin: 0 }}>
						<strong>{t('orders.tracking')}:</strong> {detail.trackingCode}
						{detail.courier ? ` · ${t('courier.' + detail.courier) || detail.courier}` : ''}
					</p>
				) : null}
				{detail.method === 'cod' && !detail.codSettled ? (
					<Button loading={busy} onClick={settleCod}>
						{t('orders.settleCod')}
					</Button>
				) : null}
				{detail.method === 'cod' && detail.codSettled ? (
					<Badge variant="success">
						{t('orders.codSettled')}
						{detail.codReceived != null ? ` · ${formatMoney(detail.codReceived, locale)}` : ''}
					</Badge>
				) : null}
			</div>

			<div className="nk-split-2">
				<Card title={t('orders.customer')}>
					<form className="nk-inline-edit" onSubmit={saveCustomer}>
						<Input
							label={t('field.name')}
							value={customer.name}
							onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
						/>
						<Input
							label={t('orders.phone')}
							value={customer.phone}
							onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
						/>
						<div className="nk-phone-actions">
							<a href={telUrl(customer.phone)} className="nk-ui-btn is-secondary is-sm">
								{t('orders.call')}
							</a>
							<a href={waMeUrl(customer.phone)} target="_blank" rel="noopener noreferrer" className="nk-ui-btn is-secondary is-sm">
								WhatsApp
							</a>
						</div>
						<Input
							label={t('orders.email')}
							type="email"
							value={customer.email}
							onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))}
						/>
						<Button type="submit" variant="secondary" loading={savingCustomer}>
							{t('common.save')}
						</Button>
					</form>
				</Card>

				<Card title={t('orders.address')}>
					<form className="nk-inline-edit" onSubmit={saveAddress}>
						<Textarea
							label={t('orders.address')}
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							rows={3}
						/>
						<p className="nk-muted" style={{ margin: 0 }}>
							{[detail.upazila, detail.district, detail.division].filter(Boolean).join(', ')}
						</p>
						<Button type="submit" variant="secondary" loading={savingAddress}>
							{t('common.save')}
						</Button>
					</form>
				</Card>
			</div>

			<Card title={t('orders.items')}>
				<ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
					{(detail.items || []).map((item, index) => (
						<li key={index}>
							{formatNumber(item.qty, locale)} × {item.name} · {formatMoney(item.price, locale)}
						</li>
					))}
				</ul>
				<div style={{ marginTop: 12, display: 'grid', gap: 4 }}>
					<p style={{ margin: 0 }}>
						{t('orders.subtotal')}: {formatMoney(detail.subtotal, locale)}
					</p>
					<p style={{ margin: 0 }}>
						{t('orders.shipping')}: {formatMoney(detail.shipping, locale)}
					</p>
					<p style={{ margin: 0, fontWeight: 600 }}>
						{t('orders.total')}: {formatMoney(detail.total, locale)}
					</p>
					<label className="nk-inline-edit">
						<Input
							label={t('orders.collect')}
							type="number"
							min="0"
							step="0.01"
							value={collect}
							onChange={(e) => setCollect(e.target.value)}
						/>
						<p className="nk-muted" style={{ margin: 0 }}>
							{t('orders.collectCourier').replace('{amount}', formatMoney(Number(collect) || 0, locale))}
						</p>
						<Button variant="secondary" size="sm" onClick={saveCollect} loading={busy}>
							{t('orders.saveCollect')}
						</Button>
					</label>
				</div>
			</Card>

			<Card title={t('orders.payment')}>
				<p style={{ marginTop: 0 }}>
					<Badge>{t('pay.' + detail.method)}</Badge>
				</p>
				{detail.trxId ? (
					<CopyField
						label={t('orders.trx')}
						value={detail.trxId}
						copyLabel={t('common.copy')}
						copiedLabel={t('common.copied')}
					/>
				) : null}
				{detail.trxVerified ? (
					<Badge variant="success">{t('orders.trxVerified')}</Badge>
				) : hasTrx ? (
					<Badge variant="warning">?</Badge>
				) : null}
				{detail.fraud ? (
					<p className="nk-muted">
						{t('orders.fraud')}: {detail.fraud.label} ({formatNumber(detail.fraud.score, locale)})
					</p>
				) : null}
			</Card>

			{attrBits.length ? (
				<Card title={t('orders.attribution')}>
					<p style={{ margin: 0 }}>{attrBits.join(' · ')}</p>
				</Card>
			) : null}

			<Card title={t('orders.notes')}>
				{(detail.notes || []).length === 0 ? (
					<p className="nk-muted">{t('orders.notesEmpty')}</p>
				) : (
					<ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
						{detail.notes.map((n) => (
							<li key={n.id} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--nk-border)' }}>
								<p style={{ margin: '0 0 4px' }}>{n.note}</p>
								<small className="nk-muted">{formatRelative(n.createdAt, locale)}</small>
							</li>
						))}
					</ul>
				)}
				<form onSubmit={addNote} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
					<Textarea
						label={t('orders.addNote')}
						value={noteDraft}
						onChange={(e) => setNoteDraft(e.target.value)}
						rows={2}
					/>
					<Button type="submit" variant="secondary" disabled={!noteDraft.trim()} loading={busy}>
						{t('orders.addNote')}
					</Button>
				</form>
				{detail.note ? (
					<p className="nk-muted" style={{ marginTop: 12 }}>
						{t('orders.note')}: {detail.note}
					</p>
				) : null}
			</Card>
		</div>
	);
}