function parseGuidFromString(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const fromXml = trimmed.match(/<r[^>]*\bid="?\{?([0-9a-fA-F-]{36})\}?"?/i);
  if (fromXml) {
    return fromXml[1].toLowerCase();
  }
  const fromGuid = trimmed.match(/\{?([0-9a-fA-F-]{36})\}?/);
  return fromGuid ? fromGuid[1].toLowerCase() : null;
}

/** Parse a Sitecore Droplink / Item reference field value to an item GUID. */
export function parseDroplinkItemId(field: unknown): string | null {
  if (!field || typeof field !== 'object') {
    return null;
  }

  const record = field as Record<string, unknown>;

  // Layout Service may send an expanded Item (id on the field root, no `value`).
  if (typeof record.id === 'string') {
    const fromId = parseGuidFromString(record.id);
    if (fromId) {
      return fromId;
    }
  }

  const metadata = record.metadata as Record<string, unknown> | undefined;
  if (metadata && typeof metadata.id === 'string') {
    const fromMetadata = parseGuidFromString(metadata.id);
    if (fromMetadata) {
      return fromMetadata;
    }
  }

  const value = record.value;

  if (typeof value === 'string') {
    return parseGuidFromString(value);
  }

  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const id = obj.id ?? obj.Id ?? obj.itemId;
    if (typeof id === 'string') {
      return id.replace(/[{}]/g, '').toLowerCase();
    }
  }

  return null;
}

export function isCheckboxChecked(field: unknown): boolean {
  if (!field || typeof field !== 'object') {
    return false;
  }
  const value = (field as { value?: unknown }).value;
  if (typeof value === 'boolean') {
    return value;
  }
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}
