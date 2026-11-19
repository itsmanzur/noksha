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
  { value: 'fashion', labelKey: 'pages.fashion', descKey: 'pages.fashionBody' },
  { value: 'food', labelKey: 'pages.food', descKey: 'pages.foodBody' },
  { value: 'health', labelKey: 'pages.health', descKey: 'pages.healthBody' },
  { value: 'home', labelKey: 'pages.home', descKey: 'pages.homeBody' },
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