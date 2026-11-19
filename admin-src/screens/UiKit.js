import { useState } from '@wordpress/element';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Combobox,
  CopyField,
  DateRangePicker,
  EmptyState,
  IconButton,
  Input,
  RadioCards,
  SecretField,
  Select,
  Skeleton,
  StatCard,
  StatusPill,
  Stepper,
  Table,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
} from '../ui';
import { useToast } from '../providers';
import { formatMoney, formatRelative } from '../format';
import { Plus, Trash2 } from 'lucide-react';

export function UiKit({ t, locale }) {
  const { toast, success } = useToast();
  const [toggle, setToggle] = useState(true);
  const [check, setCheck] = useState(false);
  const [radio, setRadio] = useState('a');
  const [combo, setCombo] = useState('');
  const [range, setRange] = useState({ preset: '7d' });
  const [tab, setTab] = useState('one');
  const [secret, setSecret] = useState('');

  return (
    <div className="nk-uikit">
      <div>
        <h1>{t('uikit.title')}</h1>
        <p className="nk-muted">{t('uikit.help')}</p>
      </div>

      <section>
        <h2>Buttons</h2>
        <div className="nk-uikit-row">
          <Button variant="primary">{t('common.save')}</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger" loading>Danger</Button>
          <IconButton aria-label="Add" icon={Plus} />
          <Tooltip content="Delete"><IconButton aria-label="Delete" icon={Trash2} /></Tooltip>
        </div>
      </section>

      <section>
        <h2>Forms</h2>
        <div className="nk-uikit-row" style={{ alignItems: 'stretch' }}>
          <Input label="Name" placeholder="Customer" />
          <Select label="Method">
            <option value="cod">COD</option>
            <option value="bkash">bKash</option>
          </Select>
          <Textarea label="Note" rows={2} />
        </div>
        <div className="nk-uikit-row">
          <Toggle checked={toggle} onChange={setToggle} label="Enabled" />
          <Checkbox checked={check} onChange={setCheck} label="Agree" />
        </div>
        <RadioCards
          value={radio}
          onChange={setRadio}
          options={[
            { value: 'a', label: 'Option A', description: 'Default' },
            { value: 'b', label: 'Option B', description: 'Alt' },
          ]}
        />
        <Combobox
          label="District"
          value={combo}
          onChange={setCombo}
          options={[
            { value: '47', label: 'Dhaka' },
            { value: '10', label: 'Chattogram' },
            { value: '35', label: 'Khulna' },
          ]}
        />
      </section>

      <section>
        <h2>Status & stats</h2>
        <div className="nk-uikit-row">
          {['pending', 'confirmed', 'paid', 'shipped', 'delivered', 'returned', 'fake', 'no_answer'].map((s) => (
            <StatusPill key={s} status={s} label={t('status.' + s)} />
          ))}
          <Badge>Badge</Badge>
        </div>
        <div className="nk-uikit-row">
          <StatCard label={t('home.todayOrders')} value={formatMoney(1250, locale)} delta={12} sparkline={[4, 8, 6, 10, 9, 14, 12]} />
          <StatCard label={t('home.revenue')} value={formatMoney(48200, locale)} delta={-3} sparkline={[20, 18, 22, 19, 17, 16, 15]} />
        </div>
        <p className="nk-muted">{formatRelative(Date.now() - 5 * 60 * 1000, locale)}</p>
      </section>

      <section>
        <h2>Table / empty / skeleton</h2>
        <Table
          columns={[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'total', label: 'Total', sortable: true },
          ]}
          rows={[
            { id: 1, name: 'Amina', total: formatMoney(890, locale) },
            { id: 2, name: 'Karim', total: formatMoney(1200, locale) },
          ]}
          selectable
        />
        <Skeleton height={48} />
        <EmptyState
          title={t('uikit.empty')}
          description={t('uikit.emptyBody')}
          action={<Button onClick={() => success(t('uikit.toast'))}>{t('common.retry')}</Button>}
        />
      </section>

      <section>
        <h2>Tabs / stepper / dates / secrets</h2>
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'one', label: 'One', children: <p className="nk-muted">Panel one</p> },
            { value: 'two', label: 'Two', children: <p className="nk-muted">Panel two</p> },
          ]}
        />
        <Stepper current={1} steps={[{ label: 'Basics' }, { label: 'Payments' }, { label: 'Done' }]} />
        <DateRangePicker value={range} onChange={setRange} />
        <CopyField label="Webhook" value="https://example.test/wp-json/noksha/v1/webhooks/pathao" />
        <SecretField label="API key" value={secret} onChange={setSecret} saved={false} />
        <Card title="Card"><p className="nk-muted">Calm commerce operations surface.</p></Card>
        <Button variant="secondary" onClick={() => toast({ message: t('uikit.toast') })}>Toast</Button>
      </section>
    </div>
  );
}
