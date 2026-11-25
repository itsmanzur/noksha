/**
 * Mini page sketch for the template picker: the template's own section order in its own brand colour.
 */

export const TEMPLATES = [
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

const LOOKS = {
  single: { brand: '#0F766E', canvas: '#F4FAF9', blocks: ['hero', 'benefits', 'product', 'reviews'] },
  lead: { brand: '#0F766E', canvas: '#F4FAF9', blocks: ['hero', 'benefits', 'reviews', 'faq'] },
  festival: { brand: '#B91C1C', canvas: '#FFF6F4', blocks: ['hero', 'countdown', 'benefits', 'product', 'reviews'] },
  fashion: { brand: '#7C2D5B', canvas: '#FBF7F9', blocks: ['hero', 'gallery', 'benefits', 'product', 'reviews', 'faq'] },
  food: { brand: '#B45309', canvas: '#FFFBF0', blocks: ['hero', 'benefits', 'product', 'video', 'compare', 'steps', 'reviews'] },
  health: { brand: '#166534', canvas: '#F4F8F4', blocks: ['hero', 'benefits', 'product', 'compare', 'steps', 'reviews'] },
  home: { brand: '#0369A1', canvas: '#F3F8FC', blocks: ['hero', 'countdown', 'video', 'benefits', 'gallery', 'steps', 'compare'] },
  beauty: { brand: '#BE185D', canvas: '#FDF6F8', blocks: ['hero', 'benefits', 'product', 'steps', 'compare', 'reviews'] },
  gadget: { brand: '#4338CA', canvas: '#F5F5FB', blocks: ['hero', 'countdown', 'benefits', 'compare', 'video', 'gallery'] },
  blank: { brand: '#64748B', canvas: '#F8FAFC', blocks: ['hero', 'product'] },
};

const W = 72;
const H = 100;
const PAD = 6;
const INNER = W - PAD * 2;
const GAP = 4;
const LINE = '#CBD5E1';

function lines(x, y, widths) {
  return widths.map((w, i) => <rect key={i} x={x} y={y + i * 4} width={w} height="2" rx="1" fill={LINE} />);
}

/** Each block returns its height and drawing for a given top offset and brand colour. */
const BLOCKS = {
  hero: (y, c) => ({
    h: 22,
    node: (
      <g>
        <rect x={PAD} y={y} width={INNER} height="22" rx="3" fill={c} />
        <rect x={PAD + 5} y={y + 5} width="30" height="3" rx="1.5" fill="#fff" />
        <rect x={PAD + 5} y={y + 10} width="40" height="2" rx="1" fill="#fff" opacity="0.7" />
        <rect x={PAD + 5} y={y + 15} width="16" height="4" rx="2" fill="#fff" />
      </g>
    ),
  }),
  benefits: (y, c) => ({
    h: 10,
    node: (
      <g>
        {[0, 1, 2].map((i) => <circle key={i} cx={PAD + 8 + i * 22} cy={y + 3} r="2.5" fill={c} opacity="0.85" />)}
        {[0, 1, 2].map((i) => <rect key={i} x={PAD + 3 + i * 22} y={y + 8} width="12" height="2" rx="1" fill={LINE} />)}
      </g>
    ),
  }),
  product: (y, c) => ({
    h: 14,
    node: (
      <g>
        <rect x={PAD} y={y} width="18" height="14" rx="2" fill={c} opacity="0.25" />
        {lines(PAD + 22, y + 1, [30, 22])}
        <rect x={PAD + 22} y={y + 10} width="14" height="4" rx="2" fill={c} />
      </g>
    ),
  }),
  gallery: (y, c) => ({
    h: 11,
    node: (
      <g>
        {[0, 1, 2].map((i) => <rect key={i} x={PAD + i * 21.5} y={y} width="19" height="11" rx="2" fill={c} opacity={0.18 + i * 0.1} />)}
      </g>
    ),
  }),
  video: (y, c) => ({
    h: 14,
    node: (
      <g>
        <rect x={PAD} y={y} width={INNER} height="14" rx="3" fill="#1E293B" />
        <circle cx={W / 2} cy={y + 7} r="4.5" fill={c} />
        <path d={`M${W / 2 - 1.2} ${y + 4.8} L${W / 2 + 2.4} ${y + 7} L${W / 2 - 1.2} ${y + 9.2} Z`} fill="#fff" />
      </g>
    ),
  }),
  steps: (y, c) => ({
    h: 12,
    node: (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle cx={PAD + 4} cy={y + 2 + i * 4.5} r="1.8" fill={c} />
            <rect x={PAD + 9} y={y + 1 + i * 4.5} width={30 - i * 4} height="2" rx="1" fill={LINE} />
          </g>
        ))}
      </g>
    ),
  }),
  compare: (y, c) => ({
    h: 12,
    node: (
      <g>
        <rect x={PAD} y={y} width={INNER} height="12" rx="2" fill="#fff" stroke={LINE} strokeWidth="0.6" />
        <rect x={PAD + 28} y={y} width="19" height="12" fill={c} opacity="0.18" />
        <rect x={PAD + 3} y={y + 3} width="18" height="2" rx="1" fill={LINE} />
        <rect x={PAD + 3} y={y + 8} width="14" height="2" rx="1" fill={LINE} />
        <circle cx={PAD + 37} cy={y + 4} r="1.4" fill={c} />
        <circle cx={PAD + 37} cy={y + 9} r="1.4" fill={c} />
      </g>
    ),
  }),
  countdown: (y, c) => ({
    h: 8,
    node: (
      <g>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={PAD + 9 + i * 13} y={y} width="10" height="8" rx="2" fill="#fff" stroke={c} strokeWidth="0.7" />)}
      </g>
    ),
  }),
  reviews: (y, c) => ({
    h: 10,
    node: (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={PAD + i * 21.5} y={y} width="19" height="10" rx="2" fill="#fff" stroke={LINE} strokeWidth="0.6" />
            <rect x={PAD + 2 + i * 21.5} y={y + 2} width="8" height="1.6" rx="0.8" fill={c} />
            <rect x={PAD + 2 + i * 21.5} y={y + 5.5} width="14" height="1.6" rx="0.8" fill={LINE} />
          </g>
        ))}
      </g>
    ),
  }),
  faq: (y) => ({
    h: 9,
    node: (
      <g>
        <rect x={PAD} y={y} width={INNER} height="4" rx="2" fill="#fff" stroke={LINE} strokeWidth="0.6" />
        <rect x={PAD} y={y + 5} width={INNER} height="4" rx="2" fill="#fff" stroke={LINE} strokeWidth="0.6" />
      </g>
    ),
  }),
};

/** Options for RadioCards: name, description and a page sketch for each template. */
export function templateOptions(t, skip = []) {
  return TEMPLATES.filter((tpl) => !skip.includes(tpl.value)).map((tpl) => ({
    value: tpl.value,
    label: t(tpl.labelKey),
    description: t(tpl.descKey),
    icon: <TemplateThumb id={tpl.value} />,
  }));
}

export function TemplateThumb({ id }) {
  const look = LOOKS[id] || LOOKS.single;
  const parts = [];
  let y = PAD;
  look.blocks.forEach((type) => {
    const make = BLOCKS[type];
    if (!make || y + 10 > H - 14) {
      return;
    }
    const block = make(y, look.brand);
    if (y + block.h > H - 14) {
      return;
    }
    parts.push(<g key={type + y}>{block.node}</g>);
    y += block.h + GAP;
  });
  return (
    <svg className="nk-template-thumb" viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden="true" focusable="false">
      <rect width={W} height={H} rx="5" fill={look.canvas} />
      {parts}
      <rect x={PAD} y={H - 11} width={INNER} height="6" rx="3" fill={look.brand} />
    </svg>
  );
}
