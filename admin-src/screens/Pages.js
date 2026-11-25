import { useEffect, useMemo, useState } from '@wordpress/element';
import { LayoutGrid, MoreVertical, Table as TableIcon } from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  Modal,
  RadioCards,
  Select,
  Skeleton,
  StatusPill,
  Table,
} from '../ui';
import { api } from '../api';
import { formatNumber } from '../format';
import { useConfirm, useToast } from '../providers';

const TEMPLATES = [
  { value: 'single', labelKey: 'pages.single', descKey: 'pages.singleBody' },
  { value: 'lead', labelKey: 'pages.lead', descKey: 'pages.leadBody' },
  { value: 'festival', labelKey: 'pages.festival', descKey: 'pages.festivalBody' },
  { value: 'beauty', labelKey: 'pages.beauty', descKey: 'pages.beautyBody' },
  { value: 'gadget', labelKey: 'pages.gadget', descKey: 'pages.gadgetBody' },
  { value: 'blank', labelKey: 'pages.blank', descKey: 'pages.singleBody' },
];

export function Pages({ t, go, locale }) {
  const confirm = useConfirm();
  const { success, toast } = useToast();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [pages, setPages] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [menuId, setMenuId] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [createTemplate, setCreateTemplate] = useState('single');
  const [createLang, setCreateLang] = useState('en');
  const [createTitle, setCreateTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  function load(pageNum = 1) {
    setStatus('loading');
    const query = new URLSearchParams({ page: String(pageNum), per_page: '24' });
    api('pages?' + query.toString())
      .then((data) => {
        setPages(data.pages || []);
        setMeta({
          page: data.page || 1,
          totalPages: data.totalPages || 1,
          total: data.total || 0,
        });
        setStatus('ready');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }

  useEffect(() => {
    load(1);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pages.filter((page) => {
      if (statusFilter === 'publish' && page.status !== 'publish') return false;
      if (statusFilter === 'draft' && page.status !== 'draft') return false;
      if (q && !String(page.title || '').toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pages, search, statusFilter]);

  async function removePage(id) {
    const ok = await confirm({
      title: t('pages.delete'),
      message: t('pages.deleteConfirm'),
      confirmLabel: t('pages.delete'),
      cancelLabel: t('common.cancel'),
      danger: true,
    });
    if (!ok) return;
    api('pages/' + id, { method: 'DELETE' })
      .then(() => {
        success(t('pages.deleted'));
        load(meta.page);
      })
      .catch((err) => setError(err.message));
  }

  function copyLink(page) {
    const link = page.link || '';
    if (!link) {
      toast({ message: t('pages.noLiveLink') });
      return;
    }
    navigator.clipboard?.writeText(link).then(() => success(t('pages.copied'))).catch(() => toast({ message: link }));
  }

  async function duplicatePage(page) {
    setBusy(true);
    try {
      const payload = await api('pages/' + page.id).catch(() => ({}));
      const template = payload.template || 'single';
      const language = payload.language || 'en';
      const created = await api('pages', {
        method: 'POST',
        body: { template, language, title: (page.title || t('editor.untitled')) + ' (2)' },
      });
      success(t('pages.duplicated'));
      go('pages/' + created.id);
    } catch (err) {
      toast({ message: err.message || t('common.error') });
    } finally {
      setBusy(false);
      setMenuId(0);
    }
  }

  function createPage() {
    setBusy(true);
    api('pages', {
      method: 'POST',
      body: {
        template: createTemplate,
        language: createLang,
        title: createTitle.trim(),
      },
    })
      .then((page) => {
        setModalOpen(false);
        setCreateTitle('');
        go('pages/' + page.id);
      })
      .catch((err) => {
        setError(err.message);
        setBusy(false);
      });
  }

  const templateOptions = TEMPLATES.map((tpl) => ({
    value: tpl.value,
    label: t(tpl.labelKey),
    description: t(tpl.descKey),
  }));

  if (status === 'loading' && !pages.length) {
    return (
      <div className="nk-screen">
        <Skeleton height={48} />
        <div className="nk-grid-cards">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={160} />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error' && !pages.length) {
    return (
      <Card>
        <p className="nk-muted">{error || t('common.error')}</p>
        <Button onClick={() => load(1)}>{t('common.retry')}</Button>
      </Card>
    );
  }

  return (
    <div className="nk-screen">
      <header className="nk-screen-header">
        <h1>{t('pages.title')}</h1>
        <div className="nk-screen-actions">
          <Button variant="ghost" onClick={() => setBulkOpen(true)}>{t('bulk.open')}</Button>
          <Button onClick={() => setModalOpen(true)}>{t('pages.new')}</Button>
        </div>
      </header>

      <div className="nk-filters">
        <Input
          label={t('pages.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('pages.search')}
        />
        <Select label={t('pages.status')} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">{t('pages.filterAll')}</option>
          <option value="publish">{t('pages.filterLive')}</option>
          <option value="draft">{t('pages.filterDraft')}</option>
        </Select>
        <div className="nk-phone-actions" role="group" aria-label={t('pages.viewMode')}>
          <IconButton
            icon={LayoutGrid}
            aria-label={t('pages.viewGrid')}
            className={view === 'grid' ? 'is-active' : ''}
            onClick={() => setView('grid')}
          />
          <IconButton
            icon={TableIcon}
            aria-label={t('pages.viewTable')}
            className={view === 'table' ? 'is-active' : ''}
            onClick={() => setView('table')}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={t('pages.emptyTitle')}
          description={t('pages.emptyBody')}
          action={<Button onClick={() => setModalOpen(true)}>{t('pages.new')}</Button>}
        />
      ) : view === 'grid' ? (
        <div className="nk-grid-cards">
          {filtered.map((page) => (
            <article key={page.id} className="nk-page-card">
              <div className="nk-page-card-thumb" />
              <p style={{ margin: 0 }}>
                <strong>{page.title}</strong>
              </p>
              <div className="nk-page-card-meta">
                <StatusPill
                  status={page.status === 'publish' ? 'delivered' : 'pending'}
                  label={page.status === 'publish' ? t('pages.published') : t('pages.draft')}
                />
                <span>
                  {t('pages.visits')}: {formatNumber(page.visits, locale)}
                </span>
                <span>
                  {t('pages.orders')}: {formatNumber(page.orders, locale)}
                </span>
                <span>
                  {t('pages.conversion')}: {formatNumber(page.conversion, locale)}%
                </span>
              </div>
              <div className="nk-screen-actions">
                <Button size="sm" onClick={() => go('pages/' + page.id)}>
                  {t('pages.edit')}
                </Button>
                <div style={{ position: 'relative' }}>
                  <IconButton
                    icon={MoreVertical}
                    aria-label={t('pages.more')}
                    onClick={() => setMenuId(menuId === page.id ? 0 : page.id)}
                  />
                  {menuId === page.id ? (
                    <div
                      className="nk-page-card"
                      style={{ position: 'absolute', right: 0, top: '100%', zIndex: 5, minWidth: 160 }}
                    >
                      <div className="nk-detail-stack">
                        <Button variant="ghost" size="sm" onClick={() => { go('pages/' + page.id); setMenuId(0); }}>
                          {t('pages.edit')}
                        </Button>
                        {page.link ? (
                          <a className="nk-ui-btn is-ghost is-sm" href={page.link} target="_blank" rel="noreferrer">
                            {t('pages.view')}
                          </a>
                        ) : null}
                        <Button variant="ghost" size="sm" onClick={() => copyLink(page)}>
                          {t('pages.copyLink')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => duplicatePage(page)} disabled={busy}>
                          {t('pages.duplicate')}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => { setMenuId(0); removePage(page.id); }}>
                          {t('pages.delete')}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Table
          columns={[
            { key: 'title', label: t('pages.name') },
            { key: 'status', label: t('pages.status') },
            { key: 'visits', label: t('pages.visits'), sortable: true },
            { key: 'orders', label: t('pages.orders'), sortable: true },
            { key: 'conversion', label: t('pages.conversion'), sortable: true },
            { key: 'actions', label: '' },
          ]}
          rows={filtered.map((page) => ({
            id: page.id,
            title: (
              <Button variant="ghost" size="sm" onClick={() => go('pages/' + page.id)}>
                {page.title}
              </Button>
            ),
            status: (
              <StatusPill
                status={page.status === 'publish' ? 'delivered' : 'pending'}
                label={page.status === 'publish' ? t('pages.published') : t('pages.draft')}
              />
            ),
            visits: formatNumber(page.visits, locale),
            orders: formatNumber(page.orders, locale),
            conversion: `${formatNumber(page.conversion, locale)}%`,
            actions: (
              <div className="nk-phone-actions">
                <Button size="sm" variant="ghost" onClick={() => copyLink(page)}>
                  {t('pages.copyLink')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removePage(page.id)}>
                  {t('pages.delete')}
                </Button>
              </div>
            ),
          }))}
        />
      )}

      {meta.totalPages > 1 ? (
        <div className="nk-pager">
          <span className="nk-muted">
            {t('pages.pageOf')
              .replace('{page}', formatNumber(meta.page, locale))
              .replace('{total}', formatNumber(meta.totalPages, locale))}
          </span>
          <div className="nk-screen-actions">
            <Button
              variant="secondary"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => load(meta.page - 1)}
            >
              {t('pages.prev')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => load(meta.page + 1)}
            >
              {t('pages.next')}
            </Button>
          </div>
        </div>
      ) : null}

      <FromProductsModal t={t} open={bulkOpen} onClose={() => setBulkOpen(false)} onMade={() => load(1)} go={go} defaultLang={createLang} />

      <Modal
        open={modalOpen}
        onClose={() => !busy && setModalOpen(false)}
        title={t('pages.createModal')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={busy}>
              {t('common.cancel')}
            </Button>
            <Button onClick={createPage} loading={busy}>
              {t('pages.new')}
            </Button>
          </>
        }
      >
        <div className="nk-detail-stack">
          <RadioCards
            legend={t('pages.templatePick')}
            value={createTemplate}
            onChange={setCreateTemplate}
            options={templateOptions}
          />
          <Select label={t('pages.language')} value={createLang} onChange={(e) => setCreateLang(e.target.value)}>
            <option value="en">{t('settings.english')}</option>
            <option value="bn">{t('settings.bangla')}</option>
          </Select>
          <Input
            label={t('pages.pageTitle')}
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
            placeholder={t('pages.pageTitlePlaceholder')}
          />
        </div>
      </Modal>
    </div>
  );
}
/**
 * Draft pages from store products, several at once. Each page gets the
 * product's own text and reviews; sections it has nothing for are hidden.
 */
function FromProductsModal({ t, open, onClose, onMade, go, defaultLang }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState([]);
  const [lang, setLang] = useState(defaultLang || 'en');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setPicked([]);
      setResult(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setSearchError(false);
    const timer = window.setTimeout(() => {
      api('wc-products?q=' + encodeURIComponent(query))
        .then((data) => { if (!cancelled) setProducts(data.products || []); })
        .catch(() => {
          if (!cancelled) {
            setProducts([]);
            setSearchError(true);
          }
        })
        .then(() => { if (!cancelled) setLoading(false); });
    }, query ? 250 : 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [open, query, attempt]);

  function toggle(id) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : (current.length < 20 ? current.concat(id) : current)));
  }

  async function make() {
    setBusy(true);
    try {
      const data = await api('pages/from-products', { method: 'POST', body: { productIds: picked, language: lang } });
      setResult(data);
      setPicked([]);
      onMade();
    } catch (err) {
      setResult({ made: [], failed: [{ productId: 0, message: err.message }] });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !busy && onClose()}
      title={t('bulk.title')}
      footer={
        result ? (
          <Button onClick={onClose}>{t('bulk.done')}</Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose} disabled={busy}>{t('common.cancel')}</Button>
            <Button onClick={make} loading={busy} disabled={!picked.length}>
              {t('bulk.make').replace('{n}', String(picked.length))}
            </Button>
          </>
        )
      }
    >
      {result ? (
        <div className="nk-detail-stack">
          <p>{t('bulk.made').replace('{n}', String(result.made.length))}</p>
          <ul className="nk-bulk-list">
            {result.made.map((row) => (
              <li key={row.pageId}>
                <span>{row.title}</span>
                <Button size="sm" variant="ghost" onClick={() => { onClose(); go('pages/' + row.pageId); }}>{t('bulk.openPage')}</Button>
              </li>
            ))}
          </ul>
          {result.failed.length ? (
            <p className="nk-banner" role="alert">{t('bulk.failed').replace('{n}', String(result.failed.length))} {result.failed.map((row) => row.message).join(' ')}</p>
          ) : null}
        </div>
      ) : (
        <div className="nk-detail-stack">
          <p className="nk-muted">{t('bulk.help')}</p>
          <Input label={t('offer.wcSearch')} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('offer.wcSearchPlaceholder')} />
          <Select label={t('pages.language')} value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">{t('settings.english')}</option>
            <option value="bn">{t('settings.bangla')}</option>
          </Select>
          {loading ? <p className="nk-muted">{t('common.loading')}</p> : null}
          {!loading && searchError ? (
            <div className="nk-banner" role="alert">
              <p>{t('common.error')}</p>
              <Button size="sm" variant="ghost" onClick={() => setAttempt((n) => n + 1)}>{t('common.retry')}</Button>
            </div>
          ) : null}
          {!loading && !searchError && products.length === 0 ? <p className="nk-muted">{t('offer.wcNone')}</p> : null}
          <ul className="nk-bulk-list">
            {products.map((product) => (
              <li key={product.id}>
                <label>
                  <input type="checkbox" checked={picked.includes(product.id)} onChange={() => toggle(product.id)} />
                  {' '}{product.name}
                  {product.pages > 0 ? <em className="nk-tag">{t('bulk.hasPage').replace('{n}', String(product.pages))}</em> : null}
                </label>
                <small className="nk-muted">{product.priceHtml}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
}
