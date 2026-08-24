const ATTRIBUTION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

const ALIASES: Partial<Record<(typeof ATTRIBUTION_KEYS)[number], Record<string, string>>> = {
  utm_source: {
    ig: 'instagram',
    'instagram.com': 'instagram',
    'l.instagram.com': 'instagram',
  },
  utm_medium: {
    paidsocial: 'paid_social',
    social_paid: 'paid_social',
    organicsocial: 'organic_social',
    social_organic: 'organic_social',
  },
  utm_campaign: {
    '2026_positioning_class': 'class_8',
    positioning_class: 'class_8',
    class8: 'class_8',
    profile: 'profile_link',
  },
};

function normalizeValue(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

export function normalizeAttributionParams(params: URLSearchParams) {
  let changed = false;

  ATTRIBUTION_KEYS.forEach((key) => {
    const original = params.get(key);
    if (!original) return;

    const normalized = normalizeValue(original);
    const canonical = ALIASES[key]?.[normalized] ?? normalized;

    if (canonical !== original) {
      params.set(key, canonical);
      changed = true;
    }
  });

  return changed;
}

export { ATTRIBUTION_KEYS };
