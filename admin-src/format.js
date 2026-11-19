const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaDigits(str) {
	return String(str).replace(/\d/g, (d) => BN[Number(d)]);
}

export function formatNumber(n, locale) {
	const num = Number(n);
	if (Number.isNaN(num)) {
		return locale === 'bn' ? toBanglaDigits(String(n)) : String(n);
	}
	const formatted = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US').format(num);
	return locale === 'bn' ? toBanglaDigits(formatted) : formatted;
}

export function formatMoney(amount, locale) {
	const value = formatNumber(amount, locale);
	return `৳${value}`;
}

function relativeValue(date) {
	const ms = (date instanceof Date ? date : new Date(date)).getTime();
	if (Number.isNaN(ms)) {
		return null;
	}
	const diffSec = Math.round((ms - Date.now()) / 1000);
	const abs = Math.abs(diffSec);
	if (abs < 60) {
		return { value: diffSec, unit: 'second' };
	}
	if (abs < 3600) {
		return { value: Math.round(diffSec / 60), unit: 'minute' };
	}
	if (abs < 86400) {
		return { value: Math.round(diffSec / 3600), unit: 'hour' };
	}
	if (abs < 2592000) {
		return { value: Math.round(diffSec / 86400), unit: 'day' };
	}
	if (abs < 31536000) {
		return { value: Math.round(diffSec / 2592000), unit: 'month' };
	}
	return { value: Math.round(diffSec / 31536000), unit: 'year' };
}

export function formatRelative(date, locale) {
	const rel = relativeValue(date);
	if (!rel) {
		return '';
	}
	const tag = locale === 'bn' ? 'bn' : 'en';
	const out = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' }).format(rel.value, rel.unit);
	return locale === 'bn' ? toBanglaDigits(out) : out;
}