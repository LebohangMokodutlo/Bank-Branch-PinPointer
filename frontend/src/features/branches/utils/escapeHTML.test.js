import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHTML';

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml('<script>alert("hi")</script>')).toBe(
      '&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;',
    );
  });

  it('escapes ampersands without double-escaping already-escaped entities', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('leaves plain text completely unchanged', () => {
    expect(escapeHtml('Capitec Bank - Sandton')).toBe('Capitec Bank - Sandton');
  });

  it('coerces non-string values to a string first', () => {
    expect(escapeHtml(123)).toBe('123');
  });
});
