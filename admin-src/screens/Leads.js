import { useCallback, useEffect, useState } from '@wordpress/element';
import { Phone, MessageCircle, Trash2 } from 'lucide-react';
import { api } from '../api';
import { formatNumber, formatRelative } from '../format';
import { useConfirm, useToast } from '../providers';
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  Table,
  Tabs,
  Textarea,
} from '../ui';

const PER_PAGE = 20;

function telHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  return `tel:${digits.startsWith('0') ? digits : digits}`;
}

function waHref(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith('0')) {
    digits = `88${digits.slice(1)}`;
  } else if (!digits.startsWith('88')) {
    digits = `88${digits}`;
  }
  return `https://wa.me/${digits}`;
}

export function Leads({ t, locale }) {
  const confirm = useConfirm();
  const { success, error: toastError } = useToast();
  const [tab, setTab] = useState('incomplete');
  const [leadsStatus, setLeadsStatus] = useState('loading');
  const [leadsError, setLeadsError] = useState('');
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [blacklistStatus, setBlacklistStatus] = useState('loading');
  const [blacklistError, setBlacklistError] = useState('');
  const [blacklist, setBlacklist] = useState([]);
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);

  const loadLeads = useCallback((nextPage = page) => {
    setLeadsStatus('loading');
    setLeadsError('');
    api(`leads?page=${nextPage}&per_page=${PER_PAGE}`)
      .then((data) => {
        setLeads(data.leads || []);
        setTotal(Number(data.total) || 0);
        setPage(Number(data.page) || nextPage);
        setTotalPages(Number(data.totalPages) || 1);
        setLeadsStatus('ready');
      })
      .catch((err) => {
        setLeadsError(err.message || t('common.error'));
        setLeadsStatus('error');
      });
  }, [page, t]);

  const loadBlacklist = useCallback(() => {
    setBlacklistStatus('loading');
    setBlacklistError('');
    api('blacklist')
      .then((data) => {
        setBlacklist(data.phones || []);
        setBlacklistStatus('ready');
      })
      .catch((err) => {
        setBlacklistError(err.message || t('common.error'));
        setBlacklistStatus('error');
      });
  }, [t]);

  useEffect(() => {
    loadLeads(1);
    loadBlacklist();
  }, []);

  useEffect(() => {
    if (tab === 'incomplete') {
      loadLeads(page);
    }
  }, [page, tab]);

  function addBlacklist(event) {
    event.preventDefault();
    if (!phone.trim()) {
      return;
    }
    setAdding(true);
    api('blacklist', { method: 'POST', body: { phone: phone.trim(), note: note.trim() } })
      .then((data) => {
        setBlacklist(data.phones || []);
        setPhone('');
        setNote('');
        success(t('leads.added'));
      })
      .catch((err) => toastError(err.message || t('common.error')))
      .finally(() => setAdding(false));
  }

  async function removeBlacklist(row) {
    const ok = await confirm({
      title: t('leads.remove'),
      message: t('leads.removeConfirm'),
      confirmLabel: t('leads.remove'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (!ok) {
      return;
    }
    api('blacklist', { method: 'DELETE', body: { phone: row.phone } })
      .then((data) => {
        setBlacklist(data.phones || []);
        success(t('common.saved'));
      })
      .catch((err) => toastError(err.message || t('common.error')));
  }

  const incompletePanel = (
    <Card title={t('leads.incomplete')}>
      {leadsStatus === 'error' ? (
        <EmptyState
          title={t('common.error')}
          description={leadsError}
          action={<Button onClick={() => loadLeads(page)}>{t('common.retry')}</Button>}
        />
      ) : (
        <>
          <Table
            loading={leadsStatus === 'loading'}
            emptyTitle={t('leads.empty')}
            columns={[
              { key: 'name', label: t('field.name'), render: (row) => row.name || '—' },
              {
                key: 'phone',
                label: t('orders.phone'),
                render: (row) => (
                  <div className="nk-phone-actions">
                    <span>{row.phone}</span>
                    {telHref(row.phone) ? (
                      <a href={telHref(row.phone)} className="nk-ui-link" aria-label={t('orders.phone')}>
                        <Phone size={14} />
                      </a>
                    ) : null}
                    {waHref(row.phone) ? (
                      <a href={waHref(row.phone)} target="_blank" rel="noreferrer" className="nk-ui-link" aria-label="WhatsApp">
                        <MessageCircle size={14} />
                      </a>
                    ) : null}
                  </div>
                ),
              },
              {
                key: 'pageId',
                label: t('leads.pageId'),
                render: (row) => formatNumber(row.pageId, locale),
              },
              {
                key: 'updatedAt',
                label: t('orders.when'),
                render: (row) => formatRelative(row.updatedAt, locale) || row.updatedAt,
              },
            ]}
            rows={leads}
            rowKey={(row) => row.id}
          />
          {totalPages > 1 ? (
            <div className="nk-pager" style={{ marginTop: 16 }}>
              <span className="nk-muted">
                {t('leads.page')} {formatNumber(page, locale)} / {formatNumber(totalPages, locale)}
              </span>
              <div className="nk-screen-actions">
                <Button variant="secondary" size="sm" disabled={page <= 1 || leadsStatus === 'loading'} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  {t('leads.prev')}
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages || leadsStatus === 'loading'} onClick={() => setPage((p) => p + 1)}>
                  {t('leads.next')}
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </Card>
  );

  const blacklistPanel = (
    <div className="nk-screen" style={{ gap: 16 }}>
      <Card title={t('leads.blacklist')}>
        <p className="nk-muted" style={{ marginTop: 0 }}>{t('leads.blacklistHelp')}</p>
        <form className="nk-filters" onSubmit={addBlacklist}>
          <Input
            label={t('orders.phone')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Textarea
            label={t('leads.note')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
          <Button type="submit" disabled={adding}>{t('leads.add')}</Button>
        </form>
      </Card>
      <Card>
        {blacklistStatus === 'error' ? (
          <EmptyState
            title={t('common.error')}
            description={blacklistError}
            action={<Button onClick={loadBlacklist}>{t('common.retry')}</Button>}
          />
        ) : (
          <Table
            loading={blacklistStatus === 'loading'}
            emptyTitle={t('leads.blacklistEmpty')}
            columns={[
              { key: 'phone', label: t('orders.phone') },
              { key: 'note', label: t('leads.note'), render: (row) => row.note || '—' },
              {
                key: 'created_at',
                label: t('leads.date'),
                render: (row) => formatRelative(row.created_at, locale) || row.created_at || '—',
              },
              {
                key: 'actions',
                label: '',
                render: (row) => (
                  <IconButton
                    icon={Trash2}
                    variant="ghost"
                    aria-label={t('leads.remove')}
                    onClick={() => removeBlacklist(row)}
                  />
                ),
              },
            ]}
            rows={blacklist}
            rowKey={(row) => row.phone}
          />
        )}
      </Card>
    </div>
  );

  return (
    <div className="nk-screen">
      <header className="nk-screen-header">
        <div>
          <h1>{t('leads.title')}</h1>
          <p className="nk-muted">{t('leads.help')}</p>
        </div>
      </header>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'incomplete', label: t('leads.tabIncomplete'), content: incompletePanel },
          { value: 'blacklist', label: t('leads.tabBlacklist'), content: blacklistPanel },
        ]}
      />
    </div>
  );
}